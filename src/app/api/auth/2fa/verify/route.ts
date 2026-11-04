import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otpStore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body as { email: string; otp: string };

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email dan kode OTP wajib diisi." },
        { status: 400 }
      );
    }

    const verification = verifyOtp(email, otp);

    if (!verification.valid) {
      return NextResponse.json(
        { error: verification.error || "Kode OTP tidak valid." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verifikasi 2FA berhasil.",
    });
  } catch (err: any) {
    console.error("[2FA OTP Verify API Error]:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

