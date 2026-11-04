"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MapPin, Activity } from "lucide-react";

interface RunnerProfileHeaderProps {
  name: string;
  email: string;
  city: string;
  avatarUrl?: string | null;
  isConnectedToStrava: boolean;
}

export function RunnerProfileHeader({
  name,
  email,
  city,
  avatarUrl,
  isConnectedToStrava,
}: RunnerProfileHeaderProps) {
  const [imgError, setImgError] = useState(false);

  const fallbackPhoto =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
  const photo = avatarUrl || fallbackPhoto;

  const initials = (name || "Pelari StrideTix")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50/70 via-white to-stone-50/40 border-b border-stone-100 flex items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
        {/* Avatar Bulat */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-brand/20 bg-stone-100 shrink-0 shadow-sm flex items-center justify-center">
          {!imgError && photo ? (
            <Image
              src={photo}
              alt={name || "Pelari"}
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

        {/* Info Pelari */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-espresso tracking-tight truncate">
              {name || "Pelari StrideTix"}
            </h2>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-brand-50 text-brand border border-brand/20 uppercase tracking-wider shrink-0">
              Runner
            </span>
          </div>

          <p className="text-xs text-stone-500 truncate mt-0.5">
            {email || "runner@stridetix.com"}
          </p>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
            <span className="inline-flex items-center gap-1 shrink-0">
              <MapPin className="w-3 h-3 text-stone-400" />
              <span>{city || "Indonesia"}, ID</span>
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
    </div>
  );
}

