import React from "react";
import { notFound } from "next/navigation";
import { getEventById, getEvents } from "@/services/eventService";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventDetailHeader } from "@/components/events/EventDetailHeader";
import { EventTicketBookingSection } from "@/components/events/EventTicketBookingSection";
import { MapPin, Route, ShieldAlert, Award, CheckCircle2 } from "lucide-react";

interface EventDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ id: e.id }));
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-main">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Header Section */}
        <EventDetailHeader event={event} />

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Event Details (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* About Event */}
            <section className="bg-white rounded-card p-6 border border-sand-border shadow-warm space-y-3">
              <h2 className="text-xl font-extrabold text-espresso">
                Tentang Perlombaan
              </h2>
              <p className="text-sm text-espresso-secondary leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </section>

            {/* Route & Highlights */}
            {event.routeHighlights && event.routeHighlights.length > 0 && (
              <section className="bg-white rounded-card p-6 border border-sand-border shadow-warm space-y-4">
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-brand" />
                  <h2 className="text-xl font-extrabold text-espresso">
                    Rute & Jalur Utama Lomba
                  </h2>
                </div>
                <ul className="space-y-2.5">
                  {event.routeHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-espresso-secondary">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Rules & Regulations */}
            {event.rulesAndTerms && event.rulesAndTerms.length > 0 && (
              <section className="bg-white rounded-card p-6 border border-sand-border shadow-warm space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-accent-warning" />
                  <h2 className="text-xl font-extrabold text-espresso">
                    Syarat & Ketentuan Peserta
                  </h2>
                </div>
                <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-espresso-secondary leading-relaxed">
                  {event.rulesAndTerms.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right Column: Ticket Booking Selector (5 cols) */}
          <div className="lg:col-span-5">
            <EventTicketBookingSection
              eventId={event.id}
              categories={event.categories}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
