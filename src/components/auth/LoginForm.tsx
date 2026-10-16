"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { ArrowRight, Lock, LogIn, Mail, AlertCircle, Loader2 } from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      if (redirectParam && redirectParam.startsWith("/")) {
        router.push(redirectParam);
      } else {
        redirectByRole(user.role);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Email atau password yang Anda masukkan salah.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const redirectByRole = (role: UserRole) => {
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "organizer") {
      router.push("/organizer/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-modal p-6 sm:p-8 border border-sand-border shadow-warm-modal space-y-6">
      {/* Informational banner when redirected from checkout */}
      {redirectParam && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed animate-in fade-in">
          Silakan masuk terlebih dahulu untuk melanjutkan pembelian tiket lomba.
        </div>
      )}
      {/* Header */}
      <div className="text-center space-y-1.5">
        <Link href="/" className="inline-block">
          <div className="w-12 h-12 rounded-btn bg-brand-50 text-brand flex items-center justify-center mx-auto mb-2 shadow-xs hover:scale-105 transition-transform">
            <StrideTixSymbol size={28} />
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-espresso">Masuk ke StrideTix</h2>
        <p className="text-xs text-espresso-secondary">
          Akses akun Pelari, Organizer (EO), atau Administrator Anda.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Alamat Email</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
            <input
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
            <label className="text-xs font-bold text-espresso">Password</label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
            <input
              type="password"
              required
              placeholder="Masukkan password akun"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Akun</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-espresso-secondary pt-2 border-t border-sand-border/60">
        Belum memiliki akun?{" "}
        <Link
          href={`/register${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
          className="font-bold text-brand hover:underline"
        >
          Daftar Akun Baru
        </Link>
      </div>
    </div>
  );
}
