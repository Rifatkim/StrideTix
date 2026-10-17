"use client";

import React from "react";
import Link from "next/link";
import { useRunner } from "@/context/RunnerContext";
import { useAuth } from "@/context/AuthContext";
import { formatPace } from "@/lib/utils";
import {
  Sparkles,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Info,
  ChevronRight,
  Gauge,
} from "lucide-react";

export function RecommendationCard() {
  const { currentUser, role } = useAuth();
  const { currentProfile, recommendation, isConnectedToStrava, setProfileById } = useRunner();
  const [aiExplanation, setAiExplanation] = React.useState<{
    explanation: string;
    safetyNotes: string;
    modelUsed?: string;
  } | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  React.useEffect(() => {
    if (!currentProfile || !recommendation || recommendation.status === "insufficient_data") {
      setAiExplanation(null);
      return;
    }

    let isMounted = true;
    async function fetchAiExplanation() {
      setIsAiLoading(true);
      try {
        const res = await fetch("/api/recommendation/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recommendedCategory: recommendation?.recommendedCategory,
            longestRunKm: currentProfile?.summary.longestRunKm,
            weeklyFrequency: currentProfile?.summary.weeklyFrequency,
            averagePaceMinPerKm: currentProfile?.summary.averagePaceMinPerKm,
            consistencyScore: currentProfile?.summary.consistencyScore,
            readiness: recommendation?.readiness,
            totalRuns: currentProfile?.summary.totalRuns,
          }),
        });
        const data = await res.json();
        if (data.success && isMounted) {
          setAiExplanation({
            explanation: data.explanation,
            safetyNotes: data.safetyNotes,
            modelUsed: data.modelUsed,
          });
        }
      } catch {
        // Fallback offline
      } finally {
        if (isMounted) setIsAiLoading(false);
      }
    }

    fetchAiExplanation();
    return () => {
      isMounted = false;
    };
  }, [currentProfile?.id, currentProfile?.summary?.longestRunKm, recommendation?.recommendedCategory]);

  // 1. Jika belum login, tampilkan banner ajakan login sebagai pelari
  if (!currentUser) {
    return (
      <div className="bg-brand-50/80 rounded-card p-4 border border-brand-200/70 shadow-sm flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-brand shrink-0" />
          <span className="text-xs text-espresso font-medium leading-relaxed">
            Masuk sebagai <strong>Pelari</strong> untuk mengaktifkan fitur Smart Distance AI berbasis data Strava.
          </span>
        </div>
        <Link
          href="/login"
          className="px-3.5 py-1.5 rounded-btn bg-brand text-white text-xs font-bold shrink-0 hover:bg-brand-800 transition-colors shadow-sm"
        >
          Masuk
        </Link>
      </div>
    );
  }

  // 2. Fitur AI hanya khusus untuk pelari (bukan organizer atau admin)
  if (role !== "runner") {
    return null;
  }

  if (!isConnectedToStrava || !currentProfile) {
    return (
      <div className="bg-brand-50 rounded-card p-5 border border-brand-200 shadow-warm space-y-3">
        <div className="flex items-center gap-2 text-brand">
          <Activity className="w-5 h-5 text-accent-strava" />
          <h3 className="text-sm font-extrabold text-espresso">
            Dapatkan Rekomendasi Jarak Berdasarkan Data Lari Anda
          </h3>
        </div>
        <p className="text-xs text-espresso-secondary leading-relaxed">
          Unggah file GPX/CSV atau isi data latihan Anda untuk melihat analisis kesiapan fisik dan kategori jarak lomba yang paling ideal (5K, 10K, Half Marathon, atau Full Marathon).
        </p>
        <div className="flex items-center gap-3 pt-1 flex-wrap">
          <Link
            href="/dashboard?tab=strava"
            className="px-4 py-2 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Sinkronkan Riwayat Lari</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  // Handle Insufficient Data
  if (recommendation.status === "insufficient_data") {
    return (
      <div className="bg-surface-soft rounded-card p-5 border border-sand-border shadow-warm space-y-3">
        <div className="flex items-center gap-2 text-espresso">
          <Info className="w-5 h-5 text-accent-info" />
          <h3 className="text-sm font-extrabold text-espresso">
            Data Aktivitas Strava Belum Cukup
          </h3>
        </div>
        <p className="text-xs text-espresso-secondary leading-relaxed">
          Akun Strava Anda baru merekam {currentProfile.summary.totalRuns} aktivitas lari. Rekomendasi personal memerlukan minimal 3 aktivitas lari dalam 4–8 minggu terakhir untuk analisis yang akurat.
        </p>
        <div className="text-[11px] text-espresso-muted bg-white p-3 rounded-btn border border-sand-border">
          💡 Anda tetap bebas memilih kategori tiket yang diinginkan secara mandiri.
        </div>
      </div>
    );
  }

  // Render Full Smart Recommendation Card per DESIGN.md Section 9.5
  return (
    <div className="bg-brand-50 rounded-card p-5 sm:p-6 border-2 border-brand shadow-warm space-y-5 relative overflow-hidden">
      {/* Decorative AI Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent-ai/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-brand text-white shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-accent-ai" />
          <span>Recommended for You</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-espresso-muted">
          <span>Smart AI Scoring</span>
        </div>
      </div>

      {/* Main Recommended Distance & Readiness */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-brand-200/80 pb-4">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-wider text-espresso-muted block">
            Kategori Jarak yang Direkomendasikan:
          </span>
          <span className="text-3xl font-extrabold text-brand tracking-tight">
            {recommendation.recommendedCategory}
          </span>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] uppercase font-bold tracking-wider text-espresso-muted block">
            Tingkat Kesiapan Fisik:
          </span>
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-accent-success/15 text-accent-success border border-accent-success/30">
            {recommendation.readiness}
          </span>
        </div>
      </div>

      {/* Confidence Level Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-espresso flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-brand" />
            Confidence Level Sistem:
          </span>
          <span className="font-bold text-brand">
            {recommendation.confidencePercentage}% ({recommendation.confidenceLevel} Confidence)
          </span>
        </div>

        <div className="w-full bg-sand-border h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand h-full rounded-full transition-all duration-500"
            style={{ width: `${recommendation.confidencePercentage}%` }}
          />
        </div>
      </div>

      {/* Groq LLM Explanation Layer (PRD §15.1) */}
      <div className="bg-white/95 rounded-btn p-4 border border-brand-200/80 space-y-2 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-brand font-black text-xs">
            <Sparkles className="w-3.5 h-3.5 text-accent-ai animate-pulse" />
            <span>Penjelasan AI (Groq Cloud Inference)</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand font-bold border border-brand-200">
            {aiExplanation?.modelUsed || "Groq LPU"}
          </span>
        </div>

        {isAiLoading ? (
          <div className="animate-pulse space-y-1.5 py-1">
            <div className="h-2.5 bg-sand-border/70 rounded w-full" />
            <div className="h-2.5 bg-sand-border/70 rounded w-4/5" />
          </div>
        ) : (
          <p className="text-xs text-espresso leading-relaxed">
            {aiExplanation?.explanation || recommendation.reasons.join(" ")}
          </p>
        )}
      </div>

      {/* Reasons Breakdown (Rule-Based Engine) */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
          Poin Analitik Scoring Engine:
        </span>
        <ul className="space-y-1">
          {recommendation.reasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[11px] text-espresso-secondary leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-1.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Strava Key Metrics Pill */}
      <div className="grid grid-cols-3 gap-2 bg-white/80 p-3 rounded-btn border border-sand-border text-center text-xs">
        <div>
          <span className="text-[10px] text-espresso-muted block">Longest Run</span>
          <strong className="text-espresso font-bold">{currentProfile.summary.longestRunKm} KM</strong>
        </div>
        <div>
          <span className="text-[10px] text-espresso-muted block">Frekuensi</span>
          <strong className="text-espresso font-bold">{currentProfile.summary.weeklyFrequency}x /mgg</strong>
        </div>
        <div>
          <span className="text-[10px] text-espresso-muted block">Rata-rata Pace</span>
          <strong className="text-espresso font-bold">{formatPace(currentProfile.summary.averagePaceMinPerKm)}</strong>
        </div>
      </div>

      {/* Safety Note Alert if present */}
      {recommendation.safetyNotes && (
        <div className="bg-accent-warning-bg/90 rounded-btn p-3 border border-accent-warning-border flex items-start gap-2.5 text-xs text-espresso">
          <AlertTriangle className="w-4 h-4 text-accent-warning shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Catatan:</strong> {recommendation.safetyNotes}
          </p>
        </div>
      )}
    </div>
  );
}
