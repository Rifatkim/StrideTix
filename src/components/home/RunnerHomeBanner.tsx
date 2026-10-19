"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRunner } from "@/context/RunnerContext";
import { getAllUserTickets } from "@/services/ticketService";
import { formatPace } from "@/lib/utils";
import { ETicket } from "@/types";
import { Container } from "@/components/layout/Container";
import { RunningStrideIcon } from "@/components/brand/RunningStrideIcon";
import {
  Ticket,
  Activity,
  ArrowRight,
  Award,
  CalendarCheck2,
} from "lucide-react";

export function RunnerHomeBanner() {
  const { currentUser } = useAuth();
  const { currentProfile, recommendation } = useRunner();
  const [tickets, setTickets] = useState<ETicket[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (currentUser) {
      getAllUserTickets()
        .then((data) => {
          if (isMounted) setTickets(data);
        })
        .catch(() => {
          // Fallback empty
        });
    }
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const readyToCheckInCount = tickets.filter(
    (t) => t.status !== "checked_in"
  ).length;

  return (
    <section className="bg-gradient-to-b from-brand-50/50 via-sand-warm/40 to-surface-main border-b border-sand-border pt-5 pb-7 sm:pt-6 sm:pb-8">
      <Container className="space-y-6 sm:space-y-7">
        {/* 1. Hero 2-Column Layout */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          {/* Kolom Kiri (~62%): Greeting Bersih & Deskripsi */}
          <div className="lg:w-[62%] space-y-1.5 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-espresso tracking-tight leading-tight flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <span>Halo, {currentUser?.name || "Pelari Hebat"}!</span>
              <RunningStrideIcon
                size={34}
                className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 shrink-0 inline-block drop-shadow-[0_3px_8px_rgba(234,88,12,0.25)] hover:scale-105 transition-transform duration-200"
              />
            </h1>
            <p className="text-xs sm:text-sm text-espresso-secondary max-w-3xl leading-relaxed">
              Temukan race lari terkurasi dan gunakan analitik kebugaran Anda untuk memilih kategori jarak yang paling realistis dan aman.
            </p>
          </div>

          {/* Kolom Kanan (~38%): Aksi Cepat Tiket & Strava AI, Rata Kanan di Desktop */}
          <div className="lg:w-[38%] flex flex-wrap sm:flex-nowrap items-center lg:justify-end gap-3 shrink-0">
            <Link
              href="/dashboard?tab=tickets"
              className="w-full sm:w-auto px-5 py-3 rounded-btn bg-brand text-white font-bold text-xs sm:text-sm shadow-warm hover:bg-brand-800 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Ticket className="w-4 h-4" />
              <span>Tiket Saya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/dashboard?tab=strava"
              className="w-full sm:w-auto px-5 py-3 rounded-btn bg-white text-accent-strava font-bold text-xs sm:text-sm border border-sand-border shadow-sm hover:border-accent-strava/40 hover:bg-orange-50/50 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Activity className="w-4 h-4 text-accent-strava" />
              <span>Analisis Strava AI</span>
            </Link>
          </div>
        </div>

        {/* 2. Statistic Cards: Grid 3-Kolom Penuh Berdasarkan Data Backend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {/* Card 1: Status Kebugaran / Strava */}
          <div className="bg-white rounded-card p-4 sm:p-5 border border-sand-border shadow-warm flex items-center gap-3.5 hover:shadow-warm-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-accent-strava flex items-center justify-center shrink-0 border border-orange-200/60">
              <Activity className="w-6 h-6" />
            </div>
            {currentProfile ? (
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-bold text-espresso-muted block">Status Kebugaran</span>
                <p className="text-sm font-bold text-espresso truncate">
                  Terkoneksi • Pace {formatPace(currentProfile.summary.averagePaceMinPerKm)}
                </p>
                <span className="text-[10px] text-espresso-muted">
                  Long Run {currentProfile.summary.longestRunKm.toFixed(1)} km • {currentProfile.summary.weeklyFrequency}x/minggu
                </span>
              </div>
            ) : (
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-bold text-espresso-muted block">Status Kebugaran</span>
                <p className="text-sm font-bold text-espresso truncate">Belum Terhubung</p>
                <Link href="/dashboard?tab=strava" className="text-[10px] text-accent-strava font-bold hover:underline block truncate">
                  Sinkronkan GPX / CSV / Manual →
                </Link>
              </div>
            )}
          </div>

          {/* Card 2: Event Terdaftar */}
          <div className="bg-white rounded-card p-4 sm:p-5 border border-sand-border shadow-warm flex items-center gap-3.5 hover:shadow-warm-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand flex items-center justify-center shrink-0 border border-brand/20">
              <CalendarCheck2 className="w-6 h-6" />
            </div>
            {tickets.length > 0 ? (
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-bold text-espresso-muted block">Event Terdaftar</span>
                <p className="text-sm font-bold text-espresso truncate">{tickets.length} Race Aktif</p>
                <span className="text-[10px] text-espresso-muted">
                  {readyToCheckInCount} Race siap check-in (E-Ticket)
                </span>
              </div>
            ) : (
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-bold text-espresso-muted block">Event Terdaftar</span>
                <p className="text-sm font-bold text-espresso truncate">0 Race Aktif</p>
                <Link href="/#events" className="text-[10px] text-brand font-bold hover:underline block truncate">
                  Jelajahi Event Lari →
                </Link>
              </div>
            )}
          </div>

          {/* Card 3: Target Rekomendasi */}
          <div className="bg-white rounded-card p-4 sm:p-5 border border-sand-border shadow-warm flex items-center gap-3.5 hover:shadow-warm-hover transition-all sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
              <Award className="w-6 h-6" />
            </div>
            {recommendation ? (
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-bold text-espresso-muted block">Target Rekomendasi</span>
                <p className="text-sm font-bold text-emerald-700 truncate">
                  {recommendation.recommendedCategory || "Belum Ditentukan"} ({recommendation.confidencePercentage}%)
                </p>
                <span className="text-[10px] text-espresso-muted truncate block">
                  Kesiapan: {recommendation.readiness}
                </span>
              </div>
            ) : (
              <div className="min-w-0">
                <span className="text-[11px] uppercase font-bold text-espresso-muted block">Target Rekomendasi</span>
                <p className="text-sm font-bold text-espresso-secondary truncate">Belum Dianalisis</p>
                <Link href="/dashboard?tab=strava" className="text-[10px] text-brand font-bold hover:underline block truncate">
                  Dapatkan Rekomendasi AI →
                </Link>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
