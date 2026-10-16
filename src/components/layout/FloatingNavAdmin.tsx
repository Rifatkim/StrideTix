"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Building2,
  Receipt,
  Shield,
} from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";
import { FloatingNavMoreMenu } from "./FloatingNavMoreMenu";
import { UserNavDropdown } from "./UserNavDropdown";

export function FloatingNavAdmin() {
  const pathname = usePathname();

  const isDashboardActive = pathname === "/admin/dashboard";
  const isOrganizersActive = pathname === "/admin/organizers";
  const isEventsActive = pathname === "/admin/events";
  const isTransactionsActive = pathname === "/admin/transactions";

  return (
    <div className="w-full flex items-center justify-between gap-2 sm:gap-3">
      {/* 1. Logo Left */}
      <Link href="/admin/dashboard" className="flex items-center gap-2 group shrink-0" aria-label="Admin Dashboard">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-accent-info flex items-center justify-center text-white shadow-warm group-hover:bg-blue-700 transition-all active:scale-95">
          <Shield size={18} color="#FFFFFF" />
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-base sm:text-lg font-black tracking-tight text-espresso leading-none">
            Stride<span className="text-brand">Tix</span>
          </span>
          <span className="text-[9px] font-bold text-accent-info uppercase tracking-wider">
            Governance
          </span>
        </div>
      </Link>

      {/* 2. Middle Navigation Items with Badges */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {/* Dashboard Overview */}
        <Link
          href="/admin/dashboard"
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${
            isDashboardActive
              ? "bg-accent-info/10 text-accent-info border border-accent-info/30"
              : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE]"
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Dashboard</span>
        </Link>

        {/* Moderasi Event with badge */}
        <Link
          href="/admin/events"
          className={`relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${
            isEventsActive
              ? "bg-purple-50 text-purple-700 border border-purple-200"
              : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE]"
          }`}
          title="Moderasi Event"
        >
          <CalendarCheck className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden sm:inline">Moderasi</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-purple-100 text-purple-700">
            2
          </span>
        </Link>

        {/* Verifikasi Organizer with badge */}
        <Link
          href="/admin/organizers"
          className={`relative inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${
            isOrganizersActive
              ? "bg-[#FFF7ED] text-brand border border-brand/20"
              : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE]"
          }`}
          title="Verifikasi Organizer"
        >
          <Building2 className="w-3.5 h-3.5 text-brand" />
          <span className="hidden sm:inline">Verifikasi EO</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-brand-50 text-brand">
            1
          </span>
        </Link>

        {/* Audit Transaksi */}
        <Link
          href="/admin/transactions"
          className={`hidden md:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${
            isTransactionsActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE]"
          }`}
          title="Audit Transaksi"
        >
          <Receipt className="w-3.5 h-3.5 text-emerald-600" />
          <span>Audit</span>
        </Link>
      </div>

      {/* 3. Right: Avatar & More Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <UserNavDropdown compact={true} />
        <FloatingNavMoreMenu role="admin" />
      </div>
    </div>
  );
}
