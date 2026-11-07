"use client";

import React, { useState, useEffect } from "react";
import { Lock, AlertCircle, Loader2, CheckCircle2, KeyRound, ArrowRight, RotateCcw } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ResetPasswordStepProps {
  onSuccess: () => void;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function ResetPasswordStep({ onSuccess, onRetry, onCancel }: ResetPasswordStepProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isValidatingSession, setIsValidatingSession] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Verifikasi dan sinkronisasi sesi auth pemulihan password
  useEffect(() => {
    let isMounted = true;

    async function establishAndVerifySession() {
      const supabase = createClient();

      try {
        // 1. Ekstraksi token jika redirect menggunakan hash (#access_token=...&refresh_token=...)
        if (typeof window !== "undefined" && window.location.hash.includes("access_token")) {
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error: sessionErr } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (!sessionErr && isMounted) {
              setIsSessionValid(true);
              setIsValidatingSession(false);
              return;
            }
          }
        }

        // 2. Pertukaran PKCE code jika URL memuat ?code=...
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
          const { error: codeErr } = await supabase.auth.exchangeCodeForSession(code);
          if (!codeErr && isMounted) {
            setIsSessionValid(true);
            setIsValidatingSession(false);
            return;
          }
        }

        // 3. Verifikasi token_hash jika URL memuat ?token_hash=...
        const tokenHash = urlParams.get("token_hash");
        const type = urlParams.get("type");
        if (tokenHash) {
          const { error: otpErr } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: (type as any) || "recovery",
          });
          if (!otpErr && isMounted) {
            setIsSessionValid(true);
            setIsValidatingSession(false);
            return;
          }
        }

        // 4. Periksa sesi aktif yang sudah tersimpan di cookie
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && isMounted) {
          setIsSessionValid(true);
        } else if (isMounted) {
          setIsSessionValid(false);
          setErrorMessage(
            "Sesi pemulihan akun tidak valid atau telah kedaluwarsa. Silakan minta tautan baru."
          );
        }
      } catch (err: any) {
        if (isMounted) {
          setIsSessionValid(false);
          setErrorMessage(err.message || "Gagal memverifikasi sesi reset password.");
        }
      } finally {
        if (isMounted) {
          setIsValidatingSession(false);
        }
      }
    }

    establishAndVerifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok dengan password baru.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(
          error.message || "Gagal memperbarui password akun Anda."
        );
      } else {
        setIsSuccess(true);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || "Terjadi kesalahan saat menyimpan password baru."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // State: Loading Verifikasi Sesi
  if (isValidatingSession) {
    return (
      <div className="py-10 text-center space-y-3 animate-in fade-in duration-200">
        <Loader2 className="w-8 h-8 text-brand animate-spin mx-auto" />
        <p className="text-xs text-espresso-muted">
          Memverifikasi tautan pemulihan akun...
        </p>
      </div>
    );
  }

  // State: Sesi Tidak Valid / Kadaluwarsa
  if (!isSessionValid) {
    return (
      <div className="space-y-5 animate-in fade-in duration-200 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-espresso">
            Tautan Kedaluwarsa
          </h2>
          <p className="text-xs text-espresso-muted leading-relaxed max-w-sm mx-auto">
            {errorMessage ||
              "Tautan pemulihan akun ini sudah digunakan atau telah kedaluwarsa demi keamanan akun Anda."}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="flex-1 py-2.5 px-4 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-xs shadow-warm transition-transform duration-150 ease-out active:scale-[0.97] flex items-center justify-center gap-1.5 min-h-[44px] touch-manipulation cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Minta Tautan Baru</span>
            </button>
          )}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2.5 px-4 rounded-btn border border-sand-border bg-surface-main hover:bg-stone-100 text-espresso font-semibold text-xs transition-transform duration-150 ease-out active:scale-[0.97] min-h-[44px] touch-manipulation cursor-pointer"
            >
              Kembali ke Login
            </button>
          )}
        </div>
      </div>
    );
  }

  // State: Berhasil Reset Password
  if (isSuccess) {
    return (
      <div className="space-y-5 animate-in fade-in duration-200 text-center py-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-espresso">
            Password Berhasil Diperbarui
          </h2>
          <p className="text-xs text-espresso-muted leading-relaxed">
            Akun Anda telah diamankan dengan password baru. Silakan masuk kembali untuk melanjutkan.
          </p>
        </div>

        <button
          type="button"
          onClick={onSuccess}
          className="w-full h-12 px-4 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-transform duration-150 ease-out flex items-center justify-center gap-1.5 active:scale-[0.97] touch-manipulation cursor-pointer"
        >
          <span>Masuk dengan Password Baru</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // State: Form Buat Password Baru
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="text-center space-y-1.5">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand flex items-center justify-center mx-auto shadow-xs">
          <KeyRound className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-espresso tracking-tight">
          Buat Password Baru
        </h2>
        <p className="text-xs text-espresso-muted leading-relaxed">
          Masukkan password baru untuk akun StrideTix Anda.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">
            Password Baru
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 h-12 rounded-input bg-surface-main border border-sand-border text-base sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-150 ease-out touch-manipulation"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 h-12 rounded-input bg-surface-main border border-sand-border text-base sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand transition-colors duration-150 ease-out touch-manipulation"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 px-4 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-transform duration-150 ease-out flex items-center justify-center gap-1.5 disabled:opacity-50 active:scale-[0.97] touch-manipulation select-none cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan Password...</span>
            </>
          ) : (
            <>
              <span>Simpan Password Baru</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
