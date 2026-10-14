import { ConfidenceLevel, DistanceCategory } from "@/types";

export const CATEGORY_TIERS: Record<DistanceCategory, number> = {
  "5K": 1,
  "10K": 2,
  "Half Marathon": 3,
  "Full Marathon": 4,
};

export interface CategoryBenchmark {
  category: DistanceCategory;
  minLongestRunKm: number;
  minAverageDistanceKm: number;
  minWeeklyFrequency: number;
  minTotalRuns: number;
}

export const CATEGORY_BENCHMARKS: CategoryBenchmark[] = [
  {
    category: "Full Marathon",
    minLongestRunKm: 26.0,
    minAverageDistanceKm: 12.0,
    minWeeklyFrequency: 3.8,
    minTotalRuns: 24,
  },
  {
    category: "Half Marathon",
    minLongestRunKm: 14.0,
    minAverageDistanceKm: 8.0,
    minWeeklyFrequency: 2.8,
    minTotalRuns: 16,
  },
  {
    category: "10K",
    minLongestRunKm: 7.5,
    minAverageDistanceKm: 5.0,
    minWeeklyFrequency: 2.0,
    minTotalRuns: 8,
  },
  {
    category: "5K",
    minLongestRunKm: 3.5,
    minAverageDistanceKm: 2.5,
    minWeeklyFrequency: 1.2,
    minTotalRuns: 3,
  },
];

export function calculateConfidenceScore(
  totalRuns: number,
  consistencyScore: number,
  weeklyFrequency: number
): { percentage: number; level: ConfidenceLevel } {
  // Volume score (max 40 pts)
  const volumeScore = Math.min(40, (totalRuns / 25) * 40);

  // Consistency score (max 35 pts)
  const consistencyNormalized = (Math.min(100, consistencyScore) / 100) * 35;

  // Frequency score (max 25 pts)
  const frequencyNormalized = Math.min(25, (weeklyFrequency / 4) * 25);

  const total = Math.round(volumeScore + consistencyNormalized + frequencyNormalized);
  const percentage = Math.min(99, Math.max(20, total));

  let level: ConfidenceLevel = "Low";
  if (percentage >= 80) {
    level = "High";
  } else if (percentage >= 55) {
    level = "Medium";
  }

  return { percentage, level };
}
