"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRunner } from "@/context/RunnerContext";
import {
  Activity,
  CheckCircle2,
  MapPin,
  ShieldAlert,
  Sparkles,
  Ticket,
  Flame,
} from "lucide-react";

interface DashboardHeaderProps {
  ticketCount: number;
}

export function DashboardHeader({ ticketCount }: DashboardHeaderProps) {
  const { currentUser } = useAuth();
  const { currentProfile, isConnectedToStrava, recommendation } = useRunner();

  const totalKm = currentProfile
    ? currentProfile.summary.totalDistanceKm.toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Top Banner & Profile Overview */}
      <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-brand/20 bg-soft-cream shrink-0">
              <Image
                src={
                  currentUser?.avatarUrl ||
                  currentProfile?.athlete.profileMedium ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                }
                alt={currentUser?.name || "Pelari"}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-espresso">
                  {currentUser?.name || (currentProfile ? `${currentProfile.athlete.firstname} ${currentProfile.athlete.lastname}` : "Pelari StrideTix")}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand border border-brand/20 uppercase tracking-wider">
                  Runner
                </span>
                {isConnectedToStrava ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-accent-strava border border-orange-200">
                    <Activity className="w-3 h-3" />
                    Strava Synced
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-espresso-muted">
                    Strava Offline
                  </span>
                )}
              </div>
              <p className="text-xs text-espresso-secondary mt-1 flex items-center gap-1">
                <span>{currentUser?.email || "runner@stridetix.com"}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-espresso-muted" />
                  {currentProfile?.athlete.city || "Jakarta"}, Indonesia
                </span>
              </p>
              <p className="text-[11px] text-espresso-muted mt-2">
                Selamat datang di portal pelari. Pantau kesiapan jarak lomba Anda, unduh E-Ticket dengan QR aman, dan kelola data profil race.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Metric Chips Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-sand-border">
          <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80">
            <div className="flex items-center justify-between text-espresso-secondary mb-1">
              <span className="text-[11px] font-medium">Tiket Saya</span>
              <Ticket className="w-4 h-4 text-brand" />
            </div>
            <div className="text-xl font-black text-espresso">{ticketCount}</div>
            <div className="text-[10px] text-espresso-muted">Lomba terdaftar</div>
          </div>

          <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80">
            <div className="flex items-center justify-between text-espresso-secondary mb-1">
              <span className="text-[11px] font-medium">Jarak Rekomendasi</span>
              <Sparkles className="w-4 h-4 text-accent-strava" />
            </div>
            <div className="text-xl font-black text-espresso">
              {recommendation ? recommendation.recommendedCategory : "10K"}
            </div>
            <div className="text-[10px] text-accent-success font-medium">
              {recommendation ? `${Math.round(recommendation.confidencePercentage)}% Kesiapan` : "Siap Lari"}
            </div>
          </div>

          <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80">
            <div className="flex items-center justify-between text-espresso-secondary mb-1">
              <span className="text-[11px] font-medium">Volume Latihan</span>
              <Flame className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-xl font-black text-espresso">{totalKm} <span className="text-xs font-normal text-espresso-muted">km</span></div>
            <div className="text-[10px] text-espresso-muted">Total histori Strava</div>
          </div>

          <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80">
            <div className="flex items-center justify-between text-espresso-secondary mb-1">
              <span className="text-[11px] font-medium">Long Run Terjauh</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-black text-espresso">
              {currentProfile?.summary.longestRunKm || 7.5} <span className="text-xs font-normal text-espresso-muted">km</span>
            </div>
            <div className="text-[10px] text-espresso-muted">Single session max</div>
          </div>
        </div>
      </div>
    </div>
  );
}
