"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  MoreHorizontal,
  Calendar,
  Sparkles,
  Building2,
  HelpCircle,
  UserPlus,
  LayoutDashboard,
  Receipt,
  Activity,
  Settings,
  LogOut,
  Users,
  FileText,
  Shield,
  Layers,
  CheckCircle,
} from "lucide-react";

import { LandingNavSectionId } from "@/hooks/useLandingScrollSpy";

interface FloatingNavMoreMenuProps {
  role?: "guest" | "runner" | "organizer" | "admin";
  activeSection?: LandingNavSectionId | null;
  onSelectSection?: (sectionId: LandingNavSectionId) => void;
}

export function FloatingNavMoreMenu({
  role = "guest",
  activeSection,
  onSelectSection,
}: FloatingNavMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full bg-[#F7F3EE] hover:bg-[#EFEAE2] text-espresso-secondary hover:text-espresso flex items-center justify-center transition-all active:scale-95 border border-sand-border/60"
        aria-label="Menu navigasi lainnya"
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl border border-sand-border shadow-[0_16px_36px_rgba(36,28,23,0.18)] p-2 z-50 animate-in zoom-in-95 duration-150 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-espresso-muted border-b border-sand-border/60 mb-1">
            Navigasi Cepat
          </div>

          {/* 1. GUEST MENU */}
          {role === "guest" && (
            <>
              <Link
                href="/#kalender-lomba"
                onClick={(e) => {
                  setIsOpen(false);
                  if (onSelectSection) {
                    e.preventDefault();
                    onSelectSection("kalender-lomba");
                  }
                }}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-colors ${
                  activeSection === "kalender-lomba"
                    ? "bg-[#FFF7ED] text-brand font-bold border border-brand/20"
                    : "font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft"
                }`}
              >
                <Calendar className={`w-3.5 h-3.5 ${activeSection === "kalender-lomba" ? "text-brand" : "text-espresso-muted"}`} />
                <span>Kalender Lomba</span>
              </Link>
              <Link
                href="/#smart-distance-ai"
                onClick={(e) => {
                  setIsOpen(false);
                  if (onSelectSection) {
                    e.preventDefault();
                    onSelectSection("smart-distance-ai");
                  }
                }}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-colors ${
                  activeSection === "smart-distance-ai"
                    ? "bg-purple-50 text-purple-700 font-bold border border-purple-200"
                    : "font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft"
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${activeSection === "smart-distance-ai" ? "text-purple-600" : "text-accent-strava"}`} />
                <span>Tentang Smart AI</span>
              </Link>
              <Link
                href="/register?role=organizer"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-accent-strava" />
                <span>Untuk Organizer</span>
              </Link>
              <Link
                href="/#faq"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-espresso-muted" />
                <span>Pusat Bantuan</span>
              </Link>
              <div className="pt-1 border-t border-sand-border/60">
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-brand bg-brand-50 hover:bg-brand-100 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Daftar Akun Baru</span>
                </Link>
              </div>
            </>
          )}

          {/* 2. RUNNER MENU */}
          {role === "runner" && (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-brand" />
                <span>Dashboard Pelari</span>
              </Link>
              <Link
                href="/dashboard#orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Receipt className="w-3.5 h-3.5 text-espresso-muted" />
                <span>Riwayat Pesanan</span>
              </Link>
              <Link
                href="/dashboard#strava"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-accent-strava" />
                <span>Aktivitas Strava</span>
              </Link>
              <Link
                href="/dashboard#settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-espresso-muted" />
                <span>Pengaturan</span>
              </Link>
              <div className="pt-1 border-t border-sand-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </>
          )}

          {/* 3. ORGANIZER MENU */}
          {role === "organizer" && (
            <>
              <Link
                href="/organizer/dashboard#participants"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-brand" />
                <span>Daftar Peserta</span>
              </Link>
              <Link
                href="/organizer/dashboard#orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Receipt className="w-3.5 h-3.5 text-espresso-muted" />
                <span>Pesanan Masuk</span>
              </Link>
              <Link
                href="/organizer/dashboard#reports"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-accent-info" />
                <span>Laporan Event</span>
              </Link>
              <Link
                href="/organizer/dashboard#settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-espresso-muted" />
                <span>Pengaturan EO</span>
              </Link>
              <div className="pt-1 border-t border-sand-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </>
          )}

          {/* 4. ADMIN MENU */}
          {role === "admin" && (
            <>
              <Link
                href="/admin/dashboard#users"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-accent-info" />
                <span>Pengguna & Akun</span>
              </Link>
              <Link
                href="/admin/transactions"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audit Transaksi</span>
              </Link>
              <Link
                href="/admin/dashboard#logs"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-purple-600" />
                <span>Audit Logs</span>
              </Link>
              <Link
                href="/admin/dashboard#settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold text-espresso-secondary hover:text-espresso hover:bg-surface-soft transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-espresso-muted" />
                <span>Konfigurasi Platform</span>
              </Link>
              <div className="pt-1 border-t border-sand-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
