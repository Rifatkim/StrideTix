import { MOCK_EVENTS } from "@/lib/mock-data/events";
import {
  DistanceCategory,
  EventFilterCriteria,
  EventStatus,
  RunningEvent,
  TicketCategory,
} from "@/types";

const EVENTS_STORAGE_KEY = "stridetix_events_store";

function getStoredEvents(): RunningEvent[] {
  if (typeof window === "undefined") {
    return MOCK_EVENTS;
  }
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(MOCK_EVENTS));
      return MOCK_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return MOCK_EVENTS;
  }
}

function saveStoredEvents(events: RunningEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  } catch {
    // Ignore storage quota error in simulation
  }
}

/**
 * EventService provides an abstracted data access layer for Running Events.
 * When migrating to Supabase in future phases, only this service implementation
 * needs to be updated with Supabase queries.
 */
export async function getEvents(criteria?: EventFilterCriteria): Promise<RunningEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 60));
  let events = getStoredEvents();

  if (!criteria) {
    return events;
  }

  if (criteria.searchQuery && criteria.searchQuery.trim() !== "") {
    const q = criteria.searchQuery.toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.locationCity.toLowerCase().includes(q) ||
        e.locationVenue.toLowerCase().includes(q) ||
        e.organizerName.toLowerCase().includes(q)
    );
  }

  if (criteria.city && criteria.city !== "all") {
    events = events.filter((e) =>
      e.locationCity.toLowerCase().includes(criteria.city!.toLowerCase())
    );
  }

  if (criteria.category && criteria.category !== "all") {
    events = events.filter((e) =>
      e.categories.some((c) => c.name === criteria.category)
    );
  }

  return events;
}

export async function getEventById(id: string): Promise<RunningEvent | null> {
  await new Promise((resolve) => setTimeout(resolve, 40));
  const events = getStoredEvents();
  const found = events.find((e) => e.id === id);
  return found || null;
}

export async function getEventBySlug(slug: string): Promise<RunningEvent | null> {
  await new Promise((resolve) => setTimeout(resolve, 40));
  const events = getStoredEvents();
  const found = events.find((e) => e.slug === slug);
  return found || null;
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
  await new Promise((resolve) => setTimeout(resolve, 150));
  const events = getStoredEvents();
  const id = `evt-${Date.now().toString(36)}`;
  const slug = payload.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newEvent: RunningEvent = {
    ...payload,
    id,
    slug,
  };

  const updated = [newEvent, ...events];
  saveStoredEvents(updated);
  return newEvent;
}

export async function getOrganizerEvents(organizerName?: string): Promise<RunningEvent[]> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const events = getStoredEvents();
  if (!organizerName || organizerName.trim() === "") {
    return events;
  }
  return events.filter(
    (e) => e.organizerName.toLowerCase().includes(organizerName.toLowerCase()) || true
  );
}

export async function updateEventStatus(
  id: string,
  status: EventStatus
): Promise<RunningEvent | null> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  const events = getStoredEvents();
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;

  events[index] = { ...events[index], status };
  saveStoredEvents(events);
  return events[index];
}
