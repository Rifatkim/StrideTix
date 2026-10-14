"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ETicket } from "@/types";

const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  { ssr: false }
);
import { X, ShieldCheck, ExternalLink, Printer } from "lucide-react";

interface TicketQRModalProps {
  isOpen: boolean;
  ticket: ETicket | null;
  onClose: () => void;
}

export function TicketQRModal({ isOpen, ticket, onClose }: TicketQRModalProps) {
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-modal max-w-sm w-full p-6 border border-sand-border shadow-warm-modal space-y-4 animate-in zoom-in-95 duration-150 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-btn text-espresso-muted hover:text-espresso hover:bg-surface-soft transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pt-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand block">
            E-Ticket Pass
          </span>
          <h3 className="text-base font-extrabold text-espresso line-clamp-1">
            {ticket.eventTitle}
          </h3>
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-espresso text-white">
            Kategori {ticket.categoryName}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="p-4 bg-surface-main rounded-card border border-sand-border flex flex-col items-center justify-center space-y-3">
          <div className="p-3 bg-white rounded-btn shadow-sm border border-sand-border">
            <QRCodeSVG value={ticket.qrPayload} size={160} level="H" />
          </div>

          <div className="text-center space-y-0.5">
            <span className="text-[10px] text-espresso-muted block font-mono">
              {ticket.ticketCode}
            </span>
            <span className="text-lg font-extrabold text-brand font-mono tracking-wider block">
              BIB: {ticket.bibName}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-espresso-secondary px-1">
          <span>Peserta: <strong>{ticket.participantName}</strong></span>
          <span
            className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded-full ${
              ticket.status === "checked_in"
                ? "bg-accent-ai/10 text-accent-ai"
                : "bg-accent-success/10 text-accent-success"
            }`}
          >
            {ticket.status}
          </span>
        </div>

        {/* Modal Action Links */}
        <div className="pt-2 flex gap-2">
          <Link
            href={`/tickets/${ticket.ticketCode}`}
            className="flex-1 py-2.5 px-3 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-xs shadow-warm transition-all flex items-center justify-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Halaman Tiket</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
