"use client";

import React from "react";
import { RunningEvent } from "@/types";
import { HeroSection } from "./HeroSection";
import { FeaturedRacesSection } from "./FeaturedRacesSection";
import { EventDiscoverySection } from "./EventDiscoverySection";
import { SmartRecommendationExplainer } from "./SmartRecommendationExplainer";

interface PublicLandingHomeProps {
  events: RunningEvent[];
}

export function PublicLandingHome({ events }: PublicLandingHomeProps) {

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* 1. Balanced 2-Column Hero Section with Layered Product Preview */}
      <HeroSection />

      {/* 2. Featured Races Preview Section ("Race Pilihan Minggu Ini") */}
      <FeaturedRacesSection events={events} />



      {/* 4. Full Marketplace Search, Filter & Event Catalog */}
      <EventDiscoverySection initialEvents={events} />

      {/* 5. Smart Distance Scoring Explainer */}
      <SmartRecommendationExplainer />
    </div>
  );
}
