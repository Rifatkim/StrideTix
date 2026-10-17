"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RunningEvent } from "@/types";
import { formatDateIndonesian } from "@/lib/utils";
import { deleteEvent } from "@/services/eventService";
import { EditEventModal } from "./EditEventModal";
import {
  Calendar,
  MapPin,
  Users,
  QrCode,
  ExternalLink,
  PlusCircle,
  Edit3,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface ManagedEventsListProps {
  events: RunningEvent[];
  onEventUpdated?: (updatedEvent: RunningEvent) => void;
  onEventDeleted?: (eventId: string) => void;
}

export function ManagedEventsList({
  events,
  onEventUpdated,
  onEventDeleted,
}: ManagedEventsListProps) {
  const [editingEvent, setEditingEvent] = useState<RunningEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<RunningEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;
    setIsDeleting(true);
    setDeleteError("");

    try {
      await deleteEvent(deletingEvent.id);
      if (onEventDeleted) {
        onEventDeleted(deletingEvent.id);
      }
      setDeletingEvent(null);
    } catch (err: any) {
      setDeleteError(err.message || "Gagal menghapus event.");
    } finally {
      setIsDeleting(false);
    }
  };

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
        const totalQuota = event.categories.reduce((acc, c) => acc + (Number(c.quota) || 0), 0);
        const totalAvailable = event.categories.reduce(
          (acc, c) => acc + (Number(c.availableQuota) || 0),
          0
        );
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
                  src={event.bannerImage || "/images/events/city-marathon.jpg"}
                  alt={event.title}
                  fill
                  unoptimized
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/events/city-marathon.jpg";
                  }}
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
                    {event.locationVenue ? `${event.locationVenue}, ${event.locationCity}` : event.locationCity}
                  </span>
                </div>

                {/* Categories Badge Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {event.categories.map((c) => (
                    <span
                      key={c.id}
                      className="px-2 py-0.5 rounded bg-sand-warm text-[10px] font-semibold text-espresso-secondary border border-sand-border/80"
                    >
                      {c.name}: {c.quota} slot
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
                {/* Edit Button */}
                <button
                  type="button"
                  onClick={() => setEditingEvent(event)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-espresso font-semibold text-xs hover:border-brand hover:text-brand transition-colors"
                  title="Edit Tanggal, Kuota & Harga"
                >
                  <Edit3 className="w-3.5 h-3.5 text-brand" />
                  <span>Edit</span>
                </button>

                {/* Kelola Peserta */}
                <Link
                  href={`/organizer/events/${event.id}/participants`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Peserta</span>
                </Link>

                {/* Gate Check-in */}
                <Link
                  href="/organizer/check-in"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-espresso font-semibold text-xs hover:border-brand transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-brand" />
                  <span>Gate</span>
                </Link>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => {
                    setDeletingEvent(event);
                    setDeleteError("");
                  }}
                  className="p-2 rounded-btn bg-sand-warm border border-sand-border text-espresso-muted hover:text-red-600 hover:border-red-300 hover:bg-red-50/50 transition-colors"
                  title="Hapus Event Ini"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>

                {/* Lihat Publik */}
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

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          isOpen={true}
          onClose={() => setEditingEvent(null)}
          onSaved={(updated) => {
            if (onEventUpdated) onEventUpdated(updated);
            setEditingEvent(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-xs">
          <div className="bg-white rounded-card border border-sand-border shadow-warm max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-espresso">Hapus Event Lomba?</h3>
                <p className="text-xs text-espresso-secondary mt-1">
                  Apakah Anda yakin ingin menghapus <strong>{deletingEvent.title}</strong>? Seluruh kategori tiket dan kuota pada event ini akan dihapus secara permanen.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="pt-2 border-t border-sand-border flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setDeletingEvent(null);
                  setDeleteError("");
                }}
                className="px-4 py-2 rounded-btn bg-sand-warm text-espresso font-semibold text-xs hover:bg-sand-border/50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-btn bg-red-600 text-white font-bold text-xs hover:bg-red-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {isDeleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>{isDeleting ? "Menghapus..." : "Ya, Hapus Event"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
