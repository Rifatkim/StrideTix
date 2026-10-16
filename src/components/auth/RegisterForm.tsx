"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Building, Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const [role, setRole] = useState<"runner" | "organizer">("runner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        organizerName: role === "organizer" ? organizerName : undefined,
      });

      if (user.role === "organizer") {
        router.push("/organizer/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mendaftarkan akun. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-modal p-6 sm:p-8 border border-sand-border shadow-warm-modal space-y-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <Link href="/" className="inline-block">
          <div className="w-12 h-12 rounded-btn bg-brand-50 text-brand flex items-center justify-center mx-auto mb-2 shadow-xs hover:scale-105 transition-transform">
            <StrideTixSymbol size={28} />
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-espresso">Daftar Akun StrideTix</h2>
        <p className="text-xs text-espresso-secondary">
          Mulai langkah Anda untuk mengikuti atau mempublikasikan event lari resmi.
        </p>
      </div>

      {/* Role Picker Pills */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-espresso block">Pilih Jenis Akun</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("runner")}
            className={`py-2.5 px-3 rounded-btn border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === "runner"
                ? "bg-brand text-white border-brand shadow-sm"
                : "bg-surface-main text-espresso border-sand-border hover:bg-brand-50"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Pelari (Runner)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("organizer")}
            className={`py-2.5 px-3 rounded-btn border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              role === "organizer"
                ? "bg-brand text-white border-brand shadow-sm"
                : "bg-surface-main text-espresso border-sand-border hover:bg-brand-50"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Penyelenggara (EO)</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Nama Lengkap</label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
            <input
              type="text"
              required
              placeholder="Contoh: Budi Pratama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
        </div>

        {role === "organizer" && (
          <div className="space-y-1.5 animate-in fade-in duration-150">
            <label className="text-xs font-bold text-espresso">Nama Organisasi / Komunitas EO</label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
              <input
                type="text"
                required
                placeholder="Contoh: Stride Jakarta Athletics"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
        )}

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
          <label className="text-xs font-bold text-espresso">Password</label>
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-6 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Mendaftarkan Akun...</span>
            </>
          ) : (
            <>
              <span>Buat Akun Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="text-center text-xs text-espresso-secondary pt-2 border-t border-sand-border/60">
        Sudah memiliki akun?{" "}
        <Link href="/login" className="font-bold text-brand hover:underline">
          Masuk di Sini
        </Link>
      </div>
    </div>
  );
}
