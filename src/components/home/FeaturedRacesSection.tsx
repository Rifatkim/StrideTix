"use client";

import React from "react";
import Link from "next/link";
import { RunningEvent } from "@/types";
import { EventCard } from "@/components/events/EventCard";
import { Container } from "@/components/layout/Container";
import { ArrowRight, Flame, Sparkles } from "lucide-react";

interface FeaturedRacesSectionProps {
  events: RunningEvent[];
}

export function FeaturedRacesSection({ events }: FeaturedRacesSectionProps) {
  if (events.length === 0) {
    return null;
  }

  // Take top 4 curated events
  const featured = events.slice(0, 4);

  return (
    <section id="kalender-lomba" className="pt-8 pb-4 scroll-mt-20 md:scroll-mt-24 relative">
      {/* Anchor alias for backwards compatibility */}
      <span id="featured-races" className="absolute -top-24" aria-hidden="true" />
      <Container className="space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-border pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand border border-brand/20 mb-2">
              <Flame className="w-3.5 h-3.5 text-brand" />
              <span>Pilihan Kurasi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-espresso tracking-tight">
              Race Pilihan Minggu Ini
            </h2>
            <p className="text-xs sm:text-sm text-espresso-secondary mt-1 max-w-xl">
              Temukan event lari berdasarkan lokasi, kategori, dan jadwal yang sesuai.
            </p>
          </div>

          <a
            href="#events-section"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand hover:text-brand-800 transition-colors self-start sm:self-end group"
          >
            <span>Lihat Semua Event ({events.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* 4-Column Curated Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featured.map((event, idx) => (
            <EventCard
              key={event.id}
              event={event}
              isRecommended={idx === 0 || idx === 2}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
