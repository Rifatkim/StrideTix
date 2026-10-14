"use client";

import React from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { DistanceCategory } from "@/types";

interface EventFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedCategory: DistanceCategory | "all";
  onCategoryChange: (category: DistanceCategory | "all") => void;
  availableCities: string[];
}

const CATEGORIES: (DistanceCategory | "all")[] = [
  "all",
  "5K",
  "10K",
  "Half Marathon",
  "Full Marathon",
];

export function EventFilterBar({
  searchQuery,
  onSearchChange,
  selectedCity,
  onCityChange,
  selectedCategory,
  onCategoryChange,
  availableCities,
}: EventFilterBarProps) {
  return (
    <div className="bg-white rounded-card p-4 sm:p-5 border border-sand-border shadow-warm space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
          <input
            type="text"
            placeholder="Cari nama lomba, lokasi, atau organizer..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso placeholder:text-espresso-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all"
          />
        </div>

        {/* City Filter Dropdown */}
        <div className="relative md:w-56">
          <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso appearance-none focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all cursor-pointer"
          >
            <option value="all">Semua Kota</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-xs font-bold text-espresso-secondary uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
          Jarak:
        </span>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                isActive
                  ? "bg-brand text-white shadow-sm ring-1 ring-brand-700"
                  : "bg-surface-main text-espresso-secondary hover:bg-brand-50 hover:text-brand border border-sand-border"
              }`}
            >
              {cat === "all" ? "Semua Kategori" : cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
