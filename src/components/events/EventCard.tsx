import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Ticket, Users } from "lucide-react";
import { RunningEvent } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface EventCardProps {
  event: RunningEvent;
}

export function EventCard({ event }: EventCardProps) {
  // Lowest price among categories
  const lowestPrice = Math.min(...event.categories.map((c) => c.price));
  // Total available quota
  const totalAvailableQuota = event.categories.reduce((acc, c) => acc + c.availableQuota, 0);

  // Format date: "15 Nov 2026"
  const formattedDate = new Date(event.eventDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="group bg-white rounded-card border border-sand-border shadow-warm hover:shadow-warm-hover hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
      {/* 16:9 Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted">
        <Image
          src={event.bannerImage}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />

        {/* Category Badges on Top-Left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
          {event.categories.map((cat) => (
            <span
              key={cat.id}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-espresso shadow-sm backdrop-blur-sm border border-sand-border"
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* Quota Indicator on Top-Right */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-espresso/80 text-white backdrop-blur-sm">
            <Users className="w-3 h-3 text-brand-300" />
            <span>Sisa {totalAvailableQuota}</span>
          </span>
        </div>

        {/* Date on bottom-left of image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-brand-300" />
          <span>{formattedDate}</span>
          <span className="text-white/60">•</span>
          <span>{event.startTime}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-espresso-muted">
            <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span className="truncate">{event.locationCity}</span>
          </div>

          <h3 className="text-lg font-bold text-espresso group-hover:text-brand transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          <p className="text-xs text-espresso-secondary line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Footer: Price & CTA Button */}
        <div className="pt-3 border-t border-sand-border flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
              Mulai dari
            </span>
            <span className="text-base font-extrabold text-brand">
              {formatRupiah(lowestPrice)}
            </span>
          </div>

          <Link
            href={`/events/${event.id}`}
            className="px-4 py-2 rounded-btn bg-brand-50 hover:bg-brand text-brand hover:text-white font-bold text-xs border border-brand-200 transition-all duration-150 flex items-center gap-1 shadow-sm"
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Pilih Tiket</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
