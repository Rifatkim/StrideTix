"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";
import { AuthUser, UserRole } from "@/types";
import { ArrowRight, Lock, Mail, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";
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

  const redirectByRole = (role: UserRole) => {
    if (role === "admin") {
      router.push("/admin");
    } else if (role === "organizer") {
      router.push("/organizer");
    } else {
      router.push("/dashboard");
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
        setCountdown(60);

        // Kirim email OTP via Resend API
        try {
          await fetch("/api/auth/2fa/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: normalizedEmail }),
          });
        } catch (sendErr) {
          console.warn("Could not dispatch 2FA OTP email:", sendErr);
        }
      } else {
        // Direct login jika 2FA tidak aktif
        const user = await login({ email, password });
        if (redirectParam && redirectParam.startsWith("/")) {
          router.push(redirectParam);
        } else {
          redirectByRole(user.role);
        }
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Email atau password yang Anda masukkan salah."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setOtpError(null);
    setIsVerifyingOtp(true);

    const targetEmail = pendingCredentials?.email || email.trim();

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: targetEmail,
          otp: code.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setOtpError(data.error || "Kode OTP tidak valid atau telah kadaluarsa.");
        return;
      }

      if (!pendingCredentials) {
        setOtpError("Sesi verifikasi kadaluarsa. Silakan masukkan password kembali.");
        setStep("credentials");
        return;
      }

      // Kredensial & OTP Valid: Sekarang lakukan login resmi ke Supabase
      const user = await login({
        email: pendingCredentials.email,
        password: pendingCredentials.password,
      });

      // Verification success -> proceed to dashboard or redirect URL
      if (redirectParam && redirectParam.startsWith("/")) {
        router.push(redirectParam);
      } else {
        redirectByRole(user.role);
      }
    } catch (err: any) {
      setOtpError(err.message || "Gagal memverifikasi kode OTP.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || isResendingOtp) return;
    setIsResendingOtp(true);
    setOtpError(null);

    const targetEmail = pendingCredentials?.email || email.trim();

    try {
      const res = await fetch("/api/auth/2fa/send", {
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
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Logo di atas, tepat di bawahnya langsung nama merk */}
      <div className="flex flex-col items-center justify-center">
        <Link
          href="/"
          className="inline-flex flex-col items-center group transition-transform active:scale-95"
          aria-label="Beranda StrideTix"
        >
          <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-warm group-hover:bg-brand-800 transition-colors">
            <StrideTixSymbol size={22} color="#FFFFFF" />
          </div>
          <span className="font-extrabold text-sm tracking-tight text-espresso mt-1.5 group-hover:text-brand transition-colors">
            Stride<span className="text-brand">Tix</span>
          </span>
        </Link>
      </div>

      {/* Frame Konten Form */}
      <div className="bg-white rounded-modal p-6 sm:p-8 border border-sand-border shadow-warm-modal space-y-6">
        {step === "credentials" && (
          <>
            {/* Informational banner when redirected from checkout */}
            {redirectParam && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed animate-in fade-in">
                Silakan masuk terlebih dahulu untuk melanjutkan pembelian tiket
                lomba.
              </div>
            )}

            {/* Header: Judul minimalis */}
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-bold text-espresso tracking-tight">
                Masuk
              </h2>
            </div>

            {/* Success Message Banner */}
            {infoMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-espresso">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-espresso">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setInfoMessage(null);
                      setStep("forgot_password");
                    }}
                    className="text-xs font-semibold text-brand hover:underline transition-colors"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
                  <input
                    id="password-input"
                    type="password"
                    required
                    placeholder="Masukkan password akun"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              {/* Tombol Masuk & Tombol Daftar Berdampingan (Tanpa Icon Panah) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Masuk...</span>
                    </div>
                  ) : (
                    <span>Masuk</span>
                  )}
                </button>

                <Link
                  href={`/register${
                    redirectParam
                      ? `?redirect=${encodeURIComponent(redirectParam)}`
                      : ""
                  }`}
                  className="w-full py-2.5 px-4 rounded-btn border border-brand/30 bg-brand-50/60 hover:bg-brand-100/60 text-brand font-bold text-sm transition-all flex items-center justify-center shadow-2xs hover:border-brand/50 text-center"
                >
                  <span>Daftar</span>
                </Link>
              </div>
            </form>
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
