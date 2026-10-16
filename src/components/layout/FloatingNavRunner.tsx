"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket, Activity, Compass } from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";
import { FloatingNavSearch } from "./FloatingNavSearch";
import { FloatingNavMoreMenu } from "./FloatingNavMoreMenu";
import { UserNavDropdown } from "./UserNavDropdown";

export function FloatingNavRunner() {
  const pathname = usePathname();

  const isHomeActive = pathname === "/";
  const isDashboardActive = pathname === "/dashboard" || pathname.startsWith("/tickets");

  return (
    <div className="w-full flex items-center justify-between gap-2 sm:gap-3">
      {/* 1. Logo */}
      <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="StrideTix Homepage">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-all active:scale-95">
          <StrideTixSymbol size={18} color="#FFFFFF" />
        </div>
        <span className="hidden sm:inline text-base sm:text-lg font-black tracking-tight text-espresso leading-none">
          Stride<span className="text-brand">Tix</span>
        </span>
      </Link>

      {/* 2. Middle: Search + Tiket Saya + Smart AI */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        <FloatingNavSearch />

        {/* Tiket Saya with active indicator */}
        <Link
          href="/dashboard"
          className={`relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${
            isDashboardActive
              ? "bg-[#FFF7ED] text-brand border border-brand/20 shadow-xs"
              : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE]"
          }`}
          title="Tiket Saya"
        >
          <Ticket className="w-3.5 h-3.5 text-brand" />
          <span className="hidden sm:inline">Tiket Saya</span>
          {/* Active Ticket Indicator Dot */}
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </Link>

        {/* Smart Distance AI */}
        <Link
          href="/dashboard"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-all active:scale-95 shrink-0"
          title="Smart Distance AI"
        >
          <Activity className="w-3.5 h-3.5 text-purple-600" />
          <span>Smart AI</span>
        </Link>
      </div>

      {/* 3. Right: Avatar Profile & More Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <UserNavDropdown compact={true} />
        <FloatingNavMoreMenu role="runner" />
      </div>
    </div>
  );
}
