import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { sendTicketConfirmationEmail } from "@/services/emailService";
import { checkRateLimit } from "@/lib/security/rateLimit";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // OWASP A01: Wajibkan autentikasi sesi pelari
    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Akses ditolak. Silakan login untuk mengirim ulang tiket." },
        { status: 401 }
      );
    }

    // Rate limiting: maksimal 4 pengiriman ulang tiket per menit per user
    const rateCheck = checkRateLimit(`resend_tix_${user.id}`, 4, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan pengiriman tiket. Mohon tunggu sesaat." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { ticketCode, email } = body;

    if (!ticketCode) {
      return NextResponse.json(
        { error: "Kode tiket wajib disertakan." },
        { status: 400 }
      );
    }

    // OWASP A01 (IDOR / BOLA): Validasi kepemilikan tiket di database
    const adminClient = createClient(supabaseUrl, serviceRoleKey);
    const { data: ticket, error: ticketError } = await adminClient
      .from("tickets")
      .select("*, event_categories(*, running_events(*)), users(*)")
      .eq("ticket_code", ticketCode.trim().toUpperCase())
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Tiket tidak ditemukan dalam sistem." },
        { status: 404 }
      );
    }

    const isOwner = ticket.user_id === user.id;
    const isOrganizer = ticket.event_categories?.running_events?.organizer_id === user.id;

    if (!isOwner && !isOrganizer) {
      return NextResponse.json(
        { error: "Akses ditolak. Anda tidak memiliki izin untuk mengirim tiket ini." },
        { status: 403 }
      );
    }

    const cat = ticket.event_categories || {};
    const evt = cat.running_events || {};
    const recipientEmail = (email || ticket.users?.email || user.email || "").trim();

    const result = await sendTicketConfirmationEmail({
      to: recipientEmail,
      ticketCode: ticket.ticket_code,
      eventTitle: evt.title || "Lomba Lari StrideTix",
      eventDate: evt.event_date || "-",
      startTime: evt.start_time || "-",
      venue: evt.location || "-",
      city: evt.city || "-",
      categoryName: cat.category_name || "-",
      bibName: (ticket.participant_name || user.user_metadata?.full_name || "RUNNER").toUpperCase(),
      participantName: ticket.participant_name || user.user_metadata?.full_name || "Peserta Lari",
      qrPayload: ticket.qr_code_hash || `STRIDETIX-TOKEN-${ticket.ticket_code}-VERIFIED`,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Gagal mengirim ulang email tiket." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `E-Ticket resmi telah dikirimkan ke ${recipientEmail}`,
    });
  } catch (err: any) {
    console.error("resend-confirmation error:", err);
    return NextResponse.json(
      { error: err.message || "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
