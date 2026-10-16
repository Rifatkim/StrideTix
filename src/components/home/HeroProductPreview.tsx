"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Activity,
  Ticket,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Zap,
} from "lucide-react";

export function HeroProductPreview() {
  return (
    <div className="relative w-full max-w-[500px] mx-auto lg:max-w-none flex items-center justify-center pt-4 pb-8 sm:pt-6 sm:pb-12 select-none">
      {/* 1. Subtle Radial Ambient Glow behind cards */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-brand-500/20 via-orange-500/10 to-transparent blur-3xl pointer-events-none -top-6 -right-6"
        aria-hidden="true"
      />

      {/* 2. Composition Container for the Stacked Product Cards */}
      <div className="relative w-full max-w-[460px]">

        {/* --- CARD 4: Strava Connected Floating Status (Top Right) --- */}
        <div className="absolute -top-4 -right-2 sm:-right-4 z-30 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/60 shadow-[0_12px_32px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-transform duration-200 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-accent-strava border border-orange-200/80 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-espresso">Strava Terhubung</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-espresso-muted">Aktivitas terakhir disinkronkan</p>
          </div>
        </div>

        {/* --- CARD 1: Core Smart Distance Recommendation Card (Center Anchor) --- */}
        <div className="relative z-20 bg-white/95 backdrop-blur-md rounded-card p-5 sm:p-6 border border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.22)] hover:-translate-y-0.5 transition-all duration-200 space-y-4">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-3 border-b border-sand-border/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 border border-purple-200/80 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs font-black tracking-tight text-espresso">
                Smart Distance Recommendation
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sand-warm text-espresso-muted border border-sand-border">
              Simulasi Latihan
            </span>
          </div>

          {/* Core Recommendation & Confidence */}
          <div className="bg-sand-warm/70 rounded-xl p-4 border border-sand-border/80 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted">
                  Kategori Jarak Rekomendasi
                </span>
                <div className="text-3xl sm:text-4xl font-black text-espresso tracking-tight leading-none mt-0.5">
                  10K
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direkomendasikan</span>
              </span>
            </div>

            {/* Confidence Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-espresso-secondary">Tingkat Kesiapan Jarak</span>
                <span className="text-brand font-black">82%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-sand-border/70 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand to-accent-strava rounded-full transition-all duration-500"
                  style={{ width: "82%" }}
                />
              </div>
            </div>
          </div>

          {/* Strava 3-Metric Summary Grid */}
          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2.5 rounded-xl bg-surface-main border border-sand-border/60">
              <span className="text-[10px] font-bold text-espresso-muted block">Pace Rata-rata</span>
              <span className="text-xs sm:text-sm font-black text-espresso">6:15 /km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-main border border-sand-border/60">
              <span className="text-[10px] font-bold text-espresso-muted block">Long Run</span>
              <span className="text-xs sm:text-sm font-black text-espresso">8,6 km</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-main border border-sand-border/60">
              <span className="text-[10px] font-bold text-espresso-muted block">Frekuensi</span>
              <span className="text-xs sm:text-sm font-black text-espresso">3× / minggu</span>
            </div>
          </div>

          {/* Action Link Footer */}
          <div className="pt-1 flex items-center justify-between text-xs border-t border-sand-border/60">
            <span className="text-[11px] text-espresso-muted">Analisis fisiologis Strava aman</span>
            <Link
              href="#recommendation-explainer"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:underline"
            >
              <span>Lihat Analisis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* --- CARD 2: Matched Event Card (Bottom Right Offset) --- */}
        <div className="hidden sm:block absolute -bottom-4 -right-2 sm:-right-4 z-10 w-[260px] bg-white/95 backdrop-blur-md rounded-card p-3 border border-white/60 shadow-[0_16px_36px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-200">
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-2">
            <Image
              src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=400&q=80"
              alt="Jakarta City Marathon"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-white text-espresso shadow-xs">
              10K
            </span>
            <span className="absolute bottom-2 left-2 text-[11px] font-black text-white truncate max-w-[200px]">
              Jakarta City Marathon
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-espresso-secondary">
              <Calendar className="w-3 h-3 text-brand" />
              <span>15 Nov 2026 • GBK Senayan</span>
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-50 text-brand border border-orange-200">
                <Zap className="w-2.5 h-2.5" />
                Cocok untuk Rekomendasimu
              </span>
            </div>
          </div>
        </div>

        {/* --- CARD 3: E-Ticket Verified Card (Bottom Left Offset) --- */}
        <div className="hidden sm:flex absolute -bottom-5 -left-2 sm:-left-4 z-30 w-[220px] bg-white/95 backdrop-blur-md rounded-card p-3 border border-white/60 shadow-[0_16px_36px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-200 flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded bg-brand-50 text-brand flex items-center justify-center">
                <Ticket className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-black text-espresso leading-tight">E-Ticket Aktif</div>
                <div className="text-[9px] text-espresso-muted">Kategori 10K • BIB 8492</div>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-accent-success" />
          </div>

          {/* Stylized QR Code Matrix Bar */}
          <div className="bg-sand-warm/80 rounded-lg p-2 flex items-center justify-between border border-sand-border/70">
            <div className="w-9 h-9 bg-espresso rounded p-1 flex items-center justify-center shrink-0">
              <div className="w-full h-full border border-white/40 grid grid-cols-3 gap-0.5 p-0.5">
                <div className="bg-white rounded-[1px]" />
                <div className="bg-white/40 rounded-[1px]" />
                <div className="bg-white rounded-[1px]" />
                <div className="bg-white/40 rounded-[1px]" />
                <div className="bg-brand rounded-[1px]" />
                <div className="bg-white/70 rounded-[1px]" />
                <div className="bg-white rounded-[1px]" />
                <div className="bg-white/30 rounded-[1px]" />
                <div className="bg-white rounded-[1px]" />
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                Siap Digunakan
              </span>
              <div className="text-[8px] font-mono text-espresso-muted mt-0.5">STX-2026-JKT</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
