"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { RunningEvent, ETicket } from "@/types";
import { RunnerHomeBanner } from "./RunnerHomeBanner";
import { EventDiscoverySection } from "./EventDiscoverySection";
import { Container } from "@/components/layout/Container";
import { getAllUserTickets } from "@/services/ticketService";
import { formatDateIndonesian } from "@/lib/utils";
import {
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  ArrowRight,
  Sparkles,
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
    <div className="space-y-8 sm:space-y-10">
      {/* 1. Personalized Runner Banner & Statistic Cards */}
      <RunnerHomeBanner />

      {/* 2. Upcoming Active Race Card: Mengisi Seluruh Lebar Container */}
      {upcomingTicket && (
        <section aria-label="Upcoming Registered Race">
          <Container>
            <div className="bg-[#1C140E] bg-gradient-to-r from-[#431B0C] via-[#2B1408] to-[#1C140E] text-white rounded-card p-6 sm:p-7 lg:p-8 shadow-warm border border-brand/40 relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Bagian Kiri: Info Race, Kategori, Tanggal, Lokasi */}
                <div className="space-y-3 lg:max-w-3xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20 backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5 text-accent-strava" />
                    <span>Race Mendatang Anda</span>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-snug">
                      {upcomingTicket.eventTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/85 mt-2">
                      <span className="flex items-center gap-1.5 font-bold text-accent-strava bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                        <Ticket className="w-3.5 h-3.5" />
                        Kategori {upcomingTicket.categoryName}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-brand-300" />
                        {formatDateIndonesian(upcomingTicket.eventDate)}
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-brand-300" />
                        {upcomingTicket.venue}, {upcomingTicket.city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bagian Kanan: Aksi E-Ticket & Semua Tiket */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 pt-2 lg:pt-0">
                  <Link
                    href={`/tickets/${upcomingTicket.ticketCode}`}
                    className="px-6 py-3.5 rounded-btn bg-brand text-white font-bold text-xs sm:text-sm shadow-warm hover:bg-brand-800 transition-all flex items-center justify-center gap-2 active:scale-95 hover:shadow-warm-hover"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Lihat E-Ticket QR</span>
                  </Link>

                  <Link
                    href="/dashboard?tab=tickets"
                    className="px-5 py-3.5 rounded-btn bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Semua Tiket ({tickets.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 3. Marketplace Event Discovery Section */}
      <EventDiscoverySection initialEvents={events} />
    </div>
  );
}
