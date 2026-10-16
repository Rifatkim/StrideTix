"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCards } from "@/components/admin/AdminStatCards";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getOrganizerApplications, getStoredAuditLogs } from "@/services/adminService";
import { getEvents } from "@/services/eventService";
import { getAllUserTickets } from "@/services/ticketService";
import { OrganizerApplication, RunningEvent, ETicket, AuditLogEntry } from "@/types";
import { formatDateIndonesian } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  Calendar,
  ArrowRight,
  Clock,
  UserCheck,
  Activity,
  CheckCircle2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [organizers, setOrganizers] = useState<OrganizerApplication[]>([]);
  const [events, setEvents] = useState<RunningEvent[]>([]);
  const [tickets, setTickets] = useState<ETicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    }
    loadData();
  }, []);

  const pendingOrganizers = organizers.filter((o) => o.status === "pending");
  const pendingEvents = events.filter((e) => e.status !== "published");
  const verifiedOrganizers = organizers.filter((o) => o.status === "verified");

  let totalRevenue = 0;
  events.forEach((ev) => {
    ev.categories.forEach((cat) => {
      const sold = Math.max(0, cat.quota - cat.availableQuota);
      totalRevenue += sold * cat.price;
    });
  });

  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-28 sm:pt-8 sm:pb-12 space-y-8">
        <AuthGuard allowedRole="admin">
        <AdminHeader
          title="Platform Governance & Control"
          subtitle="Pantau indikator performa platform, verifikasi permohonan penyelenggara lomba, dan kendalikan penerbitan event."
        />

        {/* Top KPIs */}
        <AdminStatCards
          totalOrganizers={verifiedOrganizers.length}
          totalEvents={events.filter((e) => e.status === "published").length}
          totalRevenue={totalRevenue}
          pendingOrganizers={pendingOrganizers.length}
          pendingEvents={pendingEvents.length}
        />

        {/* Dual Panels: Pending Approvals & Live Audit Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel 1: Pending Organizer Verifications */}
          <div className="bg-white rounded-card border border-sand-border p-5 shadow-warm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand" />
                <h2 className="text-sm font-bold text-espresso">
                  Permohonan EO Menunggu Verifikasi ({pendingOrganizers.length})
                </h2>
              </div>
              <Link
                href="/admin/organizers"
                className="text-xs text-brand hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {pendingOrganizers.length === 0 ? (
              <div className="py-8 text-center text-xs text-espresso-muted">
                <CheckCircle2 className="w-8 h-8 text-accent-success mx-auto mb-2 opacity-80" />
                Tidak ada permohonan EO yang tertunda. Semua penyelenggara telah tertinjau.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOrganizers.slice(0, 3).map((org) => (
                  <div
                    key={org.id}
                    className="p-3.5 rounded bg-sand-warm/60 border border-sand-border flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-xs text-espresso">{org.name}</div>
                      <div className="text-[11px] text-espresso-secondary">
                        PIC: {org.picName} • {org.city}
                      </div>
                      <div className="text-[10px] text-espresso-muted mt-0.5">
                        Dokumen: {org.documentType}
                      </div>
                    </div>
                    <Link
                      href="/admin/organizers"
                      className="px-3 py-1.5 rounded-btn bg-brand text-white font-bold text-[11px] hover:bg-brand-800 transition-colors shrink-0"
                    >
                      Tinjau
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panel 2: Live Governance Audit Trail */}
          <div className="bg-white rounded-card border border-sand-border p-5 shadow-warm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sand-border">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-espresso">
                  Log Audit & Aktivitas Terakhir
                </h2>
              </div>
              <Link
                href="/admin/transactions"
                className="text-xs text-brand hover:underline font-bold inline-flex items-center gap-1"
              >
                <span>Log Lengkap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded bg-sand-warm/40 border border-sand-border text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-espresso">{log.action}</span>
                    <span className="text-[10px] text-espresso-muted">
                      {new Date(log.timestamp).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </span>
                  </div>
                  <p className="text-[11px] text-espresso-secondary">{log.details}</p>
                  <div className="text-[10px] text-espresso-muted flex items-center gap-2 pt-0.5">
                    <span>Oleh: {log.actor}</span>
                    <span>•</span>
                    <span>Target: {log.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </AuthGuard>
      </main>

      <Footer />
    </div>
  );
}
