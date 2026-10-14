"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Ticket,
  Menu,
  X,
  Compass,
  Activity,
  ShieldCheck,
  LayoutDashboard,
  Shield,
  PlusCircle,
  Receipt,
  CalendarCheck,
  Building2,
  ExternalLink,
} from "lucide-react";
import { UserNavDropdown } from "./UserNavDropdown";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, role } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-sand-border shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo StrideTix per DESIGN.md */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-btn bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-colors">
              <Ticket className="w-5 h-5 -rotate-12 transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-espresso leading-none">
                Stride<span className="text-brand">Tix</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted">
                {role === "admin"
                  ? "Admin Control"
                  : role === "organizer"
                  ? "Organizer Hub"
                  : "Race Ticketing"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - DYNAMIC BY ROLE */}
          <nav className="hidden md:flex items-center gap-6">
            {/* 1. GUEST NAVIGATION */}
            {!currentUser && (
              <>
                <Link
                  href="/"
                  className="text-sm font-semibold text-espresso hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4 text-brand" />
                  <span>Jelajahi Event</span>
                </Link>
                <Link
                  href="/#recommendation-info"
                  className="text-sm font-semibold text-espresso-secondary hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <Activity className="w-4 h-4 text-accent-strava" />
                  <span>Smart Distance AI</span>
                </Link>
              </>
            )}

            {/* 2. RUNNER NAVIGATION */}
            {currentUser && role === "runner" && (
              <>
                <Link
                  href="/"
                  className="text-sm font-semibold text-espresso hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <Compass className="w-4 h-4 text-brand" />
                  <span>Cari Event</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-bold text-brand hover:opacity-80 transition-opacity flex items-center gap-1.5"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Tiket Saya</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-espresso-secondary hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-espresso-muted" />
                  <span>Dashboard Pelari</span>
                </Link>
              </>
            )}

            {/* 3. ORGANIZER NAVIGATION */}
            {currentUser && role === "organizer" && (
              <>
                <Link
                  href="/organizer/dashboard"
                  className="text-sm font-bold text-accent-strava hover:opacity-80 transition-opacity flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Portal Organizer</span>
                </Link>
                <Link
                  href="/organizer/events/new"
                  className="text-sm font-semibold text-espresso-secondary hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-brand" />
                  <span>+ Buat Event Lomba</span>
                </Link>
                <Link
                  href="/organizer/check-in"
                  className="text-sm font-semibold text-espresso-secondary hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-accent-info" />
                  <span>Gate Check-in</span>
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="text-xs text-espresso-muted hover:text-espresso flex items-center gap-1"
                >
                  <span>Lihat Katalog</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </>
            )}

            {/* 4. ADMIN NAVIGATION */}
            {currentUser && role === "admin" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="text-sm font-bold text-accent-info hover:opacity-80 transition-opacity flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview Platform</span>
                </Link>
                <Link
                  href="/admin/organizers"
                  className="text-sm font-semibold text-espresso-secondary hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <Building2 className="w-4 h-4 text-brand" />
                  <span>Verifikasi EO</span>
                </Link>
                <Link
                  href="/admin/events"
                  className="text-sm font-semibold text-espresso-secondary hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-4 h-4 text-purple-600" />
                  <span>Moderasi Event</span>
                </Link>
                <Link
                  href="/admin/transactions"
                  className="text-sm font-semibold text-espresso-secondary hover:text-brand transition-colors flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  <span>Audit Transaksi</span>
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Right Action: User Dropdown or Login Button */}
          <div className="hidden md:flex items-center gap-3">
            <UserNavDropdown />
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <UserNavDropdown />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-btn text-espresso hover:bg-surface-soft border border-sand-border focus:outline-none focus:ring-2 focus:ring-brand"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-sand-border bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {!currentUser && (
            <>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-semibold text-espresso hover:bg-brand-50 hover:text-brand"
              >
                Jelajahi Event
              </Link>
              <Link
                href="/#recommendation-info"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-semibold text-espresso-secondary hover:bg-brand-50 hover:text-brand"
              >
                Smart Distance AI
              </Link>
            </>
          )}

          {currentUser && role === "runner" && (
            <>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-semibold text-espresso hover:bg-brand-50 hover:text-brand"
              >
                Cari Event
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-bold text-brand hover:bg-brand-50"
              >
                Tiket Saya & Dashboard Pelari
              </Link>
            </>
          )}

          {currentUser && role === "organizer" && (
            <>
              <Link
                href="/organizer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-bold text-accent-strava hover:bg-accent-strava/10"
              >
                Portal Organizer
              </Link>
              <Link
                href="/organizer/events/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-semibold text-espresso hover:bg-brand-50"
              >
                + Buat Event Lomba
              </Link>
              <Link
                href="/organizer/check-in"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-semibold text-espresso hover:bg-brand-50"
              >
                Gate Check-in
              </Link>
            </>
          )}

          {currentUser && role === "admin" && (
            <>
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-bold text-accent-info hover:bg-accent-info/10"
              >
                Overview Platform
              </Link>
              <Link
                href="/admin/organizers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-semibold text-espresso hover:bg-brand-50"
              >
                Verifikasi EO
              </Link>
              <Link
                href="/admin/events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-semibold text-espresso hover:bg-brand-50"
              >
                Moderasi Event
              </Link>
              <Link
                href="/admin/transactions"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-btn text-sm font-semibold text-espresso hover:bg-brand-50"
              >
                Audit Transaksi
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
