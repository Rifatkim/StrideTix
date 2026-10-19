import { createClient } from "@/utils/supabase/client";
import {
  DistanceCategory,
  EventFilterCriteria,
  EventStatus,
  RunningEvent,
  TicketCategory,
} from "@/types";

function getSupabase() {
  return createClient();
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
    startTime: row.start_time || "05:30 WIB",
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
  payload: Omit<RunningEvent, "id" | "slug"> & { organizerId?: string }
): Promise<RunningEvent> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured.");

  // 1. Get authenticated user ID to satisfy Supabase RLS policy
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const organizerId = payload.organizerId || user?.id;
  if (!organizerId) {
    throw new Error(
      "Sesi login Anda tidak valid atau telah berakhir. Silakan login kembali sebagai Organizer."
    );
  }

  // 2. Ensure public.users entry exists to satisfy foreign key REFERENCES public.users(id)
  try {
    await supabase.from("users").upsert(
      {
        id: organizerId,
        email: user?.email || "organizer@stridetix.com",
        full_name: payload.organizerName || user?.user_metadata?.full_name || "Organizer",
        role: "organizer",
      },
      { onConflict: "id", ignoreDuplicates: true }
    );
  } catch (upsertErr) {
    console.warn("Could not upsert public.users:", upsertErr);
  }

  const basePayload = {
    organizer_id: organizerId,
    title: payload.title,
    description: payload.description,
    location: payload.locationVenue,
    city: payload.locationCity,
    event_date: payload.eventDate,
    banner_url: payload.bannerImage,
    status: payload.status || "published",
  };

  let eventData: any = null;
  let eventError: any = null;

  // Coba simpan dengan kolom start_time & organizer_name jika DDL sudah diterapkan
  const tryWithNewCols = await supabase
    .from("running_events")
    .insert({
      ...basePayload,
      start_time: payload.startTime || "05:30 WIB",
      organizer_name: payload.organizerName || "Stride Organizer",
    })
    .select()
    .single();

  if (!tryWithNewCols.error && tryWithNewCols.data) {
    eventData = tryWithNewCols.data;
  } else {
    // Fallback ke schema dasar jika DDL migration belum dieksekusi di database remote
    const fallbackInsert = await supabase
      .from("running_events")
      .insert(basePayload)
      .select()
      .single();
    eventData = fallbackInsert.data;
    eventError = fallbackInsert.error;
  }

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

export async function updateEvent(
  id: string,
  eventUpdates: {
    title?: string;
    description?: string;
    locationVenue?: string;
    locationCity?: string;
    eventDate?: string;
    bannerImage?: string;
    status?: EventStatus;
    startTime?: string;
  },
  categories?: TicketCategory[]
): Promise<RunningEvent | null> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase tidak terhubung.");

  const fieldsToUpdate: Record<string, any> = {};
  if (eventUpdates.title !== undefined) fieldsToUpdate.title = eventUpdates.title;
  if (eventUpdates.description !== undefined) fieldsToUpdate.description = eventUpdates.description;
  if (eventUpdates.locationVenue !== undefined) fieldsToUpdate.location = eventUpdates.locationVenue;
  if (eventUpdates.locationCity !== undefined) fieldsToUpdate.city = eventUpdates.locationCity;
  if (eventUpdates.eventDate !== undefined) fieldsToUpdate.event_date = eventUpdates.eventDate;
  if (eventUpdates.bannerImage !== undefined) fieldsToUpdate.banner_url = eventUpdates.bannerImage;
  if (eventUpdates.status !== undefined) fieldsToUpdate.status = eventUpdates.status;

  if (Object.keys(fieldsToUpdate).length > 0) {
    const { error: eventError } = await supabase
      .from("running_events")
      .update(fieldsToUpdate)
      .eq("id", id);

    if (eventError) {
      throw new Error(`Gagal memperbarui event: ${eventError.message}`);
    }
  }

  // Update categories if supplied
  if (categories && categories.length > 0) {
    for (const cat of categories) {
      const isExistingUuid =
        cat.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cat.id);

      if (isExistingUuid) {
        // Query existing category to preserve sold tickets count when reducing/increasing quota
        const { data: currentCat } = await supabase
          .from("event_categories")
          .select("quota, remaining_quota")
          .eq("id", cat.id)
          .single();

        const sold = currentCat
          ? Math.max(0, (currentCat.quota || 0) - (currentCat.remaining_quota || 0))
          : 0;
        const newQuota = Number(cat.quota) || 0;
        const newRemaining = Math.max(0, newQuota - sold);

        await supabase
          .from("event_categories")
          .update({
            category_name: cat.name,
            distance_km: Number(cat.distanceKm) || 10,
            price: Number(cat.price) || 0,
            quota: newQuota,
            remaining_quota: newRemaining,
          })
          .eq("id", cat.id);
      } else {
        // New category added
        await supabase.from("event_categories").insert({
          event_id: id,
          category_name: cat.name,
          distance_km: Number(cat.distanceKm) || 10,
          price: Number(cat.price) || 0,
          quota: Number(cat.quota) || 100,
          remaining_quota: Number(cat.quota) || 100,
        });
      }
    }
  }

  return getEventById(id);
}

export async function deleteEvent(id: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase tidak terhubung.");

  // 1. Get all category IDs for this event
  const { data: categories } = await supabase
    .from("event_categories")
    .select("id")
    .eq("event_id", id);

  const categoryIds = (categories || []).map((c: any) => c.id);

  // 2. If categories exist, delete any associated tickets first (due to ON DELETE RESTRICT)
  if (categoryIds.length > 0) {
    const { error: ticketError } = await supabase
      .from("tickets")
      .delete()
      .in("category_id", categoryIds);

    if (ticketError) {
      console.warn("Notice deleting tickets for categories:", ticketError.message);
    }
  }

  // 3. Delete the event (cascades to event_categories)
  const { error: eventError } = await supabase
    .from("running_events")
    .delete()
    .eq("id", id);

  if (eventError) {
    throw new Error(`Gagal menghapus event: ${eventError.message}`);
  }

  return true;
}

export async function uploadEventPoster(file: File): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase tidak terhubung.");

  const fileExt = file.name.split(".").pop() || "jpg";
  const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, "");
  const fileName = `poster-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${cleanExt || "jpg"}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("event-posters")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || "image/jpeg",
    });

  if (uploadError) {
    console.warn("Storage upload error:", uploadError.message);
    throw new Error(`Gagal upload poster ke Supabase Storage: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("event-posters").getPublicUrl(filePath);
  return data.publicUrl;
}


