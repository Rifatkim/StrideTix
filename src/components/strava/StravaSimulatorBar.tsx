"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRunner } from "@/context/RunnerContext";
import { useAuth } from "@/context/AuthContext";
import { MOCK_RUNNER_PROFILES } from "@/lib/mock-data/athletes";
import { SimulatedProfileId, UserRole } from "@/types";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Unlink,
  UserCheck,
  Building2,
  ShieldCheck,
  ExternalLink,
  LogIn,
  LogOut,
  User,
  Users,
  Shield,
} from "lucide-react";

export function StravaSimulatorBar() {
  const router = useRouter();
  const { currentProfile, selectedProfileId, setProfileById, recommendation } = useRunner();
  const { currentUser, role, login, switchRole, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    switchRole(newRole);
    if (newRole === "runner") router.push("/dashboard");
    else if (newRole === "organizer") router.push("/organizer/dashboard");
    else if (newRole === "admin") router.push("/admin/dashboard");
  };

  const handleQuickLogin = async (targetRole: UserRole) => {
    await login({ email: "", demoRole: targetRole });
    if (targetRole === "runner") router.push("/dashboard");
    else if (targetRole === "organizer") router.push("/organizer/dashboard");
    else if (targetRole === "admin") router.push("/admin/dashboard");
  };

  if (isCollapsed) {
    return (
      <div className="fixed bottom-2 right-4 z-50 animate-in fade-in">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-espresso text-white text-xs font-bold shadow-warm-modal border border-sand-border hover:bg-black transition-colors"
        >
          <Activity className="w-3.5 h-3.5 text-accent-strava" />
          <span>Demo Toolbar ({currentUser ? role : "Guest"})</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-sand-border shadow-warm-modal transition-all text-espresso font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* CASE 1: GUEST MODE (Belum Login) */}
        {!currentUser ? (
          <div className="flex items-center justify-between w-full gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-400 animate-pulse" />
              <span className="text-xs font-bold text-espresso">
                Mode Tamu (Belum Login)
              </span>
              <span className="text-[11px] text-espresso-muted hidden sm:inline">
                — Pilih peran untuk mulai menguji alur sistem StrideTix:
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleQuickLogin("runner")}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-btn bg-brand text-white text-xs font-bold shadow-sm hover:bg-brand-800 transition-colors"
              >
                <User className="w-3 h-3" />
                <span>Login Runner</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("organizer")}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-btn bg-accent-strava text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
              >
                <Users className="w-3 h-3" />
                <span>Login Organizer</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-btn bg-accent-info text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
              >
                <Shield className="w-3 h-3" />
                <span>Login Admin</span>
              </button>

              <button
                onClick={() => setIsCollapsed(true)}
                title="Sembunyikan"
                className="p-1 rounded text-espresso-muted hover:text-espresso"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* CASE 2: LOGGED IN MODE (Runner, Organizer, or Admin) */
          <>
            {/* Left: Role Indicator & Switcher */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 bg-sand-warm rounded-full px-2.5 py-1 border border-sand-border">
                <span className="text-[10px] font-bold text-espresso-muted uppercase tracking-wider">
                  Role Aktif:
                </span>
                <select
                  value={role || "runner"}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="text-xs font-black bg-transparent text-espresso focus:outline-none cursor-pointer"
                >
                  <option value="runner">🏃 Runner (Budi Pratama)</option>
                  <option value="organizer">🏢 Organizer (Danamon Ops)</option>
                  <option value="admin">🛡️ Admin (Super Admin)</option>
                </select>
              </div>

              {/* Quick Jump Links based on active role */}
              {role === "runner" && (
                <Link
                  href="/dashboard"
                  className="text-[11px] font-bold text-brand hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Dashboard Pelari</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}

              {role === "organizer" && (
                <Link
                  href="/organizer/dashboard"
                  className="text-[11px] font-bold text-accent-strava hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Dashboard Organizer</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}

              {role === "admin" && (
                <Link
                  href="/admin/dashboard"
                  className="text-[11px] font-bold text-accent-info hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Panel Admin</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}

              {/* Strava Athlete Status (Only shown for Runner!) */}
              {role === "runner" && (
                <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-sand-border">
                  <div className="w-5 h-5 rounded-full bg-accent-strava text-white flex items-center justify-center shrink-0">
                    <Activity className="w-3 h-3" />
                  </div>
                  {currentProfile ? (
                    <div className="text-xs">
                      <span className="font-bold text-espresso">
                        {currentProfile.athlete.firstname}
                      </span>
                      <span className="text-espresso-muted ml-1">
                        ({currentProfile.summary.longestRunKm} km LR)
                      </span>
                      {recommendation && (
                        <span className="ml-1.5 px-1.5 py-0.2 rounded bg-brand-50 text-brand text-[10px] font-bold">
                          Rek: {recommendation.recommendedCategory}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-espresso-muted">Strava Offline</span>
                  )}
                </div>
              )}
            </div>

            {/* Right: Strava Selector (for runner) or Quick Logout */}
            <div className="flex items-center justify-between md:justify-end gap-2">
              {role === "runner" && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-accent-strava uppercase hidden sm:inline">
                    Simulasi Strava:
                  </span>
                  <select
                    value={selectedProfileId}
                    onChange={(e) =>
                      setProfileById(e.target.value as SimulatedProfileId | "disconnected")
                    }
                    className="text-xs font-semibold py-1 px-2.5 rounded-btn bg-sand-warm border border-sand-border text-espresso focus:outline-none focus:ring-1 focus:ring-brand cursor-pointer"
                  >
                    <option value="disconnected">-- Belum Sync --</option>
                    {MOCK_RUNNER_PROFILES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>

                  {selectedProfileId !== "disconnected" ? (
                    <button
                      onClick={() => setProfileById("disconnected")}
                      title="Putus Akses Strava"
                      className="p-1 rounded text-espresso-muted hover:text-red-600 transition-colors"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setProfileById("beginner")}
                      className="px-2 py-1 rounded-btn bg-accent-strava text-white font-bold text-[11px] shadow-sm hover:opacity-90"
                    >
                      Connect
                    </button>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                title="Keluar ke Mode Tamu"
                className="px-2 py-1 rounded-btn text-xs font-semibold text-espresso-muted hover:text-red-600 border border-sand-border hover:border-red-300 transition-colors inline-flex items-center gap-1"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <button
                onClick={() => setIsCollapsed(true)}
                title="Sembunyikan Demo Bar"
                className="p-1 rounded text-espresso-muted hover:text-espresso"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
