"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Container } from "@/components/layout/Container";
import { StravaAnalyticsTab } from "@/components/dashboard/StravaAnalyticsTab";
import { useRunner } from "@/context/RunnerContext";
import {
  Sparkles,
  Activity,
  Ticket,
  Flame,
  Loader2,
  Compass,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

function SmartAIContent() {
  const { currentProfile, isConnectedToStrava, recommendation } = useRunner();

  const totalKm = currentProfile
    ? currentProfile.summary.totalDistanceKm.toFixed(1)
    : "0";

  return (
    <Container as="main" className="flex-1 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-32 md:pb-12">
      <AuthGuard allowedRole="runner">
        {/* Dedicated Header for Smart Distance AI */}
        <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              {isConnectedToStrava && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-accent-strava border border-orange-200">
                    <Activity className="w-3 h-3" />
                    Data Kebugaran Terhubung
                  </span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl font-black text-espresso tracking-tight">
                Smart Distance AI & Kesiapan Lari
              </h1>
              <p className="text-xs sm:text-sm text-espresso-secondary leading-relaxed">
                Analisis riwayat latihan lari Anda (volume mingguan, long run terpanjang, pace, dan konsistensi) untuk menentukan kategori jarak lomba yang paling aman, terukur, dan diperkuat rekomendasi Groq AI.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:gap-3 shrink-0 pt-2 sm:pt-0">
              <Link
                href="/tickets"
                className="px-4 py-2.5 rounded-btn bg-brand-50 text-brand hover:bg-brand-100 border border-brand/20 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs whitespace-nowrap"
              >
                <Ticket className="w-3.5 h-3.5 text-brand shrink-0" />
                <span>Tiket</span>
              </Link>
              <Link
                href="/"
                className="px-4 py-2.5 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-all flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Jelajahi</span>
              </Link>
            </div>
          </div>

          {/* Fitness AI Metric Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6 pt-6 border-t border-sand-border">
            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 text-espresso-secondary mb-1">
                <span className="text-[11px] font-semibold whitespace-nowrap">Rekomendasi</span>
                <Sparkles className="w-3.5 h-3.5 text-brand shrink-0" />
              </div>
              <div className="text-xl font-black text-espresso">
                {recommendation ? recommendation.recommendedCategory : "10K"}
              </div>
              <div className="text-[10px] text-accent-success font-medium truncate">
                {recommendation
                  ? `${Math.round(recommendation.confidencePercentage)}% Kesiapan`
                  : "Siap Lari"}
              </div>
            </div>

            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 text-espresso-secondary mb-1">
                <span className="text-[11px] font-semibold whitespace-nowrap">Volume Latihan</span>
                <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              </div>
              <div className="text-xl font-black text-espresso">
                {totalKm} <span className="text-xs font-normal text-espresso-muted">km</span>
              </div>
              <div className="text-[10px] text-espresso-muted truncate">Histori aktivitas</div>
            </div>

            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 text-espresso-secondary mb-1">
                <span className="text-[11px] font-semibold whitespace-nowrap">Long Run</span>
                <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              </div>
              <div className="text-xl font-black text-espresso">
                {currentProfile?.summary.longestRunKm || 7.5}{" "}
                <span className="text-xs font-normal text-espresso-muted">km</span>
              </div>
              <div className="text-[10px] text-espresso-muted truncate">Sesi terpanjang</div>
            </div>

            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 text-espresso-secondary mb-1">
                <span className="text-[11px] font-semibold whitespace-nowrap">Status AI</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              </div>
              <div className="text-sm sm:text-base font-black text-espresso whitespace-nowrap">
                Rule + Groq
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold truncate">Aktif & Siap Uji</div>
            </div>
          </div>
        </div>

        {/* Dedicated Smart Distance AI Content Pane */}
        <div className="animate-in fade-in duration-200">
          <StravaAnalyticsTab />
        </div>
      </AuthGuard>
    </Container>
  );
}

export default function SmartDistanceAIPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        }
      >
        <SmartAIContent />
      </Suspense>
      <Footer />
    </div>
  );
}
