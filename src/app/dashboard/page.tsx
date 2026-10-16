"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MyTicketsTab } from "@/components/dashboard/MyTicketsTab";
import { StravaAnalyticsTab } from "@/components/dashboard/StravaAnalyticsTab";
import { RunnerProfileTab } from "@/components/dashboard/RunnerProfileTab";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getAllUserTickets } from "@/services/ticketService";
import { ETicket } from "@/types";
import { Ticket, Activity, User, Loader2 } from "lucide-react";

type ActiveTab = "tickets" | "strava" | "profile";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab") as ActiveTab | null;

  const [activeTab, setActiveTab] = useState<ActiveTab>("tickets");
  const [tickets, setTickets] = useState<ETicket[]>([]);

  // Synchronize active tab with URL query parameter
  useEffect(() => {
    if (tabParam && (tabParam === "tickets" || tabParam === "strava" || tabParam === "profile")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    async function loadTickets() {
      const data = await getAllUserTickets();
      setTickets(data);
    }
    loadTickets();
  }, []);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    router.replace(`/dashboard?tab=${tab}`, { scroll: false });
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-32 md:pb-12">
      <AuthGuard allowedRole="runner">
        {/* Header Section */}
        <DashboardHeader ticketCount={tickets.length} />

        {/* Tab Navigation */}
        <div className="border-b border-sand-border flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => handleTabChange("tickets")}
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
            onClick={() => handleTabChange("strava")}
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
            onClick={() => handleTabChange("profile")}
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
  );
}

export default function RunnerDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
      <Footer />
    </div>
  );
}
