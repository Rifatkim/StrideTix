"use client";

import React from "react";
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
  User,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";

interface ETicketCardProps {
  ticket: ETicket;
}

export function ETicketCard({ ticket }: ETicketCardProps) {
  const isCheckedIn = ticket.status === "checked_in";

  const formattedDate = new Date(ticket.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Action header bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <Link
          href="/"
          className="font-bold text-espresso-secondary hover:text-brand transition-colors"
        >
          ← Beranda
        </Link>
        <button
          onClick={() => window.print()}
          className="px-3.5 py-1.5 rounded-btn bg-white hover:bg-surface-soft border border-sand-border text-espresso font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Printer className="w-3.5 h-3.5 text-brand" />
          <span>Cetak / Simpan PDF</span>
        </button>
      </div>

      {/* Main E-Ticket Ticket Body with Cutout Notches */}
      <div className="relative bg-white rounded-ticket border border-sand-border shadow-warm-modal overflow-hidden">
        {/* Decorative Top Accent Header */}
        <div className="bg-brand px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <StrideTixSymbol size={22} color="#FFFFFF" className="-rotate-6 shrink-0" />
            <span className="font-extrabold tracking-tight text-lg">
              Stride<span className="text-brand-200">Tix</span> Pass
            </span>
          </div>

          {/* Status Badge per DESIGN.md Section 9.7 */}
          {isCheckedIn ? (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-accent-ai text-white shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Checked-in</span>
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-accent-success text-white shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tiket Resmi • Issued</span>
            </span>
          )}
        </div>

        {/* Top Segment: Event Details */}
        <div className="p-6 sm:p-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand block">
                Official Race Pass
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-espresso">
                {ticket.eventTitle}
              </h2>
            </div>

            {/* Category Distance Badge */}
            <div className="shrink-0">
              <span className="px-4 py-1.5 rounded-full text-sm font-extrabold bg-espresso text-white shadow-sm">
                {ticket.categoryName}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-espresso-secondary pt-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand shrink-0" />
              <span>Flag-off {ticket.startTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand shrink-0" />
              <span className="truncate">{ticket.venue}</span>
            </div>
          </div>
        </div>

        {/* Ticket Divider Line with Left & Right Cutout Notches */}
        <div className="relative flex items-center my-1">
          {/* Left Notch */}
          <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-surface-main border-r border-sand-border" />
          {/* Dashed line */}
          <div className="w-full border-t-2 border-dashed border-sand-border mx-6" />
          {/* Right Notch */}
          <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-surface-main border-l border-sand-border" />
        </div>

        {/* Bottom Segment: Participant Data & QR Code */}
        <div className="p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Left: Participant & BIB */}
          <div className="sm:col-span-7 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
                Nama Dada (BIB Name)
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-brand tracking-wider font-mono">
                {ticket.bibName}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
                Nama Peserta
              </span>
              <span className="text-sm font-bold text-espresso">
                {ticket.participantName}
              </span>
              <span className="text-xs text-espresso-muted block">
                {ticket.participantEmail}
              </span>
            </div>

            <div className="pt-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
                Nomor Kode Tiket
              </span>
              <code className="text-xs font-bold text-espresso bg-surface-main px-2 py-1 rounded border border-sand-border">
                {ticket.ticketCode}
              </code>
            </div>
          </div>

          {/* Right: QR Code Visual Container */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-surface-main rounded-card border border-sand-border text-center space-y-2">
            <div className="p-2.5 bg-white rounded-btn shadow-sm border border-sand-border">
              <QRCodeSVG
                value={ticket.qrPayload}
                size={140}
                level="H"
                includeMargin={false}
              />
            </div>
            <span className="text-[10px] font-bold text-espresso-muted uppercase tracking-wider block">
              Scan untuk Check-in
            </span>
          </div>
        </div>

        {/* Footer info note */}
        <div className="bg-surface-soft px-6 py-3 border-t border-sand-border text-center text-[11px] text-espresso-secondary">
          Tunjukkan QR Code ini pada saat pengambilan Race Pack atau di pintu masuk Race Village pada hari H.
        </div>
      </div>

      {/* Simulator Shortcut CTA to Organizer Check-in */}
      <div className="bg-brand-50 rounded-card p-4 border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5 text-center sm:text-left">
          <span className="font-bold text-espresso block">
            Ingin Menguji Validasi Tiket Ini?
          </span>
          <span className="text-espresso-secondary">
            Buka portal simulator organizer untuk memindai atau memverifikasi kode tiket ini.
          </span>
        </div>

        <Link
          href={`/organizer/check-in?code=${ticket.ticketCode}`}
          className="px-4 py-2 rounded-btn bg-brand text-white font-bold text-xs shadow-sm hover:bg-brand-800 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Uji Check-in Organizer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
