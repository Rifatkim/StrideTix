"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RunningEvent, ETicket } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getEvents } from "@/services/eventService";
import { getAllUserTickets } from "@/services/ticketService";
import { formatRupiah, formatDateIndonesian } from "@/lib/utils";
import {
  Building2,
  CheckCircle2,
  PlusCircle,
  QrCode,
  Users,
  LayoutDashboard,
  Calendar,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
} from "lucide-react";
import { Container } from "@/components/layout/Container";

interface OrganizerLandingHomeProps {
  events: RunningEvent[];
}

export function OrganizerLandingHome({ events: initialEvents }: OrganizerLandingHomeProps) {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<RunningEvent[]>(initialEvents);
  const [tickets, setTickets] = useState<ETicket[]>([]);

  useEffect(() => {
    async function loadData() {
      const [evts, tix] = await Promise.all([
        getEvents(),
        getAllUserTickets(),
      ]);
      setEvents(evts);
      setTickets(tix);
    }
    loadData();
  }, []);

  let totalRevenue = 0;
  let totalQuota = 0;
  let totalSold = 0;

  events.forEach((ev) => {
    ev.categories.forEach((cat) => {
      totalQuota += cat.quota;
      const sold = Math.max(0, cat.quota - cat.availableQuota);
      totalSold += sold;
      totalRevenue += sold * cat.price;
    });
  });

  return (
    <Container className="py-8 space-y-8">
      {/* 1. Organizer Welcome Banner */}
      <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-card bg-brand-50 text-brand border border-brand/20 flex items-center justify-center shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-espresso">
                {currentUser?.organizerName || currentUser?.name || "Stride Jakarta Athletics"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand border border-brand/20 uppercase tracking-wider">
                Event Organizer
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Terverifikasi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-espresso-secondary max-w-2xl leading-relaxed">
              Selamat datang di Hub Penyelenggara Lomba. Kelola penjualan tiket, atur kuota kategori lari, pantau peserta, dan jalankan validasi gate check-in hari-H.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/organizer/check-in"
            className="px-4 py-2.5 rounded-btn bg-brand text-white font-bold text-xs sm:text-sm shadow-warm hover:bg-brand-800 transition-all flex items-center gap-2 active:scale-95"
          >
            <QrCode className="w-4 h-4" />
            <span>Terminal Scan QR</span>
          </Link>
          <Link
            href="/organizer/events/new"
            className="px-4 py-2.5 rounded-btn bg-white text-espresso font-bold text-xs sm:text-sm border border-sand-border shadow-sm hover:border-brand hover:text-brand transition-all flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-brand" />
            <span>+ Buat Event</span>
          </Link>
        </div>
      </div>

      {/* 2. Quick KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-secondary">Total Pendapatan Tiket</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-espresso">{formatRupiah(totalRevenue)}</div>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <span>Dari {events.length} event terdaftar</span>
          </p>
        </div>

        <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-secondary">Tiket Terjual</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-espresso">
            {totalSold.toLocaleString("id-ID")} <span className="text-xs text-espresso-muted font-normal">/ {totalQuota.toLocaleString("id-ID")} slot</span>
          </div>
          <div className="w-full bg-sand-border h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((totalSold / Math.max(1, totalQuota)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-secondary">Event Lari Aktif</span>
            <div className="w-8 h-8 rounded-lg bg-accent-strava/10 text-accent-strava flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-espresso">
            {events.length} <span className="text-xs text-espresso-muted font-normal">Race</span>
          </div>
          <p className="text-[11px] text-espresso-muted">
            {events.filter((e) => e.status === "published").length} dipublikasikan, {events.filter((e) => e.status !== "published").length} draft
          </p>
        </div>
      </div>

      {/* 3. Operational Quick Action Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-espresso">Aksi Cepat Penyelenggara</h2>
          <Link
            href="/organizer/dashboard"
            className="text-xs font-bold text-brand hover:text-brand-800 transition-colors flex items-center gap-1"
          >
            <span>Buka Dashboard Penuh</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/organizer/check-in"
            className="bg-white rounded-card p-5 border border-sand-border hover:border-brand shadow-warm hover:shadow-warm-lg transition-all group active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-warm">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-espresso group-hover:text-brand transition-colors">
                  Gate Check-In & Scan QR
                </h3>
                <p className="text-xs text-espresso-secondary mt-1">
                  Validasi e-ticket peserta saat race day dengan pemindai kamera atau input kode unik secara instan.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-brand gap-1">
              <span>Buka Terminal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/organizer/events/evt-jkt-marathon-2026/participants"
            className="bg-white rounded-card p-5 border border-sand-border hover:border-brand shadow-warm hover:shadow-warm-lg transition-all group active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand border border-brand/20 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-espresso group-hover:text-brand transition-colors">
                  Daftar Peserta & Kehadiran
                </h3>
                <p className="text-xs text-espresso-secondary mt-1">
                  Pantau daftar seluruh pelari yang telah terdaftar, status check-in, dan kontak darurat.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-brand gap-1">
              <span>Kelola Peserta</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/organizer/events/new"
            className="bg-white rounded-card p-5 border border-sand-border hover:border-brand shadow-warm hover:shadow-warm-lg transition-all group active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand border border-brand/20 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-espresso group-hover:text-brand transition-colors">
                  Buat Event Lomba Baru
                </h3>
                <p className="text-xs text-espresso-secondary mt-1">
                  Tambahkan event lari baru, tentukan kuota kategori jarak (5K hingga Marathon), dan tetapkan harga tiket.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-brand gap-1">
              <span>Mulai Buat Event</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Active Managed Events List */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-espresso">Event yang Sedang Berjalan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.slice(0, 4).map((event) => {
            let eventQuota = 0;
            let eventSold = 0;
            event.categories.forEach((c) => {
              eventQuota += c.quota;
              eventSold += Math.max(0, c.quota - c.availableQuota);
            });

            return (
              <div
                key={event.id}
                className="bg-white rounded-card p-5 border border-sand-border shadow-warm space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand border border-brand/20">
                      {event.status === "published" ? "Publik" : "Draft"}
                    </span>
                    <h3 className="text-base font-black text-espresso mt-1">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-espresso-secondary mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-espresso-muted" />
                        {formatDateIndonesian(event.eventDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-espresso-muted" />
                        {event.locationCity}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-sand-warm rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-espresso-muted text-[11px]">Tiket Terjual:</span>
                    <p className="font-bold text-espresso">{eventSold} / {eventQuota} Slot</p>
                  </div>
                  <div className="text-right">
                    <span className="text-espresso-muted text-[11px]">Kategori:</span>
                    <p className="font-bold text-brand">{event.categories.map((c) => c.name).join(", ")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link
                    href={`/organizer/events/${event.id}/participants`}
                    className="flex-1 py-2 text-center text-xs font-bold rounded-btn bg-brand-50 hover:bg-brand-100 text-brand border border-brand/20 transition-colors"
                  >
                    Daftar Peserta
                  </Link>
                  <Link
                    href={`/organizer/check-in`}
                    className="flex-1 py-2 text-center text-xs font-bold rounded-btn bg-brand hover:bg-brand-800 text-white shadow-warm transition-colors"
                  >
                    Buka Gate
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
