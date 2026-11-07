"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, QrCode } from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";

export function HeroRaceBib() {
  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none group">
      {/* Subtle warm athletic ambient glow behind the bib */}
      <div
        className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand/20 via-orange-400/15 to-transparent blur-2xl pointer-events-none"
        aria-hidden="true"
      />

      {/* --- THE PHYSICAL ATHLETIC RACE BIB (NOMOR DADA LARI) --- */}
      <div className="relative bg-white rounded-[22px] border-2 border-stone-200/90 shadow-[0_20px_50px_rgba(58,39,24,0.15)] p-5 sm:p-6 transition-transform duration-300 hover:-translate-y-1 overflow-hidden">
        
        {/* 4 Corner Safety Pin Holes (Grommets) */}
        <div className="absolute top-3.5 left-3.5 w-3.5 h-3.5 rounded-full border-2 border-stone-300 bg-sand-muted shadow-inner pointer-events-none" />
        <div className="absolute top-3.5 right-3.5 w-3.5 h-3.5 rounded-full border-2 border-stone-300 bg-sand-muted shadow-inner pointer-events-none" />
        <div className="absolute bottom-3.5 left-3.5 w-3.5 h-3.5 rounded-full border-2 border-stone-300 bg-sand-muted shadow-inner pointer-events-none" />
        <div className="absolute bottom-3.5 right-3.5 w-3.5 h-3.5 rounded-full border-2 border-stone-300 bg-sand-muted shadow-inner pointer-events-none" />

        {/* 1. Header: StrideTix Official Seal & Event Title */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 px-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-brand flex items-center justify-center text-white shadow-xs">
              <StrideTixSymbol size={14} color="#FFFFFF" />
            </div>
            <div>
              <span className="text-[11px] font-black tracking-tight text-espresso block leading-none">
                Stride<span className="text-brand">Tix</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-espresso-muted">
                Official Race Pass
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-extrabold text-espresso block uppercase tracking-tight">
              Jakarta City Marathon
            </span>
            <span className="text-[9px] text-espresso-muted block font-medium">
              15 Nov 2026 • GBK Senayan
            </span>
          </div>
        </div>

        {/* 2. Main Athletic BIB Number & Runner Identity */}
        <div className="py-3 text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand">
            Official Runner Number
          </span>
          <div className="text-5xl sm:text-6xl font-black text-espresso tracking-tight leading-none font-mono">
            BIB 2804
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-espresso-secondary pt-0.5">
            <span>HAKIM PRATAMA</span>
            <span>•</span>
            <span className="text-brand">WAVE 1 (06:00 WIB)</span>
          </div>
        </div>

        {/* 3. High-Contrast Category Banner */}
        <div className="bg-brand text-white px-3.5 py-1.5 rounded-lg flex items-center justify-between font-black text-xs uppercase tracking-wider shadow-xs mb-3">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span>Kategori 10K Road Race</span>
          </span>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-bold">
            Verified Pass
          </span>
        </div>

        {/* 4. Smart Distance Recommendation Stamp (Certified by StrideTix) */}
        <div className="bg-brand-50/80 border border-brand/20 rounded-xl p-3 space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-espresso">
              <Sparkles className="w-3.5 h-3.5 text-accent-ai" />
              <span>Smart Distance AI Certified</span>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100/90 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Kesiapan 82% (Aman)</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="bg-white rounded-md py-1 px-1.5 border border-sand-border/70">
              <span className="text-espresso-muted block font-medium">Long Run</span>
              <span className="font-extrabold text-espresso">8,6 km</span>
            </div>
            <div className="bg-white rounded-md py-1 px-1.5 border border-sand-border/70">
              <span className="text-espresso-muted block font-medium">Pace Nyaman</span>
              <span className="font-extrabold text-espresso">6:15 /km</span>
            </div>
            <div className="bg-white rounded-md py-1 px-1.5 border border-sand-border/70">
              <span className="text-espresso-muted block font-medium">Frekuensi</span>
              <span className="font-extrabold text-espresso">3× / mgg</span>
            </div>
          </div>
        </div>

        {/* 5. Perforated Bottom Stub (Kupon Pengambilan Race Pack & Medali) */}
        <div className="relative pt-3">
          {/* Authentic Tear Notches on the Left & Right edges */}
          <div className="absolute -top-2 -left-7 w-4 h-4 rounded-full bg-[#FFF8EE] border-r-2 border-stone-200/90 pointer-events-none" />
          <div className="absolute -top-2 -right-7 w-4 h-4 rounded-full bg-[#FFF8EE] border-l-2 border-stone-200/90 pointer-events-none" />

          {/* Dashed Perforation Line */}
          <div className="border-t-2 border-dashed border-stone-300 mb-3" />

          {/* Stub Content */}
          <div className="flex items-center justify-between gap-3 text-espresso">
            {/* Vector Barcode */}
            <div className="space-y-1">
              <div className="flex items-center h-7 gap-[2px]">
                <div className="w-[2px] h-full bg-espresso" />
                <div className="w-[1px] h-full bg-espresso" />
                <div className="w-[3px] h-full bg-espresso" />
                <div className="w-[1px] h-full bg-espresso" />
                <div className="w-[4px] h-full bg-espresso" />
                <div className="w-[2px] h-full bg-espresso" />
                <div className="w-[1px] h-full bg-espresso" />
                <div className="w-[3px] h-full bg-espresso" />
                <div className="w-[2px] h-full bg-espresso" />
                <div className="w-[1px] h-full bg-espresso" />
                <div className="w-[4px] h-full bg-espresso" />
                <div className="w-[2px] h-full bg-espresso" />
                <div className="w-[1px] h-full bg-espresso" />
                <div className="w-[3px] h-full bg-espresso" />
                <div className="w-[2px] h-full bg-espresso" />
                <div className="w-[1px] h-full bg-espresso" />
                <div className="w-[4px] h-full bg-espresso" />
                <div className="w-[1px] h-full bg-espresso" />
                <div className="w-[2px] h-full bg-espresso" />
                <div className="w-[3px] h-full bg-espresso" />
              </div>
              <span className="font-mono text-[9px] text-espresso-muted block tracking-wider">
                STX-2804-RACEPACK
              </span>
            </div>

            {/* QR Check-in Chip */}
            <div className="text-right flex items-center gap-2">
              <div>
                <span className="text-[10px] font-extrabold text-espresso block">
                  Check-in QR Ready
                </span>
                <span className="text-[9px] text-emerald-700 font-bold block">
                  ✓ Validasi Gate Otomatis
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-espresso text-white flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

