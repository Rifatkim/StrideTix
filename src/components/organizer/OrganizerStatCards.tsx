"use client";

import React from "react";
import { RunningEvent, ETicket } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Ticket, Users, CheckCircle2, TrendingUp, DollarSign } from "lucide-react";

interface OrganizerStatCardsProps {
  events: RunningEvent[];
  allTickets: ETicket[];
}

export function OrganizerStatCards({ events, allTickets }: OrganizerStatCardsProps) {
  // Aggregate stats
  let totalQuota = 0;
  let totalSoldEstimated = 0;
  let estimatedRevenue = 0;

  events.forEach((ev) => {
    ev.categories.forEach((cat) => {
      totalQuota += cat.quota;
      const sold = Math.max(0, cat.quota - cat.availableQuota);
      totalSoldEstimated += sold;
      estimatedRevenue += sold * cat.price;
    });
  });

  const percentageSold = totalQuota > 0 ? Math.round((totalSoldEstimated / totalQuota) * 100) : 0;
  const checkedInCount = allTickets.filter((t) => t.status === "checked_in").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Revenue Card */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm">
        <div className="flex items-center justify-between text-espresso-secondary mb-2">
          <span className="text-xs font-semibold">Total Pendapatan Tiket</span>
          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-espresso">
          {formatRupiah(estimatedRevenue)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-accent-success font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Dari {events.length} event terdaftar</span>
        </div>
      </div>

      {/* Tickets Sold Card */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm">
        <div className="flex items-center justify-between text-espresso-secondary mb-2">
          <span className="text-xs font-semibold">Tiket Terjual</span>
          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
            <Ticket className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-espresso">
          {totalSoldEstimated.toLocaleString("id-ID")}
          <span className="text-xs font-normal text-espresso-muted ml-1">/ {totalQuota.toLocaleString("id-ID")} slot</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-brand h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(percentageSold, 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-espresso">{percentageSold}%</span>
        </div>
      </div>

      {/* Managed Events Card */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm">
        <div className="flex items-center justify-between text-espresso-secondary mb-2">
          <span className="text-xs font-semibold">Event Lari Aktif</span>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-espresso">
          {events.length}
          <span className="text-xs font-normal text-espresso-muted ml-1">Race</span>
        </div>
        <div className="text-[11px] text-espresso-muted mt-2">
          {events.filter((e) => e.status === "published").length} dipublikasikan, {events.filter((e) => e.status === "draft").length} draft
        </div>
      </div>

      {/* Check-in Progress Card */}
      <div className="bg-white rounded-card p-5 border border-sand-border shadow-warm">
        <div className="flex items-center justify-between text-espresso-secondary mb-2">
          <span className="text-xs font-semibold">Check-in Valid</span>
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-accent-success flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-xl font-black text-espresso">
          {checkedInCount}
          <span className="text-xs font-normal text-espresso-muted ml-1">peserta</span>
        </div>
        <div className="text-[11px] text-accent-success font-medium mt-2 flex items-center gap-1">
          <span>Gate validator aktif</span>
        </div>
      </div>
    </div>
  );
}
