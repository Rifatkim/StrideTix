"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RunningEvent, ETicket, OrganizerApplication, AuditLogEntry } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { getOrganizerApplications, getStoredAuditLogs } from "@/services/adminService";
import { getEvents } from "@/services/eventService";
import { getAllUserTickets } from "@/services/ticketService";
import { formatRupiah, formatDateIndonesian } from "@/lib/utils";
import {
  Shield,
  Building2,
  CalendarCheck,
  Receipt,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  LayoutDashboard,
} from "lucide-react";

interface AdminLandingHomeProps {
  events: RunningEvent[];
}

export function AdminLandingHome({ events: initialEvents }: AdminLandingHomeProps) {
  const { currentUser } = useAuth();
  const [organizers, setOrganizers] = useState<OrganizerApplication[]>([]);
  const [events, setEvents] = useState<RunningEvent[]>(initialEvents);
  const [tickets, setTickets] = useState<ETicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    async function loadData() {
      const [orgs, evts, tix] = await Promise.all([
        getOrganizerApplications(),
        getEvents(),
        getAllUserTickets(),
      ]);
      setOrganizers(orgs);
      setEvents(evts);
      setTickets(tix);
      setAuditLogs(getStoredAuditLogs());
    }
    loadData();
  }, []);

  const pendingOrganizers = organizers.filter((o) => o.status === "pending");
  const pendingEvents = events.filter((e) => e.status !== "published");
  const verifiedOrganizers = organizers.filter((o) => o.status === "verified");

  let totalPlatformVolume = 0;
  events.forEach((ev) => {
    ev.categories.forEach((cat) => {
      const sold = Math.max(0, cat.quota - cat.availableQuota);
      totalPlatformVolume += sold * cat.price;
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Super Admin Welcome Banner */}
      <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-card bg-accent-info/10 text-accent-info border border-accent-info/20 flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-espresso">
                Platform Governance & Control
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-info/10 text-accent-info border border-accent-info/20 uppercase tracking-wider">
                Super Admin
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                Sistem Aktif & Terlindungi
              </span>
            </div>
            <p className="text-xs sm:text-sm text-espresso-secondary max-w-2xl leading-relaxed">
              Halo, {currentUser?.name || "Super Admin"}! Pantau integritas platform StrideTix, verifikasi penyelenggara lomba, lakukan moderasi event, dan audit transaksi tiket peserta.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/admin/dashboard"
            className="px-4 py-2.5 rounded-btn bg-accent-info text-white font-bold text-xs sm:text-sm shadow-warm hover:bg-blue-800 transition-all flex items-center gap-2 active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Admin Penuh</span>
          </Link>
        </div>
      </div>

      {/* 2. Platform KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-secondary">Pending Verif EO</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-accent-strava flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-espresso">{pendingOrganizers.length}</div>
          <p className="text-[11px] text-accent-strava font-semibold">
            {pendingOrganizers.length > 0 ? "Butuh tindakan persetujuan" : "Semua EO terverifikasi"}
          </p>
        </div>

        <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-secondary">Event Butuh Moderasi</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-espresso">{pendingEvents.length}</div>
          <p className="text-[11px] text-purple-700 font-semibold">
            {pendingEvents.length > 0 ? "Menunggu persetujuan rilis" : "Semua event sudah rilis"}
          </p>
        </div>

        <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-secondary">Total Volume Transaksi</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-espresso">{formatRupiah(totalPlatformVolume)}</div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            Dari {tickets.length} transaksi tiket
          </p>
        </div>

        <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-espresso-secondary">EO Terverifikasi</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-espresso">{verifiedOrganizers.length}</div>
          <p className="text-[11px] text-espresso-muted">
            Penyelenggara aktif di platform
          </p>
        </div>
      </div>

      {/* 3. Governance Core Action Tiles */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-espresso">Modul Tata Kelola Utama</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/organizers"
            className="bg-white rounded-card p-5 border border-sand-border hover:border-brand shadow-warm hover:shadow-warm-lg transition-all group active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand border border-brand/20 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-espresso group-hover:text-brand transition-colors">
                  Verifikasi Penyelenggara Lomba (EO)
                </h3>
                <p className="text-xs text-espresso-secondary mt-1">
                  Tinjau portofolio penyelenggara, keabsahan dokumen legalitas (NIB / SK PASI), serta setujui atau tolak izin tayang event.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-brand gap-1">
              <span>Buka Verifikasi EO ({pendingOrganizers.length} antrean)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/events"
            className="bg-white rounded-card p-5 border border-sand-border hover:border-purple-600 shadow-warm hover:shadow-warm-lg transition-all group active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-espresso group-hover:text-purple-700 transition-colors">
                  Moderasi & Rilis Event Lomba
                </h3>
                <p className="text-xs text-espresso-secondary mt-1">
                  Periksa batas kuota per kategori, kelayakan rute jalan raya, dan terbitkan event ke katalog publik.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-purple-700 gap-1">
              <span>Buka Moderasi Event ({pendingEvents.length} draft)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/transactions"
            className="bg-white rounded-card p-5 border border-sand-border hover:border-emerald-600 shadow-warm hover:shadow-warm-lg transition-all group active:scale-[0.99] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-espresso group-hover:text-emerald-700 transition-colors">
                  Pengawasan Transaksi & Log Audit
                </h3>
                <p className="text-xs text-espresso-secondary mt-1">
                  Pantau alur transaksi tiket masuk peserta, pelacakan kode unik anti-calo, dan riwayat aktivitas administratif sistem.
                </p>
              </div>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-emerald-700 gap-1">
              <span>Buka Audit & Log Transaksi</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* 4. Attention Alerts / Pending Submissions Preview */}
      {pendingOrganizers.length > 0 && (
        <div className="bg-amber-50/80 rounded-card border border-amber-200 p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Permohonan Penyelenggara Baru Menunggu Verifikasi Segera</span>
          </div>
          <div className="space-y-2">
            {pendingOrganizers.map((po) => (
              <div
                key={po.id}
                className="bg-white rounded-xl p-3 border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-espresso">{po.name}</span>
                  <p className="text-espresso-muted text-[11px]">{po.city} • Dokumen: {po.documentType}</p>
                </div>
                <Link
                  href="/admin/organizers"
                  className="px-3 py-1.5 rounded-btn bg-brand text-white font-bold text-xs hover:bg-brand-800 transition-colors self-start sm:self-auto"
                >
                  Tinjau Permohonan
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
