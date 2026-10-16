import { createClient } from "@supabase/supabase-js";
import {
  DistanceCategory,
  EventFilterCriteria,
  EventStatus,
  RunningEvent,
  TicketCategory,
} from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}

function mapRowToRunningEvent(row: any): RunningEvent {
  const catList = row.categories || row.event_categories || [];
  const categories: TicketCategory[] = catList.map((cat: any) => ({
    id: cat.id,
    name: (cat.category_name || "10K") as DistanceCategory,
    distanceKm: Number(cat.distance_km || 10),
    price: Number(cat.price || 0),
    quota: Number(cat.quota || 100),
    availableQuota: Number(cat.remaining_quota ?? cat.quota ?? 100),
    description: `Kategori lari ${cat.category_name}`,
    benefits: ["BIB & Timing Chip", "Finisher Medal", "Refreshment & Hydration"],
  }));

  return {
    id: row.id,
    slug: row.title
      ? row.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : row.id,
    title: row.title,
    organizerName: row.organizer_name || "Penyelenggara Resmi",
    organizerLogo: row.organizer_logo,
    description: row.description || "",
    locationCity: row.city || "",
    locationVenue: row.location || "",
    eventDate: row.event_date || "",
    startTime: "05:30 WIB",
    registrationDeadline: row.event_date || "",
    bannerImage: row.banner_url || "/images/hero-landingpage.jpg",
    status: (row.status || "published") as EventStatus,
    categories,
    rulesAndTerms: [
      "Peserta dalam kondisi fisik sehat dan siap mengikuti lomba.",
      "Membawa tanda pengenal resmi saat penukaran race pack (RPC).",
      "Nomor dada (BIB) tidak dapat dipindahtangankan tanpa persetujuan panitia.",
    ],
  };
}

export async function getEvents(criteria?: EventFilterCriteria): Promise<RunningEvent[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("running_events")
      .select("*, categories:event_categories(*)")
      .eq("status", "published")
      .order("event_date", { ascending: true });

    if (criteria?.city && criteria.city !== "all") {
      query = query.ilike("city", `%${criteria.city}%`);
    }

    if (criteria?.searchQuery && criteria.searchQuery.trim() !== "") {
      const q = criteria.searchQuery.trim();
      query = query.or(`title.ilike.%${q}%,city.ilike.%${q}%,location.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Supabase query error (table might not exist yet):", error.message);
      return [];
    }

    let events = (data || []).map(mapRowToRunningEvent);

    if (criteria?.category && criteria.category !== "all") {
      events = events.filter((e) =>
        e.categories.some((c) => c.name === criteria.category)
      );
    }

    return events;
  } catch (err) {
    console.error("Failed to load events from Supabase:", err);
    return [];
  }
}

export async function getEventById(id: string): Promise<RunningEvent | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("running_events")
      .select("*, categories:event_categories(*)")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return mapRowToRunningEvent(data);
  } catch {
    return null;
  }
}

export async function getEventBySlug(slug: string): Promise<RunningEvent | null> {
  // If slug is a UUID, find by ID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
    return getEventById(slug);
  }

  const events = await getEvents();
  return events.find((e) => e.slug === slug) || null;
}

export async function getTicketCategory(
  eventId: string,
  categoryId: string
): Promise<TicketCategory | null> {
  const event = await getEventById(eventId);
  if (!event) return null;
  const category = event.categories.find((c) => c.id === categoryId);
  return category || null;
}

export async function createEvent(
  payload: Omit<RunningEvent, "id" | "slug">
): Promise<RunningEvent> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data: eventData, error: eventError } = await supabase
    .from("running_events")
    .insert({
      title: payload.title,
      description: payload.description,
      location: payload.locationVenue,
      city: payload.locationCity,
      event_date: payload.eventDate,
      banner_url: payload.bannerImage,
      status: payload.status || "published",
    })
    .select()
    .single();

  if (eventError || !eventData) {
    throw new Error(eventError?.message || "Gagal membuat event.");
  }

  // Insert categories
  if (payload.categories && payload.categories.length > 0) {
    const categoriesToInsert = payload.categories.map((c) => ({
      event_id: eventData.id,
      category_name: c.name,
      distance_km: c.distanceKm,
      price: c.price,
      quota: c.quota,
      remaining_quota: c.quota,
    }));

    await supabase.from("event_categories").insert(categoriesToInsert);
  }

  return getEventById(eventData.id) as Promise<RunningEvent>;
}

export async function getOrganizerEvents(organizerId?: string): Promise<RunningEvent[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  try {
    let query = supabase
      .from("running_events")
      .select("*, categories:event_categories(*)")
      .order("created_at", { ascending: false });

    if (organizerId) {
      query = query.eq("organizer_id", organizerId);
    }

    const { data, error } = await query;
    if (error) return [];
    return (data || []).map(mapRowToRunningEvent);
  } catch {
    return [];
  }
}

export async function updateEventStatus(
  id: string,
  status: EventStatus
): Promise<RunningEvent | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("running_events")
      .update({ status })
      .eq("id", id)
      .select("*, categories:event_categories(*)")
      .single();

    if (error || !data) return null;
    return mapRowToRunningEvent(data);
  } catch {
    return null;
  }
}
