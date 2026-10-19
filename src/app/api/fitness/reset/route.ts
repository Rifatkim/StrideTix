import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    // Reset status sinkronisasi di user_strava_sync
    await supabase
      .from("user_strava_sync")
      .update({ is_sync_active: false })
      .eq("user_id", user.id);

    // Reset nilai metrik di runner_profiles
    await supabase
      .from("runner_profiles")
      .upsert({
        user_id: user.id,
        avg_weekly_distance_km: 0,
        longest_run_km: 0,
        avg_pace_minutes_per_km: 0,
        weekly_frequency: 0,
        consistency_score: 0,
        last_calculated_at: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      message: "Data sinkronisasi kebugaran berhasil direset.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal mereset sinkronisasi.";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
