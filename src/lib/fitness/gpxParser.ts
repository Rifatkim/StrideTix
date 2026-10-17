import { FitnessActivity } from "@/types/fitness";

/**
 * Menghitung jarak antara dua titik koordinat GPS menggunakan formula Haversine (dalam kilometer).
 */
function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Parser file GPX standar (kompatibel dengan file ekspor Strava, Garmin, Coros, Nike, Apple Watch).
 * Tanpa dependensi pihak ketiga berat, menggunakan regex parser yang aman untuk browser & server.
 */
export function parseGpxContent(
  gpxXmlText: string,
  fileName: string = "activity.gpx"
): FitnessActivity {
  // 1. Ekstrak nama aktivitas
  const nameMatch = gpxXmlText.match(/<name>(.*?)<\/name>/i);
  const rawName = nameMatch ? nameMatch[1].trim() : fileName.replace(/\.[^/.]+$/, "");

  // 2. Ekstrak tipe aktivitas
  const typeMatch = gpxXmlText.match(/<type>(.*?)<\/type>/i);
  const activityType = typeMatch ? typeMatch[1].trim() : "Run";

  // 3. Ekstrak semua trackpoint (<trkpt lat="..." lon="..."> ... <time>...</time> </trkpt>)
  const trkptRegex = /<trkpt\s+lat="([^"]+)"\s+lon="([^"]+)"[\s\S]*?(?:<time>([^<]+)<\/time>)?[\s\S]*?<\/trkpt>/gi;

  let match: RegExpExecArray | null;
  const points: { lat: number; lon: number; time?: Date }[] = [];

  while ((match = trkptRegex.exec(gpxXmlText)) !== null) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    const timeStr = match[3];
    const time = timeStr ? new Date(timeStr) : undefined;

    if (!isNaN(lat) && !isNaN(lon)) {
      points.push({ lat, lon, time });
    }
  }

  // 4. Hitung total jarak kumulatif
  let totalDistanceKm = 0;
  for (let i = 1; i < points.length; i++) {
    const d = haversineDistanceKm(
      points[i - 1].lat,
      points[i - 1].lon,
      points[i].lat,
      points[i].lon
    );
    // Filter outlier GPS glitch (hanya abaikan jika anomali ekstrem > 10 km antar 2 titik berurutan)
    if (d < 10.0) {
      totalDistanceKm += d;
    }
  }

  // 5. Hitung total waktu bergerak
  let movingTimeSeconds = 0;
  let startDate = new Date().toISOString();

  if (points.length >= 2 && points[0].time && points[points.length - 1].time) {
    startDate = points[0].time.toISOString();
    const totalDuration =
      (points[points.length - 1].time!.getTime() - points[0].time!.getTime()) / 1000;
    // Jika tidak ada pause panjang, gunakan total duration
    movingTimeSeconds = Math.max(60, Math.round(totalDuration));
  } else {
    // Estimasi standar jika tag waktu tidak lengkap: pace 6:00 min/km
    movingTimeSeconds = Math.round(totalDistanceKm * 6 * 60);
  }

  // 6. Hitung pace rata-rata (menit per km)
  const safeDistance = Math.max(0.1, totalDistanceKm);
  const averagePaceMinPerKm = movingTimeSeconds / 60 / safeDistance;

  return {
    id: `gpx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: rawName || "Sesi Lari (GPX)",
    type: activityType.toLowerCase().includes("run") ? "Run" : activityType,
    distanceKm: parseFloat(totalDistanceKm.toFixed(2)),
    movingTimeSeconds,
    averagePaceMinPerKm: parseFloat(averagePaceMinPerKm.toFixed(2)),
    startDate,
    source: "gpx_upload",
    rawFileName: fileName,
  };
}
