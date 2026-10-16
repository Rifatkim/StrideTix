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
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";
import { useScrollThreshold } from "@/hooks/useScrollThreshold";
import { useLandingScrollSpy } from "@/hooks/useLandingScrollSpy";
import { FloatingNavSearch } from "./FloatingNavSearch";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, role } = useAuth();
  const isScrolled = useScrollThreshold({ threshold: 120, hysteresis: 40 });
  const { activeSection, scrollToSection } = useLandingScrollSpy();

  const isActive = (path: string, exact = true) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  const homeHref = "/";

  return (
    <>
      {/* 1. Page Flow Spacer so layout shift = 0 when navbar is fixed */}
      <div className="w-full h-16 sm:h-18" aria-hidden="true" />

      {/* 2. Unified Navbar: Full-width at top, smoothly morphs to floating capsule on scroll */}
      <header
        className={`fixed z-40 transition-all duration-300 ease-out font-sans ${
          isScrolled
            ? "top-2 sm:top-3.5 left-1/2 -translate-x-1/2 w-[calc(100%-20px)] sm:w-[calc(100%-32px)] max-w-[1440px] h-14 sm:h-15.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8DDD0] shadow-[0_12px_36px_rgba(36,28,23,0.14),0_2px_8px_rgba(36,28,23,0.06)] px-3.5 sm:px-5 md:px-6"
            : "top-0 left-0 w-full h-16 sm:h-18 rounded-none bg-white/95 backdrop-blur-md border-b border-sand-border/80 shadow-xs px-4 sm:px-6 lg:px-8 xl:px-12"
        }`}
      >
        <div className="w-full h-full flex items-center justify-between gap-2 sm:gap-4 max-w-[1680px] mx-auto">
          {/* Logo StrideTix */}
          <Link href={homeHref} className="flex items-center gap-2 sm:gap-2.5 group shrink-0" aria-label="StrideTix Homepage">
            <div
              className={`rounded-btn bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-all active:scale-95 ${
                isScrolled ? "w-8 h-8 sm:w-8.5 sm:h-8.5" : "w-9 h-9 sm:w-10 sm:h-10"
              }`}
            >
              <StrideTixSymbol
                size={isScrolled ? 18 : 22}
                color="#FFFFFF"
                className="group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span
                  className={`font-black tracking-tight text-espresso leading-none transition-all ${
                    isScrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
                  }`}
                >
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
              {!isScrolled && (
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-espresso-muted mt-0.5 hidden sm:inline">
                  {role === "admin"
                    ? "Platform Governance"
                    : role === "organizer"
                    ? "Organizer Workspace"
                    : "Smart Race Ticketing"}
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation - Preserved Completely Across Both States! */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-1.5 lg:gap-2">
            {/* 1. GUEST DESKTOP */}
            {!currentUser && (
              <>
                <Link
                  href="/#jelajahi-event"
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      scrollToSection("jelajahi-event");
                    }
                  }}
                  aria-current={activeSection === "jelajahi-event" ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    activeSection === "jelajahi-event"
                      ? "bg-[#FFF7ED] text-brand font-bold shadow-xs border border-brand/20"
                      : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
                  }`}
                >
                  <Compass
                    className={`w-4 h-4 ${
                      activeSection === "jelajahi-event" ? "text-brand" : "text-espresso-muted"
                    }`}
                  />
                  <span>Jelajahi Event</span>
                </Link>

                <Link
                  href="/#kalender-lomba"
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      scrollToSection("kalender-lomba");
                    }
                  }}
                  aria-current={activeSection === "kalender-lomba" ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    activeSection === "kalender-lomba"
                      ? "bg-[#FFF7ED] text-brand font-bold shadow-xs border border-brand/20"
                      : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
                  }`}
                >
                  <Calendar
                    className={`w-4 h-4 ${
                      activeSection === "kalender-lomba" ? "text-brand" : "text-espresso-muted"
                    }`}
                  />
                  <span>Kalender Lomba</span>
                </Link>

                <Link
                  href="/#smart-distance-ai"
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      scrollToSection("smart-distance-ai");
                    }
                  }}
                  aria-current={activeSection === "smart-distance-ai" ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    activeSection === "smart-distance-ai"
                      ? "bg-purple-50 text-purple-700 font-bold shadow-xs border border-purple-200"
                      : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
                  }`}
                >
                  <Activity
                    className={`w-4 h-4 ${
                      activeSection === "smart-distance-ai" ? "text-purple-600" : "text-accent-strava"
                    }`}
                  />
                  <span>Tentang Smart AI</span>
                </Link>
              </>
            )}

            {/* 2. RUNNER DESKTOP */}
            {currentUser && role === "runner" && (
              <>
                <Link
                  href="/#jelajahi-event"
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      scrollToSection("jelajahi-event");
                    }
                  }}
                  aria-current={pathname === "/" && activeSection === "jelajahi-event" ? "page" : undefined}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    pathname === "/" && activeSection === "jelajahi-event"
                      ? "bg-[#FFF7ED] text-brand font-bold shadow-xs border border-brand/20"
                      : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
                  }`}
                >
                  <Compass
                    className={`w-4 h-4 ${
                      pathname === "/" && activeSection === "jelajahi-event" ? "text-brand" : "text-espresso-muted"
                    }`}
                  />
                  <span>Cari Event</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive("/dashboard")
                      ? "bg-[#FFF7ED] text-brand font-bold shadow-xs border border-brand/20"
                      : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
                  }`}
                >
                  <Ticket className="w-4 h-4 text-brand" />
                  <span>Tiket Saya</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-full text-xs sm:text-sm text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold transition-all flex items-center gap-1.5"
                >
                  <Activity className="w-4 h-4 text-accent-strava" />
                  <span>Smart Distance AI</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-full text-xs sm:text-sm text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold transition-all flex items-center gap-1.5"
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
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    pathname === "/"
                      ? "bg-[#FFF7ED] text-brand font-bold shadow-xs border border-brand/20"
                      : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Home Hub</span>
                </Link>
                <Link
                  href="/organizer/dashboard"
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive("/organizer/dashboard")
                      ? "bg-accent-strava/10 text-accent-strava font-bold border border-accent-strava/20"
                      : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Portal Organizer</span>
                </Link>
                <Link
                  href="/organizer/events/new"
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive("/organizer/events/new")
                      ? "bg-brand text-white font-bold shadow-warm"
                      : "bg-brand-50 hover:bg-brand-100 text-brand font-bold border border-brand/20"
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-brand" />
                  <span>Buat Event Lomba</span>
                </Link>
                <Link
                  href="/organizer/check-in"
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive("/organizer/check-in")
                      ? "bg-accent-info/10 text-accent-info font-bold border border-accent-info/30"
                      : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
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
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    pathname === "/"
                      ? "bg-accent-info/10 text-accent-info font-bold border border-accent-info/30"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Home Hub</span>
                </Link>
                <Link
                  href="/admin/dashboard"
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive("/admin/dashboard")
                      ? "bg-accent-info/10 text-accent-info font-bold border border-accent-info/30"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview Platform</span>
                </Link>
                <Link
                  href="/admin/organizers"
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive("/admin/organizers")
                      ? "bg-brand-50 text-brand font-bold border border-brand/20"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Building2 className="w-4 h-4 text-brand" />
                  <span>Verifikasi EO</span>
                </Link>
                <Link
                  href="/admin/events"
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive("/admin/events")
                      ? "bg-purple-50 text-purple-700 font-bold border border-purple-200"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <CalendarCheck className="w-4 h-4 text-purple-600" />
                  <span>Moderasi Event</span>
                </Link>
                <Link
                  href="/admin/transactions"
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    isActive("/admin/transactions")
                      ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                      : "text-espresso-secondary hover:text-espresso hover:bg-surface-soft font-semibold"
                  }`}
                >
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Audit Transaksi</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Header: Search Event + Masuk + Daftar / User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {(!currentUser || role === "runner") && <FloatingNavSearch />}
            <UserNavDropdown />
          </div>
        </div>
      </header>
    </>
  );
}
