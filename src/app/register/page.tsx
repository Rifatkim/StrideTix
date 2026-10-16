import React from "react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Daftar Akun Baru — StrideTix",
  description: "Daftar akun pelari atau penyelenggara (EO) di platform StrideTix.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-espresso selection:bg-brand selection:text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-brand/8 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Auth Topbar (Dedicated, Clean, Not Mixed with Landing Page) */}
      <header className="w-full border-b border-[#E8DDD0] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" aria-label="Kembali ke Beranda">
            <div className="w-9 h-9 rounded-btn bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-colors">
              <StrideTixSymbol size={20} color="#FFFFFF" />
            </div>
            <span className="font-black text-xl tracking-tight text-espresso">
              Stride<span className="text-brand">Tix</span>
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-espresso-secondary hover:text-espresso px-3 py-1.5 rounded-full hover:bg-sand-border/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative z-10">
        <RegisterForm />
      </main>

      {/* Auth Footer */}
      <footer className="w-full border-t border-[#E8DDD0] py-4 bg-white/50 text-center text-xs text-espresso-muted">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Autentikasi Terenkripsi & Dilindungi Supabase Auth</span>
        </div>
      </footer>
    </div>
  );
}
