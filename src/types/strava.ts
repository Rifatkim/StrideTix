export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  country: string;
  profileMedium: string;
}

export interface StravaRawActivity {
  id: number;
  name: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  elapsedTimeSeconds: number;
  startDate: string; // ISO date
  type: "Run" | "Ride" | "Walk" | string;
  averageSpeedMps: number;
}

export interface StravaActivitySummary {
  athleteId: number;
  analysisPeriodWeeks: number; // e.g. 8 weeks
  totalRuns: number;
  totalDistanceKm: number;
  averageDistanceKm: number;
  longestRunKm: number;
  averagePaceMinPerKm: number; // in decimal minutes e.g. 5.5 = 5:30 min/km
  weeklyFrequency: number; // average runs per week
  consistencyScore: number; // 0 to 100
  lastRunDate: string;
}

export type SimulatedProfileId = "beginner" | "intermediate" | "marathoner" | "empty";

export interface SimulatedRunnerProfile {
  id: SimulatedProfileId;
  label: string;
  description: string;
  athlete: StravaAthlete;
  summary: StravaActivitySummary;
}
