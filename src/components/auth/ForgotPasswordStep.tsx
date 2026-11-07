"use client";

import React, { useState } from "react";
import { Mail, AlertCircle, Loader2, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

interface ForgotPasswordStepProps {
  initialEmail?: string;
  onBack: () => void;
}

export function ForgotPasswordStep({ initialEmail = "", onBack }: ForgotPasswordStepProps) {
  const [forgotEmail, setForgotEmail] = useState(initialEmail);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotMessage(null);
    setIsSendingReset(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setForgotError(data.error || "Gagal mengirim permintaan reset password.");
      } else {
        setForgotMessage(
          data.message ||
            `Instruksi reset password telah dikirim ke ${forgotEmail}. Silakan periksa inbox email Anda.`
        );
      }
    } catch (err: any) {
      setForgotError(err.message || "Gagal menghubungi server reset password.");
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="text-center space-y-1.5">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-brand flex items-center justify-center mx-auto shadow-xs">
          <KeyRound className="w-5 h-5" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-espresso tracking-tight">
          Reset Password
        </h2>
        <p className="text-xs text-espresso-muted leading-relaxed">
          Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk membuat password baru.
        </p>
      </div>

      {forgotError && (
        <div className="p-3.5 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{forgotError}</span>
        </div>
      )}

      {forgotMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2.5 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{forgotMessage}</span>
        </div>
      )}

      <form onSubmit={handleForgotPassword} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">
            Alamat Email Akun
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
            <input
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              required
              placeholder="nama@email.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="w-full pl-10 pr-4 h-12 rounded-input bg-surface-main border border-sand-border text-base sm:text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors duration-150 ease-out touch-manipulation"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={onBack}
            className="w-full h-12 px-4 rounded-btn border border-sand-border bg-surface-main hover:bg-stone-100 active:scale-[0.97] transition-transform duration-150 ease-out text-espresso font-semibold text-xs flex items-center justify-center gap-1.5 select-none touch-manipulation cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <button
            type="submit"
            disabled={isSendingReset}
            className="w-full h-12 px-4 rounded-btn bg-brand hover:bg-brand-800 active:scale-[0.97] transition-transform duration-150 ease-out text-white font-bold text-xs shadow-warm flex items-center justify-center gap-1.5 disabled:opacity-50 select-none touch-manipulation cursor-pointer"
          >
            {isSendingReset ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mengirim...</span>
              </>
            ) : (
              <span>Kirim Tautan</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
