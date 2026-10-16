"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import {
  RecommendationResult,
  SimulatedProfileId,
  SimulatedRunnerProfile,
} from "@/types";
import { MOCK_RUNNER_PROFILES } from "@/lib/mock-data/athletes";
import { calculateDistanceRecommendation } from "@/lib/scoring/engine";

interface RunnerContextValue {
  currentProfile: SimulatedRunnerProfile | null;
  selectedProfileId: SimulatedProfileId | "disconnected";
  setProfileById: (id: SimulatedProfileId | "disconnected") => void;
  recommendation: RecommendationResult | null;
  isConnectedToStrava: boolean;
}

const RunnerContext = createContext<RunnerContextValue | undefined>(undefined);

export function RunnerProvider({ children }: { children: React.ReactNode }) {
  // Default to disconnected (no dummy profile loaded)
  const [selectedProfileId, setSelectedProfileId] = useState<
    SimulatedProfileId | "disconnected"
  >("disconnected");

  const currentProfile = useMemo(() => {
    if (selectedProfileId === "disconnected") return null;
    return MOCK_RUNNER_PROFILES.find((p) => p.id === selectedProfileId) || null;
  }, [selectedProfileId]);

  const recommendation = useMemo(() => {
    if (!currentProfile) return null;
    return calculateDistanceRecommendation(currentProfile.summary);
  }, [currentProfile]);

  const setProfileById = (id: SimulatedProfileId | "disconnected") => {
    setSelectedProfileId(id);
  };

  const isConnectedToStrava = selectedProfileId !== "disconnected" && currentProfile !== null;

  return (
    <RunnerContext.Provider
      value={{
        currentProfile,
        selectedProfileId,
        setProfileById,
        recommendation,
        isConnectedToStrava,
      }}
    >
      {children}
    </RunnerContext.Provider>
  );
}

export function useRunner() {
  const context = useContext(RunnerContext);
  if (!context) {
    throw new Error("useRunner must be used within a RunnerProvider");
  }
  return context;
}
