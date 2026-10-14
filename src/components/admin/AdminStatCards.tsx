"use client";

import React from "react";
import { formatRupiah } from "@/lib/utils";
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface AdminStatCardsProps {
  totalUsers?: number;
  totalOrganizers: number;
  totalEvents: number;
  totalRevenue: number;
  pendingOrganizers: number;
  pendingEvents: number;
}

export function AdminStatCards({
  totalUsers = 1248,
  totalOrganizers,
  totalEvents,
  totalRevenue,
  pendingOrganizers,
  pendingEvents,
}: AdminStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Gross Platform Revenue */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm">
        <div className="flex items-center justify-between text-espresso-secondary mb-2">
          <span className="text-xs font-semibold">Volume Transaksi Tiket</span>
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-espresso">
          {formatRupiah(totalRevenue)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-accent-success font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Total transaksi platform</span>
        </div>
      </div>

      {/* Users & Athletes */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm">
        <div className="flex items-center justify-between text-espresso-secondary mb-2">
          <span className="text-xs font-semibold">Pengguna & Pelari</span>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-espresso">
          {totalUsers.toLocaleString("id-ID")}
        </div>
        <div className="text-[11px] text-espresso-muted mt-2">
          Akun pelari aktif terdaftar
        </div>
      </div>

      {/* Verified Organizers */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm">
        <div className="flex items-center justify-between text-espresso-secondary mb-2">
          <span className="text-xs font-semibold">Penyelenggara (EO)</span>
          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-espresso">
          {totalOrganizers}
          <span className="text-xs font-normal text-espresso-muted ml-1">EO Terverifikasi</span>
        </div>
        <div className="text-[11px] mt-2">
          {pendingOrganizers > 0 ? (
            <span className="text-amber-700 font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {pendingOrganizers} permohonan antre verifikasi
            </span>
          ) : (
            <span className="text-accent-success font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Semua EO tertinjau
            </span>
          )}
        </div>
      </div>

      {/* Published Events */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm">
        <div className="flex items-center justify-between text-espresso-secondary mb-2">
          <span className="text-xs font-semibold">Event Lari Terbit</span>
          <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-espresso">
          {totalEvents}
          <span className="text-xs font-normal text-espresso-muted ml-1">Race Publik</span>
        </div>
        <div className="text-[11px] mt-2">
          {pendingEvents > 0 ? (
            <span className="text-amber-700 font-bold">
              {pendingEvents} event berstatus draft/review
            </span>
          ) : (
            <span className="text-espresso-muted">Semua event sudah live</span>
          )}
        </div>
      </div>
    </div>
  );
}
