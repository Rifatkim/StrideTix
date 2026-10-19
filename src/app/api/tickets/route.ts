import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { ETicket, TicketStatus } from "@/types";

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

    // If querying single ticket by code
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

      return NextResponse.json({ success: true, ticket: mapRowToETicket(ticket, ticket.users) });
    }

    // If querying tickets by eventId
    if (eventId) {
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

    // Default: return user tickets or organizer managed event tickets
    if (!user) {
      return NextResponse.json({ success: true, tickets: [] });
    }

    // Check user role
    const { data: profile } = await adminClient
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || user.user_metadata?.role || "runner";

    if (role === "organizer" || role === "admin") {
      // Return tickets for organizer's events or recent tickets
      const { data: tickets } = await adminClient
        .from("tickets")
        .select("*, event_categories(*, running_events(*)), users(*)")
        .limit(30);

      return NextResponse.json({
        success: true,
        tickets: (tickets || []).map((t) => mapRowToETicket(t, t.users)),
      });
    }

    // Runner role: return runner's own tickets
    const { data: tickets } = await adminClient
      .from("tickets")
      .select("*, event_categories(*, running_events(*)), users(*)")
      .eq("user_id", user.id);

    return NextResponse.json({
      success: true,
      tickets: (tickets || []).map((t) => mapRowToETicket(t, t.users)),
    });
  } catch (err: any) {
    console.error("GET /api/tickets error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
