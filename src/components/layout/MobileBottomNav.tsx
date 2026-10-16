"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Compass,
  Ticket,
  Activity,
  User,
  LayoutDashboard,
  PlusCircle,
  QrCode,
  Shield,
  Building2,
  CalendarCheck,
  Receipt,
  Calendar,
  LogIn,
  Users,
  Sparkles,
} from "lucide-react";

function MobileBottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");
  const { currentUser, role } = useAuth();

  const isExactActive = (path: string) => pathname === path;

  // Do not render bottom nav on dedicated auth pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-sand-border/80 shadow-[0_-4px_16px_rgba(43,30,22,0.06)] px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-1.5"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-13 max-w-md mx-auto">
        {/* 1. RUNNER ROLE */}
        {currentUser && role === "runner" && (
          <>
            <Link
              href="/"
              onClick={() => {
                if (pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                isExactActive("/") ? "text-brand font-bold" : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <Compass className={`w-5 h-5 ${isExactActive("/") ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Cari Event</span>
            </Link>

            <Link
              href="/dashboard?tab=tickets"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                pathname === "/dashboard" && (!tabParam || tabParam === "tickets")
                  ? "text-brand font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <Ticket
                className={`w-5 h-5 ${
                  pathname === "/dashboard" && (!tabParam || tabParam === "tickets")
                    ? "stroke-[2.5]"
                    : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Tiket Saya</span>
            </Link>

            <Link
              href="/dashboard?tab=strava"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                pathname === "/dashboard" && tabParam === "strava"
                  ? "text-accent-strava font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <div className="relative">
                <Activity
                  className={`w-5 h-5 ${
                    pathname === "/dashboard" && tabParam === "strava"
                      ? "stroke-[2.5]"
                      : "stroke-[1.75]"
                  }`}
                />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent-strava ring-2 ring-white animate-pulse" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Smart AI</span>
            </Link>

            <Link
              href="/dashboard?tab=profile"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                pathname === "/dashboard" && tabParam === "profile"
                  ? "text-brand font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <User
                className={`w-5 h-5 ${
                  pathname === "/dashboard" && tabParam === "profile"
                    ? "stroke-[2.5]"
                    : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Profil</span>
            </Link>
          </>
        )}

        {/* 2. ORGANIZER ROLE */}
        {currentUser && role === "organizer" && (
          <>
            <Link
              href="/"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                pathname === "/" || pathname === "/organizer/dashboard"
                  ? "text-brand font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <LayoutDashboard
                className={`w-5 h-5 ${
                  pathname === "/" || pathname === "/organizer/dashboard" ? "stroke-[2.5]" : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home Hub</span>
            </Link>

            <Link
              href="/organizer/events/evt-jkt-marathon-2026/participants"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                pathname.includes("/participants")
                  ? "text-brand font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <Users
                className={`w-5 h-5 ${
                  pathname.includes("/participants") ? "stroke-[2.5]" : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Peserta</span>
            </Link>

            {/* Seamless, Elegant Scan Gate Action with balanced baseline */}
            <Link
              href="/organizer/check-in"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 group ${
                isExactActive("/organizer/check-in")
                  ? "text-brand font-bold"
                  : "text-espresso-secondary hover:text-espresso"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isExactActive("/organizer/check-in")
                    ? "bg-brand text-white shadow-warm"
                    : "bg-brand-50 text-brand border border-brand/20 group-hover:bg-brand-100"
                }`}
              >
                <QrCode className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">Scan Gate</span>
            </Link>

            <Link
              href="/organizer/events/new"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                isExactActive("/organizer/events/new")
                  ? "text-brand font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <PlusCircle
                className={`w-5 h-5 ${
                  isExactActive("/organizer/events/new") ? "stroke-[2.5]" : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">+ Event</span>
            </Link>
          </>
        )}

        {/* 3. ADMIN ROLE */}
        {currentUser && role === "admin" && (
          <>
            <Link
              href="/"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                pathname === "/" || pathname === "/admin/dashboard"
                  ? "text-accent-info font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <Shield
                className={`w-5 h-5 ${
                  pathname === "/" || pathname === "/admin/dashboard" ? "stroke-[2.5]" : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Home Hub</span>
            </Link>

            <Link
              href="/admin/organizers"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                isExactActive("/admin/organizers")
                  ? "text-brand font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <Building2
                className={`w-5 h-5 ${
                  isExactActive("/admin/organizers") ? "stroke-[2.5]" : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Verif EO</span>
            </Link>

            <Link
              href="/admin/events"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                isExactActive("/admin/events")
                  ? "text-purple-700 font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <CalendarCheck
                className={`w-5 h-5 ${
                  isExactActive("/admin/events") ? "stroke-[2.5]" : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Moderasi</span>
            </Link>

            <Link
              href="/admin/transactions"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                isExactActive("/admin/transactions")
                  ? "text-emerald-700 font-bold"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <Receipt
                className={`w-5 h-5 ${
                  isExactActive("/admin/transactions") ? "stroke-[2.5]" : "stroke-[1.75]"
                }`}
              />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Audit</span>
            </Link>
          </>
        )}

        {/* 4. GUEST / BELUM LOGIN */}
        {!currentUser && (
          <>
            <Link
              href="/"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                isExactActive("/") ? "text-brand font-bold" : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <Compass className={`w-5 h-5 ${isExactActive("/") ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Jelajahi</span>
            </Link>

            <Link
              href="/#events-section"
              className="flex flex-col items-center justify-center flex-1 py-1 text-espresso-muted hover:text-espresso transition-transform active:scale-95"
            >
              <Calendar className="w-5 h-5 stroke-[1.75]" />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Kalender</span>
            </Link>

            <Link
              href="/#recommendation-info"
              className="flex flex-col items-center justify-center flex-1 py-1 text-espresso-muted hover:text-espresso transition-transform active:scale-95"
            >
              <Sparkles className="w-5 h-5 stroke-[1.75]" />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Fitur AI</span>
            </Link>

            <Link
              href="/login"
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-transform active:scale-95 ${
                isExactActive("/login") ? "text-brand font-bold" : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <User className={`w-5 h-5 ${isExactActive("/login") ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">Masuk</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <MobileBottomNavInner />
    </Suspense>
  );
}
