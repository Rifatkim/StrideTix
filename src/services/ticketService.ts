import { ETicket, ParticipantData, TicketOrder, TicketStatus } from "@/types";

// In-memory fallback and seed tickets for comprehensive demo
const SEED_TICKETS: ETicket[] = [
  {
    ticketCode: "STX-2026-JKT-8492",
    orderId: "ORD-98214",
    eventId: "evt-jkt-marathon-2026",
    eventTitle: "Jakarta City Marathon 2026",
    eventBanner:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1600&q=80",
    eventDate: "2026-11-15",
    startTime: "04:30 WIB",
    venue: "Plaza Barat Gelora Bung Karno (GBK), Senayan",
    city: "Jakarta Pusat",
    categoryName: "10K",
    bibName: "BUDI P.",
    participantName: "Budi Pratama",
    participantEmail: "budi.pratama@example.com",
    status: "issued",
    qrPayload: "STRIDETIX-TOKEN-STX-2026-JKT-8492-VERIFIED",
    issuedAt: "2026-10-14T10:00:00.000Z",
  },
  {
    ticketCode: "STX-2026-JKT-1023",
    orderId: "ORD-98216",
    eventId: "evt-jkt-marathon-2026",
    eventTitle: "Jakarta City Marathon 2026",
    eventBanner:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1600&q=80",
    eventDate: "2026-11-15",
    startTime: "04:30 WIB",
    venue: "Plaza Barat Gelora Bung Karno (GBK), Senayan",
    city: "Jakarta Pusat",
    categoryName: "Half Marathon",
    bibName: "DIMAS S.",
    participantName: "Dimas Suryo",
    participantEmail: "dimas.suryo@gmail.com",
    status: "checked_in",
    qrPayload: "STRIDETIX-TOKEN-STX-2026-JKT-1023-VERIFIED",
    issuedAt: "2026-10-10T14:20:00.000Z",
    checkedInAt: "2026-10-14T05:45:00.000Z",
  },
  {
    ticketCode: "STX-2026-JKT-5519",
    orderId: "ORD-98217",
    eventId: "evt-jkt-marathon-2026",
    eventTitle: "Jakarta City Marathon 2026",
    eventBanner:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1600&q=80",
    eventDate: "2026-11-15",
    startTime: "04:30 WIB",
    venue: "Plaza Barat Gelora Bung Karno (GBK), Senayan",
    city: "Jakarta Pusat",
    categoryName: "5K",
    bibName: "ANISA W.",
    participantName: "Anisa Wulandari",
    participantEmail: "anisa.wulan@gmail.com",
    status: "issued",
    qrPayload: "STRIDETIX-TOKEN-STX-2026-JKT-5519-VERIFIED",
    issuedAt: "2026-10-11T09:15:00.000Z",
  },
  {
    ticketCode: "STX-2026-JKT-9901",
    orderId: "ORD-98218",
    eventId: "evt-jkt-marathon-2026",
    eventTitle: "Jakarta City Marathon 2026",
    eventBanner:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1600&q=80",
    eventDate: "2026-11-15",
    startTime: "04:30 WIB",
    venue: "Plaza Barat Gelora Bung Karno (GBK), Senayan",
    city: "Jakarta Pusat",
    categoryName: "Full Marathon",
    bibName: "REZA F.",
    participantName: "Reza Firmansyah",
    participantEmail: "reza.firman@gmail.com",
    status: "issued",
    qrPayload: "STRIDETIX-TOKEN-STX-2026-JKT-9901-VERIFIED",
    issuedAt: "2026-10-09T11:00:00.000Z",
  },
  {
    ticketCode: "STX-2026-BORO-3104",
    orderId: "ORD-98215",
    eventId: "evt-borobudur-10k-2026",
    eventTitle: "Borobudur Heritage Sunset Run 2026",
    eventBanner:
      "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1600&q=80",
    eventDate: "2026-12-05",
    startTime: "15:45 WIB",
    venue: "Taman Lumbini, Candi Borobudur",
    city: "Magelang, Jawa Tengah",
    categoryName: "5K",
    bibName: "SITI R.",
    participantName: "Siti Rahmawati",
    participantEmail: "siti.rahma@example.com",
    status: "checked_in",
    qrPayload: "STRIDETIX-TOKEN-STX-2026-BORO-3104-VERIFIED",
    issuedAt: "2026-10-12T08:30:00.000Z",
    checkedInAt: "2026-10-14T06:15:00.000Z",
  },
];

const STORAGE_KEY = "stridetix_tickets_store";

function getStoredTickets(): ETicket[] {
  if (typeof window === "undefined") {
    return SEED_TICKETS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TICKETS));
      return SEED_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_TICKETS;
  }
}

function saveStoredTickets(tickets: ETicket[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // Ignore storage quota error in simulation
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
  await new Promise((resolve) => setTimeout(resolve, 300));

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const ticketCode = `STX-2026-${params.event.id.replace("evt-", "").slice(0, 3).toUpperCase()}-${randomSuffix}`;
  const orderId = `ORD-${Date.now().toString().slice(-6)}`;
  const now = new Date().toISOString();

  const newTicket: ETicket = {
    ticketCode,
    orderId,
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
    qrPayload: `STRIDETIX-TOKEN-${ticketCode}-VERIFIED`,
    issuedAt: now,
  };

  const current = getStoredTickets();
  const updated = [newTicket, ...current];
  saveStoredTickets(updated);

  return newTicket;
}

export const createTicketOrder = createTicket;

export async function getTicketByCode(ticketCode: string): Promise<ETicket | null> {
  const tickets = getStoredTickets();
  const found = tickets.find(
    (t) => t.ticketCode.toUpperCase() === ticketCode.trim().toUpperCase()
  );
  return found || null;
}

export async function getAllUserTickets(): Promise<ETicket[]> {
  return getStoredTickets();
}

export async function getParticipantsByEvent(eventId: string): Promise<ETicket[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  const tickets = getStoredTickets();
  return tickets.filter((t) => t.eventId === eventId);
}

export async function toggleTicketCheckIn(ticketCode: string): Promise<ETicket | null> {
  const tickets = getStoredTickets();
  const cleanCode = ticketCode.trim().toUpperCase();
  const index = tickets.findIndex((t) => t.ticketCode.toUpperCase() === cleanCode);

  if (index === -1) return null;

  const existing = tickets[index];
  const newStatus: TicketStatus = existing.status === "checked_in" ? "issued" : "checked_in";
  const updated: ETicket = {
    ...existing,
    status: newStatus,
    checkedInAt: newStatus === "checked_in" ? new Date().toISOString() : undefined,
  };

  tickets[index] = updated;
  saveStoredTickets(tickets);
  return updated;
}

export async function checkInTicket(ticketCode: string): Promise<{
  success: boolean;
  message: string;
  ticket?: ETicket;
}> {
  const tickets = getStoredTickets();
  const cleanCode = ticketCode.trim().toUpperCase();
  const index = tickets.findIndex((t) => t.ticketCode.toUpperCase() === cleanCode);

  if (index === -1) {
    return {
      success: false,
      message: `Tiket dengan kode "${cleanCode}" tidak ditemukan dalam sistem.`,
    };
  }

  const existing = tickets[index];

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

  if (existing.status !== "issued" && existing.status !== "paid") {
    return {
      success: false,
      message: `Status tiket "${existing.status}" tidak valid untuk check-in.`,
      ticket: existing,
    };
  }

  // Mark as checked in
  const updatedTicket: ETicket = {
    ...existing,
    status: "checked_in",
    checkedInAt: new Date().toISOString(),
  };

  tickets[index] = updatedTicket;
  saveStoredTickets(tickets);

  return {
    success: true,
    message: `Check-in berhasil! Selamat berlari, ${existing.participantName}.`,
    ticket: updatedTicket,
  };
}
