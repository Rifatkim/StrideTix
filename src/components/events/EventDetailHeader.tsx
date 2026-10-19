"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Share2 } from "lucide-react";
import { RunningEvent } from "@/types";

interface EventDetailHeaderProps {
  event: RunningEvent;
}

export function EventDetailHeader({ event }: EventDetailHeaderProps) {
  const formattedDate = new Date(event.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Back button */}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-espresso-secondary hover:text-brand transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Semua Event</span>
      </a>

      {/* Main Banner Container */}
      <div className="relative aspect-[21/9] sm:aspect-[2.5/1] w-full rounded-card overflow-hidden bg-espresso shadow-warm border border-sand-border">
        <Image
          src={event.bannerImage || "/images/events/city-marathon.jpg"}
          alt={event.title}
          fill
          priority
          unoptimized
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/events/city-marathon.jpg";
          }}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-transparent" />

        {/* Floating Organizer Badge */}
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-btn border border-sand-border shadow-md">
          {event.organizerLogo ? (
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-sand-border shrink-0">
              <Image
                src={event.organizerLogo}
                alt={event.organizerName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs shrink-0">
              {event.organizerName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted">
              Penyelenggara
            </span>
            <span className="text-xs font-bold text-espresso leading-tight">
              {event.organizerName}
            </span>
          </div>
        </div>
      </div>

      {/* Title & Key Metadata */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-espresso tracking-tight">
          {event.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-espresso-secondary pt-1 border-b border-sand-border pb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand" />
            <span className="font-semibold text-espresso">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand" />
            <span>Waktu Flag-off: <strong className="text-espresso">{event.startTime}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand" />
            <span className="truncate max-w-xs">{event.locationVenue}, {event.locationCity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
