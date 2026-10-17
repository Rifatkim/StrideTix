import { FitnessActivity } from "@/types/fitness";

/**
 * Parser file CSV riwayat aktivitas lari.
 * Mendukung format ekspor resmi Strava (activities.csv) serta format ringkas umum (Date, Distance, Time).
 */
export function parseCsvActivities(csvText: string): FitnessActivity[] {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return [];
  }

  // Header detection
  const header = lines[0].toLowerCase();
  const rows = lines.slice(1);
  const activities: FitnessActivity[] = [];

  // Pola 1: Format Resmi Strava Export (Activity Date, Activity Name, Activity Type, Elapsed Time, Distance)
  const isStravaOfficial =
    header.includes("activity type") || header.includes("activity date");

  for (let idx = 0; idx < rows.length; idx++) {
    const row = rows[idx];
    // Split by comma tapi menghiraukan koma di dalam tanda kutip
    const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((c) =>
      c.replace(/^"|"$/g, "").trim()
    );

    if (cols.length < 3) continue;

    try {
      if (isStravaOfficial) {
        // Cari indeks kolom
        const headerCols = lines[0].split(",").map((c) => c.toLowerCase().trim());
        const typeIdx = headerCols.findIndex((c) => c.includes("type"));
        const dateIdx = headerCols.findIndex((c) => c.includes("date"));
        const distIdx = headerCols.findIndex((c) => c.includes("distance"));
        const timeIdx = headerCols.findIndex(
          (c) => c.includes("elapsed") || c.includes("moving") || c.includes("time")
        );
        const nameIdx = headerCols.findIndex((c) => c.includes("name"));

        const actType = typeIdx >= 0 ? cols[typeIdx] : "Run";
        // Filter ketat: Hanya baris bertipe 'Run'
        if (!actType.toLowerCase().includes("run")) {
          continue;
        }

        const rawDist = distIdx >= 0 ? parseFloat(cols[distIdx]) : 0;
        // Jarak di Strava export bisa dalam meter (misal: 10050.2) atau kilometer (10.05)
        const distanceKm = rawDist > 200 ? rawDist / 1000 : rawDist;

        const rawTime = timeIdx >= 0 ? parseFloat(cols[timeIdx]) : 0;
        const movingTimeSeconds = rawTime > 0 ? Math.round(rawTime) : Math.round(distanceKm * 360);

        const dateStr = dateIdx >= 0 ? cols[dateIdx] : new Date().toISOString();
        const actName = nameIdx >= 0 ? cols[nameIdx] : `Sesi Lari #${idx + 1}`;

        if (distanceKm > 0.5) {
          const pace = movingTimeSeconds / 60 / distanceKm;
          activities.push({
            id: `csv-${idx}-${Date.now()}`,
            name: actName || "Lari Terjadwal",
            type: "Run",
            distanceKm: parseFloat(distanceKm.toFixed(2)),
            movingTimeSeconds,
            averagePaceMinPerKm: parseFloat(pace.toFixed(2)),
            startDate: new Date(dateStr).toISOString(),
            source: "csv_upload",
          });
        }
      } else {
        // Pola 2: Format CSV Bebas: Tanggal, Jarak (KM), Waktu (Menit)
        const dateStr = cols[0];
        const dist = parseFloat(cols[1]);
        const minutes = parseFloat(cols[2]);

        if (!isNaN(dist) && dist > 0.5) {
          const movingSeconds = !isNaN(minutes) && minutes > 0 ? Math.round(minutes * 60) : Math.round(dist * 360);
          const pace = movingSeconds / 60 / dist;

          activities.push({
            id: `csv-${idx}-${Date.now()}`,
            name: `Lari Harian ${dist.toFixed(1)} km`,
            type: "Run",
            distanceKm: parseFloat(dist.toFixed(2)),
            movingTimeSeconds: movingSeconds,
            averagePaceMinPerKm: parseFloat(pace.toFixed(2)),
            startDate: new Date(dateStr).toISOString(),
            source: "csv_upload",
          });
        }
      }
    } catch {
      // Abaikan baris yang korup
      continue;
    }
  }

  // Urutkan dari aktivitas terbaru ke terlama
  return activities.sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}
