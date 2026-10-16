"use client";

import React from "react";
import Image from "next/image";
import { useRunner } from "@/context/RunnerContext";
import { MOCK_RUNNER_PROFILES } from "@/lib/mock-data/athletes";
import { SimulatedProfileId } from "@/types";
import {
  Activity,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Unlink,
  User,
  Users,
} from "lucide-react";

interface StravaPersonaSelectorProps {
  variant?: "full" | "compact";
  className?: string;
}

export function StravaPersonaSelector({
  variant = "full",
  className = "",
}: StravaPersonaSelectorProps) {
  const { currentProfile, selectedProfileId, setProfileById } = useRunner();

  if (variant === "compact") {
    return (
      <div className={`relative inline-block ${className}`}>
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-sand-border rounded-btn px-2.5 py-1 text-xs shadow-sm">
          <Activity className="w-3.5 h-3.5 text-accent-strava shrink-0" />
          <span className="text-espresso-secondary text-[11px] font-semibold hidden sm:inline">
            Profil Strava:
          </span>
          <select
            value={selectedProfileId}
            onChange={(e) =>
              setProfileById(e.target.value as SimulatedProfileId | "disconnected")
            }
            className="bg-transparent text-espresso font-bold text-xs focus:outline-none cursor-pointer pr-1"
          >
            {MOCK_RUNNER_PROFILES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.athlete.firstname} ({p.id === "beginner" ? "5K" : p.id === "intermediate" ? "10K" : p.id === "marathoner" ? "FM" : "Kurang Data"})
              </option>
            ))}
            <option value="disconnected">Belum Terhubung (Tamu)</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-card p-5 sm:p-6 border border-sand-border shadow-warm space-y-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-border pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent-strava" />
            <h3 className="text-sm font-extrabold text-espresso">
              Simulasi Profil Data Strava (Persona Latihan Pelari)
            </h3>
          </div>
          <p className="text-xs text-espresso-secondary mt-0.5">
            Pilih salah satu persona berikut untuk menguji kalkulasi Smart Distance Recommendation dan grafik latihan:
          </p>
        </div>

        {selectedProfileId !== "disconnected" && (
          <button
            type="button"
            onClick={() => setProfileById("disconnected")}
            className="self-start sm:self-center px-3 py-1.5 rounded-btn hover:bg-accent-error/10 text-accent-error border border-sand-border text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Unlink className="w-3.5 h-3.5" />
            <span>Simulasikan Putus Hubungan</span>
          </button>
        )}
      </div>

      {/* Grid of Available Personas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {MOCK_RUNNER_PROFILES.map((p) => {
          const isActive = selectedProfileId === p.id;
          const targetBadge =
            p.id === "beginner"
              ? "Target: 5K Fun Run"
              : p.id === "intermediate"
              ? "Target: 10K Race"
              : p.id === "marathoner"
              ? "Target: 42K Marathon"
              : "Data Belum Cukup";

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setProfileById(p.id)}
              className={`text-left p-3.5 rounded-btn border transition-all relative flex flex-col justify-between ${
                isActive
                  ? "bg-brand-50 border-brand ring-2 ring-brand/30 shadow-sm"
                  : "bg-surface-main hover:bg-surface-soft border-sand-border"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-sand-border relative shrink-0">
                      <Image
                        src={p.athlete.profileMedium}
                        alt={p.athlete.firstname}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-espresso leading-tight">
                        {p.athlete.firstname} {p.athlete.lastname}
                      </h4>
                      <span className="text-[10px] text-espresso-muted">
                        @{p.athlete.username}
                      </span>
                    </div>
                  </div>

                  {isActive && (
                    <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? "bg-brand text-white"
                        : "bg-sand-border/80 text-espresso-secondary"
                    }`}
                  >
                    {targetBadge}
                  </span>
                </div>

                <p className="text-[11px] text-espresso-secondary leading-snug line-clamp-2">
                  {p.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-sand-border/60 flex items-center justify-between text-[10px] text-espresso-muted">
                <span>Longest: <strong>{p.summary.longestRunKm}km</strong></span>
                <span>Frek: <strong>{p.summary.weeklyFrequency}x/mgg</strong></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
