"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTicketByCode } from "@/services/ticketService";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ETicketCard } from "@/components/tickets/ETicketCard";
import { ETicket } from "@/types";
import { TicketX, ArrowLeft, Loader2 } from "lucide-react";
import { Container } from "@/components/layout/Container";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketCode = params?.ticketCode as string;

  const [ticket, setTicket] = useState<ETicket | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTicket() {
      if (!ticketCode) return;
      const found = await getTicketByCode(ticketCode);
      setTicket(found);
      setIsLoading(false);
    }
    loadTicket();
  }, [ticketCode]);

  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />

      <Container as="main" className="flex-1 pt-6 pb-28 sm:pt-8 sm:pb-12">
        {isLoading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-2 text-xs text-espresso-muted">
            <Loader2 className="w-6 h-6 animate-spin text-brand" />
            <span>Memverifikasi kode tiket...</span>
          </div>
        ) : ticket ? (
          <ETicketCard ticket={ticket} />
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-card p-10 text-center border border-sand-border shadow-warm space-y-4 my-12">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <TicketX className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-espresso">
              Tiket Tidak Ditemukan
            </h2>
            <p className="text-xs text-espresso-secondary">
              Kode tiket <code>{ticketCode}</code> tidak terdaftar dalam sistem lokal.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-brand text-white font-semibold text-xs shadow-sm hover:bg-brand-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        )}
      </Container>

      <Footer />
    </div>
  );
}
