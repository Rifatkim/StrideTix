"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import {
  User,
  Shield,
  Building,
  Ticket,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  QrCode,
  CheckCircle,
  FileText,
  DollarSign,
  PlusCircle,
  LogIn,
} from "lucide-react";

interface UserNavDropdownProps {
  compact?: boolean;
}

export function UserNavDropdown({ compact = false }: UserNavDropdownProps) {
  const router = useRouter();
  const { currentUser, role, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
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

  if (!currentUser) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <Link
          href="/login"
          className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold border border-sand-border bg-white text-espresso hover:text-brand hover:border-brand shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          title="Masuk ke Akun"
        >
          <LogIn className="w-3.5 h-3.5 text-brand" />
          <span>Masuk</span>
        </Link>
        <Link
          href="/register"
          className="px-3 sm:px-3.5 py-1.5 rounded-full bg-brand text-white text-xs font-bold shadow-warm hover:bg-brand-800 transition-all active:scale-95 shrink-0"
        >
          Daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center transition-all group ${
          compact
            ? "gap-1 p-1 rounded-full hover:ring-2 hover:ring-brand/30 border border-sand-border bg-white"
            : "gap-2 p-1.5 rounded-btn hover:bg-surface-soft border border-sand-border"
        }`}
        aria-label="Menu akun pengguna"
        aria-expanded={isOpen}
      >
        {currentUser.avatarUrl ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-sand-border shrink-0">
            <Image
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
        )}

        {!compact && (
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-espresso group-hover:text-brand transition-colors max-w-[120px] truncate leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] uppercase font-bold text-brand">
              {role}
            </span>
          </div>
        )}

        <ChevronDown className={`${compact ? "w-3 h-3 text-espresso-muted mr-1" : "w-3.5 h-3.5 text-espresso-muted ml-0.5"}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-card border border-sand-border shadow-warm-modal p-2 z-50 animate-in zoom-in-95 duration-150 space-y-2">
          {/* User Header */}
          <div className="px-3 py-2 border-b border-sand-border">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-xs font-extrabold text-espresso truncate">
                {currentUser.name}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                  role === "admin"
                    ? "bg-accent-info/10 text-accent-info border border-accent-info/20"
                    : role === "organizer"
                    ? "bg-accent-strava/10 text-accent-strava border border-accent-strava/20"
                    : "bg-brand-50 text-brand border border-brand-200"
                }`}
              >
                {role}
              </span>
            </div>
            <span className="text-[11px] text-espresso-muted truncate block">
              {currentUser.email}
            </span>
            {currentUser.organizerName && (
              <span className="text-[10px] font-semibold text-brand block mt-0.5">
                🏢 {currentUser.organizerName}
              </span>
            )}
          </div>

          {/* Role-Specific Links */}
          <div className="space-y-1 text-xs">
            {role === "runner" && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand" />
                  <span>Dashboard Pelari</span>
                </Link>
                <Link
                  href="/dashboard?tab=tickets"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <Ticket className="w-4 h-4 text-brand" />
                  <span>Tiket Saya</span>
                </Link>
              </>
            )}

            {role === "organizer" && (
              <>
                <Link
                  href="/organizer/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand" />
                  <span>Dashboard EO</span>
                </Link>
                <Link
                  href="/organizer/events/new"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-brand" />
                  <span>Buat Event Lomba</span>
                </Link>
                <Link
                  href="/organizer/check-in"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <QrCode className="w-4 h-4 text-accent-info" />
                  <span>Scanner Gate Check-in</span>
                </Link>
              </>
            )}

            {role === "admin" && (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-accent-info" />
                  <span>Panel Admin</span>
                </Link>
                <Link
                  href="/admin/organizers"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-accent-info" />
                  <span>Verifikasi Organizer</span>
                </Link>
                <Link
                  href="/admin/events"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <FileText className="w-4 h-4 text-accent-info" />
                  <span>Moderasi Event</span>
                </Link>
                <Link
                  href="/admin/transactions"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <DollarSign className="w-4 h-4 text-accent-info" />
                  <span>Audit Transaksi</span>
                </Link>
              </>
            )}
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-sand-border">
            <button
              onClick={async () => {
                await logout();
                setIsOpen(false);
                router.push("/login");
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-btn text-accent-error hover:bg-accent-error/10 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar (Logout)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
