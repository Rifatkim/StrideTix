import { NextResponse } from "next/server";
import { sendPaymentInstructionEmail } from "@/services/emailService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
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
      to: email,
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

