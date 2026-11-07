"use client";

import React from "react";
import {
  Compass,
  Activity,
  Sparkles,
  QrCode,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { HeroRaceBib } from "./HeroRaceBib";
import { HeroAthleticBackdrop } from "./HeroAthleticBackdrop";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0E0302] pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-14 lg:pb-24 border-b border-black/50">
      {/* 1. Cinematic Photographic Athletic Runner with Smooth Golden-Orange Light Trails (Zero Sparks/Dots) */}
      <HeroAthleticBackdrop />

      <Container className="relative z-10 w-full my-auto">
        {/* 2. Balanced 2-Column Athletic Grid: Left Content (54%) & Right Race BIB (46%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[54%_46%] gap-8 sm:gap-10 xl:gap-14 items-center">

          {/* LEFT COLUMN: High-Contrast Athletic Typography, Actions & Trust Badges */}
          <div className="space-y-6 sm:space-y-7 text-left">

            {/* Main Headline (with generous leading & bottom padding so descenders like 'g' never clip) */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.18] sm:leading-[1.18]">
              Temukan Race yang{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 inline-block pb-3 pr-2 drop-shadow-[0_2px_16px_rgba(234,88,12,0.45)]">
                Sesuai Langkahmu.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed max-w-xl font-normal">
              Beli tiket event lari resmi dengan verifikasi QR instan, dan dapatkan rekomendasi kategori jarak (5K hingga Marathon) yang paling aman berdasarkan kesiapan fisik Anda untuk mencegah risiko cedera atau DNF.
            </p>

            {/* Primary & Secondary Call To Actions */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#jelajahi-event"
                className="px-6 py-3.5 sm:px-7 sm:py-4 rounded-full bg-brand hover:bg-orange-600 text-white font-extrabold text-sm sm:text-base shadow-[0_4px_24px_rgba(194,65,12,0.5)] transition-all flex items-center justify-center gap-2 group active:scale-95 border border-orange-400/30"
              >
                <Compass className="w-4 h-4" />
                <span>Temukan Event Lari</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#smart-distance-ai"
                className="px-5 py-3.5 sm:px-6 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
              >
                <Activity className="w-4 h-4 text-orange-300" />
                <span>Coba Smart Recommendation</span>
              </a>
            </div>

            {/* Three Athletic Trust Badges (Frosted Glass Capsules) */}
            <div className="pt-4 border-t border-white/15">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Badge 1 */}
                <div className="bg-black/50 backdrop-blur-md p-3.5 rounded-xl border border-white/15 hover:border-white/30 shadow-lg space-y-1 transition-all">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <QrCode className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>E-Ticket QR Resmi</span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-tight">
                    Kode QR unik anti-duplikasi untuk race pack & check-in.
                  </p>
                </div>

                {/* Badge 2 */}
                <div className="bg-black/50 backdrop-blur-md p-3.5 rounded-xl border border-white/15 hover:border-white/30 shadow-lg space-y-1 transition-all">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <Sparkles className="w-4 h-4 text-purple-300 shrink-0" />
                    <span>Smart Distance AI</span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-tight">
                    Rekomendasi jarak terukur mitigasi risiko DNF & cedera.
                  </p>
                </div>

                {/* Badge 3 */}
                <div className="bg-black/50 backdrop-blur-md p-3.5 rounded-xl border border-white/15 hover:border-white/30 shadow-lg space-y-1 transition-all">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Kuota Terverifikasi</span>
                  </div>
                  <p className="text-[11px] text-stone-300 leading-tight">
                    Ketersediaan tiket diperbarui langsung oleh organizer resmi.
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: The Authentic Athletic Race BIB Pass */}
          <div className="w-full flex justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-0">
            <HeroRaceBib notchBgClass="bg-[#0E0302]" />
          </div>

        </div>
      </Container>
    </section>
  );
}
