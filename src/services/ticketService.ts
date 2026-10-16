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
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Anda harus masuk terlebih dahulu untuk membeli tiket.");
  }

  // 1. Create order in Supabase
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: params.category.price,
      status: "paid",
    })
    .select()
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Gagal membuat pesanan tiket.");
  }

  // 2. Generate ticket code and QR payload
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const cityCode = params.event.locationCity.slice(0, 3).toUpperCase();
  const ticketCode = `STX-2026-${cityCode}-${randomSuffix}`;
  const qrHash = `STRIDETIX-TOKEN-${ticketCode}-VERIFIED`;

  // 3. Create ticket in Supabase
  const { data: ticket, error: ticketError } = await supabase
    .from("tickets")
    .insert({
      order_id: order.id,
      category_id: params.category.id,
      user_id: user.id,
      ticket_code: ticketCode,
      qr_code_hash: qrHash,
      status: "valid",
    })
    .select()
    .single();

  if (ticketError || !ticket) {
    throw new Error(ticketError?.message || "Gagal menerbitkan e-ticket.");
  }

  // 4. Reduce remaining quota
  try {
    const { data: currentCat } = await supabase
      .from("event_categories")
      .select("remaining_quota")
      .eq("id", params.category.id)
      .single();

    if (currentCat && currentCat.remaining_quota > 0) {
      await supabase
        .from("event_categories")
        .update({ remaining_quota: currentCat.remaining_quota - 1 })
        .eq("id", params.category.id);
    }
  } catch (quotaErr) {
    console.warn("Could not decrement quota:", quotaErr);
  }

  return {
    ticketCode,
    orderId: order.id,
    eventId: params.event.id,
    eventTitle: params.event.title,
    eventBanner: params.event.bannerImage,
    eventDate: params.event.eventDate,
    startTime: params.event.startTime,
    venue: params.event.locationVenue,
    city: params.event.locationCity,
    categoryName: params.category.name,
    bibName: params.participant.bibName.toUpperCase(),
    participantName: params.participant.fullName,
    participantEmail: params.participant.email,
    status: "issued",
    qrPayload: qrHash,
    issuedAt: new Date().toISOString(),
  };
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

  const { error } = await supabase
    .from("tickets")
    .update({
      status: "checked_in",
      checked_in_at: new Date().toISOString(),
    })
    .eq("ticket_code", cleanCode);

  if (error) {
    return {
      success: false,
      message: "Gagal memperbarui status tiket: " + error.message,
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
