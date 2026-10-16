"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { RunningEvent } from "@/types";
import { PublicLandingHome } from "./PublicLandingHome";
import { RunnerLandingHome } from "./RunnerLandingHome";
import { OrganizerLandingHome } from "./OrganizerLandingHome";
import { AdminLandingHome } from "./AdminLandingHome";
import { Loader2 } from "lucide-react";

interface HomeViewDispatcherProps {
  events: RunningEvent[];
}

export function HomeViewDispatcher({ events }: HomeViewDispatcherProps) {
  const { currentUser, role, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-2 text-xs text-espresso-muted">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
        <span>Menyiapkan portal StrideTix...</span>
      </div>
    );
  }

  // 1. GUEST (Belum Login): Public Marketing Landing Page
  if (!currentUser) {
    return <PublicLandingHome events={events} />;
  }

  // 2. RUNNER (Sudah Login): Dedicated Runner Portal & Event Discovery
  if (role === "runner") {
    return <RunnerLandingHome events={events} />;
  }

  // 3. ORGANIZER (Sudah Login): Dedicated Organizer Hub Landing
  if (role === "organizer") {
    return <OrganizerLandingHome events={events} />;
  }

  // 4. ADMIN (Sudah Login): Dedicated Platform Governance Landing
  if (role === "admin") {
    return <AdminLandingHome events={events} />;
  }

  // Fallback to Public Landing
  return <PublicLandingHome events={events} />;
}
