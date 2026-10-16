"use client";

import React, { useState, useMemo } from "react";
import { DistanceCategory, RunningEvent } from "@/types";
import { Container } from "@/components/layout/Container";
import { EventFilterBar, FilterState } from "@/components/events/EventFilterBar";
import { EventCard } from "@/components/events/EventCard";
import { CalendarSearch, RotateCcw } from "lucide-react";

interface EventDiscoverySectionProps {
  initialEvents: RunningEvent[];
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: "",
  selectedCategory: "all",
  selectedCity: "all",
  selectedMonth: "all",
  priceRange: "all",
  availability: "all",
  sortBy: "date-asc",
};

export function EventDiscoverySection({
  initialEvents,
}: EventDiscoverySectionProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Extract unique cities from initial events
  const availableCities = useMemo(() => {
    const cities = new Set(initialEvents.map((e) => e.locationCity));
    return Array.from(cities);
  }, [initialEvents]);

  const handleFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Reactive Multi-dimensional Filter & Sorting
  const filteredEvents = useMemo(() => {
    let result = initialEvents.filter((event) => {
      // 1. Long Search Query: title, city, venue, organizer, categories
      if (filters.searchQuery.trim() !== "") {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesCity = event.locationCity.toLowerCase().includes(q);
        const matchesVenue = event.locationVenue.toLowerCase().includes(q);
        const matchesOrganizer = event.organizerName.toLowerCase().includes(q);
        const matchesCategory = event.categories.some((c) =>
          c.name.toLowerCase().includes(q)
        );

        if (
          !matchesTitle &&
          !matchesCity &&
          !matchesVenue &&
          !matchesOrganizer &&
          !matchesCategory
        ) {
          return false;
        }
      }

      // 2. Running Distance Category filter
      if (filters.selectedCategory !== "all") {
        const hasCategory = event.categories.some(
          (c) => c.name === filters.selectedCategory
        );
        if (!hasCategory) return false;
      }

      // 3. City filter
      if (
        filters.selectedCity !== "all" &&
        event.locationCity !== filters.selectedCity
      ) {
        return false;
      }

      // 4. Month / Period filter (YYYY-MM)
      if (filters.selectedMonth !== "all") {
        if (!event.eventDate.startsWith(filters.selectedMonth)) {
          return false;
        }
      }

      // 5. Availability & AI Recommendation filter
      const totalQuota = event.categories.reduce(
        (acc, c) => acc + c.availableQuota,
        0
      );
      if (filters.availability === "available" && totalQuota <= 0) {
        return false;
      }
      if (
        filters.availability === "almost-sold-out" &&
        (totalQuota <= 0 || totalQuota > 50)
      ) {
        return false;
      }
      if (filters.availability === "recommended") {
        const hasHalfMarathon = event.categories.some(
          (c) => c.name === "Half Marathon"
        );
        if (!hasHalfMarathon) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (filters.sortBy === "price-asc") {
        const minPriceA = Math.min(...a.categories.map((c) => c.price));
        const minPriceB = Math.min(...b.categories.map((c) => c.price));
        return minPriceA - minPriceB;
      }
      if (filters.sortBy === "popular") {
        const totalQuotaA = a.categories.reduce((acc, c) => acc + c.quota, 0);
        const totalQuotaB = b.categories.reduce((acc, c) => acc + c.quota, 0);
        return totalQuotaB - totalQuotaA;
      }
      // Default: date-asc
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    });

    return result;
  }, [initialEvents, filters]);

  return (
    <section id="jelajahi-event" className="py-6 sm:py-8 space-y-6 scroll-mt-20 md:scroll-mt-24 relative">
      {/* Anchor alias for backwards compatibility */}
      <span id="events-section" className="absolute -top-24" aria-hidden="true" />
      <Container className="space-y-6">
        {/* Section Header: Lebar & Proporsional */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-sand-border pb-3.5">
          <div>
            <span className="text-xs uppercase font-black tracking-wider text-brand">
              Marketplace Event Lari
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-espresso tracking-tight">
              Jelajahi Event Lari Aktif
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-espresso-muted">
            <span>
              Menampilkan{" "}
              <strong className="text-espresso font-black">
                {filteredEvents.length}
              </strong>{" "}
              dari {initialEvents.length} lomba lari
            </span>
          </div>
        </div>

        {/* Long Marketplace Search & Filter Bar */}
        <EventFilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          availableCities={availableCities}
          totalResults={filteredEvents.length}
        />

        {/* 4-Column Responsive Marketplace Event Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-card p-10 sm:p-12 text-center border border-sand-border shadow-warm space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto text-brand">
              <CalendarSearch className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-espresso">
                {initialEvents.length === 0
                  ? "Belum Ada Event Dipublikasikan"
                  : "Tidak ada event yang cocok"}
              </h3>
              <p className="text-xs text-espresso-secondary mt-1">
                {initialEvents.length === 0
                  ? "Penyelenggara lomba (EO) dapat mulai membuat dan mempublikasikan event lari melalui Portal Organizer."
                  : "Coba ubah kata kunci pencarian, pilih kota lain, atau reset filter kategori jarak."}
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-btn bg-brand text-white font-bold text-xs shadow-sm hover:bg-brand-800 transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
