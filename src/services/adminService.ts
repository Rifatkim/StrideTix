import { AdminKPIs, AuditLogEntry, OrganizerApplication } from "@/types";

const SEED_ORGANIZERS: OrganizerApplication[] = [
  {
    id: "org-app-1",
    name: "Bandung Athletics Club",
    picName: "Rangga Pratama",
    email: "contact@bandungathletics.org",
    phone: "0812-3344-5566",
    city: "Bandung",
    portfolio: "Penyelenggara Dago 10K Run 2025 (1,500 peserta) & Gedung Sate Heritage 5K.",
    documentType: "SK Kemenkumham & Rekomendasi PASI Jabar",
    status: "pending",
    submittedAt: "2026-10-12T08:00:00.000Z",
  },
  {
    id: "org-app-2",
    name: "Surabaya Night Runners Community",
    picName: "Maya Indah",
    email: "admin@surabayanightrun.com",
    phone: "0813-7788-9900",
    city: "Surabaya",
    portfolio: "Komunitas lari 800 member aktif, menyelenggarakan 3x charity run tahunan.",
    documentType: "Akta Pendirian Perkumpulan Komunitas",
    status: "pending",
    submittedAt: "2026-10-13T11:30:00.000Z",
  },
  {
    id: "org-app-3",
    name: "Danamon Run Management",
    picName: "Satria Budi",
    email: "race@danamonrun.id",
    phone: "0811-2233-4455",
    city: "Jakarta Pusat",
    portfolio: "Promotor resmi event skala nasional 5,000+ peserta bersertifikasi World Athletics.",
    documentType: "NIB PT & Sertifikasi Manajemen Lomba Nasional",
    status: "verified",
    submittedAt: "2026-10-01T09:00:00.000Z",
    verifiedAt: "2026-10-02T14:00:00.000Z",
  },
  {
    id: "org-app-4",
    name: "Borobudur Heritage Ops",
    picName: "Lestari Dewi",
    email: "ops@borobudurrun.com",
    phone: "0819-4455-6677",
    city: "Magelang",
    portfolio: "Manajemen rute heritage Borobudur dan Prambanan Marathon.",
    documentType: "Surat Kerjasama Balai Taman Borobudur & PASI",
    status: "verified",
    submittedAt: "2026-10-03T10:00:00.000Z",
    verifiedAt: "2026-10-04T16:30:00.000Z",
  },
];

const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-1",
    action: "Penyelenggara Terverifikasi",
    actor: "Super Admin (Rian)",
    target: "Danamon Run Management",
    details: "Verifikasi dokumen NIB dan sertifikasi race selesai disetujui.",
    type: "verification",
    timestamp: "2026-10-02T14:00:00.000Z",
  },
  {
    id: "log-2",
    action: "Event Dipublikasikan",
    actor: "Super Admin (Rian)",
    target: "Jakarta City Marathon 2026",
    details: "Event disetujui untuk pendaftaran umum setelah pengecekan rute dan kuota.",
    type: "moderation",
    timestamp: "2026-10-05T09:30:00.000Z",
  },
  {
    id: "log-3",
    action: "Tiket Terbit & Pembayaran Valid",
    actor: "System Gateway",
    target: "STX-2026-JKT-8492",
    details: "Pembayaran Rp 375.000 terverifikasi (Budi Pratama - 10K).",
    type: "transaction",
    timestamp: "2026-10-14T10:00:00.000Z",
  },
];

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
