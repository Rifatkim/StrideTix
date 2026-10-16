import React from "react";
import { getEvents } from "@/services/eventService";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HomeViewDispatcher } from "@/components/home/HomeViewDispatcher";

export const revalidate = 60; // 1 minute ISR / fast cache

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen flex flex-col bg-surface-main">
      <Navbar />
      <main className="flex-1 pb-28 md:pb-8">
        <HomeViewDispatcher events={events} />
      </main>
      <Footer />
    </div>
  );
}
