import { DistanceCategory } from "./event";

export type TicketStatus =
  | "pending"
  | "paid"
  | "issued"
  | "checked_in"
  | "cancelled"
  | "expired";

export interface ParticipantData {
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: "male" | "female";
  dateOfBirth: string; // YYYY-MM-DD
  bibName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodType?: string;
  medicalNotes?: string;
}

export interface TicketOrder {
  orderId: string;
  eventId: string;
  eventTitle: string;
  categoryId: string;
  categoryName: DistanceCategory;
  price: number;
  adminFee: number;
  totalAmount: number;
  participant: ParticipantData;
  createdAt: string;
  paidAt?: string;
  status: TicketStatus;
}

export interface ETicket {
  ticketCode: string; // e.g. "STX-2026-JKT-8492"
  orderId: string;
  eventId: string;
  eventTitle: string;
  eventBanner: string;
  eventDate: string;
  startTime: string;
  venue: string;
  city: string;
  categoryName: DistanceCategory;
  bibName: string;
  participantName: string;
  participantEmail: string;
  status: TicketStatus;
  qrPayload: string; // Token encoded inside QR
  issuedAt: string;
  checkedInAt?: string;
}
