import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { parseGpxContent } from "@/lib/fitness/gpxParser";
import { parseCsvActivities } from "@/lib/fitness/csvParser";
import { calculateFitnessSummaryFromActivities } from "@/lib/fitness/fitnessMetrics";
import { calculateDistanceRecommendation } from "@/lib/scoring/engine";
import { FitnessActivity } from "@/types/fitness";

export const dynamic = "force-dynamic";

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

    // OWASP A04/A05: Input caps to prevent Denial of Service (DoS)
    const MAX_FILES = 10;
    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB per file

    if (allUploadedFiles.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Batas maksimal upload adalah ${MAX_FILES} file sekaligus.` },
        { status: 400 }
      );
    }

    const parsedActivities: FitnessActivity[] = [];

    for (const file of allUploadedFiles) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { success: false, error: `Ukuran file "${file.name}" melebihi batas maksimal 5 MB.` },
          { status: 413 }
        );
      }

      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith(".gpx") && !fileName.endsWith(".csv")) {
        continue;
      }

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
        // 1. Simpan metrik ke runner_profiles (Tabel Inti Kebugaran)
        if (summary) {
          try {
            await supabase.from("runner_profiles").upsert({
              user_id: user.id,
              avg_weekly_distance_km: Number(
                (summary.averageDistanceKm * summary.weeklyFrequency).toFixed(2)
              ),
              longest_run_km: summary.longestRunKm,
              avg_pace_minutes_per_km: summary.averagePaceMinPerKm,
              weekly_frequency: Math.round(summary.weeklyFrequency),
              consistency_score: summary.consistencyScore,
              last_calculated_at: new Date().toISOString(),
            });
          } catch (profErr) {
            console.error("[Fitness Upload] Gagal upsert runner_profiles:", profErr);
          }

          // 2. Simpan rekomendasi resmi ke event_recommendations
          if (recommendation) {
            try {
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
            } catch (recErr) {
              console.warn("[Fitness Upload] Gagal upsert event_recommendations:", recErr);
            }
          }
        }

        // 3. Simpan status sync di user_fitness_sync (PRD Section 16.2)
        try {
          const isGpx = allUploadedFiles[0].name.toLowerCase().endsWith(".gpx");
          await supabase.from("user_fitness_sync").upsert({
            user_id: user.id,
            sync_source: isGpx ? "gpx_upload" : "csv_upload",
            athlete_name: user.user_metadata?.full_name || "Pelari StrideTix",
            device_or_app: isGpx ? "Smartwatch (GPX)" : "Aplikasi Lari (CSV)",
            total_activities_synced: parsedActivities.length,
            is_sync_active: true,
            last_synced_at: new Date().toISOString(),
          });
        } catch (syncErr) {
          console.warn("[Fitness Upload] Gagal update user_fitness_sync:", syncErr);
        }

        // 4. Simpan riwayat aktivitas ke raw_fitness_activities (PRD Section 16.2)
        try {
          const activityRows = parsedActivities.slice(0, 30).map((act) => ({
            user_id: user.id,
            activity_name: act.name || "Aktivitas Lari",
            activity_type: act.type || "Run",
            distance_meters: Math.round(act.distanceKm * 1000),
            moving_time_seconds: Math.round(act.movingTimeSeconds),
            average_speed_mps: Number(
              ((act.distanceKm * 1000) / Math.max(1, act.movingTimeSeconds)).toFixed(2)
            ),
            start_date: act.startDate || new Date().toISOString(),
            source: act.source === "csv_upload" ? "csv" : "gpx",
            raw_payload: {
              name: act.name,
              paceMinPerKm: act.averagePaceMinPerKm,
              type: act.type,
              source: act.source,
            },
          }));

          if (activityRows.length > 0) {
            await supabase.from("raw_fitness_activities").insert(activityRows);
          }
        } catch (rawErr) {
          console.warn("[Fitness Upload] Gagal insert raw_fitness_activities:", rawErr);
        }
      }
    } catch (dbErr) {
      console.warn("[Fitness Upload DB Warning]:", dbErr);
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
