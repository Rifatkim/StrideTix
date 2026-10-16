"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ETicket } from "@/types";
import { getAllUserTickets } from "@/services/ticketService";
import { TicketQRModal } from "./TicketQRModal";
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  ShieldCheck,
  Ticket,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export function MyTicketsTab() {
  const [tickets, setTickets] = useState<ETicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<ETicket | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTickets() {
      const data = await getAllUserTickets();
      setTickets(data);
      setIsLoading(false);
    }
    loadTickets();
  }, []);

  const handleOpenQR = (ticket: ETicket) => {
    setSelectedTicket(ticket);
    setQrModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-espresso-muted">
        Memuat daftar tiket Anda...
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-card p-10 text-center border border-sand-border shadow-warm space-y-4 max-w-md mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand flex items-center justify-center mx-auto">
          <Ticket className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-espresso">Belum Ada Tiket Lomba</h3>
        <p className="text-xs text-espresso-secondary">
          Anda belum memiliki tiket lomba aktif. Jelajahi kalender event lari dan temukan jarak lomba yang sesuai.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors"
        >
          <span>Jelajahi Event Lari</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-sand-border pb-3">
        <div>
          <h3 className="text-lg font-extrabold text-espresso">
            Tiket Lomba Saya ({tickets.length})
          </h3>
          <p className="text-xs text-espresso-muted">
            Tunjukkan kode QR tiket saat pengambilan race pack atau di gerbang race village.
          </p>
        </div>
      </div>

      {/* Grid of Ticket Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tickets.map((ticket) => {
          const formattedDate = new Date(ticket.eventDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          const isCheckedIn = ticket.status === "checked_in";

          return (
            <article
              key={ticket.ticketCode}
              className="bg-white rounded-card border border-sand-border shadow-warm hover:shadow-warm-hover transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Event Image Banner Bar */}
              <div className="relative aspect-[21/9] w-full bg-espresso overflow-hidden">
                <Image
                  src={ticket.eventBanner}
                  alt={ticket.eventTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase backdrop-blur-md shadow-sm ${
                      isCheckedIn
                        ? "bg-accent-ai text-white"
                        : "bg-accent-success text-white"
                    }`}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>{ticket.status}</span>
                  </span>
                </div>

                {/* Distance Category */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-0.5 rounded-full text-xs font-extrabold bg-white text-espresso shadow-sm">
                    {ticket.categoryName}
                  </span>
                </div>

                {/* Title */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="text-sm font-bold truncate">{ticket.eventTitle}</h4>
                </div>
              </div>

              {/* Body Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-sand-border pb-2.5">
                  <div className="flex items-center gap-1.5 text-espresso-secondary">
                    <Calendar className="w-3.5 h-3.5 text-brand" />
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-brand" />
                    <span>{ticket.startTime}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-espresso-muted block">BIB</span>
                    <strong className="text-brand font-mono font-bold text-sm">
                      {ticket.bibName}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-espresso-secondary">
                  <MapPin className="w-3.5 h-3.5 text-brand shrink-0" />
                  <span className="truncate">{ticket.venue}, {ticket.city}</span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => handleOpenQR(ticket)}
                    className="flex-1 py-2 px-3 rounded-btn bg-brand-50 hover:bg-brand text-brand hover:text-white border border-brand-200 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Tampilkan QR</span>
                  </button>

                  <Link
                    href={`/tickets/${ticket.ticketCode}`}
                    className="py-2 px-3 rounded-btn bg-white hover:bg-surface-soft border border-sand-border text-espresso font-semibold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Detail</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* QR Modal */}
      <TicketQRModal
        isOpen={qrModalOpen}
        ticket={selectedTicket}
        onClose={() => {
          setQrModalOpen(false);
          setSelectedTicket(null);
        }}
      />
    </div>
  );
}
