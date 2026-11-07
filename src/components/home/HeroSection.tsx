"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  Activity,
  Sparkles,
  QrCode,
  ShieldCheck,
  ArrowRight,
  Flame,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { HeroRaceBib } from "./HeroRaceBib";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-warm-hero border-b border-sand-border pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-20">
      {/* 1. Subtle Athletic Track Curve Contours (Background Aesthetics) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-24 -right-24 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] text-brand-200/40"
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="400" r="380" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="400" cy="400" r="320" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="400" cy="400" r="260" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="1" />
        </svg>

        {/* Soft Warm Radial Ambient Light */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <Container className="relative z-10 w-full my-auto">
        {/* 2. Balanced 2-Column Athletic Grid: Left Content (54%) & Right Race BIB (46%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[54%_46%] gap-8 sm:gap-10 xl:gap-14 items-center">

          {/* LEFT COLUMN: Editorial Typography, Action CTAs & Trust Badges */}
          <div className="space-y-6 sm:space-y-7 text-left">
            
            {/* Pill Tagline */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-brand-50 text-brand border border-brand/20 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              <span>Smart Race Ticketing Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-espresso tracking-tight leading-[1.12]">
              Temukan Race yang{" "}
              <span className="text-brand inline-block underline decoration-brand-200 decoration-wavy decoration-2 underline-offset-8">
                Sesuai Langkahmu.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-espresso-secondary leading-relaxed max-w-xl font-medium">
              Beli tiket event lari resmi dengan verifikasi QR instan, dan dapatkan rekomendasi kategori jarak (5K hingga Marathon) yang paling aman berdasarkan kesiapan fisik Anda untuk mencegah risiko cedera atau DNF.
            </p>

            {/* Primary & Secondary Call To Actions */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#jelajahi-event"
                className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-btn bg-brand hover:bg-brand-800 text-white font-extrabold text-sm sm:text-base shadow-warm hover:shadow-warm-hover transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>Temukan Event Lari</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#smart-distance-ai"
                className="px-5 py-3.5 sm:px-6 sm:py-4 rounded-btn bg-white hover:bg-brand-50 text-brand font-bold text-sm sm:text-base border-2 border-brand/30 hover:border-brand transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95"
              >
                <Activity className="w-4 h-4 text-brand" />
                <span>Coba Smart Recommendation</span>
              </a>
            </div>

            {/* Three Athletic Trust Badges (Warm White Cards per DESIGN.md) */}
            <div className="pt-4 border-t border-sand-border/80">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Badge 1 */}
                <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-sand-border shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-espresso">
                    <QrCode className="w-4 h-4 text-brand shrink-0" />
                    <span>E-Ticket QR Resmi</span>
                  </div>
                  <p className="text-[11px] text-espresso-muted leading-tight">
                    Kode QR unik anti-duplikasi untuk race pack & check-in.
                  </p>
                </div>

                {/* Badge 2 */}
                <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-sand-border shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-espresso">
                    <Sparkles className="w-4 h-4 text-accent-ai shrink-0" />
                    <span>Smart Distance AI</span>
                  </div>
                  <p className="text-[11px] text-espresso-muted leading-tight">
                    Rekomendasi jarak terukur mitigasi risiko DNF & cedera.
                  </p>
                </div>

                {/* Badge 3 */}
                <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-sand-border shadow-2xs space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-espresso">
                    <ShieldCheck className="w-4 h-4 text-accent-success shrink-0" />
                    <span>Kuota Terverifikasi</span>
                  </div>
                  <p className="text-[11px] text-espresso-muted leading-tight">
                    Ketersediaan tiket diperbarui langsung oleh organizer resmi.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: The Authentic Athletic Race BIB Pass */}
          <div className="w-full flex justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-0">
            <HeroRaceBib />
          </div>

        </div>
      </Container>
    </section>
  );
}
