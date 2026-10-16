"use client";

import React from "react";
import {
  Search,
  MapPin,
  Calendar,
  ArrowUpDown,
  Tag,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { DistanceCategory } from "@/types";

export interface FilterState {
  searchQuery: string;
  selectedCategory: DistanceCategory | "all";
  selectedCity: string;
  selectedMonth: string;
  priceRange: "all" | "under-300" | "300-500" | "above-500";
  availability: "all" | "available" | "almost-sold-out" | "recommended";
  sortBy: "date-asc" | "price-asc" | "popular";
}

interface EventFilterBarProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  availableCities: string[];
  totalResults: number;
}

const CATEGORIES: { label: string; value: DistanceCategory | "all" }[] = [
  { label: "Semua Event", value: "all" },
  { label: "5K Fun Run", value: "5K" },
  { label: "10K City Race", value: "10K" },
  { label: "Half Marathon (21K)", value: "Half Marathon" },
  { label: "Full Marathon (42K)", value: "Full Marathon" },
];

export function EventFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  availableCities,
  totalResults,
}: EventFilterBarProps) {
  const isFiltered =
    filters.searchQuery.trim() !== "" ||
    filters.selectedCategory !== "all" ||
    filters.selectedCity !== "all" ||
    filters.selectedMonth !== "all" ||
    filters.priceRange !== "all" ||
    filters.availability !== "all" ||
    filters.sortBy !== "date-asc";

  return (
    <div className="bg-white rounded-card p-4 sm:p-5 lg:p-6 border border-sand-border shadow-warm space-y-4">
      {/* 1. Baris Atas: Search Bar Panjang ala Marketplace Loket.com + Filter Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Bar Lebar (MD: 5 cols, LG: 6 cols) */}
        <div className="md:col-span-6 lg:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Cari event lari, kota, rute, atau nama organizer..."
            value={filters.searchQuery}
            onChange={(e) => onFilterChange("searchQuery", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso placeholder:text-espresso-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all"
          />
        </div>

        {/* Dropdown Kota / Lokasi (MD: 3 cols, LG: 2 cols) */}
        <div className="md:col-span-3 lg:col-span-2 relative">
          <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
          <select
            value={filters.selectedCity}
            onChange={(e) => onFilterChange("selectedCity", e.target.value)}
            className="w-full pl-8 pr-7 py-2.5 rounded-input bg-surface-main border border-sand-border text-xs sm:text-sm text-espresso appearance-none focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer truncate"
          >
            <option value="all">Semua Kota</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Periode Tanggal (MD: 3 cols, LG: 2 cols) */}
        <div className="md:col-span-3 lg:col-span-2 relative">
          <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
          <select
            value={filters.selectedMonth}
            onChange={(e) => onFilterChange("selectedMonth", e.target.value)}
            className="w-full pl-8 pr-7 py-2.5 rounded-input bg-surface-main border border-sand-border text-xs sm:text-sm text-espresso appearance-none focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer truncate"
          >
            <option value="all">Semua Waktu</option>
            <option value="2026-11">November 2026</option>
            <option value="2026-12">Desember 2026</option>
          </select>
        </div>

        {/* Dropdown Urutan / Sorting (MD: 6 cols, LG: 3 cols) */}
        <div className="md:col-span-6 lg:col-span-3 relative">
          <ArrowUpDown className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-espresso-muted pointer-events-none" />
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange(
                "sortBy",
                e.target.value as FilterState["sortBy"]
              )
            }
            className="w-full pl-8 pr-7 py-2.5 rounded-input bg-surface-main border border-sand-border text-xs sm:text-sm text-espresso appearance-none focus:outline-none focus:ring-2 focus:ring-brand cursor-pointer truncate"
          >
            <option value="date-asc">Urutkan: Tanggal Terdekat</option>
            <option value="price-asc">Urutkan: Harga Terendah</option>
            <option value="popular">Urutkan: Paling Populer</option>
          </select>
        </div>
      </div>

      {/* 2. Baris Bawah: Chip Kategori Lari + Filter Ketersediaan + Reset Button */}
      <div className="pt-2 border-t border-sand-border/70 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Chip Kategori Lari Horizontal */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
          <span className="text-[11px] font-bold text-espresso-muted uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand" />
            Jarak:
          </span>
          {CATEGORIES.map((cat) => {
            const isActive = filters.selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onFilterChange("selectedCategory", cat.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 ${
                  isActive
                    ? "bg-brand text-white shadow-sm ring-1 ring-brand-800"
                    : "bg-surface-main text-espresso-secondary hover:bg-brand-50 hover:text-brand border border-sand-border"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Quick Filter Status Tiket & Reset Button */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none shrink-0">
          {/* Filter Status: Semua vs Tersedia vs Rekomendasi AI */}
          <div className="inline-flex rounded-lg border border-sand-border p-0.5 bg-surface-main text-xs">
            <button
              onClick={() => onFilterChange("availability", "all")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                filters.availability === "all"
                  ? "bg-white text-espresso shadow-xs"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => onFilterChange("availability", "available")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                filters.availability === "available"
                  ? "bg-white text-emerald-700 shadow-xs"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Tiket Ada</span>
            </button>
            <button
              onClick={() => onFilterChange("availability", "recommended")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 ${
                filters.availability === "recommended"
                  ? "bg-white text-accent-ai shadow-xs"
                  : "text-espresso-muted hover:text-espresso"
              }`}
            >
              <Sparkles className="w-3 h-3 text-accent-ai" />
              <span>Rekomendasi AI</span>
            </button>
          </div>

          {/* Reset Filter Button (Active when filter changed) */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-espresso-muted hover:text-brand hover:bg-brand-50 rounded-btn transition-colors shrink-0"
              title="Reset semua filter ke pengaturan awal"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
