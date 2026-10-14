import React from "react";
import { getEvents } from "@/services/eventService";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { SmartRecommendationExplainer } from "@/components/home/SmartRecommendationExplainer";
import { EventDiscoverySection } from "@/components/home/EventDiscoverySection";

export const revalidate = 60; // 1 minute ISR / fast cache

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen flex flex-col bg-surface-main">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <EventDiscoverySection initialEvents={events} />
        <SmartRecommendationExplainer />
      </main>
      <Footer />
    </div>
  );
}
