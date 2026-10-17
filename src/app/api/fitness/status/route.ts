import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { calculateDistanceRecommendation } from "@/lib/scoring/engine";
import { StravaActivitySummary } from "@/types/strava";

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

    const { data: syncData } = await supabase
      .from("user_fitness_sync")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: profileData } = await supabase
      .from("runner_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!syncData || !syncData.is_sync_active || !profileData) {
      return NextResponse.json({
        isConnected: false,
        syncSource: syncData?.sync_source || "manual",
        athleteName: syncData?.athlete_name || user.user_metadata?.full_name || "Pelari StrideTix",
        totalActivities: syncData?.total_activities_synced || 0,
        lastSyncedAt: syncData?.last_synced_at || null,
        summary: null,
        recommendation: null,
      });
    }

    const summary: StravaActivitySummary = {
      athleteId: 10003,
      analysisPeriodWeeks: 8,
      totalRuns: profileData.total_runs || 12,
      totalDistanceKm: parseFloat(
        ((profileData.avg_weekly_distance_km || 15) * 8).toFixed(1)
      ),
      averageDistanceKm: parseFloat(
        (
          (profileData.avg_weekly_distance_km || 15) /
          Math.max(1, profileData.weekly_frequency || 3)
        ).toFixed(1)
      ),
      longestRunKm: profileData.longest_run_km || 10,
      averagePaceMinPerKm: profileData.avg_pace_minutes_per_km || 5.8,
      weeklyFrequency: profileData.weekly_frequency || 3,
      consistencyScore: profileData.consistency_score || 75,
      lastRunDate:
        profileData.last_calculated_at?.split("T")[0] ||
        new Date().toISOString().split("T")[0],
    };

    const recommendation = calculateDistanceRecommendation(summary);

    return NextResponse.json({
      isConnected: true,
      syncSource: syncData.sync_source,
      athleteName: syncData.athlete_name,
      deviceOrApp: syncData.device_or_app,
      totalActivities: syncData.total_activities_synced,
      lastSyncedAt: syncData.last_synced_at,
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
