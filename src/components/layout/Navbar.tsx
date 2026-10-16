"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Ticket,
  Compass,
  Activity,
  ShieldCheck,
  LayoutDashboard,
  Shield,
  PlusCircle,
  Receipt,
  CalendarCheck,
  Building2,
  Calendar,
} from "lucide-react";
import { UserNavDropdown } from "./UserNavDropdown";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, role } = useAuth();

  const isActive = (path: string, exact = true) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  const homeHref = "/";

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-sand-border/80 shadow-xs font-sans transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo StrideTix */}
          <Link href={homeHref} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-btn bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-transform active:scale-95">
              <Ticket className="w-5 h-5 -rotate-12 transform" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-espresso leading-none">
                  Stride<span className="text-brand">Tix</span>
                </span>
                {currentUser && role === "organizer" && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-accent-strava/10 text-accent-strava border border-accent-strava/30">
                    EO Hub
                  </span>
                )}
                {currentUser && role === "admin" && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-accent-info/10 text-accent-info border border-accent-info/30">
                    Admin
                  </span>
                )}
                {currentUser && role === "runner" && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-brand-50 text-brand border border-brand/20">
                    Runner
                  </span>
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-espresso-muted">
                {role === "admin"
                  ? "Platform Governance"
                  : role === "organizer"
                  ? "Organizer Workspace"
                  : "Smart Race Ticketing"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Role-Segmented */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {/* 1. GUEST DESKTOP */}
            {!currentUser && (
              <>
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/")
                      ? "bg-brand-50 text-brand font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Compass className="w-4 h-4 text-brand" />
                  <span>Jelajahi Event</span>
                </Link>
                <Link
                  href="/#events-section"
                  className="px-3 py-2 rounded-btn text-xs sm:text-sm text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold transition-all flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4 text-espresso-muted" />
                  <span>Kalender Lomba</span>
                </Link>
                <Link
                  href="/#recommendation-info"
                  className="px-3 py-2 rounded-btn text-xs sm:text-sm text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold transition-all flex items-center gap-1.5"
                >
                  <Activity className="w-4 h-4 text-accent-strava" />
                  <span>Tentang Smart AI</span>
                </Link>
              </>
            )}

            {/* 2. RUNNER DESKTOP */}
            {currentUser && role === "runner" && (
              <>
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/")
                      ? "bg-brand-50 text-brand font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Compass className="w-4 h-4 text-brand" />
                  <span>Cari Event</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/dashboard")
                      ? "bg-brand-50 text-brand font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Ticket className="w-4 h-4 text-brand" />
                  <span>Tiket Saya</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-btn text-xs sm:text-sm text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold transition-all flex items-center gap-1.5"
                >
                  <Activity className="w-4 h-4 text-accent-strava" />
                  <span>Smart Distance AI</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3 py-2 rounded-btn text-xs sm:text-sm text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold transition-all flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-espresso-muted" />
                  <span>Dashboard Pelari</span>
                </Link>
              </>
            )}

            {/* 3. ORGANIZER DESKTOP */}
            {currentUser && role === "organizer" && (
              <>
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    pathname === "/"
                      ? "bg-brand-50 text-brand font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Home Hub</span>
                </Link>
                <Link
                  href="/organizer/dashboard"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/organizer/dashboard")
                      ? "bg-accent-strava/10 text-accent-strava font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Portal Organizer</span>
                </Link>
                <Link
                  href="/organizer/events/new"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/organizer/events/new")
                      ? "bg-brand-50 text-brand font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-brand" />
                  <span>Buat Event Lomba</span>
                </Link>
                <Link
                  href="/organizer/check-in"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/organizer/check-in")
                      ? "bg-accent-info/10 text-accent-info font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-accent-info" />
                  <span>Gate Check-in</span>
                </Link>
              </>
            )}

            {/* 4. ADMIN DESKTOP */}
            {currentUser && role === "admin" && (
              <>
                <Link
                  href="/"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    pathname === "/"
                      ? "bg-accent-info/10 text-accent-info font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Home Hub</span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/admin/dashboard")
                      ? "bg-accent-info/10 text-accent-info font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview Platform</span>
                </Link>
                <Link
                  href="/admin/organizers"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/admin/organizers")
                      ? "bg-brand-50 text-brand font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-brand" />
                  <span>Verifikasi EO</span>
                </Link>
                <Link
                  href="/admin/events"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/admin/events")
                      ? "bg-purple-50 text-purple-700 font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <CalendarCheck className="w-4 h-4 text-purple-600" />
                  <span>Moderasi Event</span>
                </Link>
                <Link
                  href="/admin/transactions"
                  className={`px-3 py-2 rounded-btn text-xs sm:text-sm transition-all flex items-center gap-1.5 ${
                    isActive("/admin/transactions")
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Audit Transaksi</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Header: User Profile Dropdown or Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            <UserNavDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
