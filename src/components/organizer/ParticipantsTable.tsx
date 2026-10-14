"use client";

import React from "react";
import Link from "next/link";
import { ETicket } from "@/types";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  QrCode,
  ShieldAlert,
  User,
  Check,
  XCircle,
} from "lucide-react";

interface ParticipantsTableProps {
  participants: ETicket[];
  onToggleCheckIn: (ticketCode: string) => Promise<void>;
  isProcessing: string | null;
}

export function ParticipantsTable({
  participants,
  onToggleCheckIn,
  isProcessing,
}: ParticipantsTableProps) {
  if (participants.length === 0) {
    return (
      <div className="bg-white rounded-card p-10 text-center border border-sand-border shadow-warm">
        <User className="w-10 h-10 text-espresso-muted mx-auto mb-3" />
        <h4 className="text-sm font-bold text-espresso">Tidak Ada Peserta Ditemukan</h4>
        <p className="text-xs text-espresso-secondary mt-1">
          Tidak ada data peserta yang cocok dengan kriteria pencarian atau filter yang dipilih.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-card border border-sand-border shadow-warm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sand-warm/70 border-b border-sand-border text-[11px] font-bold text-espresso-secondary uppercase tracking-wider">
              <th className="py-3 px-4">Nama Peserta / BIB</th>
              <th className="py-3 px-4">Kategori Lomba</th>
              <th className="py-3 px-4">Kode Tiket</th>
              <th className="py-3 px-4">Status Check-in Gate</th>
              <th className="py-3 px-4 text-right">Aksi Validator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-border text-xs">
            {participants.map((p) => {
              const isCheckedIn = p.status === "checked_in";
              const isCurrentProcessing = isProcessing === p.ticketCode;

              return (
                <tr
                  key={p.ticketCode}
                  className="hover:bg-sand-warm/30 transition-colors"
                >
                  {/* Name and BIB */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-espresso flex items-center gap-2">
                      <span>{p.participantName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand text-[10px] font-mono font-bold">
                        BIB: {p.bibName}
                      </span>
                    </div>
                    <div className="text-[11px] text-espresso-muted mt-0.5">
                      {p.participantEmail}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-sand-warm border border-sand-border text-espresso">
                      {p.categoryName}
                    </span>
                  </td>

                  {/* Ticket Code */}
                  <td className="py-3.5 px-4 font-mono text-[11px] text-espresso-secondary">
                    {p.ticketCode}
                  </td>

                  {/* Check-in Status */}
                  <td className="py-3.5 px-4">
                    {isCheckedIn ? (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-accent-success/15 text-accent-success border border-accent-success/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Sudah Check-in</span>
                        </span>
                        {p.checkedInAt && (
                          <div className="text-[10px] text-espresso-muted flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(p.checkedInAt).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            WIB
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-100 text-espresso-muted border border-stone-200">
                        <Clock className="w-3 h-3" />
                        <span>Belum Check-in</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        disabled={isCurrentProcessing}
                        onClick={() => onToggleCheckIn(p.ticketCode)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-btn text-[11px] font-bold transition-colors ${
                          isCheckedIn
                            ? "bg-stone-100 text-espresso-secondary hover:bg-stone-200 border border-stone-300"
                            : "bg-accent-success text-white hover:bg-emerald-700 shadow-sm"
                        } disabled:opacity-50`}
                      >
                        {isCurrentProcessing ? (
                          <span>Proses...</span>
                        ) : isCheckedIn ? (
                          <>
                            <XCircle className="w-3 h-3 text-stone-500" />
                            <span>Batalkan</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Check-in</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/tickets/${p.ticketCode}`}
                        target="_blank"
                        className="p-1.5 rounded-btn bg-sand-warm border border-sand-border text-espresso-muted hover:text-brand hover:border-brand transition-colors"
                        title="Lihat E-Ticket"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
