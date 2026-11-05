import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/security/rateLimit";

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

    const normalizedEmail = email.trim().toLowerCase();

    // OWASP A07: Brute-force protection pada verifikasi login (maksimal 10x percobaan per menit)
    const rateCheck = checkRateLimit(`auth_verify_${normalizedEmail}`, 10, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          valid: false,
          error: "Terlalu banyak percobaan masuk yang gagal. Mohon tunggu 1 menit sebelum mencoba kembali.",
        },
        { status: 429 }
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
      email: normalizedEmail,
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
