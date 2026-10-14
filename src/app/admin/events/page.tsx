"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StravaSimulatorBar } from "@/components/strava/StravaSimulatorBar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { EventModerationList } from "@/components/admin/EventModerationList";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getEvents, updateEventStatus } from "@/services/eventService";
import { addAuditLog } from "@/services/adminService";
import { RunningEvent, EventStatus } from "@/types";
import { Filter, Calendar } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<RunningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const loadData = async () => {
    const data = await getEvents();
    setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: EventStatus) => {
    setIsProcessing(id);
    const updated = await updateEventStatus(id, newStatus);
    if (updated) {
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      addAuditLog({
        action: newStatus === "published" ? "Event Disetujui & Diterbitkan" : "Event Ditarik ke Draft",
        actor: "Super Admin",
        target: updated.title,
        details: `Status event diubah menjadi ${newStatus}.`,
        type: "moderation",
      });
    }
    setIsProcessing(null);
  };

  const filtered = events.filter((e) => {
    if (filterStatus === "all") return true;
    return e.status === filterStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <StravaSimulatorBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AuthGuard allowedRole="admin">
        <AdminHeader
          title="Moderasi Event Lomba"
          subtitle="Tinjau kesesuaian kategori jarak, batas kuota peserta, dan kelayakan sertifikasi rute lomba sebelum tayang di katalog publik."
        />

        {/* Filter Toolbar */}
        <div className="bg-white rounded-card p-4 border border-sand-border shadow-warm flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-semibold text-espresso">
            <Filter className="w-4 h-4 text-brand" />
            <span>Filter Status:</span>
            <div className="flex items-center gap-1.5 ml-2">
              {[
                { label: "Semua", value: "all" },
                { label: "Tayang Publik", value: "published" },
                { label: "Draft / Antre Review", value: "draft" },
              ].map((st) => (
                <button
                  key={st.value}
                  onClick={() => setFilterStatus(st.value)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    filterStatus === st.value
                      ? "bg-brand text-white"
                      : "bg-sand-warm text-espresso-secondary hover:text-espresso"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-espresso-muted">
            Menampilkan {filtered.length} dari {events.length} event
          </div>
        </div>

        {/* Event List */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-espresso-muted">
            Memuat daftar moderasi event...
          </div>
        ) : (
          <EventModerationList
            events={filtered}
            onUpdateStatus={handleUpdateStatus}
            isProcessing={isProcessing}
          />
        )}
        </AuthGuard>
      </main>

      <Footer />
    </div>
  );
}
