import React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { getEventById, getTicketCategory } from "@/services/eventService";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckoutFlowContainer } from "@/components/checkout/CheckoutFlowContainer";
import { Container } from "@/components/layout/Container";

interface CheckoutPageProps {
  searchParams: {
    eventId?: string;
    categoryId?: string;
  };
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const eventId = searchParams.eventId || "evt-jkt-marathon-2026";
  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  // Find category or default to first
  const categoryId = searchParams.categoryId || event.categories[0].id;
  const category = (await getTicketCategory(eventId, categoryId)) || event.categories[0];

  // Tamu tanpa login wajib diarahkan ke login page
  if (!session?.user) {
    redirect(`/login?redirect=${encodeURIComponent(`/checkout?eventId=${eventId}&categoryId=${categoryId}`)}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-main">
      <Navbar />

      <Container as="main" className="flex-1 pt-6 pb-28 sm:pt-8 sm:pb-12">
        <CheckoutFlowContainer event={event} category={category} />
      </Container>

      <Footer />
    </div>
  );
}
