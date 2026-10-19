import { createClient } from "@/utils/supabase/client";
import { ETicket, ParticipantData, TicketStatus } from "@/types";

const STORAGE_KEY = "stridetix_tickets_store";

function clearLegacyMockStorage() {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
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
    startTime: "05:30 WIB",
    venue: evt.location || "Lokasi Lomba",
    city: evt.city || "Kota",
    categoryName: cat.category_name || "10K",
    bibName: (user?.full_name || user?.name || "RUNNER").split(" ")[0].toUpperCase(),
    participantName: user?.full_name || user?.name || "Peserta Lari",
    participantEmail: user?.email || "",
    status: (row.status === "valid" ? "issued" : row.status) as TicketStatus,
    qrPayload: `STRIDETIX-TOKEN-${row.ticket_code}-VERIFIED`,
    issuedAt: row.created_at || new Date().toISOString(),
    checkedInAt: row.checked_in_at,
  };
}

export async function getAllUserTickets(): Promise<ETicket[]> {
  clearLegacyMockStorage();
  const supabase = createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("*, event_categories(*, running_events(*))")
      .eq("user_id", user.id)
      .order("checked_in_at", { ascending: false, nullsFirst: false });

    if (error || !tickets) {
      return [];
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    return tickets.map((t) => mapRowToETicket(t, profile || user));
  } catch (err) {
    console.error("Failed to load user tickets:", err);
    return [];
  }
}

export async function getTicketByCode(ticketCode: string): Promise<ETicket | null> {
  const supabase = createClient();
  const cleanCode = ticketCode.trim().toUpperCase();

  try {
    const { data: ticket, error } = await supabase
      .from("tickets")
      .select("*, event_categories(*, running_events(*)), users(*)")
      .eq("ticket_code", cleanCode)
      .single();

    if (error || !ticket) {
      return null;
    }

    return mapRowToETicket(ticket, ticket.users);
  } catch {
    return null;
  }
}

export async function createTicket(params: {
  event: {
    id: string;
    title: string;
    bannerImage: string;
    eventDate: string;
    startTime: string;
    locationVenue: string;
    locationCity: string;
  };
  category: {
    id: string;
    name: any;
    price: number;
  };
  participant: ParticipantData;
}): Promise<ETicket> {
  const res = await fetch("/api/tickets/purchase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || "Gagal menerbitkan e-ticket.");
  }

  return data.ticket;
}

export const createTicketOrder = createTicket;

export async function getParticipantsByEvent(eventId: string): Promise<ETicket[]> {
  const supabase = createClient();

  try {
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("*, event_categories!inner(*, running_events!inner(*)), users(*)")
      .eq("event_categories.event_id", eventId);

    if (error || !tickets) {
      return [];
    }

    return tickets.map((t) => mapRowToETicket(t, t.users));
  } catch {
    return [];
  }
}

export async function checkInTicket(ticketCode: string): Promise<{
  success: boolean;
  message: string;
  ticket?: ETicket;
}> {
  const supabase = createClient();
  const cleanCode = ticketCode.trim().toUpperCase();

  const existing = await getTicketByCode(cleanCode);

  if (!existing) {
    return {
      success: false,
      message: `Tiket dengan kode "${cleanCode}" tidak ditemukan dalam sistem database.`,
    };
  }

  if (existing.status === "checked_in") {
    return {
      success: false,
      message: `Tiket ini SUDAH DIGUNAKAN untuk check-in pada ${
        existing.checkedInAt
          ? new Date(existing.checkedInAt).toLocaleTimeString("id-ID")
          : "sebelumnya"
      }.`,
      ticket: existing,
    };
  }

  // Verify organizer ownership and check for cross-event checkin (TC-ORG-01)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: updatedRows, error } = await supabase
    .from("tickets")
    .update({
      status: "checked_in",
      checked_in_at: new Date().toISOString(),
    })
    .eq("ticket_code", cleanCode)
    .select();

  if (error) {
    return {
      success: false,
      message: "Gagal memperbarui status tiket: " + error.message,
    };
  }

  // If 0 rows were updated, RLS prevented the update (user is not the event owner)
  if (!updatedRows || updatedRows.length === 0) {
    return {
      success: false,
      message: `Akses ditolak: Tiket ini terdaftar untuk "${existing.eventTitle}". Anda hanya dapat memvalidasi tiket event yang Anda kelola.`,
    };
  }

  const updatedTicket: ETicket = {
    ...existing,
    status: "checked_in",
    checkedInAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: `Check-in berhasil! Selamat berlari, ${existing.participantName}.`,
    ticket: updatedTicket,
  };
}

export async function toggleTicketCheckIn(ticketCode: string): Promise<ETicket | null> {
  const supabase = createClient();
  const cleanCode = ticketCode.trim().toUpperCase();
  const existing = await getTicketByCode(cleanCode);
  if (!existing) return null;

  const newStatus: TicketStatus = existing.status === "checked_in" ? "issued" : "checked_in";
  const checkedInAt = newStatus === "checked_in" ? new Date().toISOString() : null;

  await supabase
    .from("tickets")
    .update({
      status: newStatus === "issued" ? "valid" : "checked_in",
      checked_in_at: checkedInAt,
    })
    .eq("ticket_code", cleanCode);

  return {
    ...existing,
    status: newStatus,
    checkedInAt: checkedInAt || undefined,
  };
}
