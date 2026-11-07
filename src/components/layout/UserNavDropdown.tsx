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
  LayoutDashboard,
  QrCode,
  CheckCircle,
  FileText,
  DollarSign,
  PlusCircle,
  LogIn,
  Sparkles,
  Settings,
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
      <div className="flex items-center shrink-0">
        <Link
          href="/login"
          className="px-3.5 py-1.5 rounded-full bg-brand text-white text-xs font-bold shadow-warm hover:bg-brand-800 transition-all active:scale-95 shrink-0 flex items-center justify-center"
          title="Masuk ke Akun"
        >
          <span>Masuk</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button: Clean Avatar Icon Only (No Card Wrapper, No Dropdown Arrow) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full transition-all group focus:outline-none focus:ring-2 focus:ring-brand/40 active:scale-95 shrink-0"
        aria-label="Menu akun pengguna"
        aria-expanded={isOpen}
      >
        {currentUser.avatarUrl ? (
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-sand-border shrink-0 shadow-2xs group-hover:ring-2 group-hover:ring-brand/40 transition-all">
            <Image
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-warm group-hover:bg-brand-800 group-hover:ring-2 group-hover:ring-brand/40 transition-all">
            {currentUser.name.slice(0, 2).toUpperCase()}
          </div>
        )}
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
              <span className="text-[10px] font-semibold text-brand flex items-center gap-1 mt-0.5">
                <Building className="w-3 h-3 shrink-0" />
                <span>{currentUser.organizerName}</span>
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
                  href="/tickets"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <Ticket className="w-4 h-4 text-brand" />
                  <span>Tiket Saya</span>
                </Link>
                <Link
                  href="/smart-ai"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-brand" />
                  <span>Smart Distance AI</span>
                </Link>
                <Link
                  href="/dashboard?tab=profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-btn hover:bg-brand-50 text-espresso font-semibold transition-colors"
                >
                  <Settings className="w-4 h-4 text-brand" />
                  <span>Pengaturan</span>
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
