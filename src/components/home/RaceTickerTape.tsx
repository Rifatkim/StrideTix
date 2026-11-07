"use client";

import React from "react";
import Link from "next/link";
import { Flame, ShieldCheck, Sparkles, Trophy, Ticket, ArrowUpRight } from "lucide-react";

const TICKER_ITEMS = [
  {
    icon: Flame,
    label: "JAKARTA CITY MARATHON",
    detail: "15 NOV 2026 • 10K, HM & FM TERSEDIA",
    highlight: "Sisa 240 Slot",
  },
  {
    icon: Sparkles,
    label: "SMART DISTANCE AI",
    detail: "Cek kesiapan fisik sebelum checkout untuk mencegah cedera",
    highlight: "94% Patuh Rekomendasi",
  },
  {
    icon: Ticket,
    label: "BOROBUDUR HERITAGE 10K",
    detail: "14 FEB 2027 • SLOT EARLY BIRD",
    highlight: "Buka Pendaftaran",
  },
  {
    icon: ShieldCheck,
    label: "E-TICKET RESMI QR",
    detail: "Verifikasi instan panitia race pack & gerbang start",
    highlight: "Anti-Duplikasi",
  },
  {
    icon: Trophy,
    label: "BALI SUNSET 10K",
    detail: "22 DES 2026 • KUOTA TERBATAS",
    highlight: "Sisa 68 Tiket",
  },
];

export function RaceTickerTape() {
  return (
    <div className="w-full bg-surface-soft border-y border-sand-border/80 overflow-hidden py-2.5 sm:py-3 select-none">
      <div className="animate-sports-ticker flex items-center gap-6 sm:gap-10">
        {/* Render twice for continuous loop */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 shrink-0 text-xs text-espresso"
            >
              <span className="w-6 h-6 rounded-full bg-brand-50 text-brand border border-brand/20 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-brand" />
              </span>
              <span className="font-extrabold tracking-tight text-espresso uppercase text-[11px] sm:text-xs">
                {item.label}
              </span>
              <span className="text-espresso-muted hidden sm:inline text-[11px]">
                {item.detail}
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-sand-border text-brand shadow-2xs">
                {item.highlight}
              </span>
              <span className="text-sand-border-strong mx-2">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

