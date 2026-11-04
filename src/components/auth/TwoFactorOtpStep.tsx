"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertCircle, Loader2, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";

interface TwoFactorOtpStepProps {
  email: string;
  countdown: number;
  isVerifying: boolean;
  isResending: boolean;
  errorMessage: string | null;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onCancel: () => void;
}

export function TwoFactorOtpStep({
  email,
  countdown,
  isVerifying,
  isResending,
  errorMessage,
  onVerify,
  onResend,
  onCancel,
}: TwoFactorOtpStepProps) {
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      onVerify(otpCode);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header 2FA */}
      <div className="text-center space-y-1.5">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-espresso tracking-tight">
          Verifikasi Dua Langkah
        </h2>
        <p className="text-xs text-espresso-muted leading-relaxed">
          Kode OTP 6-digit telah dikirimkan ke email:
          <br />
          <span className="font-bold text-espresso">{email}</span>
        </p>
      </div>

      {/* OTP Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Input OTP */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso text-center block">
            Masukkan 6-Digit Kode OTP
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            maxLength={6}
            placeholder="••••••"
            value={otpCode}
            onChange={(e) =>
              setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 font-extrabold rounded-input bg-surface-main border border-sand-border text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <button
          type="submit"
          disabled={isVerifying || otpCode.length !== 6}
          className="w-full py-3 px-6 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isVerifying ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi Kode OTP...</span>
            </>
          ) : (
            <>
              <span>Verifikasi & Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Actions: Kirim Ulang & Kembali */}
      <div className="flex items-center justify-between pt-2 border-t border-sand-border/60 text-xs">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 text-espresso-muted hover:text-espresso font-semibold transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali</span>
        </button>

        <button
          type="button"
          onClick={onResend}
          disabled={countdown > 0 || isResending}
          className="inline-flex items-center gap-1 font-bold text-brand hover:underline disabled:text-espresso-muted disabled:no-underline transition-colors"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`}
          />
          <span>
            {countdown > 0 ? `Kirim Ulang (${countdown}s)` : "Kirim Ulang Kode"}
          </span>
        </button>
      </div>
    </div>
  );
}

