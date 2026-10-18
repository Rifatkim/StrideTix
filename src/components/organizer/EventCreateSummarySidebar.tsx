import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TicketCategory } from "@/types";
import { formatRupiah } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Save,
  Send,
  Loader2,
} from "lucide-react";

const DEFAULT_BANNER = "/images/events/city-marathon.jpg";

interface EventCreateSummarySidebarProps {
  title: string;
  organizerName: string;
  locationCity: string;
  locationVenue: string;
  eventDate: string;
  startTime: string;
  bannerImage: string;
  categories: TicketCategory[];
  rules: string;
  isSubmitting: boolean;
  onSubmit: (status: "draft" | "published") => void;
}

export function EventCreateSummarySidebar({
  title,
  organizerName,
  locationCity,
  locationVenue,
  eventDate,
  startTime,
  bannerImage,
  categories,
  rules,
  isSubmitting,
  onSubmit,
}: EventCreateSummarySidebarProps) {
  const [imgSrc, setImgSrc] = useState(bannerImage || DEFAULT_BANNER);

  useEffect(() => {
    setImgSrc(bannerImage || DEFAULT_BANNER);
  }, [bannerImage]);

  const totalQuota = categories.reduce((acc, c) => acc + (Number(c.quota) || 0), 0);
  const potentialRevenue = categories.reduce(
    (acc, c) => acc + (Number(c.quota) || 0) * (Number(c.price) || 0),
    0
  );

  const isTitleComplete = title.trim().length > 3;
  const isVenueComplete = locationVenue.trim().length > 3;
  const hasCategories = categories.length > 0 && categories.some(c => c.price > 0 && c.quota > 0);
  const isRulesComplete = rules.trim().length > 10;

  const completionPercent = [
    isTitleComplete,
    isVenueComplete,
    hasCategories,
    isRulesComplete,
  ].filter(Boolean).length * 25;

  return (
    <aside className="space-y-5 sticky top-24">
      {/* Live Preview Card */}
      <div className="bg-white rounded-card border border-sand-border overflow-hidden shadow-warm">
        <div className="relative aspect-[16/9] w-full bg-surface-muted">
          <Image
            src={imgSrc}
            alt="Preview Banner Lomba"
            fill
            unoptimized
            onError={() => setImgSrc(DEFAULT_BANNER)}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand text-white shadow-xs">
              Live Preview
            </span>
          </div>
          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
            <span className="text-[10px] text-white/80 block">
              {organizerName || "Penyelenggara"}
            </span>
            <h4 className="text-sm font-black truncate leading-tight">
              {title || "Nama Event Lari Anda"}
            </h4>
          </div>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="flex items-center gap-1.5 text-espresso-secondary">
            <Calendar className="w-3.5 h-3.5 text-brand" />
            <span>{eventDate || "Tanggal"} • {startTime || "05:30 WIB"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-espresso-secondary">
            <MapPin className="w-3.5 h-3.5 text-brand" />
            <span className="truncate">{locationVenue || "Lokasi Venue"}, {locationCity}</span>
          </div>

          <div className="pt-2 border-t border-sand-border/70 grid grid-cols-2 gap-2 text-center">
            <div className="bg-surface-main p-2 rounded-btn border border-sand-border/60">
              <span className="text-[10px] text-espresso-muted block">Total Kuota</span>
              <span className="text-xs font-black text-espresso">{totalQuota} Slot</span>
            </div>
            <div className="bg-surface-main p-2 rounded-btn border border-sand-border/60">
              <span className="text-[10px] text-espresso-muted block">Potensi Omset</span>
              <span className="text-xs font-black text-brand truncate block">
                {formatRupiah(potentialRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Checklist Card */}
      <div className="bg-white rounded-card border border-sand-border p-5 shadow-warm space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-bold text-espresso">Kelengkapan Formulir</span>
            <span className="font-black text-brand">{completionPercent}%</span>
          </div>
          <div className="w-full bg-sand-warm h-2 rounded-full overflow-hidden">
            <div
              className="bg-brand h-full rounded-full transition-all duration-300"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        <ul className="space-y-2 text-xs">
          <li className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 ${
                isTitleComplete ? "text-emerald-600" : "text-sand-border"
              }`}
            />
            <span className={isTitleComplete ? "text-espresso font-medium" : "text-espresso-muted"}>
              Nama lomba resmi
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 ${
                isVenueComplete ? "text-emerald-600" : "text-sand-border"
              }`}
            />
            <span className={isVenueComplete ? "text-espresso font-medium" : "text-espresso-muted"}>
              Venue & rute lomba
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 ${
                hasCategories ? "text-emerald-600" : "text-sand-border"
              }`}
            />
            <span className={hasCategories ? "text-espresso font-medium" : "text-espresso-muted"}>
              Minimal 1 kategori ({categories.length} aktif)
            </span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2
              className={`w-4 h-4 ${
                isRulesComplete ? "text-emerald-600" : "text-sand-border"
              }`}
            />
            <span className={isRulesComplete ? "text-espresso font-medium" : "text-espresso-muted"}>
              Regulasi & terms lomba
            </span>
          </li>
        </ul>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-sand-border/80 space-y-2.5">
          <button
            type="button"
            disabled={isSubmitting || !title || !locationVenue}
            onClick={() => onSubmit("published")}
            className="w-full py-3 rounded-btn bg-brand text-white font-bold text-xs sm:text-sm shadow-warm hover:bg-brand-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Kirim untuk Moderasi</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onSubmit("draft")}
            className="w-full py-2.5 rounded-btn bg-sand-warm text-espresso font-bold text-xs hover:bg-sand-border/40 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan sebagai Draf</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
