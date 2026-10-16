"use client";

import React from "react";
import { useRunner } from "@/context/RunnerContext";
import { WeeklyMileageChart } from "./WeeklyMileageChart";
import { RecommendationCard } from "@/components/recommendation/RecommendationCard";
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
} from "lucide-react";

export function StravaAnalyticsTab() {
  const { currentProfile, isConnectedToStrava, setProfileById } = useRunner();

  if (!isConnectedToStrava || !currentProfile) {
    return (
      <div className="space-y-6 w-full my-6">
        <div className="bg-white rounded-card p-8 sm:p-10 text-center border border-sand-border shadow-warm space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-accent-strava/10 text-accent-strava flex items-center justify-center mx-auto">
            <Activity className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-espresso">Akun Strava Belum Terhubung</h3>
          <p className="text-xs text-espresso-secondary leading-relaxed">
            Hubungkan akun Strava Anda untuk melihat riwayat aktivitas lari, grafik jarak mingguan, dan rekomendasi kategori jarak lomba otomatis yang aman.
          </p>
          <div className="pt-2">
            <button
              onClick={() => alert("Menghubungkan ke Strava API v3 OAuth... (Siapkan Client ID di .env.local)")}
              className="px-6 py-3 rounded-btn bg-accent-strava text-white font-bold text-xs shadow-warm hover:bg-orange-600 transition-all inline-flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Hubungkan Akun Strava Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Strava Sync Status Card */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-strava text-white flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-espresso">
                {currentProfile.athlete.firstname} {currentProfile.athlete.lastname}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-success/15 text-accent-success">
                <CheckCircle2 className="w-3 h-3" />
                <span>Terhubung</span>
              </span>
            </div>
            <span className="text-[11px] text-espresso-muted block">
              Sinkronisasi Terakhir: {currentProfile.summary.lastRunDate} • Periode: {currentProfile.summary.analysisPeriodWeeks} minggu
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Data aktivitas Strava berhasil disinkronkan ulang!")}
            className="px-3 py-1.5 rounded-btn bg-surface-main hover:bg-brand-50 border border-sand-border text-espresso font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-brand" />
            <span>Sinkronkan Ulang</span>
          </button>
          <button
            onClick={() => setProfileById("disconnected")}
            className="px-3 py-1.5 rounded-btn hover:bg-accent-error/10 text-accent-error border border-sand-border font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Unlink className="w-3.5 h-3.5" />
            <span>Putus Akses</span>
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
            {formatPace(currentProfile.summary.averagePaceMinPerKm)}
          </span>
          <span className="text-[10px] text-espresso-muted block">Ritme lari rata-rata</span>
        </div>

        <div className="bg-white rounded-card p-4 border border-sand-border shadow-warm space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-brand" />
            Konsistensi
          </span>
          <span className="text-2xl font-extrabold text-accent-success">
            {currentProfile.summary.consistencyScore}%
          </span>
          <span className="text-[10px] text-espresso-muted block">Skor stabilitas latihan</span>
        </div>
      </div>

      {/* Weekly Mileage Chart */}
      <WeeklyMileageChart summary={currentProfile.summary} />

      {/* Recommendation Card */}
      <div className="space-y-2">
        <h4 className="text-sm font-extrabold text-espresso">
          Hasil Smart Distance Recommendation Terkini:
        </h4>
        <RecommendationCard />
      </div>
    </div>
  );
}
