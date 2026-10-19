import { SupabaseClient } from "@supabase/supabase-js";
import { RunnerTrainingContext } from "@/types/ai";
import { MOCK_EVENTS } from "@/lib/mock-data/events";

interface EventCategoryRow {
  category_name: string;
  distance_km: number;
  price: number;
  remaining_quota: number;
}

interface RunningEventRow {
  id: string;
  title: string;
  city: string;
  location: string;
  event_date: string;
  categories?: EventCategoryRow[];
  event_categories?: EventCategoryRow[];
}

/**
 * Format angka mata uang Rupiah
 */
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Mengambil ringkasan riwayat latihan & rekomendasi resmi pelari dari Supabase
 */
export async function fetchRunnerFitnessContext(
  supabase: SupabaseClient,
  userId: string,
  fallbackContext?: RunnerTrainingContext
): Promise<string> {
  let profile = {
    longestRunKm: fallbackContext?.longestRunKm,
    weeklyFrequency: fallbackContext?.weeklyFrequency,
    averagePaceMinPerKm: fallbackContext?.averagePaceMinPerKm,
    consistencyScore: fallbackContext?.consistencyScore,
    targetCategory: fallbackContext?.targetCategory,
    readinessLevel: fallbackContext?.readinessLevel,
  };

  try {
    // 1. Ambil dari runner_profiles (Prioritas Utama)
    const { data: dbProfile } = await supabase
      .from("runner_profiles")
      .select("longest_run_km, weekly_frequency, avg_pace_minutes_per_km, consistency_score")
      .eq("user_id", userId)
      .maybeSingle();

    if (dbProfile && (dbProfile.longest_run_km > 0 || dbProfile.weekly_frequency > 0)) {
      profile.longestRunKm = dbProfile.longest_run_km;
      profile.weeklyFrequency = dbProfile.weekly_frequency;
      profile.averagePaceMinPerKm = dbProfile.avg_pace_minutes_per_km;
      profile.consistencyScore = dbProfile.consistency_score;
    }

    // 2. Ambil rekomendasi resmi terbaru dari event_recommendations
    const { data: dbRec } = await supabase
      .from("event_recommendations")
      .select("recommended_category, readiness_level")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (dbRec) {
      profile.targetCategory = dbRec.recommended_category || profile.targetCategory;
      profile.readinessLevel = dbRec.readiness_level || profile.readinessLevel;
    }

    // 3. Ambil 5 aktivitas lari terbaru dari raw_strava_activities
    const { data: dbRecentActivities } = await supabase
      .from("raw_strava_activities")
      .select("distance_meters, moving_time_seconds, start_date, raw_payload")
      .eq("user_id", userId)
      .order("start_date", { ascending: false })
      .limit(5);

    let recentRunsText = "";
    if (dbRecentActivities && dbRecentActivities.length > 0) {
      recentRunsText =
        "\n- Riwayat Sesi Lari Terakhir (Real Data StrideTix):\n" +
        dbRecentActivities
          .map((act, i) => {
            const distKm = (act.distance_meters / 1000).toFixed(2);
            const pace =
              act.distance_meters > 0
                ? (act.moving_time_seconds / 60 / (act.distance_meters / 1000)).toFixed(2)
                : "-";
            const dateStr = act.start_date ? act.start_date.split("T")[0] : "-";
            const payload = (act.raw_payload as Record<string, unknown>) || {};
            const actName = (payload.name as string) || `Sesi Lari #${i + 1}`;
            return `  ${i + 1}. ${actName}: ${distKm} km (Pace ${pace} min/km, Tgl ${dateStr})`;
          })
          .join("\n");
    }

    // Jika belum ada data sama sekali
    if (!profile.longestRunKm && !profile.targetCategory && !recentRunsText) {
      return `STATUS KEBUGARAN PELARI:
- Data riwayat latihan: Belum mengisi atau belum menyinkronkan aktivitas lari (< 3 sesi).
- Anjuran: Sarankan pelari untuk melengkapi penilaian mandiri di dashboard atau merekomendasikan kategori 5K Fun Run yang aman untuk pemula.`;
    }

    return `STATUS & RIWAYAT LATIHAN RESMI PELARI (REAL DATA DARI DATABASE STRIDETIX):
- Kategori Rekomendasi Resmi: ${profile.targetCategory || "5K (Pemula)"}
- Tingkat Kesiapan: ${profile.readinessLevel || "Dalam proses latihan"}
- Long Run Terjauh: ${profile.longestRunKm ? `${profile.longestRunKm} km` : "Belum tercatat"}
- Frekuensi Lari Mingguan: ${profile.weeklyFrequency ? `${profile.weeklyFrequency}x per minggu` : "Belum tercatat"}
- Pace Rata-rata: ${profile.averagePaceMinPerKm ? `${profile.averagePaceMinPerKm} min/km` : "Belum tercatat"}
- Skor Konsistensi: ${profile.consistencyScore ? `${profile.consistencyScore}%` : "Cukup"}${recentRunsText}

PERINGATAN INTEGRITAS DATA UNTUK ASISTEN AI:
Data di atas adalah riwayat latihan nyata pelari dari database StrideTix.
Anda WAJIB menyebutkan angka yang sesuai dengan data di atas persis apa adanya (misal Long Run Terjauh: ${profile.longestRunKm} km).
DILARANG KERAS mengarang, mengasumsikan, atau mengubah angka jarak terjauh pelari (misal jangan menyebut 12 km atau angka fiktif lainnya).`;
  } catch (err) {
    console.warn("[EventContext] Gagal mengambil data kebugaran pelari dari DB:", err);
    return `STATUS KEBUGARAN PELARI: Terjadi kesalahan saat membaca data kebugaran. Rekomendasikan kategori 5K untuk pemula.`;
  }
}

/**
 * Mengambil daftar event lari aktif yang sedang buka pendaftaran di platform StrideTix
 */
export async function fetchActiveEventsContext(supabase: SupabaseClient): Promise<string> {
  let eventList: {
    title: string;
    city: string;
    location: string;
    eventDate: string;
    categories: { name: string; distanceKm: number; price: number; remainingQuota: number }[];
  }[] = [];

  try {
    const { data, error } = await supabase
      .from("running_events")
      .select("id, title, city, location, event_date, categories:event_categories(category_name, distance_km, price, remaining_quota)")
      .eq("status", "published")
      .order("event_date", { ascending: true })
      .limit(8);

    if (!error && data && data.length > 0) {
      eventList = (data as RunningEventRow[]).map((ev) => {
        const catRows = ev.categories || ev.event_categories || [];
        return {
          title: ev.title,
          city: ev.city,
          location: ev.location,
          eventDate: ev.event_date,
          categories: catRows.map((c) => ({
            name: c.category_name,
            distanceKm: Number(c.distance_km),
            price: Number(c.price),
            remainingQuota: Number(c.remaining_quota || 0),
          })),
        };
      });
    }
  } catch (err) {
    console.warn("[EventContext] Query running_events dari Supabase error, fallback ke data katalog:", err);
  }

  // Fallback ke MOCK_EVENTS jika database kosong
  if (eventList.length === 0) {
    eventList = MOCK_EVENTS.filter((e) => e.status === "published").slice(0, 6).map((e) => ({
      title: e.title,
      city: e.locationCity,
      location: e.locationVenue,
      eventDate: e.eventDate,
      categories: e.categories.map((c) => ({
        name: c.name,
        distanceKm: c.distanceKm,
        price: c.price,
        remainingQuota: c.availableQuota,
      })),
    }));
  }

  // Format ke teks padat dan terstruktur untuk LLM context
  const lines: string[] = [
    "DAFTAR EVENT LARI RESMI YANG SEDANG AKTIF DI PLATFORM STRIDETIX SAAT INI:",
  ];

  eventList.forEach((ev, idx) => {
    lines.push(`\n${idx + 1}. ${ev.title}`);
    lines.push(`   - Kota & Lokasi: ${ev.city} (${ev.location})`);
    lines.push(`   - Tanggal Lomba: ${ev.eventDate}`);
    lines.push("   - Kategori & Harga Tiket:");
    ev.categories.forEach((cat) => {
      lines.push(
        `     • ${cat.name} (${cat.distanceKm}K) — ${formatRupiah(cat.price)} (Sisa Kuota: ${cat.remainingQuota})`
      );
    });
  });

  return lines.join("\n");
}
