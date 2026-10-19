import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { calculateDistanceRecommendation } from "@/lib/scoring/engine";
import { StravaActivitySummary } from "@/types/strava";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({
        isConnected: false,
        syncSource: "manual",
        athleteName: "Tamu",
        totalActivities: 0,
        lastSyncedAt: null,
        summary: null,
        recommendation: null,
      });
    }

    const { data: profileData } = await supabase
      .from("runner_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: syncData } = await supabase
      .from("user_strava_sync")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: recData } = await supabase
      .from("event_recommendations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!profileData || (profileData.longest_run_km === 0 && profileData.avg_weekly_distance_km === 0)) {
      return NextResponse.json({
        isConnected: false,
        syncSource: syncData?.access_token || "manual",
        athleteName: syncData?.strava_athlete_id || user.user_metadata?.full_name || "Pelari StrideTix",
        totalActivities: 0,
        lastSyncedAt: syncData?.last_synced_at || null,
        summary: null,
        recommendation: null,
      });
    }

    const metrics = (recData?.calculated_metrics as Record<string, number> | undefined) || {};
    const totalRuns = metrics.totalRuns || 35;
    const totalDistanceKm = metrics.totalDistanceKm || parseFloat(((profileData.avg_weekly_distance_km || 12.7) * 8).toFixed(1));

    const summary: StravaActivitySummary = {
      athleteId: 10003,
      analysisPeriodWeeks: 8,
      totalRuns,
      totalDistanceKm,
      averageDistanceKm: parseFloat(
        (
          (profileData.avg_weekly_distance_km || 12) /
          Math.max(1, profileData.weekly_frequency || 3)
        ).toFixed(1)
      ),
      longestRunKm: profileData.longest_run_km || 3.1,
      averagePaceMinPerKm: profileData.avg_pace_minutes_per_km || 9.88,
      weeklyFrequency: profileData.weekly_frequency || 4,
      consistencyScore: profileData.consistency_score || 95,
      lastRunDate:
        profileData.last_calculated_at?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
    };

    const recommendation = recData
      ? {
          recommendedCategory: recData.recommended_category,
          readiness: recData.readiness_level,
          confidencePercentage: parseInt(recData.confidence_level?.replace("%", "") || "95", 10),
          reasoning: recData.ai_explanation || "",
          targetCategory: recData.recommended_category,
        }
      : calculateDistanceRecommendation(summary);

    return NextResponse.json({
      isConnected: true,
      syncSource: syncData?.access_token || "csv_upload",
      athleteName: syncData?.strava_athlete_id || user.user_metadata?.full_name || "Pelari StrideTix",
      deviceOrApp: syncData?.access_token === "gpx_upload" ? "GPX Activity" : "Strava CSV Export",
      totalActivities: totalRuns,
      lastSyncedAt: syncData?.last_synced_at || profileData.last_calculated_at,
      summary,
      recommendation,
    });
  } catch {
    return NextResponse.json({
      isConnected: false,
      syncSource: "manual",
      athleteName: "Pelari",
      totalActivities: 0,
      lastSyncedAt: null,
      summary: null,
      recommendation: null,
    });
  }
}
