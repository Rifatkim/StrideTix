import { StravaActivitySummary } from "@/types/strava";
import { FitnessActivity, ManualFitnessAssessmentInput } from "@/types/fitness";

/**
 * Menghitung ringkasan metrik latihan dari daftar aktivitas lari.
 * Output ini kompatibel 100% dengan Deterministic Scoring Engine StrideTix.
 */
export function calculateFitnessSummaryFromActivities(
  activities: FitnessActivity[],
  analysisPeriodWeeks: number = 8
): StravaActivitySummary | null {
  const runActivities = activities.filter((a) => a.type === "Run" && a.distanceKm > 0.5);

  if (runActivities.length === 0) {
    return null;
  }

  // Urutkan berdasarkan tanggal terbaru
  const sorted = [...runActivities].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const totalRuns = sorted.length;
  const totalDistanceKm = sorted.reduce((sum, a) => sum + a.distanceKm, 0);
  const averageDistanceKm = totalDistanceKm / totalRuns;
  const longestRunKm = Math.max(...sorted.map((a) => a.distanceKm));

  // Rata-rata pace terbobot oleh jarak
  let totalTimeMinutes = 0;
  sorted.forEach((a) => {
    totalTimeMinutes += a.movingTimeSeconds / 60;
  });
  const averagePaceMinPerKm = totalDistanceKm > 0 ? totalTimeMinutes / totalDistanceKm : 6.0;

  // Frekuensi mingguan
  const effectiveWeeks = Math.max(1, Math.min(analysisPeriodWeeks, 12));
  const weeklyFrequency = totalRuns / effectiveWeeks;

  // Skor konsistensi (0 - 100) berdasarkan sebaran lari mingguan
  let consistencyScore = 50;
  if (totalRuns >= 8 && weeklyFrequency >= 2.5) {
    consistencyScore = Math.min(95, 70 + Math.round(weeklyFrequency * 6));
  } else if (totalRuns >= 4) {
    consistencyScore = Math.min(75, 45 + Math.round(weeklyFrequency * 8));
  } else {
    consistencyScore = Math.max(20, Math.round(totalRuns * 10));
  }

  return {
    athleteId: 10001,
    analysisPeriodWeeks: effectiveWeeks,
    totalRuns,
    totalDistanceKm: parseFloat(totalDistanceKm.toFixed(1)),
    averageDistanceKm: parseFloat(averageDistanceKm.toFixed(1)),
    longestRunKm: parseFloat(longestRunKm.toFixed(1)),
    averagePaceMinPerKm: parseFloat(averagePaceMinPerKm.toFixed(2)),
    weeklyFrequency: parseFloat(weeklyFrequency.toFixed(1)),
    consistencyScore,
    lastRunDate: sorted[0]?.startDate ? sorted[0].startDate.split("T")[0] : new Date().toISOString().split("T")[0],
  };
}

/**
 * Menghasilkan ringkasan metrik dari input form penilaian mandiri (Manual Assessment).
 */
export function calculateFitnessSummaryFromManualInput(
  input: ManualFitnessAssessmentInput
): StravaActivitySummary {
  const longestRunKm = Math.max(1, input.longestRunKm);
  const weeklyFrequency = Math.max(0.5, input.weeklyFrequency);
  const averagePaceMinPerKm = Math.max(3.5, Math.min(12.0, input.averagePaceMinPerKm));

  // Estimasi rata-rata jarak per lari (sekitar 55-70% dari long run)
  const averageDistanceKm = parseFloat(Math.max(2.0, longestRunKm * 0.65).toFixed(1));

  // Periode analisis standar 8 minggu
  const analysisPeriodWeeks = 8;
  const totalRuns = input.totalRunsLastMonth
    ? input.totalRunsLastMonth * 2
    : Math.round(weeklyFrequency * analysisPeriodWeeks);

  const totalDistanceKm = parseFloat((totalRuns * averageDistanceKm).toFixed(1));

  // Skor konsistensi
  let consistencyScore = 60;
  if (weeklyFrequency >= 4.0) {
    consistencyScore = 90;
  } else if (weeklyFrequency >= 2.5) {
    consistencyScore = 80;
  } else if (weeklyFrequency >= 1.5) {
    consistencyScore = 65;
  } else {
    consistencyScore = 40;
  }

  return {
    athleteId: 10002,
    analysisPeriodWeeks,
    totalRuns,
    totalDistanceKm,
    averageDistanceKm,
    longestRunKm,
    averagePaceMinPerKm,
    weeklyFrequency: parseFloat(weeklyFrequency.toFixed(1)),
    consistencyScore,
    lastRunDate: input.lastRunDate || new Date().toISOString().split("T")[0],
  };
}
