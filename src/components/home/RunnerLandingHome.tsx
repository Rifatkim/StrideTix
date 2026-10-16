"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RunningEvent, ETicket } from "@/types";
import { RunnerHomeBanner } from "./RunnerHomeBanner";
import { EventDiscoverySection } from "./EventDiscoverySection";
import { getAllUserTickets } from "@/services/ticketService";
import { formatDateIndonesian } from "@/lib/utils";
import {
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface RunnerLandingHomeProps {
  events: RunningEvent[];
}

export function RunnerLandingHome({ events }: RunnerLandingHomeProps) {
  const [tickets, setTickets] = useState<ETicket[]>([]);

  useEffect(() => {
    async function loadTickets() {
      const allTickets = await getAllUserTickets();
      setTickets(allTickets);
    }
    loadTickets();
  }, []);

  const upcomingTicket = tickets[0];

  return (
    <div className="space-y-8">
      {/* 1. Personalized Runner Banner */}
      <RunnerHomeBanner />

      {/* 2. Upcoming Active Race Card (If runner has tickets) */}
      {upcomingTicket && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-900 to-espresso text-white rounded-card p-6 shadow-warm border border-brand/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-accent-strava" />
                  <span>Race Mendatang Anda</span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    {upcomingTicket.eventTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 mt-1">
                    <span className="flex items-center gap-1.5 font-semibold text-accent-strava">
                      <Ticket className="w-3.5 h-3.5" />
                      Kategori {upcomingTicket.categoryName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDateIndonesian(upcomingTicket.eventDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {upcomingTicket.venue}, {upcomingTicket.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/tickets/${upcomingTicket.ticketCode}`}
                  className="px-5 py-3 rounded-btn bg-brand text-white font-bold text-xs sm:text-sm shadow-warm hover:bg-brand-800 transition-all flex items-center gap-2 active:scale-95"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Lihat E-Ticket QR</span>
                </Link>

                <Link
                  href="/dashboard?tab=tickets"
                  className="px-4 py-3 rounded-btn bg-white/10 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <span>Semua Tiket ({tickets.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Personalized Event Discovery Section */}
      <EventDiscoverySection initialEvents={events} />
    </div>
  );
}
