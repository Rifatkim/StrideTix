"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";
import { ArrowRight, Lock, Mail, AlertCircle, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { ForgotPasswordStep } from "./ForgotPasswordStep";
import { TwoFactorOtpStep } from "./TwoFactorOtpStep";
import { ResetPasswordStep } from "./ResetPasswordStep";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { login, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // View Step: "credentials" | "2fa_otp" | "forgot_password" | "reset_password"
  const [step, setStep] = useState<"credentials" | "2fa_otp" | "forgot_password" | "reset_password">("credentials");

  // 2FA Flow States
  const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Listen for Password Reset / Recovery state from URL or Supabase Auth event
  useEffect(() => {
    const isResetSuccess = searchParams.get("reset") === "success";
    const isTypeRecovery = searchParams.get("type") === "recovery";
    const hasRecoveryHash =
      typeof window !== "undefined" &&
      (window.location.hash.includes("type=recovery") ||
       window.location.hash.includes("access_token"));

    if (isResetSuccess || isTypeRecovery || hasRecoveryHash) {
      setStep("reset_password");
    }

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setStep("reset_password");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams]);

  // Countdown timer for Resend OTP button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "2fa_otp" && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handlePostLoginRedirect = () => {
    if (redirectParam && redirectParam.startsWith("/")) {
      router.push(redirectParam);
    } else {
      router.push("/");
    }
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const is2faActive =
        typeof window !== "undefined" &&
        (localStorage.getItem("stridetix_2fa_gmail_" + normalizedEmail) === "true" ||
         localStorage.getItem("stridetix_2fa_gmail_active") === "true");

      if (is2faActive) {
        // 1. Verifikasi kredensial email & password secara terisolasi tanpa membuat sesi browser
        const verifyRes = await fetch("/api/auth/verify-credentials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail, password }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok || !verifyData.valid) {
          setErrorMessage(
            verifyData.error || "Email atau password yang Anda masukkan salah."
          );
          setIsSubmitting(false);
          return;
        }

        // Pastikan tidak ada sesi lama yang aktif di browser
        await logout().catch(() => {});

        // Simpan kredensial sementara hanya di memori state React untuk login nanti setelah OTP diverifikasi
        setPendingCredentials({ email: normalizedEmail, password });
        setStep("2fa_otp");
        setOtpError(null);
        setCountdown(60);

        // 2. Trigger pengiriman OTP ke Gmail pengguna
        try {
          const otpRes = await fetch("/api/auth/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: normalizedEmail }),
          });

          if (!otpRes.ok) {
            const otpData = await otpRes.json();
            setOtpError(otpData.error || "Gagal mengirimkan kode OTP ke email Anda.");
          }
        } catch {
          setOtpError("Terjadi gangguan saat mengirimkan kode verifikasi 2FA.");
        }

        setIsSubmitting(false);
        return;
      }

      // Login normal tanpa 2FA
      await login({ email: normalizedEmail, password });
      handlePostLoginRedirect();
    } catch (err: any) {
      setErrorMessage(
        err.message || "Email atau password salah. Silakan coba kembali."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (token: string) => {
    if (!pendingCredentials) {
      setOtpError("Sesi verifikasi telah kedaluwarsa. Silakan login ulang.");
      setStep("credentials");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingCredentials.email,
          token: token.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setOtpError(data.error || "Kode OTP tidak valid atau sudah kedaluwarsa.");
        setIsVerifyingOtp(false);
        return;
      }

      // OTP Valid -> Eksekusi login final
      await login({
        email: pendingCredentials.email,
        password: pendingCredentials.password,
      });
      setPendingCredentials(null);
      handlePostLoginRedirect();
    } catch {
      setOtpError("Gagal memverifikasi kode OTP. Silakan coba lagi.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    const targetEmail = pendingCredentials?.email || email.trim().toLowerCase();
    if (!targetEmail) return;

    setIsResendingOtp(true);
    setOtpError(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });

      if (res.ok) {
        setCountdown(60);
      } else {
        const data = await res.json();
        setOtpError(data.error || "Gagal mengirim ulang kode OTP.");
      }
    } catch {
      setOtpError("Terjadi kesalahan koneksi saat mengirim kode OTP.");
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleCancel2fa = async () => {
    await logout().catch(() => {});
    setStep("credentials");
    setPendingCredentials(null);
    setOtpError(null);
  };

  return (
    <div className="w-full">
      {/* Frame Konten Form Ringkas */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 xl:p-7 border border-sand-border shadow-warm-modal space-y-3.5 sm:space-y-4">
        {step === "credentials" && (
          <>
            {/* Informational banner when redirected from checkout */}
            {redirectParam && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs sm:text-sm text-amber-900 leading-relaxed animate-in fade-in">
                Silakan masuk terlebih dahulu untuk melanjutkan pembelian tiket lomba.
              </div>
            )}

            {/* Success Message Banner */}
            {infoMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-semibold flex items-center gap-2 shadow-2xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2 text-xs sm:text-sm text-accent-error animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs sm:text-sm font-bold text-espresso">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
                  <input
                    id="email-input"
                    type="email"
                    inputMode="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="next"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 h-11 sm:h-12 rounded-input bg-surface-main border border-sand-border text-sm sm:text-base text-espresso focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs sm:text-sm font-bold text-espresso">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setInfoMessage(null);
                      setStep("forgot_password");
                    }}
                    className="text-xs sm:text-sm font-semibold text-brand hover:underline transition-colors cursor-pointer touch-manipulation"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    autoCapitalize="none"
                    autoCorrect="off"
                    enterKeyHint="done"
                    required
                    placeholder="Masukkan password akun"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-11 h-11 sm:h-12 rounded-input bg-surface-main border border-sand-border text-sm sm:text-base text-espresso focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-espresso-muted hover:text-espresso transition-colors select-none active:scale-[0.92] touch-manipulation"
                    aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Tombol Masuk Penuh Selebar Container */}
              <div className="pt-1 sm:pt-1.5">
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 sm:h-12 min-h-[44px] px-5 rounded-btn bg-brand hover:bg-brand-800 active:scale-[0.98] transition-transform text-white font-bold text-sm sm:text-base shadow-warm flex items-center justify-center gap-2 group disabled:opacity-50 select-none cursor-pointer touch-manipulation"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Masuk...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Akun</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer Link: Belum memiliki akun? Daftar di Sini */}
            <div className="text-center text-xs sm:text-sm text-espresso-secondary pt-2.5 border-t border-sand-border/60">
              Belum memiliki akun?{" "}
              <Link
                href={`/register${
                  redirectParam
                    ? `?redirect=${encodeURIComponent(redirectParam)}`
                    : ""
                }`}
                className="font-bold text-brand hover:underline inline-flex items-center px-1"
              >
                Daftar Sekarang
              </Link>
            </div>
          </>
        )}

        {/* STEP 2: LUPA PASSWORD (KIRIM TAUTAN KE EMAIL) */}
        {step === "forgot_password" && (
          <ForgotPasswordStep
            initialEmail={email}
            onBack={() => setStep("credentials")}
          />
        )}

        {/* STEP 3: BUAT PASSWORD BARU (RESET PASSWORD SETELAH KLIK LINK EMAIL) */}
        {step === "reset_password" && (
          <ResetPasswordStep
            onSuccess={() => {
              setStep("credentials");
              setInfoMessage("Password berhasil diperbarui! Silakan masuk dengan password baru.");
              router.replace("/login");
            }}
            onRetry={() => {
              setStep("forgot_password");
              router.replace("/login");
            }}
            onCancel={() => {
              setStep("credentials");
              router.replace("/login");
            }}
          />
        )}

        {/* STEP 4: VERIFIKASI 2FA GMAIL (OTP EMAIL RESEND) */}
        {step === "2fa_otp" && (
          <TwoFactorOtpStep
            email={email}
            countdown={countdown}
            isVerifying={isVerifyingOtp}
            isResending={isResendingOtp}
            errorMessage={otpError}
            onVerify={handleVerifyOtp}
            onResend={handleResendOtp}
            onCancel={handleCancel2fa}
          />
        )}
      </div>
    </div>
  );
}
