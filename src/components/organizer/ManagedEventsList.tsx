"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { RunningEvent } from "@/types";
import { formatDateIndonesian } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  QrCode,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  Clock,
} from "lucide-react";

interface ManagedEventsListProps {
  events: RunningEvent[];
}

export function ManagedEventsList({ events }: ManagedEventsListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-card p-10 text-center border border-sand-border shadow-warm space-y-4 max-w-md mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-espresso">Belum Ada Event Lari</h3>
        <p className="text-xs text-espresso-secondary">
          Mulai publikasikan event lomba lari pertama Anda dan kelola kuota serta pendaftaran secara profesional.
        </p>
        <Link
          href="/organizer/events/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Event Baru</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const totalQuota = event.categories.reduce((acc, c) => acc + c.quota, 0);
        const totalAvailable = event.categories.reduce((acc, c) => acc + c.availableQuota, 0);
        const sold = Math.max(0, totalQuota - totalAvailable);
        const percentage = totalQuota > 0 ? Math.round((sold / totalQuota) * 100) : 0;

        return (
          <div
            key={event.id}
            className="bg-white rounded-card border border-sand-border p-5 shadow-warm hover:border-brand/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            {/* Left: Thumbnail and Info */}
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-card overflow-hidden bg-sand-warm shrink-0 border border-sand-border">
                <Image
                  src={event.bannerImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      event.status === "published"
                        ? "bg-accent-success/15 text-accent-success border border-accent-success/30"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {event.status === "published" ? "Publik" : "Draft"}
                  </span>
                  <span className="text-xs text-espresso-muted">
                    {event.organizerName}
                  </span>
                </div>

                <h3 className="text-base font-bold text-espresso hover:text-brand transition-colors">
                  <Link href={`/organizer/events/${event.id}/participants`}>
                    {event.title}
                  </Link>
                </h3>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-espresso-secondary">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-espresso-muted" />
                    {formatDateIndonesian(event.eventDate)}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-espresso-muted" />
                    {event.locationCity}
                  </span>
                </div>

                {/* Categories Badge Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {event.categories.map((c) => (
                    <span
                      key={c.id}
                      className="px-2 py-0.5 rounded bg-sand-warm text-[10px] font-semibold text-espresso-secondary border border-sand-border/80"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quota & Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center md:items-end lg:items-center gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-sand-border">
              {/* Quota Progress */}
              <div className="w-full sm:w-44 md:w-36 lg:w-44 space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-espresso-secondary font-medium">Terisi</span>
                  <span className="font-bold text-espresso">
                    {sold.toLocaleString("id-ID")} / {totalQuota.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="bg-sand-warm rounded-full h-2 overflow-hidden border border-sand-border">
                  <div
                    className="bg-brand h-full rounded-full transition-all"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-right text-espresso-muted">
                  {percentage}% kuota terisi
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/organizer/events/${event.id}/participants`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Kelola Peserta</span>
                </Link>

                <Link
                  href="/organizer/check-in"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-espresso font-semibold text-xs hover:border-brand transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-brand" />
                  <span>Gate Check-in</span>
                </Link>

                <Link
                  href={`/events/${event.id}`}
                  target="_blank"
                  className="p-2 rounded-btn bg-sand-warm border border-sand-border text-espresso-muted hover:text-espresso transition-colors"
                  title="Lihat Halaman Publik"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
