"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";
import { AuthVideoBackdrop } from "./AuthVideoBackdrop";

interface AuthShowcaseLayoutProps {
  type: "login" | "register";
  title: string;
  subtitle: string;
  heroImage?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  children: React.ReactNode;
}

export function AuthShowcaseLayout({
  type,
  title,
  subtitle,
  children,
}: AuthShowcaseLayoutProps) {
  return (
    <div className="min-h-[100dvh] lg:h-screen lg:max-h-screen w-full flex flex-col lg:flex-row bg-[#FFFCF8] text-espresso selection:bg-brand selection:text-white relative overflow-x-hidden lg:overflow-hidden">
      {/* =========================================================================
          DESKTOP SHOWCASE VIDEO PANEL (lg:flex, 46% - 48% width)
          Background video orang sedang lari dengan filter warna gelap ber-opacity
          Tipografi minimalis: hanya nama StrideTix dan kalimat yang diminta.
      ========================================================================= */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative flex-col justify-between p-8 xl:p-12 text-white overflow-hidden bg-[#120B07] shrink-0 h-full">
        {/* 1. Background Native Video with Dark Opacity Filter Block (per SS 3) */}
        <AuthVideoBackdrop />

        {/* 2. Top: StrideTix Brand Lockup ONLY */}
        <div className="relative z-30 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group w-fit" aria-label="Beranda StrideTix">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-colors">
              <StrideTixSymbol size={20} color="#FFFFFF" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Stride<span className="text-orange-400">Tix</span>
            </span>
          </Link>
        </div>

        {/* 3. Middle: Exact Storytelling Headline & Copy (No extra pills or badges) */}
        <div className="relative z-30 my-auto py-6 space-y-4 max-w-xl">
          <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-white tracking-tight leading-[1.16] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            Langkah Pertama Menuju Garis Finis.
          </h1>

          <p className="text-sm xl:text-base text-stone-200 leading-relaxed max-w-lg font-normal drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
            Platform e-ticketing resmi event lari nasional dengan Smart Distance Recommendation. Pilih kategori jarak yang terukur dan hindari risiko cedera.
          </p>
        </div>

        {/* 4. Bottom Empty Area (Footage switcher resides inside AuthVideoBackdrop) */}
        <div className="relative z-30 h-8" />
      </aside>

      {/* =========================================================================
          MOBILE NATIVE TOPBAR (lg:hidden)
          Tampilan mobile bersih, proporsional, safe-area aware, dan bebas duplikasi heading
      ========================================================================= */}
      <header className="lg:hidden w-full px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-2.5 flex items-center justify-between border-b border-sand-border/50 bg-[#FFFCF8] shrink-0 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2 group min-h-[44px]" aria-label="Beranda StrideTix">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white shadow-warm">
            <StrideTixSymbol size={18} color="#FFFFFF" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-espresso">
            Stride<span className="text-brand">Tix</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-espresso-secondary hover:text-brand px-3 py-1.5 rounded-full bg-white border border-sand-border/80 shadow-2xs min-h-[38px] active:scale-[0.97] transition-all touch-manipulation"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-espresso-muted" />
          <span>Kembali</span>
        </Link>
      </header>

      {/* =========================================================================
          FORM CONTAINER PANEL
          Desktop: 1 layar penuh (100% viewport) tanpa scrollbar berlebih.
          Mobile: Mengalir rapi dari topbar tanpa banner yang terjepit, pas di layar HP.
      ========================================================================= */}
      <section className="flex-1 flex flex-col justify-between relative z-20 bg-[#FFFCF8] lg:border-none min-h-0 lg:h-full lg:max-h-screen lg:overflow-y-auto">
        {/* Desktop Header Topbar (Hidden di mobile) */}
        <header className="hidden lg:flex w-full px-6 xl:px-10 py-2.5 xl:py-3.5 items-center justify-between border-b border-sand-border/40 shrink-0">
          <div>
            <span className="text-xs font-semibold text-espresso-muted">
              {type === "login" ? "Sudah siap untuk race berikutnya?" : "Hanya butuh 30 detik untuk mendaftar."}
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-espresso-secondary hover:text-brand px-3 py-1.5 rounded-full hover:bg-brand-50 transition-colors border border-sand-border/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </header>

        {/* Form Center Wrapper */}
        <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 py-4 sm:py-3 min-h-0">
          <div className="w-full max-w-md sm:max-w-[420px] space-y-2.5 sm:space-y-3">
            {/* Header Text Above Card */}
            <div className="space-y-0.5 text-left">
              <h2 className="text-xl sm:text-2xl font-black text-espresso tracking-tight">
                {title}
              </h2>
              <p className="text-xs text-espresso-secondary leading-snug">
                {subtitle}
              </p>
            </div>

            {/* The Actual Form Component */}
            {children}
          </div>
        </main>

        {/* Footer Reassurance Info */}
        <footer className="w-full px-4 sm:px-6 xl:px-10 py-2 xl:py-2.5 text-center lg:text-left border-t border-sand-border/50 text-[10.5px] text-espresso-muted flex flex-col sm:flex-row items-center justify-between gap-1.5 shrink-0 pb-[max(0.6rem,env(safe-area-inset-bottom,0px))]">
          <span>&copy; {new Date().getFullYear()} StrideTix. Hak Cipta Dilindungi.</span>
          <span className="flex items-center gap-1.5 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-success" />
            <span>Enkripsi SSL & Perlindungan Akun Aman</span>
          </span>
        </footer>
      </section>
    </div>
  );
}
