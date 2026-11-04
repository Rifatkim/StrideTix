import { NextResponse } from "next/server";
import { sendEmail } from "@/services/emailService";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const to = searchParams.get("to") || "oss.tam1137@gmail.com";

  const result = await sendEmail({
    to,
    subject: "Test Koneksi Resend API - StrideTix",
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #2B1E16;">
        <h2 style="color: #EA580C;">StrideTix x Resend Sukses!</h2>
        <p>Integrasi Resend API dengan domain <strong>oscartambunan.my.id</strong> berhasil tersambung ke project StrideTix.</p>
        <p style="font-size: 12px; color: #786B62;">Waktu Pengiriman: ${new Date().toLocaleString("id-ID")}</p>
      </div>
    `,
    text: "Integrasi Resend API ke StrideTix berhasil!",
  });

  return NextResponse.json({
    status: result.success ? "success" : "failed",
    to,
    resendResult: result,
  });
}

