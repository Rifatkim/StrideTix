"use client";

import React, { useState } from "react";
import { OrganizerApplication } from "@/types";
import { RejectOrganizerModal } from "./RejectOrganizerModal";
import {
  CheckCircle2,
  XCircle,
  Building2,
  FileCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";

interface OrganizerVerificationListProps {
  organizers: OrganizerApplication[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  isProcessing: string | null;
}

export function OrganizerVerificationList({
  organizers,
  onApprove,
  onReject,
  isProcessing,
}: OrganizerVerificationListProps) {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedForReject, setSelectedForReject] = useState<OrganizerApplication | null>(null);

  const handleOpenReject = (org: OrganizerApplication) => {
    setSelectedForReject(org);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (reason: string) => {
    if (!selectedForReject) return;
    await onReject(selectedForReject.id, reason);
    setRejectModalOpen(false);
    setSelectedForReject(null);
  };

  if (organizers.length === 0) {
    return (
      <div className="bg-white rounded-card p-10 text-center border border-sand-border shadow-warm">
        <Building2 className="w-10 h-10 text-espresso-muted mx-auto mb-2" />
        <h4 className="text-sm font-bold text-espresso">Belum Ada Permohonan</h4>
        <p className="text-xs text-espresso-secondary mt-1">
          Tidak ada permohonan verifikasi penyelenggara lomba dalam sistem.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {organizers.map((org) => {
          const isPending = org.status === "pending";
          const isVerified = org.status === "verified";
          const isRejected = org.status === "rejected";
          const isBusy = isProcessing === org.id;

          return (
            <div
              key={org.id}
              className="bg-white rounded-card border border-sand-border p-5 shadow-warm space-y-4"
            >
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-card bg-sand-warm flex items-center justify-center text-brand border border-sand-border shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-espresso">{org.name}</h3>
                    <p className="text-xs text-espresso-muted flex items-center gap-2">
                      <span>PIC: {org.picName}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {org.city}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-accent-success/15 text-accent-success border border-accent-success/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Terverifikasi
                    </span>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      Menunggu Peninjauan
                    </span>
                  )}
                  {isRejected && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                      <XCircle className="w-3.5 h-3.5" />
                      Ditolak
                    </span>
                  )}
                </div>
              </div>

              {/* Body Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-[11px] font-bold text-espresso-secondary mb-1">
                    Portofolio & Pengalaman Lomba:
                  </div>
                  <p className="text-espresso bg-sand-warm/60 p-2.5 rounded border border-sand-border/80">
                    {org.portfolio}
                  </p>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] font-bold text-espresso-secondary block mb-0.5">
                      Dokumen Pendukung Resmi:
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 border border-stone-200 text-espresso font-semibold text-[11px]">
                      <FileCheck className="w-3.5 h-3.5 text-brand" />
                      {org.documentType}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-espresso-muted pt-1">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {org.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {org.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rejection Note if any */}
              {isRejected && org.rejectionReason && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Catatan Penolakan: </span>
                    <span>{org.rejectionReason}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sand-border">
                {isPending && (
                  <>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleOpenReject(org)}
                      className="px-3.5 py-1.5 rounded-btn bg-sand-warm border border-sand-border text-red-600 font-bold text-xs hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-50"
                    >
                      Tolak
                    </button>
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => onApprove(org.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-btn bg-accent-success text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isBusy ? "Memproses..." : "Setujui & Verifikasi"}</span>
                    </button>
                  </>
                )}
                {isRejected && (
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => onApprove(org.id)}
                    className="px-3.5 py-1.5 rounded-btn bg-stone-100 border border-stone-300 text-espresso font-semibold text-xs hover:border-brand transition-colors"
                  >
                    Tinjau Ulang & Setujui
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <RejectOrganizerModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        organizerName={selectedForReject?.name || ""}
      />
    </>
  );
}
