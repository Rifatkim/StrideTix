"use client";

import React from "react";
import { DistanceCategory, TicketCategory } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, Award, Users, Tag } from "lucide-react";

interface CategoryFormBuilderProps {
  categories: TicketCategory[];
  onChange: (categories: TicketCategory[]) => void;
}

const DISTANCE_PRESETS: Record<DistanceCategory, { distanceKm: number; defaultPrice: number }> = {
  "5K": { distanceKm: 5, defaultPrice: 200000 },
  "10K": { distanceKm: 10, defaultPrice: 350000 },
  "Half Marathon": { distanceKm: 21.0975, defaultPrice: 500000 },
  "Full Marathon": { distanceKm: 42.195, defaultPrice: 750000 },
};

export function CategoryFormBuilder({ categories, onChange }: CategoryFormBuilderProps) {
  const handleAddCategory = () => {
    // Pick the first unused distance preset if available
    const existingNames = new Set(categories.map((c) => c.name));
    const allPresets: DistanceCategory[] = ["5K", "10K", "Half Marathon", "Full Marathon"];
    const available = allPresets.find((name) => !existingNames.has(name)) || "10K";
    const preset = DISTANCE_PRESETS[available];

    const newCategory: TicketCategory = {
      id: `cat-${Date.now().toString(36)}`,
      name: available,
      distanceKm: preset.distanceKm,
      price: preset.defaultPrice,
      quota: 500,
      availableQuota: 500,
      description: `Kategori lomba lari jarak ${available} untuk semua pelari.`,
      benefits: ["Jersey Eksklusif", "Finisher Medal", "Timing Chip", "Refreshment Station"],
    };

    onChange([...categories, newCategory]);
  };

  const handleRemoveCategory = (index: number) => {
    if (categories.length <= 1) {
      alert("Event wajib memiliki minimal satu kategori lomba.");
      return;
    }
    onChange(categories.filter((_, i) => i !== index));
  };

  const handleUpdateField = (index: number, field: keyof TicketCategory, value: any) => {
    const updated = [...categories];
    const item = { ...updated[index], [field]: value };

    // Auto-update distanceKm if name changes
    if (field === "name" && DISTANCE_PRESETS[value as DistanceCategory]) {
      item.distanceKm = DISTANCE_PRESETS[value as DistanceCategory].distanceKm;
    }

    // Keep availableQuota in sync with total quota
    if (field === "quota") {
      item.availableQuota = Number(value);
    }

    updated[index] = item;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-espresso uppercase tracking-wider">
            Kategori Jarak & Kuota Tiket
          </h3>
          <p className="text-[11px] text-espresso-muted">
            Tentukan kategori jarak yang dilombakan, harga tiket dalam IDR, dan kuota peserta.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-brand-50 text-brand border border-brand/20 font-bold text-xs hover:bg-brand hover:text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      <div className="space-y-4">
        {categories.map((cat, index) => (
          <div
            key={cat.id || index}
            className="p-4 rounded-card bg-sand-warm/60 border border-sand-border space-y-3 relative group"
          >
            <div className="flex items-center justify-between pb-2 border-b border-sand-border">
              <span className="text-xs font-bold text-espresso flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-brand" />
                Kategori #{index + 1}
              </span>
              {categories.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(index)}
                  className="text-espresso-muted hover:text-red-600 transition-colors p-1"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-espresso mb-1">
                  Nama Jarak
                </label>
                <select
                  value={cat.name}
                  onChange={(e) =>
                    handleUpdateField(index, "name", e.target.value as DistanceCategory)
                  }
                  className="w-full px-2.5 py-1.5 rounded bg-white border border-sand-border text-xs text-espresso focus:ring-1 focus:ring-brand outline-none"
                >
                  <option value="5K">5K (5.0 km)</option>
                  <option value="10K">10K (10.0 km)</option>
                  <option value="Half Marathon">Half Marathon (21.1 km)</option>
                  <option value="Full Marathon">Full Marathon (42.2 km)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-espresso mb-1">
                  Harga Tiket (IDR)
                </label>
                <input
                  type="number"
                  step={10000}
                  min={50000}
                  value={cat.price}
                  onChange={(e) => handleUpdateField(index, "price", Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-white border border-sand-border text-xs text-espresso focus:ring-1 focus:ring-brand outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-espresso mb-1">
                  Kuota Peserta
                </label>
                <input
                  type="number"
                  min={10}
                  value={cat.quota}
                  onChange={(e) => handleUpdateField(index, "quota", Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-white border border-sand-border text-xs text-espresso focus:ring-1 focus:ring-brand outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-espresso mb-1">
                  Estimasi Nilai Kuota
                </label>
                <div className="px-2.5 py-1.5 rounded bg-white/70 border border-sand-border text-xs font-bold text-espresso">
                  {formatRupiah(cat.price * cat.quota)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-espresso mb-1">
                Deskripsi Singkat Kategori
              </label>
              <input
                type="text"
                value={cat.description}
                onChange={(e) => handleUpdateField(index, "description", e.target.value)}
                placeholder="Deskripsi target peserta kategori ini"
                className="w-full px-2.5 py-1.5 rounded bg-white border border-sand-border text-xs text-espresso focus:ring-1 focus:ring-brand outline-none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
