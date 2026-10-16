"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { ArrowRight, Lock, LogIn, Mail, Shield, User, Users } from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("budi@stridetix.com");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      redirectByRole(user.role);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setIsSubmitting(true);
    try {
      const user = await login({ email: "", demoRole: role });
      redirectByRole(user.role);
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
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="w-12 h-12 rounded-btn bg-brand-50 text-brand flex items-center justify-center mx-auto mb-2 shadow-xs">
          <StrideTixSymbol size={28} />
        </div>
        <h2 className="text-2xl font-extrabold text-espresso">Masuk ke StrideTix</h2>
        <p className="text-xs text-espresso-secondary">
          Akses tiket lomba lari, rekomendasi jarak, atau dashboard pengelolaan Anda.
        </p>
      </div>

      {/* 1-Click Demo Login Shortcuts */}
      <div className="bg-surface-soft rounded-card p-4 border border-sand-border space-y-2.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-brand block text-center">
          ⚡ 1-Click Demo Login (Pengujian Instan):
        </span>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("runner")}
            className="w-full py-2 px-3 rounded-btn bg-white hover:bg-brand-50 border border-sand-border text-xs font-bold text-espresso flex items-center justify-between transition-colors shadow-sm"
          >
            <span className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-brand" />
              <span>Login sebagai <strong>Runner</strong> (Budi)</span>
            </span>
            <span className="text-[10px] text-espresso-muted">Ke /dashboard →</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin("organizer")}
            className="w-full py-2 px-3 rounded-btn bg-white hover:bg-brand-50 border border-sand-border text-xs font-bold text-espresso flex items-center justify-between transition-colors shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-accent-strava" />
              <span>Login sebagai <strong>Organizer</strong> (Hendra)</span>
            </span>
            <span className="text-[10px] text-espresso-muted">Ke /organizer →</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin("admin")}
            className="w-full py-2 px-3 rounded-btn bg-white hover:bg-brand-50 border border-sand-border text-xs font-bold text-espresso flex items-center justify-between transition-colors shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-accent-info" />
              <span>Login sebagai <strong>Admin StrideTix</strong></span>
            </span>
            <span className="text-[10px] text-espresso-muted">Ke /admin →</span>
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center my-2">
        <div className="w-full border-t border-sand-border" />
        <span className="bg-white px-3 text-[11px] font-bold text-espresso-muted uppercase tracking-wider absolute">
          Atau Gunakan Email
        </span>
      </div>

      {/* Standard Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Email Terdaftar</label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
            <input
              type="password"
              required
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
          <span>{isSubmitting ? "Memverifikasi..." : "Masuk ke Akun"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-espresso-secondary">
        Belum memiliki akun?{" "}
        <Link href="/auth/register" className="font-bold text-brand hover:underline">
          Daftar Akun Baru
        </Link>
      </div>
    </div>
  );
}
