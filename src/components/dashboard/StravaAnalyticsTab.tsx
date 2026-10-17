"use client";

import React, { useState } from "react";
import { useRunner } from "@/context/RunnerContext";
import { WeeklyMileageChart } from "./WeeklyMileageChart";
import { RecommendationCard } from "@/components/recommendation/RecommendationCard";
import { FitnessSyncMethods } from "@/components/fitness/FitnessSyncMethods";
import { formatPace } from "@/lib/utils";
import {
  Activity,
  CheckCircle2,
  RefreshCw,
  Unlink,
  Flame,
  Gauge,
  Clock,
  Compass,
  FileCheck2,
} from "lucide-react";

export function StravaAnalyticsTab() {
  const {
    currentProfile,
    isConnectedToStrava,
    fitnessDeviceOrApp,
    fitnessSyncSource,
    resetFitnessData,
    isLoading,
  } = useRunner();

  const [showMethods, setShowMethods] = useState<boolean>(false);

  // Jika belum terhubung atau pengguna ingin mengganti data
  if (!isConnectedToStrava || !currentProfile || showMethods) {
    return (
      <div className="space-y-6 w-full my-6">
        {isConnectedToStrava && (
          <div className="flex justify-end max-w-xl mx-auto">
            <button
              onClick={() => setShowMethods(false)}
              className="text-xs font-bold text-brand hover:underline"
            >
              ← Kembali ke Hasil Analitik Aktif
            </button>
          </div>
        )}
        <FitnessSyncMethods />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fitness Sync Status Card */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shrink-0 shadow-warm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-espresso">
                {currentProfile.athlete.firstname} {currentProfile.athlete.lastname}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-success/15 text-accent-success">
                <CheckCircle2 className="w-3 h-3" />
                <span>Terhubung • {fitnessDeviceOrApp}</span>
              </span>
            </div>
            <span className="text-[11px] text-espresso-muted block">
              Sinkronisasi Terakhir: {currentProfile.summary.lastRunDate} • Periode Analisis: {currentProfile.summary.analysisPeriodWeeks} minggu
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMethods(true)}
            className="px-3 py-1.5 rounded-btn bg-surface-main hover:bg-brand-50 border border-sand-border text-espresso font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand" />
            <span>Ganti / Update Data</span>
          </button>
          <button
            onClick={() => resetFitnessData()}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-btn hover:bg-accent-error/10 text-accent-error border border-sand-border font-semibold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Unlink className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>
        </div>
      </div>

      {/* 4 Key Numerical Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-card p-4 border border-sand-border shadow-warm space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-brand" />
            Total Jarak Lari
          </span>
          <span className="text-2xl font-extrabold text-espresso">
            {currentProfile.summary.totalDistanceKm} <small className="text-xs font-normal">KM</small>
          </span>
          <span className="text-[10px] text-espresso-muted block">
            dari {currentProfile.summary.totalRuns} sesi lari
          </span>
        </div>

        <div className="bg-white rounded-card p-4 border border-sand-border shadow-warm space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-brand" />
            Longest Run
          </span>
          <span className="text-2xl font-extrabold text-brand">
            {currentProfile.summary.longestRunKm} <small className="text-xs font-normal">KM</small>
          </span>
          <span className="text-[10px] text-espresso-muted block">Jarak tempuh terpanjang</span>
        </div>

        <div className="bg-white rounded-card p-4 border border-sand-border shadow-warm space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand" />
            Rata-rata Pace
          </span>
          <span className="text-2xl font-extrabold text-espresso">
            {formatPace(currentProfile.summary.averagePaceMinPerKm)}{" "}
            <small className="text-xs font-normal">/km</small>
          </span>
          <span className="text-[10px] text-espresso-muted block">Kecepatan lari rata-rata</span>
        </div>

        <div className="bg-white rounded-card p-4 border border-sand-border shadow-warm space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-brand" />
            Skor Konsistensi
          </span>
          <span className="text-2xl font-extrabold text-accent-success">
            {currentProfile.summary.consistencyScore}%
          </span>
          <span className="text-[10px] text-espresso-muted block">
            Rata-rata {currentProfile.summary.weeklyFrequency}x / minggu
          </span>
        </div>
      </div>

      {/* Detail Rekomendasi Jarak Cerdas StrideTix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-espresso flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-brand" />
            <span>Hasil Analisis Rekomendasi Kategori Lomba</span>
          </h3>
          <span className="text-xs text-espresso-secondary">
            Scoring Engine Deterministik StrideTix
          </span>
        </div>
        <RecommendationCard />
      </div>

      {/* Grafik Jarak Mingguan */}
      <WeeklyMileageChart summary={currentProfile.summary} />
    </div>
  );
}
