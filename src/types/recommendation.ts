import { DistanceCategory } from "./event";

export type RecommendationStatus =
  | "insufficient_data"
  | "recommended_5k"
  | "recommended_10k"
  | "recommended_half_marathon"
  | "recommended_full_marathon";

export type ReadinessLevel =
  | "Belum Cukup Data"
  | "Perlu Persiapan Tambahan"
  | "Cukup Siap"
  | "Siap"
  | "Sangat Siap Berdasarkan Data Latihan";

export type ConfidenceLevel = "Low" | "Medium" | "High";

export interface RecommendationResult {
  status: RecommendationStatus;
  recommendedCategory: DistanceCategory | null;
  readiness: ReadinessLevel;
  confidencePercentage: number; // 0 - 100
  confidenceLevel: ConfidenceLevel;
  reasons: string[];
  safetyNotes?: string;
  calculatedAt: string;
  isEligibleForCategory: (selectedCategory: DistanceCategory) => {
    isRecommended: boolean;
    isAboveRecommendation: boolean;
    warningMessage?: string;
  };
}

export interface SafetyWarningAcknowledgment {
  selectedCategory: DistanceCategory;
  recommendedCategory: DistanceCategory | null;
  acknowledged: boolean;
  timestamp: string;
}
