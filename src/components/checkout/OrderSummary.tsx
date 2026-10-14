import React from "react";
import Image from "next/image";
import { Calendar, MapPin, ShieldCheck, Ticket } from "lucide-react";
import { RunningEvent, TicketCategory } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface OrderSummaryProps {
  event: RunningEvent;
  category: TicketCategory;
}

export function OrderSummary({ event, category }: OrderSummaryProps) {
  const adminFee = 5000;
  const total = category.price + adminFee;

  const formattedDate = new Date(event.eventDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-card p-6 border border-sand-border shadow-warm space-y-5">
      <h3 className="text-base font-extrabold text-espresso border-b border-sand-border pb-3 flex items-center gap-2">
        <Ticket className="w-4 h-4 text-brand" />
        <span>Ringkasan Pesanan Tiket</span>
      </h3>

      {/* Mini Event Info */}
      <div className="flex gap-3.5 items-start">
        <div className="relative w-20 h-14 rounded-btn overflow-hidden bg-sand-border shrink-0">
          <Image
            src={event.bannerImage}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="space-y-1">
          <h4 className="text-sm font-bold text-espresso leading-snug line-clamp-2">
            {event.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-espresso-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-brand" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 truncate max-w-[120px]">
              <MapPin className="w-3 h-3 text-brand" />
              {event.locationCity}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Category Pill */}
      <div className="bg-brand-50 rounded-btn p-3.5 border border-brand-200 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-800 block">
            Kategori Tiket
          </span>
          <span className="text-sm font-extrabold text-espresso">
            {category.name} ({category.distanceKm} KM)
          </span>
        </div>
        <span className="text-sm font-extrabold text-brand">
          {formatRupiah(category.price)}
        </span>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 text-xs text-espresso-secondary border-t border-sand-border pt-4">
        <div className="flex justify-between">
          <span>Harga Tiket</span>
          <span className="font-semibold text-espresso">{formatRupiah(category.price)}</span>
        </div>
        <div className="flex justify-between">
          <span>Biaya Layanan & Pemrosesan</span>
          <span className="font-semibold text-espresso">{formatRupiah(adminFee)}</span>
        </div>
        <div className="flex justify-between text-base font-extrabold text-espresso border-t border-sand-border pt-3">
          <span>Total Pembayaran</span>
          <span className="text-brand">{formatRupiah(total)}</span>
        </div>
      </div>

      <div className="bg-surface-soft p-3 rounded-btn border border-sand-border flex items-center gap-2 text-[11px] text-espresso-secondary">
        <ShieldCheck className="w-4 h-4 text-accent-success shrink-0" />
        <span>QR Code E-Ticket unik resmi diterbitkan otomatis setelah checkout.</span>
      </div>
    </div>
  );
}
