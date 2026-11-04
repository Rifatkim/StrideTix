import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/services/emailService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Konfigurasi server database auth belum lengkap." },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Tentukan origin callback untuk redirect ke form Buat Password Baru
    const url = new URL(request.url);
    const origin = url.origin;
    const redirectTo = `${origin}/login?reset=success`;

    // Buat link recovery via Supabase Admin API (TIDAK memakai SMTP Supabase yang terkena rate limit!)
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email.trim().toLowerCase(),
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error("[Reset Password Admin API Error]:", error);
      return NextResponse.json(
        { error: error.message || "Gagal membuat tautan reset password." },
        { status: 400 }
      );
    }

    const actionLink = data?.properties?.action_link;
    if (!actionLink) {
      return NextResponse.json(
        { error: "Gagal membuat tautan pemulihan akun." },
        { status: 500 }
      );
    }

    // Kirim email pemulihan via RESEND API (Domain resmi & tanpa limit SMTP Supabase)
    const emailResult = await sendPasswordResetEmail({
      to: email.trim(),
      resetLink: actionLink,
    });

    if (!emailResult.success) {
      console.error("[Reset Password Email Error]:", emailResult.error);
      return NextResponse.json(
        {
          error:
            emailResult.error || "Gagal mengirimkan email melalui server Resend.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Tautan reset password berhasil dikirim ke ${email}. Silakan periksa inbox atau folder spam Anda.`,
    });
  } catch (err: any) {
    console.error("[Reset Password Route Exception]:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}

