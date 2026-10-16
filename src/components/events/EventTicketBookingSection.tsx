"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TicketCategory } from "@/types";
import { CategoryCard } from "@/components/events/CategoryCard";
import { RecommendationCard } from "@/components/recommendation/RecommendationCard";
import { SafetyWarningModal } from "@/components/recommendation/SafetyWarningModal";
import { StickyBookingBar } from "@/components/events/StickyBookingBar";
import { useRunner } from "@/context/RunnerContext";
import { useAuth } from "@/context/AuthContext";
import { Info, Sparkles } from "lucide-react";

interface EventTicketBookingSectionProps {
  eventId: string;
  categories: TicketCategory[];
}

export function EventTicketBookingSection({
  eventId,
  categories,
}: EventTicketBookingSectionProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { recommendation, currentProfile } = useRunner();

  // Initial state: no category selected yet until user actively chooses
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | null>(null);
  const [warningModalOpen, setWarningModalOpen] = useState(false);

  // Check if selected category is above recommendation
  const isSelectedAboveRecommendation = React.useMemo(() => {
    if (!selectedCategory || !recommendation?.recommendedCategory) return false;
    return recommendation.isEligibleForCategory(selectedCategory.name).isAboveRecommendation;
  }, [selectedCategory, recommendation]);

  // Handle user clicking a category card
  const handleSelectCategory = (category: TicketCategory) => {
    setSelectedCategory(category);
  };

  // Scroll back to categories list smoothly
  const handleScrollToCategories = () => {
    const el = document.getElementById("event-categories-list");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // When user clicks "Lanjutkan Pemesanan" in the sticky booking bar
  const handleProceed = () => {
    if (!selectedCategory) return;

    // Tamu tanpa login hanya bisa melihat detail & harga, wajib diarahkan ke login untuk membeli
    if (!currentUser) {
      const targetUrl = `/checkout?eventId=${eventId}&categoryId=${selectedCategory.id}`;
      router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
      return;
    }

    // If above recommendation, show full Safety Warning Modal first
    if (isSelectedAboveRecommendation && recommendation?.recommendedCategory) {
      setWarningModalOpen(true);
      return;
    }

    // Otherwise proceed directly to checkout
    router.push(`/checkout?eventId=${eventId}&categoryId=${selectedCategory.id}`);
  };

  // Modal actions
  const handleSwitchToRecommended = () => {
    if (recommendation?.recommendedCategory) {
      const match = categories.find((c) => c.name === recommendation.recommendedCategory);
      if (match) {
        setSelectedCategory(match);
      }
    }
    setWarningModalOpen(false);
  };

  const handleProceedAnyway = () => {
    if (selectedCategory) {
      setWarningModalOpen(false);
      if (!currentUser) {
        const targetUrl = `/checkout?eventId=${eventId}&categoryId=${selectedCategory.id}`;
        router.push(`/login?redirect=${encodeURIComponent(targetUrl)}`);
        return;
      }
      router.push(`/checkout?eventId=${eventId}&categoryId=${selectedCategory.id}`);
    }
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

      {/* 3. Helper Note Before Selection */}
      {!selectedCategory ? (
        <div className="p-3.5 rounded-xl bg-surface-soft border border-sand-border/80 text-espresso-secondary text-xs flex items-center gap-2.5 animate-in fade-in">
          <Info className="w-4 h-4 text-brand shrink-0" />
          <span>Pilih salah satu kategori lomba di bawah untuk melanjutkan pemesanan.</span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/80 text-xs text-espresso flex items-center justify-between gap-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand" />
            <span>
              Kategori terpilih: <strong>{selectedCategory.name}</strong> ({selectedCategory.distanceKm} KM)
            </span>
          </div>
          <button
            type="button"
            onClick={handleScrollToCategories}
            className="text-[11px] font-bold text-brand hover:underline"
          >
            Pilih Lainnya
          </button>
        </div>
      )}

      {/* 4. Category Cards List */}
      <div id="event-categories-list" className="space-y-3.5 scroll-mt-28">
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

      {/* 5. Sticky Booking Bar (Fixed to bottom viewport) */}
      <StickyBookingBar
        selectedCategory={selectedCategory}
        isAboveRecommendation={isSelectedAboveRecommendation}
        onProceed={handleProceed}
        onScrollToCategories={handleScrollToCategories}
      />

      {/* 6. Safety Warning Modal Dialog (Opens when proceeding with above-recommendation category) */}
      {selectedCategory && recommendation?.recommendedCategory && (
        <SafetyWarningModal
          isOpen={warningModalOpen}
          selectedCategoryName={selectedCategory.name}
          recommendedCategoryName={recommendation.recommendedCategory}
          longestRunKm={currentProfile?.summary.longestRunKm || 0}
          onSwitchToRecommended={handleSwitchToRecommended}
          onProceedAnyway={handleProceedAnyway}
          onClose={() => setWarningModalOpen(false)}
        />
      )}
    </div>
  );
}
