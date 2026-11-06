import React from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Masuk ke Akun — StrideTix",
  description: "Masuk ke platform e-ticket lomba lari dan Smart Distance Recommendation StrideTix.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-espresso selection:bg-brand selection:text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-brand/8 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Auth Topbar (Dedicated, Clean, Not Mixed with Landing Page) */}
      <header className="w-full border-b border-[#E8DDD0] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 sm:h-15 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" aria-label="Beranda StrideTix">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-colors">
              <StrideTixSymbol size={18} color="#FFFFFF" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-espresso">
              Stride<span className="text-brand">Tix</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-espresso-secondary hover:text-espresso px-2.5 py-1.5 rounded-full hover:bg-sand-border/40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </Link>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-6 relative z-10">
        <React.Suspense fallback={<div className="text-center text-xs text-espresso-muted">Memuat formulir...</div>}>
          <LoginForm />
        </React.Suspense>
      </main>
    </div>
  );
}
