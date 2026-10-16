"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";
import { FloatingNavMoreMenu } from "./FloatingNavMoreMenu";
import { UserNavDropdown } from "./UserNavDropdown";

export function FloatingNavOrganizer() {
  const pathname = usePathname();

  const isDashboardActive = pathname === "/organizer/dashboard";
  const isNewEventActive = pathname === "/organizer/events/new";
  const isCheckInActive = pathname === "/organizer/check-in";

  return (
    <div className="w-full flex items-center justify-between gap-2 sm:gap-3">
      {/* 1. Logo Left */}
      <Link href="/organizer/dashboard" className="flex items-center gap-2 group shrink-0" aria-label="Portal Organizer">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-all active:scale-95">
          <StrideTixSymbol size={18} color="#FFFFFF" />
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-base sm:text-lg font-black tracking-tight text-espresso leading-none">
            Stride<span className="text-brand">Tix</span>
          </span>
          <span className="text-[9px] font-bold text-accent-strava uppercase tracking-wider">
            EO Hub
          </span>
        </div>
      </Link>

      {/* 2. Middle Navigation Items */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {/* Dashboard */}
        <Link
          href="/organizer/dashboard"
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${
            isDashboardActive
              ? "bg-[#FFF7ED] text-brand border border-brand/20 shadow-xs"
              : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE]"
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>

        {/* Event Saya */}
        <Link
          href="/organizer/dashboard#events"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] transition-all active:scale-95 shrink-0"
        >
          <Calendar className="w-3.5 h-3.5 text-espresso-muted" />
          <span>Event Saya</span>
        </Link>

        {/* Buat Event - Prominent Race Orange Button */}
        <Link
          href="/organizer/events/new"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-warm transition-all active:scale-95 shrink-0 ${
            isNewEventActive ? "bg-brand-800 ring-2 ring-brand/40" : "bg-brand hover:bg-orange-600"
          }`}
          title="Buat Event Baru"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Buat Event</span>
        </Link>

        {/* Gate Check-in QR */}
        <Link
          href="/organizer/check-in"
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${
            isCheckInActive
              ? "bg-accent-info/10 text-accent-info border border-accent-info/30"
              : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE]"
          }`}
          title="Gate Check-in QR"
        >
          <QrCode className="w-3.5 h-3.5 text-accent-info" />
          <span className="hidden sm:inline">Check-in</span>
        </Link>
      </div>

      {/* 3. Right: Avatar & More Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <UserNavDropdown compact={true} />
        <FloatingNavMoreMenu role="organizer" />
      </div>
    </div>
  );
}
