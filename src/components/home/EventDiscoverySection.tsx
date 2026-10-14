"use client";

import React, { useState, useMemo } from "react";
import { DistanceCategory, RunningEvent } from "@/types";
import { EventFilterBar } from "@/components/events/EventFilterBar";
import { EventCard } from "@/components/events/EventCard";
import { CalendarSearch } from "lucide-react";

interface EventDiscoverySectionProps {
  initialEvents: RunningEvent[];
}

export function EventDiscoverySection({ initialEvents }: EventDiscoverySectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<DistanceCategory | "all">("all");

  // Extract unique cities
  const availableCities = useMemo(() => {
    const cities = new Set(initialEvents.map((e) => e.locationCity));
    return Array.from(cities);
  }, [initialEvents]);

  // Filter events reactively
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      // 1. Search Query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          event.title.toLowerCase().includes(q) ||
          event.locationCity.toLowerCase().includes(q) ||
          event.locationVenue.toLowerCase().includes(q) ||
          event.organizerName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // 2. City filter
      if (selectedCity !== "all" && event.locationCity !== selectedCity) {
        return false;
      }

      // 3. Category filter
      if (selectedCategory !== "all") {
        const hasCategory = event.categories.some((c) => c.name === selectedCategory);
        if (!hasCategory) return false;
      }

      return true;
    });
  }, [initialEvents, searchQuery, selectedCity, selectedCategory]);

  return (
    <section id="events-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-border pb-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-brand">
            Kalender Lomba
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-espresso">
            Jelajahi Event Lari Aktif
          </h2>
        </div>
        <span className="text-xs text-espresso-muted font-medium">
          Menampilkan <strong className="text-espresso">{filteredEvents.length}</strong> dari {initialEvents.length} event
        </span>
      </div>

      {/* Filter Bar */}
      <EventFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        availableCities={availableCities}
      />

      {/* Event Cards Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-card p-12 text-center border border-sand-border shadow-warm space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto text-brand">
            <CalendarSearch className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-espresso">
            Tidak ada event yang cocok
          </h3>
          <p className="text-xs text-espresso-secondary">
            Coba ubah kata kunci pencarian, pilih kota lain, atau reset filter kategori jarak.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("all");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 rounded-btn bg-brand text-white font-semibold text-xs shadow-sm hover:bg-brand-600 transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}
    </section>
  );
}
