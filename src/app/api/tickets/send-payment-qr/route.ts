import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { sendPaymentInstructionEmail } from "@/services/emailService";
import { checkRateLimit } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // OWASP A01: Wajibkan autentikasi sesi pelari sebelum memicu email relay
    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Akses ditolak. Silakan login untuk mengirimkan tagihan pembayaran." },
        { status: 401 }
      );
    }

    // Rate limiting: maksimal 6 pengiriman instruksi bayar per menit per user
    const rateCheck = checkRateLimit(`send_qr_${user.id}`, 6, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan pengiriman tagihan. Mohon tunggu sesaat." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      email,
      participantName,
      eventTitle,
      categoryName,
      totalAmount,
      paymentMethod,
      vaNumber,
      bankName,
      qrisValue,
    } = body;

    if (!email || !eventTitle) {
      return NextResponse.json(
        { error: "Email dan data pendaftaran tidak lengkap." },
        { status: 400 }
      );
    }

    const result = await sendPaymentInstructionEmail({
      to: email.trim(),
      participantName: participantName || "Runner",
      eventTitle,
      categoryName: categoryName || "Tiket Lomba",
      totalAmount: Number(totalAmount) || 0,
      paymentMethod: paymentMethod === "va" ? "va" : "qris",
      vaNumber,
      bankName,
      qrisValue,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Gagal mengirim email instruksi pembayaran." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Instruksi pembayaran berhasil dikirim ke ${email}`,
    });
  } catch (err: any) {
    console.error("send-payment-qr error:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
