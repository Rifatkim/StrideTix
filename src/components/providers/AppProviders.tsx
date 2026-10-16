"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { RunnerProvider } from "@/context/RunnerContext";
import { ChatbotWidget } from "@/components/chat/ChatbotWidget";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RunnerProvider>
        {children}
        <ChatbotWidget />
        <MobileBottomNav />
      </RunnerProvider>
    </AuthProvider>
  );
}
