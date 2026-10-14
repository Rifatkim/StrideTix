"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { RunnerProvider } from "@/context/RunnerContext";
import { StravaSimulatorBar } from "@/components/strava/StravaSimulatorBar";
import { ChatbotWidget } from "@/components/chat/ChatbotWidget";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RunnerProvider>
        {children}
        <ChatbotWidget />
        <StravaSimulatorBar />
      </RunnerProvider>
    </AuthProvider>
  );
}
