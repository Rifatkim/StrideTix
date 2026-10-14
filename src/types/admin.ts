export type OrganizerVerificationStatus = "pending" | "verified" | "rejected";

export interface OrganizerApplication {
  id: string;
  name: string;
  picName: string;
  email: string;
  phone: string;
  city: string;
  portfolio: string;
  documentType: string;
  status: OrganizerVerificationStatus;
  submittedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  details: string;
  type: "verification" | "moderation" | "transaction" | "system";
}

export interface AdminKPIs {
  totalUsers: number;
  totalOrganizers: number;
  totalEventsPublished: number;
  totalRevenueIdr: number;
  pendingOrganizerVerifications: number;
  pendingEventModerations: number;
}
