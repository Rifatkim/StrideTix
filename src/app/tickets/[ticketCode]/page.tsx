"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getTicketByCode } from "@/services/ticketService";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ETicketCard } from "@/components/tickets/ETicketCard";
import { ETicket } from "@/types";
import { TicketX, ArrowLeft, Loader2, Lock, LogIn } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { useAuth } from "@/context/AuthContext";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketCode = params?.ticketCode as string;
  const { currentUser } = useAuth();

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
        ) : !currentUser ? (
          /* Guest Unauthenticated View (TC-RUN-02) */
          <div className="max-w-md mx-auto bg-white rounded-modal p-8 text-center border border-sand-border shadow-warm-modal space-y-5 my-12">
            <div className="w-14 h-14 rounded-full bg-brand-50 text-brand flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand bg-brand-50 px-2.5 py-0.5 rounded-full">
                Privasi & Keamanan E-Ticket
              </span>
              <h2 className="text-xl font-black text-espresso mt-2">
                Autentikasi Diperlukan
              </h2>
              <p className="text-xs text-espresso-secondary">
                Untuk melindungi data privasi pelari dan nomor BIB, e-ticket hanya dapat dilihat oleh pemilik akun yang sah.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href={`/login?redirect=/tickets/${ticketCode}`}
                className="w-full py-2.5 px-4 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk untuk Melihat E-Ticket</span>
              </Link>

              <Link
                href="/register"
                className="w-full py-2.5 px-4 rounded-btn bg-sand-warm border border-sand-border text-espresso font-semibold text-xs hover:border-brand transition-colors flex items-center justify-center gap-2"
              >
                <span>Daftar Akun Baru</span>
              </Link>
            </div>

            <div className="pt-2 border-t border-sand-border">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-espresso-muted hover:text-espresso font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Authenticated but Not Found / Unauthorized View */
          <div className="max-w-md mx-auto bg-white rounded-card p-10 text-center border border-sand-border shadow-warm space-y-4 my-12">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <TicketX className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-espresso">
              Tiket Tidak Ditemukan
            </h2>
            <p className="text-xs text-espresso-secondary">
              Kode tiket <code className="bg-sand-warm px-1.5 py-0.5 rounded font-mono font-bold text-espresso">{ticketCode}</code> tidak terdaftar dalam database atau akun Anda tidak memiliki hak akses atas tiket ini.
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
