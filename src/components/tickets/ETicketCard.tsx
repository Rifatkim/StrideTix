"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ETicket } from "@/types";
import { downloadTicketPDF } from "@/utils/ticketPdf";

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
  User,
  ExternalLink,
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

  const handleDownloadPDF = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const fileName = `StrideTix-Pass-${ticket.ticketCode}.pdf`;
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Action header bar */}
      <div className="flex items-center justify-between gap-3 text-xs no-print">
        <Link
          href="/"
          className="font-bold text-espresso-secondary hover:text-brand transition-colors"
        >
          ← Beranda
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPDF}
            className="px-4 py-2 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold flex items-center gap-1.5 shadow-warm transition-all disabled:opacity-60"
            title="Unduh e-ticket resmi dalam format dokumen PDF beresolusi tinggi"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isExporting ? "Membuat PDF..." : "Unduh E-Ticket (PDF)"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 rounded-btn bg-white hover:bg-surface-soft border border-sand-border text-espresso font-semibold flex items-center gap-1.5 shadow-sm"
            title="Cetak langsung menggunakan printer fisik"
          >
            <Printer className="w-3.5 h-3.5 text-espresso-secondary" />
            <span className="hidden sm:inline">Cetak</span>
          </button>
        </div>
      </div>

      {/* Main E-Ticket Ticket Body with Cutout Notches */}
      <div
        ref={ticketRef}
        className="ticket-print-target relative bg-white rounded-ticket border border-sand-border shadow-warm-modal overflow-hidden"
      >
        {/* Decorative Top Accent Header */}
        <div className="bg-espresso px-6 py-4 text-white flex items-center justify-between border-b border-espresso">
          <div className="flex items-center gap-3">
            <StrideTixSymbol size={24} color="#F97316" className="shrink-0" />
            <div className="flex items-baseline gap-2">
              <span className="font-black tracking-tight text-lg text-white">
                Stride<span className="text-brand">Tix</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-warm-white/70">
                Official Race Pass
              </span>
            </div>
          </div>

          {/* Status Badge per DESIGN.md Section 9.7 */}
          {isCheckedIn ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-accent-ai text-white shadow-xs flex items-center gap-1.5 leading-none">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sudah Check-in</span>
            </span>
          ) : (
            <span className="px-3.5 py-1.5 rounded-full text-[11px] font-bold bg-accent-success text-white shadow-xs flex items-center gap-1.5 leading-none">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tiket Resmi • Issued</span>
            </span>
          )}
        </div>

        {/* Top Segment: Event Details */}
        <div className="p-6 sm:p-7 space-y-4 bg-white">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] uppercase font-black tracking-widest text-brand block">
                Race Series 2026
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-espresso tracking-tight truncate">
                {ticket.eventTitle}
              </h2>
            </div>

            {/* Category Distance Badge: Polished, pill badge with fixed alignment */}
            <div className="shrink-0">
              <div className="px-4 py-2 rounded-xl bg-brand text-white shadow-xs text-center border border-brand-600/30">
                <span className="text-[9px] uppercase font-bold text-white/80 block leading-tight">
                  Kategori
                </span>
                <span className="text-base font-black tracking-wide leading-none">
                  {ticket.categoryName}
                </span>
              </div>
            </div>
          </div>

          {/* Event Schedule & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-surface-main/90 p-3.5 rounded-xl border border-sand-border">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-espresso-muted block leading-tight">Tanggal Lomba</span>
                <span className="font-bold text-espresso truncate block">{formattedDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-espresso-muted block leading-tight">Waktu Flag-off</span>
                <span className="font-bold text-espresso truncate block">{ticket.startTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 sm:col-span-1">
              <div className="w-7 h-7 rounded-lg bg-brand-50 text-brand flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-espresso-muted block leading-tight">Lokasi & Kota</span>
                <span className="font-bold text-espresso truncate block" title={`${ticket.venue}, ${ticket.city}`}>
                  {ticket.venue}, {ticket.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Divider Line with Left & Right Cutout Notches */}
        <div className="relative flex items-center bg-white my-0 py-2">
          {/* Left Notch */}
          <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-sand-warm border border-sand-border" />
          {/* Dashed line */}
          <div className="w-full border-t-2 border-dashed border-sand-border/80 mx-6" />
          {/* Right Notch */}
          <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-sand-warm border border-sand-border" />
        </div>

        {/* Bottom Segment: Participant Data & QR Code */}
        <div className="p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-white">
          {/* Left: Participant & BIB */}
          <div className="sm:col-span-7 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-espresso-muted block mb-1">
                Nomor Dada (BIB Name)
              </span>
              <span className="text-3xl sm:text-4xl font-black text-brand tracking-widest font-mono">
                {ticket.bibName}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-black tracking-widest text-espresso-muted block">
                Nama Peserta
              </span>
              <span className="text-sm sm:text-base font-bold text-espresso block">
                {ticket.participantName}
              </span>
              <span className="text-xs text-espresso-secondary block font-mono">
                {ticket.participantEmail}
              </span>
            </div>

            {/* Ticket Code Box: Clean, unified badge without input-like appearance */}
            <div className="pt-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-espresso-muted block mb-1.5">
                Kode Validasi E-Ticket
              </span>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-espresso text-white shadow-xs">
                <Ticket className="w-3.5 h-3.5 text-brand shrink-0" />
                <span className="text-xs font-mono font-black tracking-widest">
                  {ticket.ticketCode}
                </span>
              </div>
            </div>
          </div>

          {/* Right: QR Code Visual Container */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-sand-warm/60 rounded-2xl border border-sand-border/80 text-center space-y-2.5">
            <div className="p-3 bg-white rounded-xl shadow-xs border border-sand-border">
              <QRCodeSVG
                value={ticket.qrPayload}
                size={140}
                level="H"
                includeMargin={false}
              />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-espresso uppercase tracking-wider block">
                Pindai di Gate Check-in
              </span>
              <span className="text-[9px] text-espresso-muted block">
                Tunjukkan ke Panitia Lomba
              </span>
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="bg-sand-warm/80 px-6 py-3.5 border-t border-sand-border flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-espresso-secondary">
          <span className="font-semibold">
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
