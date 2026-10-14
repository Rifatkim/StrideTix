"use client";

import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface RejectOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  organizerName: string;
}

export function RejectOrganizerModal({
  isOpen,
  onClose,
  onConfirm,
  organizerName,
}: RejectOrganizerModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-card max-w-md w-full p-6 border border-sand-border shadow-warm relative space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-espresso-muted hover:text-espresso p-1 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-espresso">Tolak Permohonan EO</h3>
            <p className="text-xs text-espresso-secondary">{organizerName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-espresso mb-1">
              Alasan Penolakan / Catatan Perbaikan
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Contoh: Dokumen legalitas kurang jelas atau sertifikasi penyelenggara belum terlampir."
              className="w-full px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-btn text-xs font-semibold text-espresso-secondary hover:text-espresso"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-btn bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-sm"
            >
              Konfirmasi Tolak
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
