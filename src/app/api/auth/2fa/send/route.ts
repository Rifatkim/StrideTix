import { NextResponse } from "next/server";
import { generateOtp } from "@/lib/otpStore";
import { sendOtpVerificationEmail } from "@/services/emailService";
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

    const normalizedEmail = email.toLowerCase().trim();

    // OWASP A05: Rate limit pengiriman OTP (maksimal 4x per 5 menit per email)
    const rateCheck = checkRateLimit(`otp_send_${normalizedEmail}`, 4, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Terlalu banyak permintaan kode OTP dalam waktu singkat. Mohon tunggu beberapa menit sebelum meminta kode baru.",
        },
        { status: 429 }
      );
    }

    const otpCode = generateOtp(normalizedEmail);
    // CWE-532: Jangan pernah mencatat kode OTP plain di server log
    console.log(`[2FA OTP] Generated code dispatched for recipient: ${normalizedEmail}`);

    const result = await sendOtpVerificationEmail({
      to: normalizedEmail,
      otpCode,
      purpose: "Verifikasi Dua Langkah (2FA) StrideTix",
    });

    if (!result.success) {
      console.error("[2FA OTP] Error delivering email via Resend:", result.error);
      return NextResponse.json(
        { error: result.error || "Gagal mengirimkan email kode OTP via Resend." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kode OTP 6-digit berhasil dikirim ke email Anda.",
      emailDeliveryId: result.id,
    });
  } catch (err: any) {
    console.error("[2FA OTP Send API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
