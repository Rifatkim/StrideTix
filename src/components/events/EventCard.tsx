import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Ticket,
  Users,
  Sparkles,
  Building2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { RunningEvent } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface EventCardProps {
  event: RunningEvent;
  isRecommended?: boolean;
}

export function EventCard({ event, isRecommended = false }: EventCardProps) {
  // Lowest price among categories
  const lowestPrice = Math.min(...event.categories.map((c) => c.price));
  // Total available quota
  const totalAvailableQuota = event.categories.reduce(
    (acc, c) => acc + c.availableQuota,
    0
  );

  // Format date: "15 Nov 2026"
  const formattedDate = new Date(event.eventDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Status computation
  const isPastDeadline =
    new Date(event.registrationDeadline).getTime() < new Date("2026-10-16").getTime();
  const isSoldOut = totalAvailableQuota <= 0;
  const isAlmostSoldOut = !isSoldOut && totalAvailableQuota <= 50;

  // Check if categories contain Half Marathon (default AI recommendation for runner Budi)
  const matchesAIRecommendation =
    isRecommended || event.categories.some((c) => c.name === "Half Marathon");

  return (
    <article className="group bg-white rounded-card border border-sand-border shadow-warm hover:shadow-warm-hover hover:-translate-y-1 transition-all duration-200 flex flex-col overflow-hidden">
      {/* 1. 16:9 Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-muted">
        <Image
          src={event.bannerImage}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />

        {/* Top-Left: Category Badges & AI Recommendation Pill */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[75%] z-10">
          {matchesAIRecommendation && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-ai text-white shadow-sm ring-1 ring-white/30 backdrop-blur-sm animate-pulse">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Rekomendasi AI</span>
            </span>
          )}

          {event.categories.slice(0, 2).map((cat) => (
            <span
              key={cat.id}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-espresso shadow-xs backdrop-blur-sm border border-sand-border"
            >
              {cat.name}
            </span>
          ))}

          {event.categories.length > 2 && (
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-espresso-muted border border-sand-border">
              +{event.categories.length - 2}
            </span>
          )}
        </div>

        {/* Top-Right: Status Ticket Indicator */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isSoldOut ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600/90 text-white backdrop-blur-sm shadow-xs">
              <XCircle className="w-3 h-3" />
              <span>Sold Out</span>
            </span>
          ) : isPastDeadline ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-espresso/85 text-white backdrop-blur-sm shadow-xs">
              <AlertCircle className="w-3 h-3 text-orange-400" />
              <span>Ditutup</span>
            </span>
          ) : isAlmostSoldOut ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/95 text-white backdrop-blur-sm shadow-xs animate-bounce">
              <AlertCircle className="w-3 h-3" />
              <span>Sisa {totalAvailableQuota}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-espresso/75 text-white backdrop-blur-sm">
              <Users className="w-3 h-3 text-brand-300" />
              <span>Sisa {totalAvailableQuota}</span>
            </span>
          )}
        </div>

        {/* Bottom of Image: Date & Time */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-medium drop-shadow-md">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-brand-300 shrink-0" />
            <span className="font-semibold">{formattedDate}</span>
            <span className="text-white/60">•</span>
            <span>{event.startTime}</span>
          </div>
        </div>
      </div>

      {/* 2. Content Body: Compact & Scannable */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Location & Organizer Name */}
          <div className="flex items-center justify-between gap-2 text-[11px] text-espresso-muted">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-brand shrink-0" />
              <span className="truncate">{event.locationCity}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-[10px]">
              <Building2 className="w-3 h-3 text-espresso-muted" />
              <span className="truncate max-w-[120px]">{event.organizerName}</span>
            </div>
          </div>

          {/* Event Title */}
          <h3 className="text-base font-extrabold text-espresso group-hover:text-brand transition-colors line-clamp-1 leading-snug">
            {event.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-espresso-secondary line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* 3. Footer: Starting Price & CTA */}
        <div className="pt-2.5 border-t border-sand-border/80 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
              Mulai dari
            </span>
            <span className="text-sm sm:text-base font-black text-brand">
              {formatRupiah(lowestPrice)}
            </span>
          </div>

          <Link
            href={`/events/${event.id}`}
            className={`px-3.5 py-1.5 rounded-btn font-bold text-xs transition-all duration-150 flex items-center gap-1 shadow-xs active:scale-95 ${
              isSoldOut
                ? "bg-sand-muted text-espresso-muted border border-sand-border pointer-events-none opacity-60"
                : "bg-brand-50 hover:bg-brand text-brand hover:text-white border border-brand-200"
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{isSoldOut ? "Habis" : "Pilih Tiket"}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
