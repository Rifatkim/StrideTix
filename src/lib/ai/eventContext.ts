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
    // 1. Ambil dari runner_profiles
    const { data: dbProfile } = await supabase
      .from("runner_profiles")
      .select("longest_run_km, weekly_frequency, avg_pace_minutes_per_km, consistency_score")
      .eq("user_id", userId)
      .maybeSingle();

    if (dbProfile) {
      profile.longestRunKm = dbProfile.longest_run_km || profile.longestRunKm;
      profile.weeklyFrequency = dbProfile.weekly_frequency || profile.weeklyFrequency;
      profile.averagePaceMinPerKm = dbProfile.avg_pace_minutes_per_km || profile.averagePaceMinPerKm;
      profile.consistencyScore = dbProfile.consistency_score || profile.consistencyScore;
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
  } catch (err) {
    console.warn("[EventContext] Gagal mengambil data kebugaran pelari dari DB:", err);
  }

  // Jika belum ada data sama sekali
  if (!profile.longestRunKm && !profile.targetCategory) {
    return `STATUS KEBUGARAN PELARI:
- Data riwayat latihan: Belum mengisi atau belum menyinkronkan aktivitas lari (< 3 sesi).
- Anjuran: Sarankan pelari untuk melengkapi penilaian mandiri di dashboard atau merekomendasikan kategori 5K Fun Run yang aman untuk pemula.`;
  }

  return `STATUS & RIWAYAT LATIHAN PELARI SAAT INI (DARI DATABASE STRIDETIX):
- Kategori Rekomendasi Resmi: ${profile.targetCategory || "5K (Pemula)"}
- Tingkat Kesiapan: ${profile.readinessLevel || "Dalam proses latihan"}
- Long Run Terjauh: ${profile.longestRunKm ? `${profile.longestRunKm} km` : "Belum tercatat"}
- Frekuensi Lari Mingguan: ${profile.weeklyFrequency ? `${profile.weeklyFrequency}x per minggu` : "Belum tercatat"}
- Pace Rata-rata: ${profile.averagePaceMinPerKm ? `${profile.averagePaceMinPerKm} min/km` : "Belum tercatat"}
- Skor Konsistensi: ${profile.consistencyScore ? `${profile.consistencyScore}%` : "Cukup"}
Gunakan data ini untuk mencocokkan event dan kategori jarak lomba yang paling aman dan proporsional.`;
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
