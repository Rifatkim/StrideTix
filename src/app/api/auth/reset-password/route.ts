import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendPasswordResetEmail } from "@/services/emailService";
import { checkRateLimit } from "@/lib/security/rateLimit";

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

    const normalizedEmail = email.trim().toLowerCase();

    // OWASP A05: Rate limit permintaan reset password (maksimal 4x per 10 menit per email)
    const rateCheck = checkRateLimit(`reset_pwd_${normalizedEmail}`, 4, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan reset password. Mohon tunggu beberapa saat sebelum mencoba kembali.",
        },
        { status: 429 }
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

    const url = new URL(request.url);
    const origin = url.origin;
    const redirectTo = `${origin}/login?reset=success`;

    // Buat link recovery via Supabase Admin API
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: normalizedEmail,
      options: {
        redirectTo,
      },
    });

    // OWASP A07: Anti-User Enumeration Protection
    // Jika email tidak terdaftar di sistem, tetap kembalikan pesan generik seragam
    if (error || !data?.properties?.action_link) {
      console.warn("[Reset Password] Info (user might not exist):", error?.message);
      return NextResponse.json({
        success: true,
        message: `Jika alamat email Anda terdaftar, tautan reset password telah dikirim ke ${email}. Silakan periksa kotak masuk atau folder spam Anda.`,
      });
    }

    const actionLink = data.properties.action_link;

    // Kirim email pemulihan via Resend API
    const emailResult = await sendPasswordResetEmail({
      to: normalizedEmail,
      resetLink: actionLink,
    });

    if (!emailResult.success) {
      console.error("[Reset Password Email Error]:", emailResult.error);
      return NextResponse.json(
        {
          error: emailResult.error || "Gagal mengirimkan email melalui server Resend.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Tautan reset password berhasil dikirim ke ${email}. Silakan periksa kotak masuk atau folder spam Anda.`,
    });
  } catch (err: any) {
    console.error("[Reset Password Route Exception]:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
