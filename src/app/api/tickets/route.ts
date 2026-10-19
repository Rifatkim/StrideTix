import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { ETicket, TicketStatus } from "@/types";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");
    const code = searchParams.get("code");

    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // 1. Mandatory Authentication (OWASP A01: Broken Access Control)
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak. Silakan login untuk melihat tiket." },
        { status: 401 }
      );
    }

    // Check user role
    const { data: profile } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || user.user_metadata?.role || "runner";

    // 2. Querying single ticket by code (BOLA Protection)
    if (code) {
      const cleanCode = code.trim().toUpperCase();
      const { data: ticket, error } = await adminClient
        .from("tickets")
        .select("*, event_categories(*, running_events(*)), users(*)")
        .eq("ticket_code", cleanCode)
        .single();

      if (error || !ticket) {
        return NextResponse.json({ success: false, ticket: null }, { status: 404 });
      }

      // Authorization Check: Must be ticket owner OR event organizer OR platform admin
      const isOwner = ticket.user_id === user.id;
      const eventOrganizerId = ticket.event_categories?.running_events?.organizer_id;
      const isEventOrganizer = eventOrganizerId && eventOrganizerId === user.id;
      const isAdminOrOrganizer = role === "admin" || (role === "organizer" && isEventOrganizer);

      if (!isOwner && !isAdminOrOrganizer && role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Akses ditolak. Anda tidak memiliki izin melihat tiket ini." },
          { status: 403 }
        );
      }

      return NextResponse.json({ success: true, ticket: mapRowToETicket(ticket, ticket.users) });
    }

    // 3. Querying tickets by eventId (Multi-tenant isolation)
    if (eventId) {
      // Must be event organizer or admin
      const { data: eventData } = await adminClient
        .from("running_events")
        .select("organizer_id")
        .eq("id", eventId)
        .single();

      if (role !== "admin" && eventData?.organizer_id !== user.id) {
        return NextResponse.json(
          { success: false, error: "Akses ditolak: Anda bukan penyelenggara event ini." },
          { status: 403 }
        );
      }

      const { data: tickets, error } = await adminClient
        .from("tickets")
        .select("*, event_categories!inner(*, running_events!inner(*)), users(*)")
        .eq("event_categories.event_id", eventId);

      if (error || !tickets) {
        console.error("Error querying tickets for eventId:", error);
        return NextResponse.json({ success: true, tickets: [] });
      }

      return NextResponse.json({
        success: true,
        tickets: tickets.map((t) => mapRowToETicket(t, t.users)),
      });
    }

    // 4. Default list tickets
    if (role === "organizer" || role === "admin") {
      // Return tickets only for events owned by this organizer (or all if admin)
      let query = adminClient
        .from("tickets")
        .select("*, event_categories!inner(*, running_events!inner(*)), users(*)")
        .order("created_at", { ascending: false });

      if (role !== "admin") {
        query = query.eq("event_categories.running_events.organizer_id", user.id);
      }

      const { data: tickets } = await query.limit(50);

      return NextResponse.json({
        success: true,
        tickets: (tickets || []).map((t) => mapRowToETicket(t, t.users)),
      });
    }

    // Runner role: return runner's own tickets strictly
    const { data: tickets } = await adminClient
      .from("tickets")
      .select("*, event_categories(*, running_events(*)), users(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({
      success: true,
      tickets: (tickets || []).map((t) => mapRowToETicket(t, t.users)),
    });
  } catch (err: any) {
    console.error("GET /api/tickets error:", err);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan internal server." }, { status: 500 });
  }
}
