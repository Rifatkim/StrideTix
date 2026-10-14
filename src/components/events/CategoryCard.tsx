"use client";

import React from "react";
import { Check, Sparkles, AlertTriangle, Users } from "lucide-react";
import { TicketCategory } from "@/types";
import { formatRupiah } from "@/lib/utils";

interface CategoryCardProps {
  category: TicketCategory;
  isSelected: boolean;
  onSelect: (category: TicketCategory) => void;
  isRecommended?: boolean;
  isAboveRecommendation?: boolean;
}

export function CategoryCard({
  category,
  isSelected,
  onSelect,
  isRecommended = false,
  isAboveRecommendation = false,
}: CategoryCardProps) {
  const isSoldOut = category.availableQuota <= 0;

  return (
    <div
      onClick={() => !isSoldOut && onSelect(category)}
      className={`relative rounded-card p-5 border transition-all duration-200 cursor-pointer ${
        isSoldOut
          ? "bg-surface-muted/50 border-sand-border opacity-60 cursor-not-allowed"
          : isSelected
          ? "bg-brand-50 border-brand-700 ring-2 ring-brand-700/20 shadow-warm"
          : "bg-white border-sand-border hover:border-brand-300 hover:shadow-warm"
      }`}
    >
      {/* Badges on Top */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Main Category Name Badge */}
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-espresso text-white">
            {category.name}
          </span>

          {/* Recommended Badge per DESIGN.md */}
          {isRecommended && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand text-white shadow-sm animate-pulse">
              <Sparkles className="w-3 h-3 text-accent-ai" />
              <span>Recommended for You</span>
            </span>
          )}

          {/* Above Recommendation Warning Badge */}
          {isAboveRecommendation && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-accent-warning-bg text-accent-warning border border-accent-warning-border">
              <AlertTriangle className="w-3 h-3" />
              <span>Di Atas Rekomendasi</span>
            </span>
          )}
        </div>

        {/* Radio Check Indicator */}
        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
            isSelected
              ? "bg-brand border-brand text-white"
              : "border-sand-border-strong bg-white"
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      {/* Price & Quota Info */}
      <div className="flex items-baseline justify-between gap-2 pb-3 border-b border-sand-border/80">
        <div>
          <span className="text-xl font-extrabold text-espresso">
            {formatRupiah(category.price)}
          </span>
          <span className="text-xs text-espresso-muted ml-1.5">/ peserta</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-espresso-secondary">
          <Users className="w-3.5 h-3.5 text-brand" />
          <span>Sisa <strong>{category.availableQuota}</strong> kuota</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-espresso-secondary pt-3 leading-relaxed">
        {category.description}
      </p>

      {/* Benefits checklist */}
      {category.benefits && category.benefits.length > 0 && (
        <div className="pt-3 space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
            Fasilitas Lomba:
          </span>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-espresso-secondary">
            {category.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-accent-success shrink-0" />
                <span className="truncate">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
