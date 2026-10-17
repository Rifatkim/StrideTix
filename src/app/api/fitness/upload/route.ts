import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { parseGpxContent } from "@/lib/fitness/gpxParser";
import { parseCsvActivities } from "@/lib/fitness/csvParser";
import { calculateFitnessSummaryFromActivities } from "@/lib/fitness/fitnessMetrics";
import { calculateDistanceRecommendation } from "@/lib/scoring/engine";
import { FitnessActivity } from "@/types/fitness";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const allUploadedFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (allUploadedFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tidak ada file GPX atau CSV yang diunggah." },
        { status: 400 }
      );
    }

    const parsedActivities: FitnessActivity[] = [];

    for (const file of allUploadedFiles) {
      const fileName = file.name.toLowerCase();
      const content = await file.text();

      if (fileName.endsWith(".gpx")) {
        const activity = parseGpxContent(content, file.name);
        if (activity.distanceKm > 0.2) {
          parsedActivities.push(activity);
        }
      } else if (fileName.endsWith(".csv")) {
        const activities = parseCsvActivities(content);
        parsedActivities.push(...activities);
      }
    }

    if (parsedActivities.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Format file tidak dikenali atau tidak ada aktivitas lari yang valid di dalamnya.",
        },
        { status: 422 }
      );
    }

    // Hitung ringkasan metrik latihan
    const summary = calculateFitnessSummaryFromActivities(parsedActivities);
    const recommendation = calculateDistanceRecommendation(summary);

    // Cek sesi autentikasi Supabase
    try {
      const cookieStore = cookies();
      const supabase = createServerSupabase(cookieStore);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Simpan / update status sync di Supabase
        await supabase.from("user_fitness_sync").upsert({
          user_id: user.id,
          sync_source: allUploadedFiles[0].name.endsWith(".gpx") ? "gpx_upload" : "csv_upload",
          athlete_name: user.user_metadata?.full_name || "Pelari StrideTix",
          device_or_app: allUploadedFiles.length === 1 ? allUploadedFiles[0].name : `${allUploadedFiles.length} File GPX/CSV`,
          total_activities_synced: parsedActivities.length,
          is_sync_active: true,
          last_synced_at: new Date().toISOString(),
        });

        // Simpan aktivitas ke raw_fitness_activities
        const activityRows = parsedActivities.slice(0, 50).map((act) => ({
          user_id: user.id,
          activity_name: act.name,
          activity_type: act.type,
          distance_meters: act.distanceKm * 1000,
          moving_time_seconds: act.movingTimeSeconds,
          average_speed_mps: (act.distanceKm * 1000) / Math.max(1, act.movingTimeSeconds),
          start_date: act.startDate,
          source: act.source === "gpx_upload" ? "gpx" : "csv",
          raw_payload: {
            paceMinPerKm: act.averagePaceMinPerKm,
            rawFileName: act.rawFileName,
          },
        }));

        await supabase.from("raw_fitness_activities").insert(activityRows);

        // Update runner_profiles
        if (summary) {
          await supabase.from("runner_profiles").upsert({
            user_id: user.id,
            avg_weekly_distance_km: summary.averageDistanceKm * summary.weeklyFrequency,
            longest_run_km: summary.longestRunKm,
            avg_pace_minutes_per_km: summary.averagePaceMinPerKm,
            weekly_frequency: Math.round(summary.weeklyFrequency),
            consistency_score: summary.consistencyScore,
            total_runs: summary.totalRuns,
            sync_source: "gpx_upload",
            last_calculated_at: new Date().toISOString(),
          });
        }
      }
    } catch {
      // Abaikan error database jika berjalan offline/sandbox
    }

    return NextResponse.json({
      success: true,
      message: `Berhasil mengekstrak ${parsedActivities.length} sesi aktivitas lari.`,
      activitiesCount: parsedActivities.length,
      activities: parsedActivities.slice(0, 10), // Kirim 10 aktivitas terbaru ke UI
      summary,
      recommendation,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memproses file upload.";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
