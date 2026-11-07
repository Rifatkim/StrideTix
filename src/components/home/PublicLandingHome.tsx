"use client";

import React from "react";
import { RunningEvent } from "@/types";
import { HeroSection } from "./HeroSection";
import { RaceTickerTape } from "./RaceTickerTape";
import { FeaturedRacesSection } from "./FeaturedRacesSection";
import { EventDiscoverySection } from "./EventDiscoverySection";
import { SmartRecommendationExplainer } from "./SmartRecommendationExplainer";

interface PublicLandingHomeProps {
  events: RunningEvent[];
}

export function PublicLandingHome({ events }: PublicLandingHomeProps) {
  return (
    <div>
      {/* 1. Full-Bleed Cinematic Athletic Hero Section */}
      <HeroSection />

      {/* 2. Continuous Sports Marquee Ticker Tape (Seamlessly contiguous) */}
      <RaceTickerTape />

      {/* 3. Marketplace Body Sections */}
      <div className="space-y-8 sm:space-y-12 mt-8 sm:mt-10">
        {/* Featured Races Preview Section ("Race Pilihan Minggu Ini") */}
        <FeaturedRacesSection events={events} />

        {/* Full Marketplace Search, Filter & Event Catalog */}
        <EventDiscoverySection initialEvents={events} />

        {/* Smart Distance Scoring Explainer */}
        <SmartRecommendationExplainer />
      </div>
    </div>
  );
}
