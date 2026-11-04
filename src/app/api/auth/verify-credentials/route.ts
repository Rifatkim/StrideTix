import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { valid: false, error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { valid: false, error: "Konfigurasi server Supabase belum lengkap." },
        { status: 500 }
      );
    }

    // Client terisolasi tanpa persistensi sesi atau cookie
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        {
          valid: false,
          error: "Email atau password yang Anda masukkan salah.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: "Kredensial email dan password valid.",
    });
  } catch (err: any) {
    console.error("[Verify Credentials Error]:", err);
    return NextResponse.json(
      { valid: false, error: err.message || "Gagal memverifikasi kredensial akun." },
      { status: 500 }
    );
  }
}

