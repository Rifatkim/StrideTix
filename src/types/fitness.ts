import { StravaActivitySummary, StravaAthlete, SimulatedProfileId } from "./strava";

export type FitnessSyncSource =
  | "manual"
  | "gpx_upload"
  | "csv_upload"
  | "strava"
  | "preset_persona";

export interface FitnessActivity {
  id: string;
  name: string;
  type: "Run" | "Walk" | "Ride" | string;
  distanceKm: number;
  movingTimeSeconds: number;
  averagePaceMinPerKm: number;
  startDate: string; // ISO date
  source: FitnessSyncSource;
  rawFileName?: string;
}

export interface ManualFitnessAssessmentInput {
  longestRunKm: number;
  weeklyFrequency: number;
  averagePaceMinPerKm: number;
  totalRunsLastMonth?: number;
  lastRunDate?: string;
}

export interface FitnessSyncStatus {
  isConnected: boolean;
  syncSource: FitnessSyncSource;
  athleteName: string;
  deviceOrApp: string;
  totalActivities: number;
  lastSyncedAt: string | null;
  summary: StravaActivitySummary | null;
  activePersonaId?: SimulatedProfileId;
}

export interface FileUploadParseResult {
  success: boolean;
  message: string;
  activities: FitnessActivity[];
  summary: StravaActivitySummary | null;
  error?: string;
}
