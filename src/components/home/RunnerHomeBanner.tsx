"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Ticket,
  Activity,
  ArrowRight,
  Flame,
  Award,
  CalendarCheck2,
} from "lucide-react";

export function RunnerHomeBanner() {
  const { currentUser } = useAuth();

  return (
    <section className="bg-gradient-to-b from-brand-50/70 via-sand-warm to-surface-main border-b border-sand-border pt-8 pb-10 sm:pt-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Welcome Pill */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-100/60 text-brand border border-brand/20">
              <Flame className="w-3.5 h-3.5 text-accent-strava" />
              <span>Runner Portal • Siap untuk Target Lomba Berikutnya</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-espresso tracking-tight">
              Halo, {currentUser?.name || "Pelari Hebat"}! 🏃‍♂️
            </h1>
            <p className="text-xs sm:text-sm text-espresso-secondary max-w-2xl leading-relaxed">
              Temukan race lari terkurasi dan gunakan analitik kebugaran Strava Anda untuk memilih kategori jarak yang paling realistis dan aman.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/dashboard?tab=tickets"
              className="px-4 py-2.5 rounded-btn bg-brand text-white font-bold text-xs sm:text-sm shadow-warm hover:bg-brand-800 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Ticket className="w-4 h-4" />
              <span>Tiket Saya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/dashboard?tab=strava"
              className="px-4 py-2.5 rounded-btn bg-white text-accent-strava font-bold text-xs sm:text-sm border border-sand-border shadow-sm hover:border-accent-strava/40 hover:bg-orange-50/50 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Activity className="w-4 h-4 text-accent-strava" />
              <span>Analisis Strava AI</span>
            </Link>
          </div>
        </div>

        {/* Runner Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="bg-white rounded-card p-3.5 border border-sand-border shadow-warm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-accent-strava flex items-center justify-center shrink-0 border border-orange-200/50">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-espresso-muted">Status Strava</span>
              <p className="text-xs font-bold text-espresso">Terkoneksi • Pace 5:20/km</p>
            </div>
          </div>

          <div className="bg-white rounded-card p-3.5 border border-sand-border shadow-warm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0 border border-brand/20">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-espresso-muted">Event Terdaftar</span>
              <p className="text-xs font-bold text-espresso">2 Race Aktif</p>
            </div>
          </div>

          <div className="bg-white rounded-card p-3.5 border border-sand-border shadow-warm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/50">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-espresso-muted">Target Rekomendasi</span>
              <p className="text-xs font-bold text-emerald-700">Half Marathon (21K)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
