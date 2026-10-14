"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldCheck,
  CalendarCheck,
  Receipt,
  ShieldAlert,
} from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
}

const ADMIN_NAV_ITEMS = [
  {
    label: "Ringkasan Platform",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Verifikasi EO",
    href: "/admin/organizers",
    icon: ShieldCheck,
  },
  {
    label: "Moderasi Event",
    href: "/admin/events",
    icon: CalendarCheck,
  },
  {
    label: "Transaksi & Audit",
    href: "/admin/transactions",
    icon: Receipt,
  },
];

export function AdminHeader({ title, subtitle, badge }: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand text-white uppercase tracking-wider">
              {badge || "Platform Administrator"}
            </span>
            <span className="text-xs text-espresso-muted">
              StrideTix Governance Center
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-espresso">{title}</h1>
          <p className="text-xs text-espresso-secondary mt-1">{subtitle}</p>
        </div>
      </div>

      {/* Admin Tab Bar */}
      <div className="border-b border-sand-border flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 pb-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-brand text-brand"
                  : "border-transparent text-espresso-secondary hover:text-espresso"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
