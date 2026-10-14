"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { RunningEvent, EventStatus } from "@/types";
import { formatDateIndonesian, formatRupiah } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  CheckCircle2,
  ExternalLink,
  EyeOff,
  Send,
  Building2,
  AlertTriangle,
} from "lucide-react";

interface EventModerationListProps {
  events: RunningEvent[];
  onUpdateStatus: (id: string, newStatus: EventStatus) => Promise<void>;
  isProcessing: string | null;
}

export function EventModerationList({
  events,
  onUpdateStatus,
  isProcessing,
}: EventModerationListProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-card p-10 text-center border border-sand-border shadow-warm">
        <Calendar className="w-10 h-10 text-espresso-muted mx-auto mb-2" />
        <h4 className="text-sm font-bold text-espresso">Tidak Ada Event Ditemukan</h4>
        <p className="text-xs text-espresso-secondary mt-1">
          Tidak ada event yang sesuai dengan filter status moderasi yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const isPublished = event.status === "published";
        const isDraft = event.status === "draft";
        const isBusy = isProcessing === event.id;

        const totalQuota = event.categories.reduce((acc, c) => acc + c.quota, 0);

        return (
          <div
            key={event.id}
            className="bg-white rounded-card border border-sand-border p-5 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            {/* Left: Thumbnail & Event Info */}
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-card overflow-hidden bg-sand-warm shrink-0 border border-sand-border">
                <Image
                  src={event.bannerImage}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isPublished
                        ? "bg-accent-success/15 text-accent-success border border-accent-success/30"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    {isPublished ? "Tayang Publik" : "Draft / Menunggu Persetujuan"}
                  </span>
                  <span className="text-xs text-espresso-muted flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {event.organizerName}
                  </span>
                </div>

                <h3 className="text-base font-bold text-espresso">{event.title}</h3>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-espresso-secondary">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-espresso-muted" />
                    {formatDateIndonesian(event.eventDate)} ({event.startTime})
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-espresso-muted" />
                    {event.locationVenue}, {event.locationCity}
                  </span>
                </div>

                {/* Categories and Quota Info */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-espresso-muted">
                  <span>Kategori:</span>
                  {event.categories.map((c) => (
                    <span
                      key={c.id}
                      className="px-2 py-0.5 rounded bg-sand-warm font-semibold text-espresso border border-sand-border"
                    >
                      {c.name} ({formatRupiah(c.price)})
                    </span>
                  ))}
                  <span>• Total Kuota: {totalQuota.toLocaleString("id-ID")} peserta</span>
                </div>
              </div>
            </div>

            {/* Right: Moderation Actions */}
            <div className="flex items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-sand-border">
              {isDraft && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onUpdateStatus(event.id, "published")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-accent-success text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isBusy ? "Mempublikasikan..." : "Setujui & Publikasikan"}</span>
                </button>
              )}

              {isPublished && (
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => onUpdateStatus(event.id, "draft")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-btn bg-sand-warm border border-sand-border text-amber-800 font-bold text-xs hover:bg-amber-50 hover:border-amber-300 transition-colors disabled:opacity-50"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>{isBusy ? "Menyimpan..." : "Tarik ke Draft"}</span>
                </button>
              )}

              <Link
                href={`/events/${event.id}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-espresso font-semibold text-xs hover:border-brand transition-colors"
                title="Buka Pratinjau Event"
              >
                <ExternalLink className="w-3.5 h-3.5 text-brand" />
                <span>Lihat Publik</span>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
