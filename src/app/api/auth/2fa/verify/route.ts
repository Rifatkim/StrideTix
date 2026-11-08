import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otpStore";
import { checkRateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body as { email: string; otp?: string };
    const otpCode = (otp || (body as any)?.token || "").trim();

    if (!email || !otpCode) {
      return NextResponse.json(
        { error: "Email dan kode OTP wajib diisi." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // OWASP A05: Rate limit verifikasi OTP (maksimal 6x percobaan verifikasi per menit)
    const rateCheck = checkRateLimit(`otp_verify_${normalizedEmail}`, 6, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: "Terlalu banyak percobaan verifikasi kode OTP. Mohon tunggu 1 menit sebelum mencoba kembali.",
        },
        { status: 429 }
      );
    }

    const verification = verifyOtp(normalizedEmail, otpCode);

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
