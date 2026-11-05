"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { OrganizerStatCards } from "@/components/organizer/OrganizerStatCards";
import { ManagedEventsList } from "@/components/organizer/ManagedEventsList";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { getOrganizerEvents } from "@/services/eventService";
import { getAllUserTickets } from "@/services/ticketService";
import { RunningEvent, ETicket } from "@/types";
import { Container } from "@/components/layout/Container";
import { PlusCircle, CheckCircle2, QrCode } from "lucide-react";

export default function OrganizerDashboardPage() {
  const { currentUser, role } = useAuth();
  const [events, setEvents] = useState<RunningEvent[]>([]);
  const [tickets, setTickets] = useState<ETicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser?.id) return;
      const [allEvents, allTickets] = await Promise.all([
        getOrganizerEvents(currentUser.id),
        getAllUserTickets(),
      ]);
      setEvents(allEvents);
      setTickets(allTickets);
      setIsLoading(false);
    }
    if (currentUser?.id) {
      loadData();
    }
  }, [currentUser?.id]);

  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />

      <Container as="main" className="flex-1 pt-6 pb-28 sm:pt-8 sm:pb-12 space-y-8">
        <AuthGuard allowedRole="organizer">
          {/* Top Header Banner */}
          <div className="bg-white rounded-card border border-sand-border p-4 sm:p-6 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-black text-espresso tracking-tight">
                  {currentUser?.organizerName || "Danamon Run Management"}
                </h1>
                <span title="Terverifikasi" className="inline-flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /></span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-50 text-brand border border-brand/20 uppercase tracking-wider">
                  EO
                </span>
              </div>
              <p className="text-xs text-espresso-secondary leading-relaxed">
                Kelola penjualan tiket, kuota kategori lari, pantau registrasi peserta, dan buka terminal check-in gate.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap pt-1 sm:pt-0">
              <Link
                href="/organizer/check-in"
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-btn bg-sand-warm border border-sand-border text-espresso font-bold text-[11px] sm:text-xs hover:border-brand transition-colors whitespace-nowrap active:scale-95 shadow-2xs"
              >
                <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand shrink-0" />
                <span className="whitespace-nowrap">Buka Gate Check-in</span>
              </Link>

              <Link
                href="/organizer/events/new"
                className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-btn bg-brand text-white font-bold text-[11px] sm:text-xs shadow-warm hover:bg-brand-800 transition-colors whitespace-nowrap active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="whitespace-nowrap">Buat</span>
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
              <ManagedEventsList
                events={events}
                onEventUpdated={(updated) =>
                  setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)))
                }
                onEventDeleted={(deletedId) =>
                  setEvents((prev) => prev.filter((e) => e.id !== deletedId))
                }
              />
            )}
          </div>
        </AuthGuard>
      </Container>

      <Footer />
    </div>
  );
}
