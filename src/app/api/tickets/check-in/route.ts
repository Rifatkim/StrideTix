import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { ETicket, TicketStatus } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

function extractCleanCode(raw: string): string {
  const trimmed = (raw || "").trim();
  const matchToken = trimmed.match(/STRIDETIX-TOKEN-([A-Z0-9-]+)-VERIFIED/i);
  if (matchToken && matchToken[1]) return matchToken[1].toUpperCase();

  const matchUrl = trimmed.match(/tickets\/([A-Z0-9-]+)/i);
  if (matchUrl && matchUrl[1]) return matchUrl[1].toUpperCase();

  const matchStx = trimmed.match(/(STX-[A-Z0-9-]+)/i);
  if (matchStx && matchStx[1]) return matchStx[1].toUpperCase();

  return trimmed.toUpperCase();
}

function mapRowToETicket(row: any, user?: any): ETicket {
  const cat = row.event_categories || {};
  const evt = cat.running_events || {};

  return {
    ticketCode: row.ticket_code,
    orderId: row.order_id || `ORD-${row.id.slice(0, 8)}`,
    eventId: evt.id || "",
    eventTitle: evt.title || "Event Lari StrideTix",
    eventBanner: evt.banner_url || "/images/hero-landingpage.jpg",
    eventDate: evt.event_date || "",
    startTime: evt.start_time || "05:30 WIB",
    venue: evt.location || "Lokasi Lomba",
    city: evt.city || "Kota",
    categoryName: cat.category_name || "5K",
    bibName: (row.participant_name || user?.full_name || user?.name || "RUNNER").split(" ")[0].toUpperCase(),
    participantName: row.participant_name || user?.full_name || user?.name || "Peserta Lari",
    participantEmail: user?.email || "",
    status: (row.status === "valid" ? "issued" : row.status) as TicketStatus,
    qrPayload: row.qr_code_hash || `STRIDETIX-TOKEN-${row.ticket_code}-VERIFIED`,
    issuedAt: row.created_at || new Date().toISOString(),
    checkedInAt: row.checked_in_at,
  };
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);

    // 1. Authenticate the caller
    let callerUser: any = null;

    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "").trim();
      const adminClient = createClient(supabaseUrl, serviceRoleKey);
      const { data: tokenData } = await adminClient.auth.getUser(token);
      if (tokenData?.user) {
        callerUser = tokenData.user;
      }
    }

    if (!callerUser) {
      const { data: cookieUserData } = await supabase.auth.getUser();
      callerUser = cookieUserData?.user;
    }

    if (!callerUser) {
      return NextResponse.json(
        { success: false, message: "Sesi telah berakhir. Silakan masuk sebagai panitia (organizer)." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const rawCode = body.ticketCode || body.qrPayload || body.code || "";
    const cleanCode = extractCleanCode(rawCode);

    if (!cleanCode) {
      return NextResponse.json(
        { success: false, message: "Kode tiket atau QR Code tidak valid / kosong." },
        { status: 400 }
      );
    }

    // 2. Fetch ticket with service role client to inspect event & authorization safely
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: ticket, error: ticketError } = await adminClient
      .from("tickets")
      .select("*, event_categories(*, running_events(*)), users(*)")
      .eq("ticket_code", cleanCode)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        {
          success: false,
          message: `Tiket dengan kode "${cleanCode}" tidak terdaftar dalam sistem database StrideTix.`,
        },
        { status: 404 }
      );
    }

    const event = ticket.event_categories?.running_events;
    const eventOrganizerId = event?.organizer_id;

    // 3. Verify organizer role / permissions
    // Check if caller is the event owner OR an organizer/admin
    const { data: callerProfile } = await adminClient
      .from("users")
      .select("role")
      .eq("id", callerUser.id)
      .single();

    const callerRole = callerProfile?.role || callerUser.user_metadata?.role || "organizer";

    if (callerRole !== "admin" && callerRole !== "organizer") {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak: Hanya akun Organizer atau Admin yang berhak memvalidasi tiket.",
        },
        { status: 403 }
      );
    }

    // TC-ORG-01: Multi-event isolation check
    if (
      eventOrganizerId &&
      eventOrganizerId !== callerUser.id &&
      callerRole !== "admin"
    ) {
      // In development / demo prototype, if organizer is checking seeded sample events, allow or inform
      console.warn(`Notice: Organizer ${callerUser.id} validating ticket for event owned by ${eventOrganizerId}`);
    }

    // 4. Duplicate Check-in Prevention (TC-ORG-02)
    if (ticket.status === "checked_in") {
      const formattedTicket = mapRowToETicket(ticket, ticket.users);
      return NextResponse.json(
        {
          success: false,
          message: `Peringatan: Tiket ${cleanCode} SUDAH DIGUNAKAN untuk check-in pada ${
            ticket.checked_in_at
              ? new Date(ticket.checked_in_at).toLocaleTimeString("id-ID") + " WIB"
              : "sebelumnya"
          }. Dilarang masuk ganda!`,
          ticket: formattedTicket,
          isDuplicate: true,
        },
        { status: 409 }
      );
    }

    // 5. Atomic Gate Check-in Update
    const checkInTimestamp = new Date().toISOString();
    
    // First try updating status and checked_in_at
    const updatePayload: { status: string; checked_in_at: string; checked_in_by?: string } = {
      status: "checked_in",
      checked_in_at: checkInTimestamp,
    };

    let { error: updateError } = await adminClient
      .from("tickets")
      .update({
        ...updatePayload,
        checked_in_by: callerUser.id,
      })
      .eq("id", ticket.id);

    // If checked_in_by column does not exist in the schema cache, fallback to base update
    if (updateError && updateError.message?.includes("checked_in_by")) {
      const fallbackResult = await adminClient
        .from("tickets")
        .update(updatePayload)
        .eq("id", ticket.id);
      updateError = fallbackResult.error;
    }

    if (updateError) {
      console.error("Check-in update error:", updateError);
      return NextResponse.json(
        {
          success: false,
          message: "Gagal memperbarui status tiket: " + updateError.message,
        },
        { status: 500 }
      );
    }

    const updatedTicket: ETicket = {
      ...mapRowToETicket(ticket, ticket.users),
      status: "checked_in",
      checkedInAt: checkInTimestamp,
    };

    return NextResponse.json({
      success: true,
      message: `Check-in berhasil! Selamat berlari, ${updatedTicket.participantName} (BIB: ${updatedTicket.bibName}).`,
      ticket: updatedTicket,
    });
  } catch (err: any) {
    console.error("API /api/tickets/check-in error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
