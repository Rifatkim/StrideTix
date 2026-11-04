import { NextResponse } from "next/server";
import { sendTicketConfirmationEmail } from "@/services/emailService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      ticketCode,
      eventTitle,
      eventDate,
      startTime,
      venue,
      city,
      categoryName,
      bibName,
      participantName,
      qrPayload,
    } = body;

    if (!email || !ticketCode) {
      return NextResponse.json(
        { error: "Data tiket tidak lengkap." },
        { status: 400 }
      );
    }

    const result = await sendTicketConfirmationEmail({
      to: email,
      ticketCode,
      eventTitle: eventTitle || "Lomba Lari StrideTix",
      eventDate: eventDate || "-",
      startTime: startTime || "-",
      venue: venue || "-",
      city: city || "-",
      categoryName: categoryName || "-",
      bibName: bibName || "RUNNER",
      participantName: participantName || "Runner",
      qrPayload: qrPayload || ticketCode,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Gagal mengirim ulang email tiket." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `E-Ticket resmi telah dikirimkan ke ${email}`,
    });
  } catch (err: any) {
    console.error("resend-confirmation error:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}

