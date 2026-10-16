"use client";

import React, { useEffect } from "react";
import { TicketCategory } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Ticket, ArrowRight, AlertTriangle, ArrowUp } from "lucide-react";

interface StickyBookingBarProps {
  selectedCategory: TicketCategory | null;
  isAboveRecommendation?: boolean;
  onProceed: () => void;
  onScrollToCategories: () => void;
}

export function StickyBookingBar({
  selectedCategory,
  isAboveRecommendation = false,
  onProceed,
  onScrollToCategories,
}: StickyBookingBarProps) {
  // Notify global listeners (e.g., AI Running Assistant widget) about booking bar visibility
  useEffect(() => {
    const isVisible = Boolean(selectedCategory);
    if (isVisible) {
      document.body.setAttribute("data-booking-bar-active", "true");
    } else {
      document.body.removeAttribute("data-booking-bar-active");
    }

    const event = new CustomEvent("stridetix:booking-bar", {
      detail: { active: isVisible },
    });
    window.dispatchEvent(event);

    return () => {
      document.body.removeAttribute("data-booking-bar-active");
      window.dispatchEvent(
        new CustomEvent("stridetix:booking-bar", { detail: { active: false } })
      );
    };
  }, [selectedCategory]);

  if (!selectedCategory) {
    return null;
  }

  return (
    <aside
      data-sticky-booking-bar="true"
      aria-label="Ringkasan Kategori Terpilih"
      className="fixed bottom-20 sm:bottom-6 left-0 right-0 z-30 pointer-events-none px-3 sm:px-6 animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
      <div className="pointer-events-auto max-w-5xl mx-auto bg-[#FFFCF8] border border-[#E8DDD0] rounded-2xl sm:rounded-full p-3.5 sm:px-7 sm:py-3.5 shadow-xl shadow-stone-900/10 backdrop-blur-md">
        {/* Desktop & Tablet Layout (sm and up) */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          {/* Section 1 & 2: Selection Status & Info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
                Kategori Terpilih
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm md:text-base font-extrabold text-espresso truncate">
                  {selectedCategory.name}
                </span>
                <span className="text-espresso-muted font-bold text-sm">·</span>
                <span className="text-xs md:text-sm font-bold text-brand">
                  {selectedCategory.distanceKm} KM
                </span>

                {isAboveRecommendation && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>Di atas rekomendasi Anda</span>
                  </span>
                )}
              </div>
            </div>

            {/* Change Category link */}
            <button
              type="button"
              onClick={onScrollToCategories}
              className="text-xs font-bold text-espresso-muted hover:text-brand underline decoration-dotted underline-offset-4 transition-colors ml-2 shrink-0 flex items-center gap-1"
              title="Gulir ke daftar pilihan kategori"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Ubah Kategori</span>
            </button>
          </div>

          {/* Section 3 & 4: Price Summary & CTA Action */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
                Total Pembayaran
              </span>
              <span className="text-xl font-extrabold text-brand leading-none">
                {formatRupiah(selectedCategory.price)}
              </span>
            </div>

            <button
              type="button"
              onClick={onProceed}
              className="h-12 px-6 rounded-full bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <Ticket className="w-4 h-4" />
              <span>Lanjutkan Pemesanan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Mobile Layout (< sm) */}
        <div className="flex flex-col gap-2.5 sm:hidden">
          {/* Row 1: Selected Category & Change Link */}
          <div className="flex items-center justify-between gap-2 border-b border-sand-border/60 pb-2">
            <div className="min-w-0">
              <span className="text-[9px] uppercase font-bold tracking-wider text-espresso-muted block">
                Kategori Terpilih
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-extrabold text-espresso truncate">
                  {selectedCategory.name}
                </span>
                <span className="text-espresso-muted text-xs">·</span>
                <span className="text-xs font-bold text-brand">
                  {selectedCategory.distanceKm} KM
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onScrollToCategories}
              className="text-[11px] font-bold text-brand hover:underline shrink-0 px-2 py-1 rounded bg-brand-50"
            >
              Ubah
            </button>
          </div>

          {/* Row 1.5: Optional Warning Pill on Mobile */}
          {isAboveRecommendation && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 w-fit">
              <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Di atas rekomendasi Anda</span>
            </div>
          )}

          {/* Row 2: Price & CTA Button */}
          <div className="flex items-center justify-between gap-3 pt-0.5">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-espresso-muted block">
                Total
              </span>
              <span className="text-base font-extrabold text-brand leading-none">
                {formatRupiah(selectedCategory.price)}
              </span>
            </div>

            <button
              type="button"
              onClick={onProceed}
              className="h-10 px-4 rounded-xl bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold text-xs shadow-warm flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Lanjutkan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
