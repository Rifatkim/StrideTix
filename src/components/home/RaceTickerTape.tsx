"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  ShieldCheck,
  Sparkles,
  Trophy,
  Ticket,
  ChevronRight,
} from "lucide-react";

interface TickerItem {
  icon: React.ElementType;
  label: string;
  detail: string;
  highlight: string;
  href: string;
  theme: "brand" | "purple" | "emerald" | "amber";
}

const TICKER_ITEMS: TickerItem[] = [
  {
    icon: Flame,
    label: "JAKARTA CITY MARATHON",
    detail: "15 NOV 2026 • 10K, HM & FM",
    highlight: "Sisa 240 Slot",
    href: "/#jelajahi-event",
    theme: "brand",
  },
  {
    icon: Sparkles,
    label: "SMART DISTANCE AI",
    detail: "Cek kesiapan fisik sebelum checkout",
    highlight: "94% Patuh Rekomendasi",
    href: "/#smart-distance-ai",
    theme: "purple",
  },
  {
    icon: Ticket,
    label: "BOROBUDUR HERITAGE 10K",
    detail: "14 FEB 2027 • SLOT EARLY BIRD",
    highlight: "Registrasi Buka",
    href: "/#jelajahi-event",
    theme: "amber",
  },
  {
    icon: ShieldCheck,
    label: "E-TICKET RESMI QR",
    detail: "Verifikasi instan panitia race pack",
    highlight: "Anti-Duplikasi",
    href: "/#jelajahi-event",
    theme: "emerald",
  },
  {
    icon: Trophy,
    label: "BALI SUNSET 10K",
    detail: "22 DES 2026 • PANTAI KUTA",
    highlight: "Sisa 68 Tiket",
    href: "/#jelajahi-event",
    theme: "brand",
  },
];

const THEME_STYLES: Record<
  TickerItem["theme"],
  { badgeBg: string; badgeText: string; iconBg: string; iconText: string }
> = {
  brand: {
    badgeBg: "bg-brand-50",
    badgeText: "text-brand",
    iconBg: "bg-brand-100",
    iconText: "text-brand",
  },
  purple: {
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-700",
    iconBg: "bg-purple-100",
    iconText: "text-purple-700",
  },
  emerald: {
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-700",
  },
  amber: {
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    iconBg: "bg-amber-100",
    iconText: "text-amber-800",
  },
};

export function RaceTickerTape() {
  return (
    <div className="w-full bg-surface-soft border-y border-sand-border/80 overflow-hidden py-3 sm:py-3.5 select-none">
      <div className="animate-sports-ticker flex items-center gap-4 sm:gap-6 px-4">
        {/* Render duplicate items for infinite smooth ticker animation */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
          const Icon = item.icon;
          const styles = THEME_STYLES[item.theme];

          return (
            <Link
              href={item.href}
              key={idx}
              className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-stone-200/90 shadow-[0_2px_6px_rgba(58,39,24,0.04)] hover:border-brand hover:shadow-[0_8px_18px_rgba(194,65,12,0.14)] hover:-translate-y-1 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0 text-xs text-espresso"
            >
              {/* Icon Capsule */}
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${styles.iconBg} ${styles.iconText}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>

              {/* Title & Detail */}
              <span className="font-extrabold tracking-tight text-espresso uppercase text-[11px] sm:text-xs group-hover:text-brand transition-colors whitespace-nowrap">
                {item.label}
              </span>

              <span className="text-espresso-muted hidden md:inline text-[11px] whitespace-nowrap">
                {item.detail}
              </span>

              {/* Pill Status Highlight */}
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-tight border border-current/20 shadow-2xs whitespace-nowrap ${styles.badgeBg} ${styles.badgeText}`}
              >
                <span>{item.highlight}</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
