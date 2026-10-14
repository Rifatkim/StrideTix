"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StravaSimulatorBar } from "@/components/strava/StravaSimulatorBar";
import { CheckInValidator } from "@/components/organizer/CheckInValidator";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface CheckInPageProps {
  searchParams: {
    code?: string;
  };
}

export default function CheckInPage({ searchParams }: CheckInPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <StravaSimulatorBar />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AuthGuard allowedRole="organizer">
          <CheckInValidator initialCode={searchParams?.code} />
        </AuthGuard>
      </main>

      <Footer />
    </div>
  );
}
