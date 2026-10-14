"use client";

import React, { useState } from "react";
import { AlertTriangle, ArrowLeft, Check, ShieldCheck, X } from "lucide-react";
import { DistanceCategory } from "@/types";

interface SafetyWarningModalProps {
  isOpen: boolean;
  selectedCategoryName: DistanceCategory;
  recommendedCategoryName: DistanceCategory;
  longestRunKm: number;
  onProceedAnyway: () => void;
  onSwitchToRecommended: () => void;
  onClose: () => void;
}

export function SafetyWarningModal({
  isOpen,
  selectedCategoryName,
  recommendedCategoryName,
  longestRunKm,
  onProceedAnyway,
  onSwitchToRecommended,
  onClose,
}: SafetyWarningModalProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-modal max-w-lg w-full p-6 sm:p-7 border border-accent-warning-border shadow-warm-modal space-y-5 animate-in zoom-in-95 duration-200">
        {/* Header with warning icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-btn bg-accent-warning-bg border border-accent-warning-border flex items-center justify-center text-accent-warning shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-accent-warning">
                Safety Distance Advisory
              </span>
              <h3 className="text-lg font-bold text-espresso leading-snug">
                Peringatan Kesiapan Jarak Lomba
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-btn text-espresso-muted hover:text-espresso hover:bg-surface-soft transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Content per DESIGN.md Section 9.6 */}
        <div className="bg-accent-warning-bg rounded-card p-4 border border-accent-warning-border space-y-2 text-xs leading-relaxed text-[#59422A]">
          <p>
            Kategori <strong>{selectedCategoryName}</strong> berada <strong>di atas rekomendasi latihan Anda saat ini</strong> (Rekomendasi sistem: <strong>{recommendedCategoryName}</strong>).
          </p>
          <p>
            Berdasarkan data Strava Anda, jarak lari terjauh (long run) yang tercatat adalah <strong>{longestRunKm} km</strong>. Memilih jarak yang melompat terlalu jauh dapat meningkatkan risiko cedera otot, kelelahan berlebih, atau gagal menyelesaikan lomba (*Did Not Finish / DNF*).
          </p>
        </div>

        {/* Non-Medical Disclaimer */}
        <p className="text-[11px] text-espresso-muted italic">
          *Peringatan ini merupakan panduan kesiapan fisik berbasis data volume latihan dan bukan diagnosis medis.
        </p>

        {/* Acknowledgment Checkbox */}
        <label className="flex items-start gap-3 p-3 rounded-btn border border-sand-border bg-surface-main cursor-pointer hover:bg-surface-soft transition-colors">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-brand focus:ring-brand border-sand-border cursor-pointer"
          />
          <span className="text-xs text-espresso select-none">
            Saya telah membaca dan memahami peringatan kesiapan ini, serta bersedia bertanggung jawab penuh atas pilihan kategori <strong>{selectedCategoryName}</strong>.
          </span>
        </label>

        {/* Actions Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          {/* Primary Safe Option: Switch to Recommended */}
          <button
            type="button"
            onClick={onSwitchToRecommended}
            className="flex-1 py-3 px-4 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-xs shadow-warm transition-all flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Pilih Rekomendasi ({recommendedCategoryName})</span>
          </button>

          {/* Secondary: Proceed Anyway (requires checkbox) */}
          <button
            type="button"
            disabled={!acknowledged}
            onClick={onProceedAnyway}
            className={`py-3 px-4 rounded-btn font-bold text-xs border transition-all ${
              acknowledged
                ? "bg-white border-sand-border-strong text-espresso hover:bg-surface-soft"
                : "bg-surface-muted text-espresso-muted border-sand-border cursor-not-allowed opacity-60"
            }`}
          >
            Tetap Lanjutkan ({selectedCategoryName})
          </button>
        </div>
      </div>
    </div>
  );
}
