import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { calculateFitnessSummaryFromManualInput } from "@/lib/fitness/fitnessMetrics";
import { calculateDistanceRecommendation } from "@/lib/scoring/engine";
import { ManualFitnessAssessmentInput } from "@/types/fitness";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ManualFitnessAssessmentInput;

    // OWASP A04: Input Boundary Validation
    if (
      !body ||
      typeof body.longestRunKm !== "number" ||
      isNaN(body.longestRunKm) ||
      body.longestRunKm < 0.5 ||
      body.longestRunKm > 100
    ) {
      return NextResponse.json(
        { success: false, error: "Jarak lari terpanjang harus berupa angka antara 0.5 km hingga 100 km." },
        { status: 422 }
      );
    }

    if (
      body.weeklyFrequency !== undefined &&
      (typeof body.weeklyFrequency !== "number" ||
        isNaN(body.weeklyFrequency) ||
        body.weeklyFrequency < 1 ||
        body.weeklyFrequency > 14)
    ) {
      return NextResponse.json(
        { success: false, error: "Frekuensi lari mingguan harus antara 1 hingga 14 kali." },
        { status: 422 }
      );
    }

    const summary = calculateFitnessSummaryFromManualInput(body);
    const recommendation = calculateDistanceRecommendation(summary);

    // Persist ke Supabase jika login
    try {
      const cookieStore = cookies();
      const supabase = createServerSupabase(cookieStore);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 1. runner_profiles
        await supabase.from("runner_profiles").upsert({
          user_id: user.id,
          avg_weekly_distance_km: Number((summary.averageDistanceKm * summary.weeklyFrequency).toFixed(2)),
          longest_run_km: summary.longestRunKm,
          avg_pace_minutes_per_km: summary.averagePaceMinPerKm,
          weekly_frequency: Math.round(summary.weeklyFrequency),
          consistency_score: summary.consistencyScore,
          last_calculated_at: new Date().toISOString(),
        });

        // 2. event_recommendations
        if (recommendation.recommendedCategory) {
          await supabase.from("event_recommendations").upsert({
            user_id: user.id,
            recommended_category: recommendation.recommendedCategory,
            readiness_level: recommendation.readiness,
            confidence_level: `${recommendation.confidencePercentage}%`,
            ai_explanation: recommendation.reasons.join(". "),
            calculated_metrics: {
              longestRunKm: summary.longestRunKm,
              totalRuns: summary.totalRuns,
              averagePaceMinPerKm: summary.averagePaceMinPerKm,
              consistencyScore: summary.consistencyScore,
              totalDistanceKm: summary.totalDistanceKm,
            },
            created_at: new Date().toISOString(),
          });
        }

        // 3. user_fitness_sync (PRD Section 16.2)
        await supabase.from("user_fitness_sync").upsert({
          user_id: user.id,
          sync_source: "manual",
          athlete_name: user.user_metadata?.full_name || "Pelari StrideTix",
          device_or_app: "Formulir Penilaian Mandiri",
          total_activities_synced: summary.totalRuns,
          is_sync_active: true,
          last_synced_at: new Date().toISOString(),
        });
      }
    } catch (dbErr) {
      console.warn("[Manual Fitness Upload DB Warning]:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Data penilaian mandiri berhasil disimpan & dianalisis.",
      summary,
      recommendation,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memproses penilaian mandiri.";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
