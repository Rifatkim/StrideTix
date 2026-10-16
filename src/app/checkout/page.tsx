import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById, getTicketCategory } from "@/services/eventService";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { ArrowLeft, CheckCircle2, ChevronRight, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";

interface CheckoutPageProps {
  searchParams: {
    eventId?: string;
    categoryId?: string;
  };
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const eventId = searchParams.eventId || "evt-jkt-marathon-2026";
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  // Find category or default to first
  const categoryId = searchParams.categoryId || event.categories[0].id;
  const category = (await getTicketCategory(eventId, categoryId)) || event.categories[0];

  return (
    <div className="min-h-screen flex flex-col bg-surface-main">
      <Navbar />

      <Container as="main" className="flex-1 pt-6 pb-28 sm:pt-8 sm:pb-12 space-y-8">
        {/* Step Progress Indicator per DESIGN.md Section 14.3 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-border pb-6">
          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-espresso-secondary hover:text-brand transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Detail Event</span>
          </Link>

          {/* Steps */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-brand">
              <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">
                1
              </span>
              <span>Data Peserta</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-espresso-muted" />
            <span className="flex items-center gap-1.5 text-brand">
              <span className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px]">
                2
              </span>
              <span>Simulasi Bayar</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-espresso-muted" />
            <span className="flex items-center gap-1.5 text-espresso-muted">
              <span className="w-5 h-5 rounded-full bg-sand-border text-espresso-secondary flex items-center justify-center text-[10px]">
                3
              </span>
              <span>E-Ticket QR</span>
            </span>
          </div>
        </div>

        {/* 2-Column Form & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <CheckoutForm event={event} category={category} />
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <OrderSummary event={event} category={category} />
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
}
