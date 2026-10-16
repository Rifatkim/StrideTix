"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Activity,
  ShieldCheck,
  QrCode,
  CheckCircle,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-warm-hero border-b border-sand-border pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-brand-100/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-50 text-brand border border-brand/20 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-strava" />
            <span>Platform E-Ticket Lari Pintar Pertama di Indonesia</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-espresso tracking-tight leading-[1.12]">
            Daftar Race Lari Sesuai <span className="text-brand">Kesiapan Fisikmu</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-espresso-secondary leading-relaxed max-w-2xl font-normal">
            Bukan sekadar beli tiket. StrideTix menghubungkan riwayat latihan Strava Anda dengan rekomendasi jarak lomba yang terbukti aman, didukung sistem tiket QR dinamis anti-calo.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/auth/login"
              className="px-7 py-3.5 rounded-btn bg-brand text-white font-bold text-base shadow-warm hover:bg-brand-800 transition-all flex items-center gap-2 group active:scale-95"
            >
              <Activity className="w-4 h-4 text-accent-strava" />
              <span>Mulai dengan Strava</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#events-section"
              className="px-6 py-3.5 rounded-btn bg-white text-espresso font-semibold text-base border border-sand-border shadow-sm hover:border-brand-300 hover:bg-brand-50/50 transition-colors flex items-center gap-2 active:scale-95"
            >
              <span>Jelajahi Kalender Lomba</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 border-t border-sand-border/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0 border border-brand/20">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-espresso">Scoring Deterministik</h4>
                <p className="text-[11px] text-espresso-muted">Analisis jarak aman transparan</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-strava/10 text-accent-strava flex items-center justify-center shrink-0 border border-accent-strava/20">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-espresso">E-Ticket QR Anti-Calo</h4>
                <p className="text-[11px] text-espresso-muted">Check-in gate terenkripsi</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-espresso">Slot Kuota Asli 100%</h4>
                <p className="text-[11px] text-espresso-muted">Langsung dari EO terverifikasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
