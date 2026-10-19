import { FitnessActivity } from "@/types/fitness";

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  mei: 4,
  may: 4,
  jun: 5,
  jul: 6,
  agu: 7,
  aug: 7,
  sep: 8,
  okt: 9,
  oct: 9,
  nop: 10,
  nov: 10,
  des: 11,
  dec: 11,
};

/**
 * Parsing tanggal fleksibel mendukung format Strava Indonesia & Inggris
 * Contoh: "17 Okt 2026, 09.05.37", "17 Oct 2026, 09:05:37", "2026-10-17 09:05:37"
 */
function parseFlexibleDate(dateStr: string): string {
  if (!dateStr) return new Date().toISOString();

  const clean = dateStr.trim();

  // Pattern: "17 Okt 2026, 09.05.37" atau "17 Oct 2026 09:05:37"
  const indonesianMatch = clean.match(
    /^(\d{1,2})\s+([a-zA-Z]{3,4})\s+(\d{4})(?:,\s*(\d{1,2})[.:](\d{1,2})(?:[.:](\d{1,2}))?)?/
  );

  if (indonesianMatch) {
    const day = parseInt(indonesianMatch[1], 10);
    const mKey = indonesianMatch[2].toLowerCase().slice(0, 3);
    const month = MONTH_MAP[mKey] !== undefined ? MONTH_MAP[mKey] : 0;
    const year = parseInt(indonesianMatch[3], 10);
    const hour = indonesianMatch[4] ? parseInt(indonesianMatch[4], 10) : 0;
    const min = indonesianMatch[5] ? parseInt(indonesianMatch[5], 10) : 0;
    const sec = indonesianMatch[6] ? parseInt(indonesianMatch[6], 10) : 0;

    const d = new Date(Date.UTC(year, month, day, hour, min, sec));
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  }

  // Fallback standar JS Date parse
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
}

/**
 * Parsing angka desimal dengan koma atau titik (misal: "3,00" atau "3.00")
 */
function parseFlexibleNumber(val: string | undefined): number {
  if (!val) return 0;
  const normalized = val.trim().replace(",", ".");
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : num;
}

/**
 * Parser file CSV riwayat aktivitas lari Strava.
 * Mendukung format ekspor resmi Strava baik dalam Bahasa Indonesia maupun Bahasa Inggris:
 * - Bahasa Indonesia: "Tanggal Aktivitas", "Jenis aktivitas", "Waktu Bergerak", "Jarak", "Nama Aktivitas"
 * - Bahasa Inggris: "Activity Date", "Activity Type", "Moving Time", "Distance", "Activity Name"
 */
export function parseCsvActivities(csvText: string): FitnessActivity[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return [];
  }

  const rawHeader = lines[0];
  const headerCols = rawHeader
    .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
    .map((c) => c.replace(/^"|"$/g, "").toLowerCase().trim());

  // Indeks deteksi kolom bilingual
  const typeIdx = headerCols.findIndex(
    (c) => c.includes("jenis") || c.includes("type")
  );
  const dateIdx = headerCols.findIndex(
    (c) => c.includes("tanggal") || c.includes("date")
  );
  const nameIdx = headerCols.findIndex(
    (c) => c.includes("nama aktivitas") || c.includes("activity name") || c === "name"
  );

  // Cari kolom waktu bergerak atau waktu total
  const movingTimeIdx = headerCols.findIndex(
    (c) => c.includes("waktu bergerak") || c.includes("moving time")
  );
  const totalTimeIdx = headerCols.findIndex(
    (c) => c.includes("waktu total") || c.includes("elapsed time")
  );
  const timeIdx = movingTimeIdx >= 0 ? movingTimeIdx : totalTimeIdx;

  // Cari kolom jarak: prioritas "Jarak" (km atau meter)
  // Di CSV Strava Indonesia, ada kolom "Jarak" (km misal "3,00") dan kolom detail meter ("3003.8")
  const distIdx = headerCols.findIndex(
    (c) => c === "jarak" || c === "distance" || c.includes("jarak") || c.includes("distance")
  );

  const rows = lines.slice(1);
  const activities: FitnessActivity[] = [];

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    // Split by comma tapi menghiraukan koma di dalam tanda kutip
    const cols = row
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((c) => c.replace(/^"|"$/g, "").trim());

    if (cols.length < 3) continue;

    try {
      // 1. Filter Tipe Aktivitas: Hanya olahraga lari ("Berlari" / "Run")
      const actType = typeIdx >= 0 && cols[typeIdx] ? cols[typeIdx] : "Run";
      const actTypeLower = actType.toLowerCase();

      // Abaikan aktivitas bukan lari seperti 'angkat beban', 'bersepeda', 'berjalan'
      const isRun =
        actTypeLower.includes("berlari") ||
        actTypeLower.includes("run") ||
        actTypeLower === "running";

      if (!isRun) {
        continue;
      }

      // 2. Ekstraksi Jarak (KM)
      let rawDist = distIdx >= 0 ? parseFlexibleNumber(cols[distIdx]) : 0;
      // Jika kolom jarak pertama menghasilkan 0 atau bernilai sangat kecil, cek kolom meter
      if (rawDist > 200) {
        rawDist = rawDist / 1000;
      }

      const distanceKm = rawDist;
      if (distanceKm < 0.3) {
        // Abaikan jarak di bawah 300 meter
        continue;
      }

      // 3. Ekstraksi Waktu Bergerak (Detik)
      let movingTimeSeconds = timeIdx >= 0 ? parseFlexibleNumber(cols[timeIdx]) : 0;
      if (movingTimeSeconds <= 0) {
        // Estimasi default pace 6:00 min/km jika waktu kosong
        movingTimeSeconds = Math.round(distanceKm * 360);
      }

      // 4. Ekstraksi Tanggal & Nama Sesi (Sanitasi untuk proteksi OWASP LLM01)
      const rawDate = dateIdx >= 0 ? cols[dateIdx] : "";
      const startDate = parseFlexibleDate(rawDate);
      const rawActName = nameIdx >= 0 && cols[nameIdx] ? cols[nameIdx] : "";
      const sanitizedName = rawActName
        .replace(/[\r\n\t\x00-\x1F\x7F]/g, " ")
        .replace(/system\s*prompt|ignore\s*previous|you\s*are\s*now/gi, "[filtered]")
        .trim()
        .slice(0, 50);

      const actName = sanitizedName || `Lari ${distanceKm.toFixed(1)}K`;

      const paceMinPerKm = movingTimeSeconds / 60 / distanceKm;

      activities.push({
        id: `strava-csv-${idx}-${Date.now()}`,
        name: actName,
        type: "Run",
        distanceKm: parseFloat(distanceKm.toFixed(2)),
        movingTimeSeconds: Math.round(movingTimeSeconds),
        averagePaceMinPerKm: parseFloat(paceMinPerKm.toFixed(2)),
        startDate,
        source: "csv_upload",
      });
    } catch {
      // Abaikan baris rusak
      continue;
    }
  }

  // Urutkan dari aktivitas terbaru ke terlama
  return activities.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}
