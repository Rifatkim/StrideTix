import { NextResponse } from "next/server";
import { generateOtp } from "@/lib/otpStore";
import { sendOtpVerificationEmail } from "@/services/emailService";

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

    const otpCode = generateOtp(email);
    console.log(`[2FA OTP] Generated code for ${email}: ${otpCode}`);

    const result = await sendOtpVerificationEmail({
      to: email,
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

