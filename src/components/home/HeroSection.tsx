"use client";

import React from "react";
import Image from "next/image";
import {
  Compass,
  Activity,
  Sparkles,
  QrCode,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { HeroProductPreview } from "./HeroProductPreview";
import { RunningStrideIcon } from "@/components/brand/RunningStrideIcon";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#120B07] border-b border-stone-800/80 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4.5rem)] flex flex-col justify-center pt-8 pb-14 sm:pt-10 sm:pb-18 lg:pt-12 lg:pb-22">
      {/* 1. Full-bleed Background Event Photo with Balanced Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-landingpage.jpg"  
          alt="Peserta event lari memenuhi lintasan jalan di kawasan perkotaan."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%] filter brightness-100 contrast-[1.05] saturate-[1.12]"
        />

        {/* Soft base dark tint so the vibrant race photo and runners remain clearly visible */}
        <div className="absolute inset-0 bg-[#120B07]/35" />

        {/* Directional gradient: darker on left (92%) for pure contrast with white text, much lighter on right (15%) so photo details pop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#120B07]/80 via-[#120B07]/50 to-[#120B07]/75 lg:bg-gradient-to-r lg:from-[#120B07]/92 lg:via-[#120B07]/60 lg:to-[#120B07]/15" />

        {/* Subtle top shade from header */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#120B07]/60 to-transparent pointer-events-none" />

        {/* Subtle dark bottom edge shade maintaining rich dark tone all the way down */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#120B07]/90 to-transparent pointer-events-none" />
      </div>

      <Container className="relative z-10 w-full my-auto">
        {/* 2. Responsive 2-Column Hero Grid: Left (53%) & Right (47%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[53%_47%] gap-8 xl:gap-12 items-start lg:items-center">

          {/* LEFT COLUMN: Messaging, CTAs & Trust Points */}
          <div className="space-y-6 sm:space-y-7 text-left">
            {/* Eyebrow Pill */}

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.14] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              Temukan Race yang{" "}
              <span className="text-orange-500 block sm:inline drop-shadow-[0_2px_12px_rgba(194,65,12,0.4)]">Sesuai dengan Langkahmu.</span>
            </h1>

            {/* Refined Description */}
            <div className="space-y-2 max-w-xl text-stone-100 text-sm sm:text-base leading-relaxed font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              <p>
                Cari event lari, beli tiket, dan dapatkan rekomendasi kategori 5K hingga Marathon berdasarkan riwayat latihan Strava Anda.
              </p>
              <p className="text-xs sm:text-sm text-stone-200">
                Rekomendasi bersifat informatif dan membantu Anda mempertimbangkan pilihan kategori.
              </p>
            </div>

            {/* Primary & Secondary Call To Actions */}
            <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#jelajahi-event"
                className="px-6 py-3.5 rounded-btn bg-brand hover:bg-orange-600 text-white font-bold text-sm sm:text-base shadow-warm transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                <Compass className="w-4 h-4" />
                <span>Temukan Event Lari</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#smart-distance-ai"
                className="px-5 py-3.5 rounded-btn bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/25 backdrop-blur-md transition-colors flex items-center justify-center gap-2 active:scale-95"
              >
                <Activity className="w-4 h-4 text-orange-400" />
                <span>Coba Smart Recommendation</span>
              </a>
            </div>

            {/* Three Streamlined Trust Points */}
            <div className="pt-6 sm:pt-8 border-t border-white/15">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-3">
                {/* Trust Point 1 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black/40 text-orange-400 flex items-center justify-center shrink-0 border border-white/20 mt-0.5 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white drop-shadow-sm">Rekomendasi Transparan</h2>
                    <p className="text-[11px] text-stone-200 leading-tight mt-0.5 drop-shadow-sm">
                      Berdasarkan ringkasan aktivitas latihan.
                    </p>
                  </div>
                </div>

                {/* Trust Point 2 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black/40 text-purple-300 flex items-center justify-center shrink-0 border border-white/20 mt-0.5 backdrop-blur-sm">
                    <QrCode className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white drop-shadow-sm">E-Ticket Terverifikasi</h2>
                    <p className="text-[11px] text-stone-200 leading-tight mt-0.5 drop-shadow-sm">
                      QR unik untuk proses check-in event.
                    </p>
                  </div>
                </div>

                {/* Trust Point 3 */}
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-black/40 text-emerald-400 flex items-center justify-center shrink-0 border border-white/20 mt-0.5 backdrop-blur-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white drop-shadow-sm">Kuota Event Aktual</h2>
                    <p className="text-[11px] text-stone-200 leading-tight mt-0.5 drop-shadow-sm">
                      Ketersediaan tiket diperbarui oleh organizer.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Elevated Product Preview Cards */}
          <div className="w-full flex justify-center lg:justify-end mt-4 lg:mt-0">
            <HeroProductPreview />
          </div>

        </div>
      </Container>
    </section>
  );
}
