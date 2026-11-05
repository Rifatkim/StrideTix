"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ETicket } from "@/types";

const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  { ssr: false }
);
import {
  Calendar,
  Clock,
  MapPin,
  Printer,
  ShieldCheck,
  Ticket,
  Download,
  Loader2,
} from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";

interface ETicketCardProps {
  ticket: ETicket;
}

export function ETicketCard({ ticket }: ETicketCardProps) {
  const isCheckedIn = ticket.status === "checked_in";
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const formattedDate = new Date(ticket.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Nomor dada (BIB) mengikuti 4 digit belakang kode tiket / QRIS
  const bibNumber = ticket.ticketCode
    ? ticket.ticketCode.split("-").pop() || ticket.ticketCode.slice(-4)
    : "0000";

  const handleDownloadPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const fileName = `StrideTix-Pass-${ticket.ticketCode}.pdf`;
      const { downloadTicketPDF } = await import("@/utils/ticketPdf");
      await downloadTicketPDF(ticket, fileName);
    } catch (err) {
      console.error("Gagal men-generate PDF:", err);
      // Fallback to browser print if PDF generation encounters error
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 sm:space-y-6">
      {/* Action bar atas: Minimalis dan bersih */}
      <div className="flex items-center justify-between gap-3 text-xs no-print">
        <Link
          href="/"
          className="font-bold text-espresso-secondary hover:text-brand transition-colors flex items-center gap-1.5"
        >
          ← Beranda
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="px-3 py-1.5 rounded-btn bg-white hover:bg-surface-soft border border-sand-border text-espresso font-semibold flex items-center gap-1.5 shadow-2xs text-xs"
          title="Cetak langsung menggunakan printer fisik"
        >
          <Printer className="w-3.5 h-3.5 text-espresso-secondary" />
          <span>Cetak</span>
        </button>
      </div>

      {/* Main E-Ticket Ticket Body with Cutout Notches */}
      <div
        ref={ticketRef}
        className="ticket-print-target relative bg-white rounded-ticket border border-sand-border shadow-warm-modal overflow-hidden"
      >
        {/* Header E-Ticket: Tipografi proporsional dan minimalis */}
        <div className="bg-espresso px-4 py-3 sm:px-6 sm:py-3.5 text-white flex items-center justify-between gap-3 border-b border-espresso">
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <StrideTixSymbol size={20} color="#F97316" className="shrink-0" />
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-sm sm:text-base text-white whitespace-nowrap">
                Stride<span className="text-brand">Tix</span>
              </span>
              <span className="text-stone-500 font-light text-xs">|</span>
              <span className="text-[11px] font-semibold tracking-wide text-stone-300/80 whitespace-nowrap">
                Race Pass
              </span>
            </div>
          </div>

          {/* Hanya status jika sudah check-in */}
          {isCheckedIn && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-ai text-white shadow-2xs whitespace-nowrap leading-none shrink-0">
              <ShieldCheck className="w-3 h-3" />
              <span>Sudah Check-in</span>
            </span>
          )}
        </div>

        {/* Top Segment: Judul Event & Kategori (Tidak Ada Teks Terpotong) */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 bg-white">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5 flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-wider text-brand block leading-tight">
                Race Series 2026
              </span>
              {/* Judul Event: Ukuran font disesuaikan dan break-words agar tidak terpotong */}
              <h2 className="text-base sm:text-lg font-black text-espresso tracking-tight leading-snug break-words">
                {ticket.eventTitle}
              </h2>
            </div>

            {/* Badge Kategori: Proporsional & Rapi */}
            <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-brand text-white shadow-xs text-center shrink-0">
              <span className="text-[8px] uppercase font-bold text-white/80 block leading-tight">
                Kategori
              </span>
              <span className="text-xs sm:text-sm font-black tracking-wider leading-none">
                {ticket.categoryName}
              </span>
            </div>
          </div>

          {/* Grid Jadwal & Lokasi: Rapi, hirarki jelas, alamat lengkap tanpa terpotong */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-xs bg-surface-main/80 p-3 rounded-xl border border-sand-border/80">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brand-50 text-brand flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] uppercase font-bold text-espresso-muted block leading-none mb-0.5">
                  Tanggal Lomba
                </span>
                <span className="font-bold text-espresso text-[11px] sm:text-xs block leading-tight">
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-brand-50 text-brand flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] uppercase font-bold text-espresso-muted block leading-none mb-0.5">
                  Waktu Flag-off
                </span>
                <span className="font-bold text-espresso text-[11px] sm:text-xs block leading-tight">
                  {ticket.startTime}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:col-span-1">
              <div className="w-6 h-6 rounded-md bg-brand-50 text-brand flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] uppercase font-bold text-espresso-muted block leading-none mb-0.5">
                  Lokasi & Kota
                </span>
                <span className="font-bold text-espresso text-[11px] sm:text-xs block leading-tight break-words">
                  {ticket.venue}, {ticket.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Garis Pembatas Tiket dengan Lubang Notches */}
        <div className="relative flex items-center bg-white my-0 py-1.5">
          <div className="absolute -left-3 w-6 h-6 rounded-full bg-sand-warm border border-sand-border" />
          <div className="w-full border-t border-dashed border-sand-border mx-5" />
          <div className="absolute -right-3 w-6 h-6 rounded-full bg-sand-warm border border-sand-border" />
        </div>

        {/* Bottom Segment: Data Pelari & QR Code */}
        <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-white">
          {/* Kolom Kiri: Nomor BIB & Identitas Pelari */}
          <div className="sm:col-span-7 space-y-3.5">
            {/* Kartu Nomor Dada (BIB) Terstruktur & Proporsional */}
            <div className="bg-brand-50/60 p-2.5 sm:p-3 rounded-xl border border-brand/20">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span className="text-[8.5px] uppercase font-extrabold tracking-wider text-brand block mb-0.5">
                    Nomor Dada (BIB)
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-brand tracking-widest font-mono block leading-none">
                    {bibNumber}
                  </span>
                </div>
                {ticket.bibName && (
                  <div className="text-right">
                    <span className="text-[8.5px] uppercase font-bold tracking-wider text-espresso-muted block mb-0.5">
                      Nama di BIB
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-espresso font-mono uppercase block leading-none">
                      {ticket.bibName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Nama Peserta */}
            <div className="space-y-0.5">
              <span className="text-[8.5px] uppercase font-bold tracking-wider text-espresso-muted block">
                Nama Peserta
              </span>
              <span className="text-xs sm:text-sm font-bold text-espresso block">
                {ticket.participantName}
              </span>
              <span className="text-[11px] text-espresso-muted block">
                {ticket.participantEmail}
              </span>
            </div>

            {/* Kode Validasi E-Ticket */}
            <div>
              <span className="text-[8.5px] uppercase font-bold tracking-wider text-espresso-muted block mb-1">
                Kode Validasi E-Ticket
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-espresso text-white shadow-2xs">
                <Ticket className="w-3 h-3 text-brand shrink-0" />
                <span className="text-[11px] font-mono font-bold tracking-wider">
                  {ticket.ticketCode}
                </span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: QR Code Visual + Tombol Unduh Tepat di Bawah QR */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 sm:p-3.5 bg-sand-warm/60 rounded-xl border border-sand-border/80 text-center space-y-2">
            <div className="p-2 bg-white rounded-lg shadow-2xs border border-sand-border">
              <QRCodeSVG
                value={ticket.qrPayload}
                size={120}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-black text-espresso uppercase tracking-wider block leading-tight">
                Pindai di Gate Check-in
              </span>
              <span className="text-[8px] text-espresso-muted block leading-tight">
                Tunjukkan ke Panitia Lomba
              </span>
            </div>

            {/* Tombol Unduh E-Ticket (PDF) Tepat di Bawah QR Code */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPDF}
              className="w-full py-2 px-3 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-warm transition-all disabled:opacity-60 no-print group"
              title="Unduh e-ticket resmi dalam format PDF"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Membuat PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Unduh E-Ticket (PDF)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer info note */}
        <div className="bg-sand-warm/80 px-4 py-2.5 sm:px-6 sm:py-3 border-t border-sand-border flex flex-col sm:flex-row items-center justify-between gap-1 text-[9px] sm:text-[10px] text-espresso-secondary">
          <span className="font-semibold text-center sm:text-left">
            Tunjukkan QR Code ini pada saat pengambilan Race Pack (RPC) atau di Gate masuk pada hari-H.
          </span>
          <span className="font-mono text-espresso-muted shrink-0">
            Order: {ticket.orderId}
          </span>
        </div>
      </div>
    </div>
  );
}
