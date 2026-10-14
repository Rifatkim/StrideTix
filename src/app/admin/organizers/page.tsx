"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StravaSimulatorBar } from "@/components/strava/StravaSimulatorBar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OrganizerVerificationList } from "@/components/admin/OrganizerVerificationList";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  getOrganizerApplications,
  approveOrganizer,
  rejectOrganizer,
} from "@/services/adminService";
import { OrganizerApplication } from "@/types";
import { Building2, ShieldCheck, Filter } from "lucide-react";

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<OrganizerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const loadData = async () => {
    const data = await getOrganizerApplications();
    setOrganizers(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    setIsProcessing(id);
    const updated = await approveOrganizer(id);
    if (updated) {
      setOrganizers((prev) => prev.map((o) => (o.id === id ? updated : o)));
    }
    setIsProcessing(null);
  };

  const handleReject = async (id: string, reason: string) => {
    setIsProcessing(id);
    const updated = await rejectOrganizer(id, reason);
    if (updated) {
      setOrganizers((prev) => prev.map((o) => (o.id === id ? updated : o)));
    }
    setIsProcessing(null);
  };

  const filtered = organizers.filter((o) => {
    if (filterStatus === "all") return true;
    return o.status === filterStatus;
  });

  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <StravaSimulatorBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AuthGuard allowedRole="admin">
        <AdminHeader
          title="Verifikasi Penyelenggara Lomba (EO)"
          subtitle="Tinjau portofolio penyelenggara, keabsahan dokumen legalitas perkumpulan/PT, dan tentukan status izin publikasi event."
        />

        {/* Filter Toolbar */}
        <div className="bg-white rounded-card p-4 border border-sand-border shadow-warm flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-semibold text-espresso">
            <Filter className="w-4 h-4 text-brand" />
            <span>Filter Status:</span>
            <div className="flex items-center gap-1.5 ml-2">
              {["all", "pending", "verified", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                    filterStatus === st
                      ? "bg-brand text-white"
                      : "bg-sand-warm text-espresso-secondary hover:text-espresso"
                  }`}
                >
                  {st === "all" ? "Semua" : st === "pending" ? "Antre Verifikasi" : st === "verified" ? "Terverifikasi" : "Ditolak"}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-espresso-muted">
            Menampilkan {filtered.length} dari {organizers.length} penyelenggara
          </div>
        </div>

        {/* List of Applications */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-espresso-muted">
            Memuat daftar permohonan penyelenggara...
          </div>
        ) : (
          <OrganizerVerificationList
            organizers={filtered}
            onApprove={handleApprove}
            onReject={handleReject}
            isProcessing={isProcessing}
          />
        )}
        </AuthGuard>
      </main>

      <Footer />
    </div>
  );
}
