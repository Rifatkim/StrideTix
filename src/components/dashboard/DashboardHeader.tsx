"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRunner } from "@/context/RunnerContext";
import {
  ChevronRight,
  MapPin,
  Activity,
} from "lucide-react";

interface DashboardHeaderProps {
  onEdit?: () => void;
  className?: string;
}

export function DashboardHeader({ onEdit, className = "" }: DashboardHeaderProps) {
  const { currentUser } = useAuth();
  const { currentProfile, isConnectedToStrava } = useRunner();
  const [imgError, setImgError] = useState(false);

  const photoUrl =
    currentUser?.avatarUrl ||
    currentProfile?.athlete.profileMedium ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

  const initials = (currentUser?.name || "Pelari StrideTix")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleClick = (e: React.MouseEvent) => {
    if (onEdit) {
      e.preventDefault();
      onEdit();
    }
  };

  return (
    <a
      href="#data-pelari"
      onClick={handleClick}
      className={`bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-[0_1px_3px_rgba(43,30,22,0.03)] flex items-center justify-between gap-3 sm:gap-4 hover:bg-stone-50/60 transition-all group ${className}`}
    >
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
        {/* Avatar Bulat Bersih */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-brand/20 bg-stone-100 shrink-0 shadow-sm flex items-center justify-center">
          {!imgError && photoUrl ? (
            <Image
              src={photoUrl}
              alt={currentUser?.name || "Pelari"}
              fill
              sizes="(max-width: 640px) 56px, 64px"
              className="object-cover"
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand to-brand-800 text-white font-extrabold text-base sm:text-lg flex items-center justify-center">
              {initials}
            </div>
          )}
        </div>

        {/* Info Pelari - 3 Baris Rapi & Sejajar */}
        <div className="min-w-0 flex-1">
          {/* Baris 1: Nama & Badge Runner */}
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-espresso tracking-tight truncate">
              {currentUser?.name || "Pelari StrideTix"}
            </h1>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-50 text-brand border border-brand/20 uppercase tracking-wider shrink-0">
              Runner
            </span>
          </div>

          {/* Baris 2: Email */}
          <p className="text-xs text-stone-500 truncate mt-0.5">
            {currentUser?.email || "runner@stridetix.com"}
          </p>

          {/* Baris 3: Lokasi & Status Strava */}
          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
            <span className="inline-flex items-center gap-1 shrink-0">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{currentProfile?.athlete.city || "Jakarta"}, ID</span>
            </span>
            <span className="text-stone-300">•</span>
            <span
              className={`inline-flex items-center gap-1 font-medium shrink-0 ${
                isConnectedToStrava ? "text-brand" : "text-stone-400"
              }`}
            >
              <Activity className="w-3 h-3" />
              <span>{isConnectedToStrava ? "Strava Sync" : "Offline"}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Aksi Kanan - Minimalis iOS Chevron */}
      <div className="flex items-center text-stone-300 group-hover:text-brand transition-colors shrink-0 pl-1">
        <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}
