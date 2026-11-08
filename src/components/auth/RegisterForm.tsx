"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, Building, Lock, Mail, User, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const { register } = useAuth();

  const [role, setRole] = useState<"runner" | "organizer">("runner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organizerName, setOrganizerName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        password,
        role,
        organizerName: role === "organizer" ? organizerName : undefined,
      });

      if (redirectParam && redirectParam.startsWith("/")) {
        router.push(redirectParam);
      } else {
        router.push("/");
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "instant" });
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal mendaftarkan akun. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Frame / Card Utama Ringkas agar 100% pas dalam layar tanpa scroll */}
      <div className="bg-white rounded-2xl p-4 sm:p-5.5 xl:p-6 border border-sand-border/80 shadow-warm-modal space-y-3 sm:space-y-3.5">
        {/* Role Picker Pills */}
        <div className="space-y-1.5">
          <label className="text-xs sm:text-sm font-bold text-espresso block">Pilih Jenis Akun</label>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setRole("runner")}
              className={`p-2.5 sm:p-3 rounded-btn border text-left flex flex-col justify-center gap-0.5 select-none active:scale-[0.98] transition-all min-h-[46px] cursor-pointer touch-manipulation ${
                role === "runner"
                  ? "bg-brand text-white border-brand shadow-xs"
                  : "bg-surface-main text-espresso border-sand-border hover:bg-brand-50/50 hover:border-brand/40"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Pelari (Runner)</span>
              </div>
              <span className={`text-[10px] sm:text-[11px] leading-tight ${role === "runner" ? "text-white/80" : "text-espresso-muted"}`}>
                Daftar & beli tiket resmi
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole("organizer")}
              className={`p-2.5 sm:p-3 rounded-btn border text-left flex flex-col justify-center gap-0.5 select-none active:scale-[0.98] transition-all min-h-[46px] cursor-pointer touch-manipulation ${
                role === "organizer"
                  ? "bg-brand text-white border-brand shadow-xs"
                  : "bg-surface-main text-espresso border-sand-border hover:bg-brand-50/50 hover:border-brand/40"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>Penyelenggara (EO)</span>
              </div>
              <span className={`text-[10px] sm:text-[11px] leading-tight ${role === "organizer" ? "text-white/80" : "text-espresso-muted"}`}>
                Kelola event & scan tiket
              </span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2 text-xs sm:text-sm text-accent-error animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-espresso">Nama Lengkap</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
              <input
                type="text"
                required
                autoCapitalize="words"
                enterKeyHint="next"
                placeholder="Contoh: Budi Pratama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 rounded-input bg-surface-main border border-sand-border text-sm sm:text-base text-espresso focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
              />
            </div>
          </div>

          {role === "organizer" && (
            <div className="space-y-1 animate-in fade-in duration-150">
              <label className="text-xs sm:text-sm font-bold text-espresso">Nama Organisasi / Komunitas EO</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
                <input
                  type="text"
                  required
                  autoCapitalize="words"
                  enterKeyHint="next"
                  placeholder="Contoh: Stride Athletics ID"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full h-11 pl-10 pr-3.5 rounded-input bg-surface-main border border-sand-border text-sm sm:text-base text-espresso focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-espresso">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
              <input
                type="email"
                required
                inputMode="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="next"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-3.5 rounded-input bg-surface-main border border-sand-border text-sm sm:text-base text-espresso focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs sm:text-sm font-bold text-espresso">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                autoCapitalize="none"
                autoCorrect="off"
                enterKeyHint="done"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-11 rounded-input bg-surface-main border border-sand-border text-sm sm:text-base text-espresso focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-colors"
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
            <span className="text-[10px] sm:text-xs text-espresso-muted block">
              Gunakan minimal 6 karakter kombinasi huruf dan angka.
            </span>
          </div>

          <div className="pt-1 sm:pt-1.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 sm:h-12 min-h-[44px] px-5 rounded-btn bg-brand hover:bg-brand-800 active:scale-[0.98] text-white font-bold text-sm sm:text-base shadow-warm transition-transform flex items-center justify-center gap-2 group disabled:opacity-50 select-none cursor-pointer touch-manipulation"
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
          </div>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs sm:text-sm text-espresso-secondary pt-2.5 border-t border-sand-border/60">
          Sudah memiliki akun?{" "}
          <Link
            href={`/login${redirectParam ? `?redirect=${encodeURIComponent(redirectParam)}` : ""}`}
            className="font-bold text-brand hover:underline inline-flex items-center px-1"
          >
            Masuk di Sini
          </Link>
        </div>
      </div>
    </div>
  );
}
