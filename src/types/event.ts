export type DistanceCategory = "5K" | "10K" | "Half Marathon" | "Full Marathon";

export interface TicketCategory {
  id: string;
  name: DistanceCategory;
  distanceKm: number;
  price: number;
  quota: number;
  availableQuota: number;
  description: string;
  benefits: string[];
}

export type EventStatus = "draft" | "published" | "completed" | "cancelled";

export interface RunningEvent {
  id: string;
  slug: string;
  title: string;
  organizerName: string;
  organizerLogo?: string;
  description: string;
  locationCity: string;
  locationVenue: string;
  eventDate: string; // ISO Date String YYYY-MM-DD
  startTime: string; // e.g. "05:30 WIB"
  registrationDeadline: string;
  bannerImage: string;
  status: EventStatus;
  categories: TicketCategory[];
  rulesAndTerms: string[];
  routeHighlights?: string[];
}

export interface EventFilterCriteria {
  searchQuery?: string;
  city?: string;
  category?: DistanceCategory | "all";
}
