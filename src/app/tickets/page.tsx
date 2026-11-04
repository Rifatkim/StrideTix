"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Container } from "@/components/layout/Container";
import { MyTicketsTab } from "@/components/dashboard/MyTicketsTab";
import { getAllUserTickets } from "@/services/ticketService";
import { ETicket } from "@/types";
import { Ticket, Compass, Loader2, Sparkles, ShieldCheck } from "lucide-react";

function TicketsContent() {
  const [tickets, setTickets] = useState<ETicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      const data = await getAllUserTickets();
      setTickets(data);
      setIsLoading(false);
    }
    loadTickets();
  }, []);

  const activeTicketsCount = tickets.filter(
    (t) => t.status === "paid" || t.status === "issued"
  ).length;

  return (
    <Container as="main" className="flex-1 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-32 md:pb-12">
      <AuthGuard allowedRole="runner">
        {/* Dedicated Header for Tiket Saya */}
        <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-50 text-brand border border-brand/20">
                  <Ticket className="w-3 h-3" />
                  Bagian Khusus Tiket
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  QR Validated Ready
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-espresso tracking-tight">
                Tiket Lomba Saya
              </h1>
              <p className="text-xs sm:text-sm text-espresso-secondary leading-relaxed">
                Kelola tiket perlombaan lari yang terdaftar, akses kode QR dinamis untuk penukaran Race Pack, dan gunakan tiket resmi saat verifikasi di Start Gate.
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              <Link
                href="/smart-ai"
                className="px-4 py-2.5 rounded-btn bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Smart Distance AI →</span>
              </Link>
              <Link
                href="/"
                className="px-4 py-2.5 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-all flex items-center gap-2 active:scale-95"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Cari Event Lari Baru</span>
              </Link>
            </div>
          </div>

          {/* Ticket Stats Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-sand-border">
            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80">
              <span className="text-[11px] font-medium text-espresso-secondary block mb-1">
                Total Tiket
              </span>
              <div className="text-2xl font-black text-espresso">
                {isLoading ? "-" : tickets.length}
              </div>
              <span className="text-[10px] text-espresso-muted">Lomba terdaftar</span>
            </div>

            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80">
              <span className="text-[11px] font-medium text-espresso-secondary block mb-1">
                Tiket Aktif Mendatang
              </span>
              <div className="text-2xl font-black text-brand">
                {isLoading ? "-" : activeTicketsCount}
              </div>
              <span className="text-[10px] text-espresso-muted">Siap Race Day</span>
            </div>

            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-espresso-secondary block mb-1">
                Status Check-in
              </span>
              <div className="text-2xl font-black text-emerald-600">
                {isLoading ? "-" : tickets.filter((t) => t.status === "checked_in").length}
              </div>
              <span className="text-[10px] text-espresso-muted">Telah hadir / selesai</span>
            </div>
          </div>
        </div>

        {/* Dedicated Tickets Content Pane */}
        <div className="animate-in fade-in duration-200">
          <MyTicketsTab />
        </div>
      </AuthGuard>
    </Container>
  );
}

export default function MyTicketsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        }
      >
        <TicketsContent />
      </Suspense>
      <Footer />
    </div>
  );
}
