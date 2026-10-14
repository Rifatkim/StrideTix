"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StravaSimulatorBar } from "@/components/strava/StravaSimulatorBar";
import { OrganizerStatCards } from "@/components/organizer/OrganizerStatCards";
import { ManagedEventsList } from "@/components/organizer/ManagedEventsList";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { getEvents } from "@/services/eventService";
import { getAllUserTickets } from "@/services/ticketService";
import { RunningEvent, ETicket } from "@/types";
import {
  Calendar,
  PlusCircle,
  Building2,
  CheckCircle2,
  QrCode,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export default function OrganizerDashboardPage() {
  const { currentUser, role } = useAuth();
  const [events, setEvents] = useState<RunningEvent[]>([]);
  const [tickets, setTickets] = useState<ETicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [allEvents, allTickets] = await Promise.all([
        getEvents(),
        getAllUserTickets(),
      ]);
      setEvents(allEvents);
      setTickets(allTickets);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <StravaSimulatorBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AuthGuard allowedRole="organizer">
        {/* Top Header Banner */}
        <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-card bg-brand-50 text-brand border border-brand/20 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-espresso">
                  {currentUser?.organizerName || "Danamon Run Management"}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand border border-brand/20 uppercase tracking-wider">
                  Event Organizer
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-success/15 text-accent-success border border-accent-success/30">
                  <CheckCircle2 className="w-3 h-3" />
                  Terverifikasi
                </span>
              </div>
              <p className="text-xs text-espresso-secondary mt-1">
                Kelola penjualan tiket, kuota kategori lari, pantau registrasi peserta, dan buka terminal check-in gate.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/organizer/check-in"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-espresso font-bold text-xs hover:border-brand transition-colors"
            >
              <QrCode className="w-4 h-4 text-brand" />
              <span>Buka Gate Check-in</span>
            </Link>

            <Link
              href="/organizer/events/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Event Lari</span>
            </Link>
          </div>
        </div>

        {/* Analytics Stat Cards */}
        <OrganizerStatCards events={events} allTickets={tickets} />

        {/* Managed Events Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-espresso">Daftar Event Dikelola</h2>
              <p className="text-xs text-espresso-secondary">
                Pilih event untuk mengelola peserta atau memantau progres kuota pendaftaran.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-espresso-muted">
              Memuat data event organizer...
            </div>
          ) : (
            <ManagedEventsList events={events} />
          )}
        </div>
        </AuthGuard>
      </main>

      <Footer />
    </div>
  );
}
