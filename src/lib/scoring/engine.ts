import {
  ConfidenceLevel,
  DistanceCategory,
  ReadinessLevel,
  RecommendationResult,
  RecommendationStatus,
  StravaActivitySummary,
} from "@/types";
import {
  CATEGORY_BENCHMARKS,
  CATEGORY_TIERS,
  calculateConfidenceScore,
} from "./rules";

export function calculateDistanceRecommendation(
  summary: StravaActivitySummary | null | undefined
): RecommendationResult {
  const calculatedAt = new Date().toISOString();

  // 1. Guard against null, empty, or insufficient data (< 3 runs or < 8km total)
  if (
    !summary ||
    summary.totalRuns < 3 ||
    summary.totalDistanceKm < 8 ||
    summary.longestRunKm < 3
  ) {
    return {
      status: "insufficient_data",
      recommendedCategory: null,
      readiness: "Belum Cukup Data",
      confidencePercentage: 25,
      confidenceLevel: "Low",
      reasons: [
        "Riwayat aktivitas lari pada profil Anda belum mencukupi ambang batas analisis (minimal 3 aktivitas lari).",
        "Rekomendasi personal membutuhkan data latihan rutin minimal dalam 4–8 minggu terakhir.",
      ],
      safetyNotes:
        "Tetap dapat memilih kategori tiket yang diinginkan secara mandiri. Disarankan memulai dari kategori 5K untuk adaptasi fisik.",
      calculatedAt,
      isEligibleForCategory: (selected) => ({
        isRecommended: false,
        isAboveRecommendation: false,
        warningMessage:
          "Data latihan belum cukup untuk memverifikasi kesiapan jarak ini. Pastikan Anda berlatih bertahap sebelum hari perlombaan.",
      }),
    };
  }

  // 2. Evaluate from the highest distance tier down to the lowest
  let recommendedCategory: DistanceCategory = "5K";
  let readiness: ReadinessLevel = "Cukup Siap";
  const reasons: string[] = [];

  for (const bench of CATEGORY_BENCHMARKS) {
    if (
      summary.longestRunKm >= bench.minLongestRunKm &&
      summary.averageDistanceKm >= bench.minAverageDistanceKm &&
      summary.weeklyFrequency >= bench.minWeeklyFrequency
    ) {
      recommendedCategory = bench.category;
      break;
    }
  }

  // 3. Determine Readiness Level
  if (recommendedCategory === "Full Marathon") {
    if (summary.longestRunKm >= 32 && summary.weeklyFrequency >= 4.0) {
      readiness = "Sangat Siap Berdasarkan Data Latihan";
    } else {
      readiness = "Siap";
    }
  } else if (recommendedCategory === "Half Marathon") {
    if (summary.longestRunKm >= 18) {
      readiness = "Sangat Siap Berdasarkan Data Latihan";
    } else {
      readiness = "Siap";
    }
  } else if (recommendedCategory === "10K") {
    if (summary.longestRunKm >= 10 && summary.weeklyFrequency >= 3) {
      readiness = "Sangat Siap Berdasarkan Data Latihan";
    } else {
      readiness = "Siap";
    }
  } else {
    // 5K
    if (summary.longestRunKm >= 5) {
      readiness = "Siap";
    } else {
      readiness = "Perlu Persiapan Tambahan";
    }
  }

  // 4. Build Structured Reasons
  reasons.push(
    `Frekuensi latihan Anda stabil rata-rata ${summary.weeklyFrequency.toFixed(1)}x per minggu.`
  );
  reasons.push(
    `Jarak tempuh lari terpanjang (long run) mencapai ${summary.longestRunKm.toFixed(1)} km, memenuhi standar ketahanan kategori ${recommendedCategory}.`
  );
  reasons.push(
    `Rata-rata jarak lari per sesi adalah ${summary.averageDistanceKm.toFixed(1)} km dengan skor konsistensi latihan ${summary.consistencyScore}%.`
  );

  // 5. Calculate Confidence Score
  const { percentage: confidencePercentage, level: confidenceLevel } =
    calculateConfidenceScore(
      summary.totalRuns,
      summary.consistencyScore,
      summary.weeklyFrequency
    );

  // 6. Map Status enum
  let status: RecommendationStatus = "recommended_5k";
  if (recommendedCategory === "10K") status = "recommended_10k";
  else if (recommendedCategory === "Half Marathon") status = "recommended_half_marathon";
  else if (recommendedCategory === "Full Marathon") status = "recommended_full_marathon";

  // 7. Safety Notes if Higher Categories exist
  let safetyNotes: string | undefined;
  if (recommendedCategory !== "Full Marathon") {
    const higherTiers = Object.keys(CATEGORY_TIERS).filter(
      (cat) => CATEGORY_TIERS[cat as DistanceCategory] > CATEGORY_TIERS[recommendedCategory]
    );
    if (higherTiers.length > 0) {
      safetyNotes = `Berdasarkan volume latihan 8 minggu terakhir, kategori ${higherTiers.join(" & ")} berada di atas rekomendasi saat ini. Disarankan meningkatkan long run secara berkala sebelum memilih jarak tersebut.`;
    }
  }

  // 8. Eligibility helper
  const isEligibleForCategory = (selectedCategory: DistanceCategory) => {
    const recommendedTier = CATEGORY_TIERS[recommendedCategory];
    const selectedTier = CATEGORY_TIERS[selectedCategory];

    const isRecommended = selectedCategory === recommendedCategory;
    const isAboveRecommendation = selectedTier > recommendedTier;

    let warningMessage: string | undefined;
    if (isAboveRecommendation) {
      warningMessage = `Kategori ${selectedCategory} berada di atas rekomendasi latihan Anda (${recommendedCategory}). Long run terpanjang Anda saat ini (${summary.longestRunKm} km) belum optimal untuk jarak ${selectedCategory}.`;
    }

    return {
      isRecommended,
      isAboveRecommendation,
      warningMessage,
    };
  };

  return {
    status,
    recommendedCategory,
    readiness,
    confidencePercentage,
    confidenceLevel,
    reasons,
    safetyNotes,
    calculatedAt,
    isEligibleForCategory,
  };
}
