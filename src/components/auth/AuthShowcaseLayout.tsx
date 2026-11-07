"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Activity, Ticket, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";

interface AuthShowcaseLayoutProps {
  type: "login" | "register";
  title: string;
  subtitle: string;
  heroImage: string;
  heroHeadline: string;
  heroSubheadline: string;
  children: React.ReactNode;
}

export function AuthShowcaseLayout({
  type,
  title,
  subtitle,
  heroImage,
  heroHeadline,
  heroSubheadline,
  children,
}: AuthShowcaseLayoutProps) {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col lg:flex-row bg-[#FFFCF8] text-espresso selection:bg-brand selection:text-white relative overflow-x-hidden">
      {/* =========================================================================
          DESKTOP SHOWCASE HERO PANEL (lg:flex, 46% - 48% width)
          Energetik, hangat, berkelas maraton resmi, dan kredibel
      ========================================================================= */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative flex-col justify-between p-10 xl:p-14 text-white overflow-hidden bg-espresso shrink-0">
        {/* Background Image with warm gradient overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={heroImage}
            alt="StrideTix Running Event"
            fill
            priority
            className="object-cover object-center scale-105 motion-safe:animate-in motion-safe:fade-in duration-700"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          {/* Multi-layer Gradient: Espresso dark base + warm brand glow + subtle vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/75 to-espresso/35" />
          <div className="absolute inset-0 bg-radial from-brand/20 via-transparent to-transparent opacity-80" />
        </div>

        {/* Top: StrideTix Brand Lockup */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Beranda StrideTix">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-colors">
              <StrideTixSymbol size={20} color="#FFFFFF" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Stride<span className="text-orange-400">Tix</span>
            </span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
            <Sparkles className="w-3 h-3 text-orange-300" />
            <span>Official Race Pass</span>
          </span>
        </div>

        {/* Middle: Editorial Storytelling Headline */}
        <div className="relative z-10 my-auto py-8 space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand/30 border border-brand/40 text-orange-200 backdrop-blur-sm">
            <Trophy className="w-3.5 h-3.5 text-orange-300" />
            <span>{type === "login" ? "Gerbang Menuju Lintasan Lomba" : "Mulai Target Finis Anda"}</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-[1.18]">
            {heroHeadline}
          </h1>

          <p className="text-sm xl:text-base text-white/80 leading-relaxed max-w-lg font-normal">
            {heroSubheadline}
          </p>
        </div>

        {/* Bottom: 3 Feature Glassmorphic Cards & Social Proof */}
        <div className="relative z-10 space-y-5 pt-4 border-t border-white/15">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <Activity className="w-4 h-4 text-orange-400" />
              <div className="text-xs font-bold text-white">Smart Distance AI</div>
              <p className="text-[10px] text-white/70 leading-tight">Analisis 5K, 10K, HM, FM</p>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <Ticket className="w-4 h-4 text-emerald-400" />
              <div className="text-xs font-bold text-white">QR Pass Instan</div>
              <p className="text-[10px] text-white/70 leading-tight">Anti-duplikasi & verifikasi</p>
            </div>

            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <div className="text-xs font-bold text-white">Keamanan 2FA</div>
              <p className="text-[10px] text-white/70 leading-tight">Privasi akun terenkripsi</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/60">
            <span>Platform E-Ticketing Resmi Event Lari Indonesia</span>
            <span>Terintegrasi 2026</span>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE COMPACT HERO HEADER (lg:hidden)
          Mengikuti kaidah /mobile-native & /emil-design-eng:
          - Kompak & terintegrasi (tinggi terkontrol ~160-190px, tidak mendominasi layar)
          - Memuat foto maraton, headline, & 3 glass chips (identik dengan desktop)
          - Safe area top padding untuk iOS Dynamic Island / Android camera notch
      ========================================================================= */}
      <div className="lg:hidden relative bg-espresso text-white overflow-hidden shrink-0">
        {/* Background Image with warm gradient overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={heroImage}
            alt="StrideTix Running Event"
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-espresso/92 via-espresso/85 to-espresso" />
          <div className="absolute inset-0 bg-radial from-brand/25 via-transparent to-transparent opacity-80" />
        </div>

        {/* Mobile Header Topbar: Safe area + Brand Logo + Back Button */}
        <div className="relative z-10 px-4 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-2.5 flex items-center justify-between border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 group min-h-[44px]" aria-label="Beranda StrideTix">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white shadow-warm">
              <StrideTixSymbol size={18} color="#FFFFFF" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Stride<span className="text-orange-400">Tix</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 backdrop-blur-md border border-white/15 text-white/90">
              <Sparkles className="w-3 h-3 text-orange-300" />
              <span>Official Pass</span>
            </span>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-white/90 hover:text-white px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 min-h-[44px] active:scale-[0.97] transition-transform duration-150 ease-out touch-manipulation"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
          </div>
        </div>

        {/* Mobile Compact Hero Content */}
        <div className="relative z-10 px-4 pt-3 pb-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand/35 border border-brand/40 text-orange-200 backdrop-blur-sm">
              <Trophy className="w-3 h-3 text-orange-300" />
              <span>{type === "login" ? "Gerbang Lintasan Lomba" : "Mulai Target Finis"}</span>
            </span>
            <span className="text-[10px] text-white/70 font-medium">Race E-Ticket 2026</span>
          </div>

          <h1 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
            {heroHeadline}
          </h1>

          {/* 3 Glassmorphic Feature Cards on Mobile */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-white truncate">Smart AI</div>
                <div className="text-[8px] text-white/70 truncate">5K s/d FM</div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
              <Ticket className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-white truncate">QR Pass</div>
                <div className="text-[8px] text-white/70 truncate">Gate Cepat</div>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-300 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-white truncate">2FA Safe</div>
                <div className="text-[8px] text-white/70 truncate">Terenkripsi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          FORM CONTAINER PANEL
          Mobile: Mengalir secara natural tanpa duplikasi min-h-[100dvh],
                  input langsung terlihat jelas di layar pertama (above-the-fold).
          Desktop: 52% - 54% width kolom kanan dengan header dan footer simetris.
      ========================================================================= */}
      <section className="flex-1 flex flex-col justify-between relative z-20 -mt-3 lg:mt-0 rounded-t-2xl sm:rounded-3xl lg:rounded-none bg-[#FFFCF8] shadow-warm-modal lg:shadow-none border-t border-sand-border/70 lg:border-none min-h-0">
        {/* Desktop Header Topbar (Hidden di mobile) */}
        <header className="hidden lg:flex w-full px-8 xl:px-12 py-5 items-center justify-between border-b border-sand-border/40">
          <div>
            <span className="text-xs font-semibold text-espresso-muted">
              {type === "login" ? "Sudah siap untuk race berikutnya?" : "Hanya butuh 30 detik untuk mendaftar."}
            </span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-espresso-secondary hover:text-brand px-3.5 py-2 rounded-full hover:bg-brand-50 transition-colors border border-sand-border/60 min-h-[44px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </header>

        {/* Form Center Wrapper */}
        <main className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-8 py-5 sm:py-8">
          <div className="w-full max-w-md sm:max-w-[430px] space-y-3.5 sm:space-y-5">
            {/* Header Text Above Card */}
            <div className="space-y-1 text-left pt-1 sm:pt-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-espresso tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-espresso-secondary leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* The Actual Form Component */}
            {children}
          </div>
        </main>

        {/* Footer Reassurance Info + Safe Area Bottom padding for iOS Home Bar */}
        <footer className="w-full px-4 sm:px-8 py-3.5 text-center lg:text-left border-t border-sand-border/50 text-[11px] text-espresso-muted flex flex-col sm:flex-row items-center justify-between gap-2 pb-[max(1rem,env(safe-area-inset-bottom,0px))]">
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
