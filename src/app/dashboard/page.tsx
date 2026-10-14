"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StravaSimulatorBar } from "@/components/strava/StravaSimulatorBar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MyTicketsTab } from "@/components/dashboard/MyTicketsTab";
import { StravaAnalyticsTab } from "@/components/dashboard/StravaAnalyticsTab";
import { RunnerProfileTab } from "@/components/dashboard/RunnerProfileTab";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getAllUserTickets } from "@/services/ticketService";
import { ETicket } from "@/types";
import { Ticket, Activity, User, ShieldCheck } from "lucide-react";

type ActiveTab = "tickets" | "strava" | "profile";

export default function RunnerDashboardPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("tickets");
  const [tickets, setTickets] = useState<ETicket[]>([]);

  useEffect(() => {
    async function loadTickets() {
      const data = await getAllUserTickets();
      setTickets(data);
    }
    loadTickets();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <StravaSimulatorBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AuthGuard allowedRole="runner">
          {/* Header Section */}
        <DashboardHeader ticketCount={tickets.length} />

        {/* Tab Navigation */}
        <div className="border-b border-sand-border flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("tickets")}
            className={`inline-flex items-center gap-2 pb-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "tickets"
                ? "border-brand text-brand"
                : "border-transparent text-espresso-secondary hover:text-espresso"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Tiket Saya ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("strava")}
            className={`inline-flex items-center gap-2 pb-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "strava"
                ? "border-brand text-brand"
                : "border-transparent text-espresso-secondary hover:text-espresso"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Analisis Strava & Rekomendasi</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`inline-flex items-center gap-2 pb-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "profile"
                ? "border-brand text-brand"
                : "border-transparent text-espresso-secondary hover:text-espresso"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profil & Kontak Darurat</span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="animate-in fade-in duration-200">
          {activeTab === "tickets" && <MyTicketsTab />}
          {activeTab === "strava" && <StravaAnalyticsTab />}
          {activeTab === "profile" && <RunnerProfileTab />}
        </div>
        </AuthGuard>
      </main>

      <Footer />
    </div>
  );
}
