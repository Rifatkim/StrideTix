"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TicketCategory, DistanceCategory } from "@/types";
import { CategoryCard } from "@/components/events/CategoryCard";
import { RecommendationCard } from "@/components/recommendation/RecommendationCard";
import { SafetyWarningModal } from "@/components/recommendation/SafetyWarningModal";
import { useRunner } from "@/context/RunnerContext";
import { formatRupiah } from "@/lib/utils";
import { ArrowRight, Ticket, ShieldCheck } from "lucide-react";

interface EventTicketBookingSectionProps {
  eventId: string;
  categories: TicketCategory[];
}

export function EventTicketBookingSection({
  eventId,
  categories,
}: EventTicketBookingSectionProps) {
  const { recommendation, currentProfile } = useRunner();

  // Find initially recommended category or default to first
  const defaultCategory = React.useMemo(() => {
    if (recommendation?.recommendedCategory) {
      const match = categories.find((c) => c.name === recommendation.recommendedCategory);
      if (match) return match;
    }
    return categories[0];
  }, [recommendation, categories]);

  const [selectedCategory, setSelectedCategory] = useState<TicketCategory>(defaultCategory);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<TicketCategory | null>(null);

  // Synchronize when recommendation changes
  React.useEffect(() => {
    if (recommendation?.recommendedCategory) {
      const match = categories.find((c) => c.name === recommendation.recommendedCategory);
      if (match) {
        setSelectedCategory(match);
      }
    }
  }, [recommendation, categories]);

  // Handle user clicking a category
  const handleSelectCategory = (category: TicketCategory) => {
    if (recommendation?.recommendedCategory) {
      const check = recommendation.isEligibleForCategory(category.name);
      if (check.isAboveRecommendation) {
        setPendingCategory(category);
        setWarningModalOpen(true);
        return;
      }
    }
    setSelectedCategory(category);
  };

  const handleSwitchToRecommended = () => {
    if (recommendation?.recommendedCategory) {
      const match = categories.find((c) => c.name === recommendation.recommendedCategory);
      if (match) {
        setSelectedCategory(match);
      }
    }
    setWarningModalOpen(false);
    setPendingCategory(null);
  };

  const handleProceedAnyway = () => {
    if (pendingCategory) {
      setSelectedCategory(pendingCategory);
    }
    setWarningModalOpen(false);
    setPendingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Smart Distance Recommendation Card */}
      <RecommendationCard />

      {/* 2. Category Selector Header */}
      <div className="flex items-center justify-between border-b border-sand-border pb-3 pt-2">
        <div>
          <h2 className="text-xl font-extrabold text-espresso">
            Pilih Kategori Tiket
          </h2>
          <p className="text-xs text-espresso-muted">
            Tersedia {categories.length} kategori jarak resmi lomba
          </p>
        </div>
      </div>

      {/* 3. Category Cards List */}
      <div className="space-y-3.5">
        {categories.map((category) => {
          const isRec = recommendation?.recommendedCategory === category.name;
          const isAbove = recommendation?.isEligibleForCategory(category.name).isAboveRecommendation;

          return (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory?.id === category.id}
              onSelect={handleSelectCategory}
              isRecommended={isRec}
              isAboveRecommendation={isAbove}
            />
          );
        })}
      </div>

      {/* 4. Sticky Order Summary Bar */}
      <div className="sticky bottom-16 z-20 bg-white rounded-card p-5 border border-brand-300 shadow-warm-hover space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-sand-border pb-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
              Kategori Terpilih
            </span>
            <span className="text-sm font-extrabold text-espresso">
              {selectedCategory.name} ({selectedCategory.distanceKm} KM)
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
              Total Pembayaran
            </span>
            <span className="text-xl font-extrabold text-brand">
              {formatRupiah(selectedCategory.price)}
            </span>
          </div>
        </div>

        {/* Checkout CTA */}
        <Link
          href={`/checkout?eventId=${eventId}&categoryId=${selectedCategory.id}`}
          className="w-full py-3.5 px-6 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 group"
        >
          <Ticket className="w-4 h-4" />
          <span>Lanjutkan Pemesanan Tiket</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        <div className="flex items-center justify-center gap-2 text-[11px] text-espresso-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-success" />
          <span>E-Ticket Resmi QR Code instan setelah pembayaran</span>
        </div>
      </div>

      {/* 5. Safety Warning Modal Dialog */}
      {pendingCategory && recommendation?.recommendedCategory && (
        <SafetyWarningModal
          isOpen={warningModalOpen}
          selectedCategoryName={pendingCategory.name}
          recommendedCategoryName={recommendation.recommendedCategory}
          longestRunKm={currentProfile?.summary.longestRunKm || 0}
          onSwitchToRecommended={handleSwitchToRecommended}
          onProceedAnyway={handleProceedAnyway}
          onClose={() => {
            setWarningModalOpen(false);
            setPendingCategory(null);
          }}
        />
      )}
    </div>
  );
}
