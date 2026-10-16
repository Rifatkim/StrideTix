"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventCreateForm } from "@/components/organizer/EventCreateForm";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";

export default function NewEventPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />

      <Container as="main" className="flex-1 pt-6 pb-28 sm:pt-8 sm:pb-12 space-y-6">
        <AuthGuard allowedRole="organizer">
          {/* Navigation Breadcrumb */}
          <div>
            <Link
              href="/organizer/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-espresso-secondary hover:text-brand transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Dashboard Organizer</span>
            </Link>
          </div>

          {/* Header */}
          <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand bg-brand-50 px-2 py-0.5 rounded-full">
                  Portal Penyelenggara Lomba
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-espresso mt-1">
                  Buat Event Lari Baru
                </h1>
                <p className="text-xs text-espresso-secondary mt-1">
                  Lengkapi rincian event dan buat kategori jarak lomba berperingkat rekomendasi cerdas.
                </p>
              </div>
            </div>
          </div>

          {/* Creation Form */}
          <EventCreateForm />
        </AuthGuard>
      </Container>

      <Footer />
    </div>
  );
}
