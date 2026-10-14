import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Activity, ShieldCheck, ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-warm-hero border-b border-sand-border pt-12 pb-20 sm:pt-16 sm:pb-28">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-brand-100/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-ai" />
            <span>Smart Distance Recommendation dengan Strava Sync</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-espresso tracking-tight leading-[1.12]">
            Every Stride Leads to a <span className="text-brand">Race</span>.
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-espresso-secondary leading-relaxed max-w-2xl font-normal">
            Platform e-ticket lomba lari pintar. Kami membantu pelari memilih kategori yang tepat—dari 5K hingga Marathon penuh—berdasarkan riwayat dan konsistensi latihan yang terukur.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="#events-section"
              className="px-7 py-3.5 rounded-btn bg-brand text-white font-bold text-base shadow-warm hover:bg-brand-800 active:bg-brand-900 transition-all duration-150 flex items-center gap-2 group"
            >
              <span>Cari Event Sekarang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="#recommendation-info"
              className="px-6 py-3.5 rounded-btn bg-white text-espresso-primary font-semibold text-base border border-sand-border shadow-sm hover:border-brand-300 hover:bg-brand-50/50 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-accent-strava" />
              <span>Cara Kerja AI Rekomendasi</span>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="pt-6 grid grid-cols-3 gap-4 border-t border-sand-border/60 max-w-xl text-xs text-espresso-secondary">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent-success" />
              <span>Tiket QR Anti Ganda</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-strava" />
              <span>Analisis Data Strava</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent-ai" />
              <span>Safety Distance Alert</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
