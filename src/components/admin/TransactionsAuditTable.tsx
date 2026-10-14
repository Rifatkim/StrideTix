"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ETicket, AuditLogEntry } from "@/types";
import { formatDateIndonesian } from "@/lib/utils";
import {
  Receipt,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  ShieldCheck,
  Tag,
} from "lucide-react";

interface TransactionsAuditTableProps {
  tickets: ETicket[];
  auditLogs: AuditLogEntry[];
}

export function TransactionsAuditTable({
  tickets,
  auditLogs,
}: TransactionsAuditTableProps) {
  const [activeTab, setActiveTab] = useState<"transactions" | "audit">("transactions");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.ticketCode.toLowerCase().includes(q) ||
      t.orderId.toLowerCase().includes(q) ||
      t.participantName.toLowerCase().includes(q) ||
      t.eventTitle.toLowerCase().includes(q) ||
      t.categoryName.toLowerCase().includes(q)
    );
  });

  const filteredLogs = auditLogs.filter((log) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.actor.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Sub-tab Selector & Search */}
      <div className="bg-white rounded-card p-4 border border-sand-border shadow-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-btn text-xs font-bold transition-colors ${
              activeTab === "transactions"
                ? "bg-brand text-white shadow-warm"
                : "bg-sand-warm text-espresso-secondary hover:text-espresso"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Transaksi Tiket ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-btn text-xs font-bold transition-colors ${
              activeTab === "audit"
                ? "bg-brand text-white shadow-warm"
                : "bg-sand-warm text-espresso-secondary hover:text-espresso"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Audit Trail Log ({auditLogs.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === "transactions"
                ? "Cari kode, nama, event..."
                : "Cari aksi audit, admin..."
            }
            className="w-full pl-8 pr-3 py-1.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-1 focus:ring-brand outline-none"
          />
          <Search className="w-3.5 h-3.5 text-espresso-muted absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Pane 1: Transactions Table */}
      {activeTab === "transactions" && (
        <div className="bg-white rounded-card border border-sand-border shadow-warm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand-warm/70 border-b border-sand-border text-[11px] font-bold text-espresso-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID & Kode Tiket</th>
                  <th className="py-3 px-4">Event Lari</th>
                  <th className="py-3 px-4">Kategori / BIB</th>
                  <th className="py-3 px-4">Nama Peserta</th>
                  <th className="py-3 px-4">Status Pesanan</th>
                  <th className="py-3 px-4 text-right">E-Ticket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-border text-xs">
                {filteredTickets.map((t) => (
                  <tr key={t.ticketCode} className="hover:bg-sand-warm/30 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-espresso">{t.ticketCode}</div>
                      <div className="text-[10px] text-espresso-muted">{t.orderId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-espresso">{t.eventTitle}</div>
                      <div className="text-[10px] text-espresso-muted">{t.city}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-sand-warm font-semibold text-[10px] text-espresso border border-sand-border mr-1.5">
                        {t.categoryName}
                      </span>
                      <span className="font-mono text-[10px] text-brand font-bold">
                        BIB: {t.bibName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-espresso">{t.participantName}</div>
                      <div className="text-[10px] text-espresso-muted">{t.participantEmail}</div>
                    </td>
                    <td className="py-3 px-4">
                      {t.status === "checked_in" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-success/15 text-accent-success border border-accent-success/30">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Check-in Selesai</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Lunas (Issued)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/tickets/${t.ticketCode}`}
                        target="_blank"
                        className="p-1.5 rounded-btn bg-sand-warm border border-sand-border text-espresso-muted hover:text-brand hover:border-brand inline-flex transition-colors"
                        title="Buka E-Ticket"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pane 2: Audit Logs Table */}
      {activeTab === "audit" && (
        <div className="bg-white rounded-card border border-sand-border shadow-warm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-sand-warm/70 border-b border-sand-border text-[11px] font-bold text-espresso-secondary uppercase tracking-wider">
                  <th className="py-3 px-4">Waktu (WIB)</th>
                  <th className="py-3 px-4">Tindakan Audit</th>
                  <th className="py-3 px-4">Pelaku (Actor)</th>
                  <th className="py-3 px-4">Objek Sasaran</th>
                  <th className="py-3 px-4">Rincian Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-border text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-sand-warm/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-espresso-muted whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-espresso">{log.action}</td>
                    <td className="py-3 px-4 text-espresso-secondary">{log.actor}</td>
                    <td className="py-3 px-4 font-semibold text-brand">{log.target}</td>
                    <td className="py-3 px-4 text-espresso-muted">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
