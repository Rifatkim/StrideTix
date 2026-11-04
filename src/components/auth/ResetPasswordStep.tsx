"use client";

import React, { useState } from "react";
import { Lock, AlertCircle, Loader2, CheckCircle2, KeyRound, ArrowRight } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ResetPasswordStepProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export function ResetPasswordStep({ onSuccess }: ResetPasswordStepProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < 6) {
      setErrorMessage("Password baru minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setErrorMessage(error.message || "Gagal memperbarui password akun.");
        return;
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat menyimpan password baru.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-5 text-center animate-in fade-in duration-200">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg sm:text-xl font-bold text-espresso tracking-tight">
            Password Berhasil Diperbarui!
          </h2>
          <p className="text-xs text-espresso-muted leading-relaxed max-w-xs mx-auto">
            Password akun Anda telah berhasil diganti. Silakan masuk menggunakan password baru Anda.
          </p>
        </div>

        <button
          type="button"
          onClick={onSuccess}
          className="w-full py-2.5 px-4 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-1.5"
        >
          <span>Masuk dengan Password Baru</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

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
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">
            Konfirmasi Password Baru
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
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

