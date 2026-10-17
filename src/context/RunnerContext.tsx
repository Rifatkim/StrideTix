"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import {
  RecommendationResult,
  SimulatedProfileId,
  SimulatedRunnerProfile,
  StravaActivitySummary,
} from "@/types";
import {
  FitnessSyncSource,
  ManualFitnessAssessmentInput,
} from "@/types/fitness";
import { MOCK_RUNNER_PROFILES } from "@/lib/mock-data/athletes";
import { calculateDistanceRecommendation } from "@/lib/scoring/engine";

interface RunnerContextValue {
  currentProfile: SimulatedRunnerProfile | null;
  selectedProfileId: SimulatedProfileId | "disconnected" | "live_fitness";
  setProfileById: (id: SimulatedProfileId | "disconnected") => void;
  recommendation: RecommendationResult | null;
  isConnectedToStrava: boolean; // Alias untuk kompatibilitas UI
  fitnessSyncSource: FitnessSyncSource | null;
  fitnessDeviceOrApp: string;
  isLoading: boolean;
  syncErrorMessage: string | null;
  uploadFitnessFiles: (files: File[]) => Promise<{ success: boolean; message: string; error?: string }>;
  submitManualAssessment: (input: ManualFitnessAssessmentInput) => Promise<{ success: boolean; message: string; error?: string }>;
  resetFitnessData: () => Promise<void>;
}

const RunnerContext = createContext<RunnerContextValue | undefined>(undefined);

export function RunnerProvider({ children }: { children: React.ReactNode }) {
  const [selectedProfileId, setSelectedProfileId] = useState<
    SimulatedProfileId | "disconnected" | "live_fitness"
  >("disconnected");

  const [liveProfile, setLiveProfile] = useState<{
    summary: StravaActivitySummary;
    athleteName: string;
    syncSource: FitnessSyncSource;
    deviceOrApp: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);

  // Periksa apakah pengguna memiliki data sinkronisasi kebugaran di backend saat mount
  useEffect(() => {
    let isMounted = true;
    async function fetchInitialStatus() {
      try {
        const res = await fetch("/api/fitness/status");
        if (!res.ok) return;
        const data = await res.json();
        if (data.isConnected && data.summary && isMounted) {
          setLiveProfile({
            summary: data.summary,
            athleteName: data.athleteName || "Pelari StrideTix",
            syncSource: data.syncSource || "manual",
            deviceOrApp: data.deviceOrApp || "Manual Assessment",
          });
          setSelectedProfileId("live_fitness");
        }
      } catch {
        // Fallback offline
      }
    }
    fetchInitialStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  // Profil aktif
  const currentProfile = useMemo<SimulatedRunnerProfile | null>(() => {
    if (selectedProfileId === "disconnected") return null;

    if (selectedProfileId === "live_fitness" && liveProfile) {
      return {
        id: "intermediate", // Fallback ID untuk tipe
        label: `${liveProfile.athleteName} (${liveProfile.deviceOrApp})`,
        description: `Sinkronisasi data kebugaran via ${liveProfile.syncSource.replace("_", " ").toUpperCase()}`,
        athlete: {
          id: 10005,
          username: "live_runner",
          firstname: liveProfile.athleteName.split(" ")[0] || "Pelari",
          lastname: liveProfile.athleteName.split(" ").slice(1).join(" ") || "StrideTix",
          city: "Indonesia",
          country: "ID",
          profileMedium: "",
        },
        summary: liveProfile.summary,
      };
    }

    return (
      MOCK_RUNNER_PROFILES.find((p) => p.id === selectedProfileId) || null
    );
  }, [selectedProfileId, liveProfile]);

  // Rekomendasi deterministik
  const recommendation = useMemo(() => {
    if (!currentProfile) return null;
    return calculateDistanceRecommendation(currentProfile.summary);
  }, [currentProfile]);

  const setProfileById = useCallback((id: SimulatedProfileId | "disconnected") => {
    setSelectedProfileId(id);
    setSyncErrorMessage(null);
  }, []);

  // Upload File GPX / CSV
  const uploadFitnessFiles = useCallback(async (files: File[]) => {
    setIsLoading(true);
    setSyncErrorMessage(null);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("/api/fitness/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal memproses file upload.");
      }

      setLiveProfile({
        summary: data.summary,
        athleteName: "Pelari Terverifikasi",
        syncSource: files[0].name.endsWith(".gpx") ? "gpx_upload" : "csv_upload",
        deviceOrApp: files.length === 1 ? files[0].name : `${files.length} File Riwayat`,
      });
      setSelectedProfileId("live_fitness");

      return { success: true, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan upload.";
      setSyncErrorMessage(msg);
      return { success: false, message: msg, error: msg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit Penilaian Mandiri (Manual Form)
  const submitManualAssessment = useCallback(
    async (input: ManualFitnessAssessmentInput) => {
      setIsLoading(true);
      setSyncErrorMessage(null);
      try {
        const res = await fetch("/api/fitness/manual", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Gagal menyimpan penilaian mandiri.");
        }

        setLiveProfile({
          summary: data.summary,
          athleteName: "Pelari Terverifikasi",
          syncSource: "manual",
          deviceOrApp: "Formulir Mandiri",
        });
        setSelectedProfileId("live_fitness");

        return { success: true, message: data.message };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Terjadi kesalahan pengisian.";
        setSyncErrorMessage(msg);
        return { success: false, message: msg, error: msg };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Reset / Putus Akses
  const resetFitnessData = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch("/api/fitness/reset", { method: "POST" });
    } catch {
      // Abaikan jika offline
    } finally {
      setLiveProfile(null);
      setSelectedProfileId("disconnected");
      setIsLoading(false);
    }
  }, []);

  const isConnectedToStrava =
    selectedProfileId !== "disconnected" && currentProfile !== null;

  return (
    <RunnerContext.Provider
      value={{
        currentProfile,
        selectedProfileId,
        setProfileById,
        recommendation,
        isConnectedToStrava,
        fitnessSyncSource: liveProfile?.syncSource || null,
        fitnessDeviceOrApp: liveProfile?.deviceOrApp || "Simulasi Persona",
        isLoading,
        syncErrorMessage,
        uploadFitnessFiles,
        submitManualAssessment,
        resetFitnessData,
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
