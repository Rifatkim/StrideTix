"use client";

import React from "react";
import { Search, Filter, CheckCircle2, Ticket } from "lucide-react";

interface ParticipantsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  availableCategories: string[];
}

export function ParticipantsFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  availableCategories,
}: ParticipantsFilterBarProps) {
  return (
    <div className="bg-white rounded-card p-4 border border-sand-border shadow-warm space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative sm:col-span-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama, email, BIB..."
            className="w-full pl-9 pr-3.5 py-2 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
          />
          <Search className="w-4 h-4 text-espresso-muted absolute left-3 top-2.5" />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
          >
            <option value="all">Semua Kategori Jarak</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in Status Filter */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
          >
            <option value="all">Semua Status Check-in</option>
            <option value="checked_in">Sudah Check-in</option>
            <option value="issued">Belum Check-in</option>
          </select>
        </div>
      </div>
    </div>
  );
}
