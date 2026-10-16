import { AdminKPIs, AuditLogEntry, OrganizerApplication } from "@/types";

// Empty seed data - starts fresh without dummy records
const SEED_ORGANIZERS: OrganizerApplication[] = [];
const SEED_AUDIT_LOGS: AuditLogEntry[] = [];

const ORGS_STORAGE_KEY = "stridetix_organizers_store";
const LOGS_STORAGE_KEY = "stridetix_audit_logs_store";

function getStoredOrganizers(): OrganizerApplication[] {
  if (typeof window === "undefined") return SEED_ORGANIZERS;
  try {
    const raw = localStorage.getItem(ORGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(SEED_ORGANIZERS));
      return SEED_ORGANIZERS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ORGANIZERS;
  }
}

function saveStoredOrganizers(orgs: OrganizerApplication[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(orgs));
  } catch {
    // Ignore error
  }
}

export function getStoredAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return SEED_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(LOGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(SEED_AUDIT_LOGS));
      return SEED_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_AUDIT_LOGS;
  }
}

export function addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
  const logs = getStoredAuditLogs();
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `log-${Date.now().toString(36)}`,
    timestamp: new Date().toISOString(),
  };
  const updated = [newEntry, ...logs];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  }
}

export async function getOrganizerApplications(): Promise<OrganizerApplication[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  return getStoredOrganizers();
}

export async function approveOrganizer(id: string): Promise<OrganizerApplication | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const orgs = getStoredOrganizers();
  const index = orgs.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updated: OrganizerApplication = {
    ...orgs[index],
    status: "verified",
    verifiedAt: new Date().toISOString(),
    rejectionReason: undefined,
  };

  orgs[index] = updated;
  saveStoredOrganizers(orgs);

  addAuditLog({
    action: "Penyelenggara Disetujui",
    actor: "Super Admin",
    target: updated.name,
    details: `Permohonan verifikasi ${updated.name} telah disetujui.`,
    type: "verification",
  });

  return updated;
}

export async function rejectOrganizer(id: string, reason: string): Promise<OrganizerApplication | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const orgs = getStoredOrganizers();
  const index = orgs.findIndex((o) => o.id === id);
  if (index === -1) return null;

  const updated: OrganizerApplication = {
    ...orgs[index],
    status: "rejected",
    rejectionReason: reason,
  };

  orgs[index] = updated;
  saveStoredOrganizers(orgs);

  addAuditLog({
    action: "Penyelenggara Ditolak",
    actor: "Super Admin",
    target: updated.name,
    details: `Permohonan ditolak dengan alasan: "${reason}".`,
    type: "verification",
  });

  return updated;
}
