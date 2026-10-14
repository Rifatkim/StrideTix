"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StravaSimulatorBar } from "@/components/strava/StravaSimulatorBar";
import { ParticipantsFilterBar } from "@/components/organizer/ParticipantsFilterBar";
import { ParticipantsTable } from "@/components/organizer/ParticipantsTable";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getEventById } from "@/services/eventService";
import { getParticipantsByEvent, toggleTicketCheckIn } from "@/services/ticketService";
import { RunningEvent, ETicket } from "@/types";
import { formatDateIndonesian } from "@/lib/utils";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  QrCode,
  Calendar,
  MapPin,
  RefreshCw,
} from "lucide-react";

export default function EventParticipantsPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<RunningEvent | null>(null);
  const [participants, setParticipants] = useState<ETicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    async function loadData() {
      if (!eventId) return;
      const [eventData, participantsData] = await Promise.all([
        getEventById(eventId),
        getParticipantsByEvent(eventId),
      ]);
      setEvent(eventData);
      setParticipants(participantsData);
      setIsLoading(false);
    }
    loadData();
  }, [eventId]);

  const handleToggleCheckIn = async (ticketCode: string) => {
    setIsProcessing(ticketCode);
    const updated = await toggleTicketCheckIn(ticketCode);
    if (updated) {
      setParticipants((prev) =>
        prev.map((p) => (p.ticketCode === ticketCode ? updated : p))
      );
    }
    setIsProcessing(null);
  };

  // Available categories for filter dropdown
  const availableCategories = event ? event.categories.map((c) => c.name) : [];

  // Filtered participants
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      p.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.participantEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.bibName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ticketCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || p.categoryName === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const checkedInCount = participants.filter((p) => p.status === "checked_in").length;

  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <StravaSimulatorBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <AuthGuard allowedRole="organizer">
        {/* Back navigation */}
        <div>
          <Link
            href="/organizer/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-secondary hover:text-brand transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard Organizer</span>
          </Link>
        </div>

        {/* Header Event Summary Card */}
        <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand-50 px-2 py-0.5 rounded-full">
                  Manajemen Peserta Lomba
                </span>
                <span className="text-xs text-espresso-muted">
                  ID: {eventId}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-espresso">
                {event ? event.title : "Memuat data event..."}
              </h1>
              {event && (
                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-espresso-secondary mt-1.5">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-espresso-muted" />
                    {formatDateIndonesian(event.eventDate)}
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-espresso-muted" />
                    {event.locationVenue}, {event.locationCity}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/organizer/check-in"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                <span>Buka Gate Check-in QR</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-sand-border text-center">
            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80">
              <div className="text-xs text-espresso-secondary">Total Peserta</div>
              <div className="text-lg sm:text-xl font-black text-espresso">
                {participants.length}
              </div>
            </div>
            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80">
              <div className="text-xs text-accent-success font-semibold">Sudah Check-in</div>
              <div className="text-lg sm:text-xl font-black text-accent-success">
                {checkedInCount}
              </div>
            </div>
            <div className="bg-sand-warm/60 rounded-btn p-3 border border-sand-border/80">
              <div className="text-xs text-espresso-muted font-semibold">Belum Check-in</div>
              <div className="text-lg sm:text-xl font-black text-espresso-secondary">
                {participants.length - checkedInCount}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <ParticipantsFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          availableCategories={availableCategories}
        />

        {/* Participants Table */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-espresso-muted">
            Memuat daftar peserta lomba...
          </div>
        ) : (
          <ParticipantsTable
            participants={filteredParticipants}
            onToggleCheckIn={handleToggleCheckIn}
            isProcessing={isProcessing}
          />
        )}
        </AuthGuard>
      </main>

      <Footer />
    </div>
  );
}
