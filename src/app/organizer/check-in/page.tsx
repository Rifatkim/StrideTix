"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckInValidator } from "@/components/organizer/CheckInValidator";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Container } from "@/components/layout/Container";

interface CheckInPageProps {
  searchParams: {
    code?: string;
  };
}

export default function CheckInPage({ searchParams }: CheckInPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />

      <Container as="main" className="flex-1 pt-6 pb-28 sm:pt-8 sm:pb-12">
        <AuthGuard allowedRole="organizer">
          <CheckInValidator initialCode={searchParams?.code} />
        </AuthGuard>
      </Container>

      <Footer />
    </div>
  );
}
