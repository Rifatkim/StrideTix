import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { calculateFitnessSummaryFromManualInput } from "@/lib/fitness/fitnessMetrics";
import { calculateDistanceRecommendation } from "@/lib/scoring/engine";
import { ManualFitnessAssessmentInput } from "@/types/fitness";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ManualFitnessAssessmentInput;

    if (!body || typeof body.longestRunKm !== "number") {
      return NextResponse.json(
        { success: false, error: "Data penilaian mandiri tidak lengkap." },
        { status: 400 }
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
        await supabase.from("user_fitness_sync").upsert({
          user_id: user.id,
          sync_source: "manual",
          athlete_name: user.user_metadata?.full_name || "Pelari StrideTix",
          device_or_app: "Formulir Mandiri",
          total_activities_synced: summary.totalRuns,
          is_sync_active: true,
          last_synced_at: new Date().toISOString(),
        });

        await supabase.from("runner_profiles").upsert({
          user_id: user.id,
          avg_weekly_distance_km: summary.averageDistanceKm * summary.weeklyFrequency,
          longest_run_km: summary.longestRunKm,
          avg_pace_minutes_per_km: summary.averagePaceMinPerKm,
          weekly_frequency: Math.round(summary.weeklyFrequency),
          consistency_score: summary.consistencyScore,
          total_runs: summary.totalRuns,
          sync_source: "manual",
          last_calculated_at: new Date().toISOString(),
        });

        if (recommendation.recommendedCategory) {
          await supabase.from("event_recommendations").insert({
            user_id: user.id,
            recommended_category: recommendation.recommendedCategory,
            readiness_level: recommendation.readiness,
            confidence_level: `${recommendation.confidencePercentage}%`,
            ai_explanation: recommendation.reasons.join(" "),
            calculated_metrics: summary,
          });
        }
      }
    } catch {
      // Abaikan jika offline
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
