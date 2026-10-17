import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";

export async function POST() {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("user_fitness_sync")
        .update({ is_sync_active: false })
        .eq("user_id", user.id);
    }

    return NextResponse.json({
      success: true,
      message: "Data sinkronisasi kebugaran berhasil direset.",
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal mereset sinkronisasi.";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
