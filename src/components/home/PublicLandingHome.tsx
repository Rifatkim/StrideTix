"use client";

import React from "react";
import Link from "next/link";
import { RunningEvent, UserRole } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { HeroSection } from "./HeroSection";
import { EventDiscoverySection } from "./EventDiscoverySection";
import { SmartRecommendationExplainer } from "./SmartRecommendationExplainer";
import { User, Building2, Shield, ArrowRight, Sparkles } from "lucide-react";

interface PublicLandingHomeProps {
  events: RunningEvent[];
}

export function PublicLandingHome({ events }: PublicLandingHomeProps) {
  const { switchRole } = useAuth();

  return (
    <div className="space-y-12">
      {/* 1. Public Marketing Hero */}
      <HeroSection />

      {/* 2. Interactive Quick Demo Role Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand border border-brand/20">
                <Sparkles className="w-3.5 h-3.5 text-accent-strava" />
                <span>Mode Simulasi Role</span>
              </div>
              <h3 className="text-base font-extrabold text-espresso mt-1">
                Ingin Menguji Tampilan Khusus Tiap Role?
              </h3>
              <p className="text-xs text-espresso-secondary">
                Pilih peran di bawah ini untuk melihat bagaimana halaman Home beradaptasi secara otomatis untuk Pelari, Penyelenggara (EO), dan Admin.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => switchRole("runner")}
                className="px-3.5 py-2 rounded-btn bg-brand-50 hover:bg-brand-100 text-brand text-xs font-bold border border-brand/20 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login sbg Pelari (Budi)</span>
              </button>

              <button
                onClick={() => switchRole("organizer")}
                className="px-3.5 py-2 rounded-btn bg-accent-strava/10 hover:bg-accent-strava/20 text-accent-strava text-xs font-bold border border-accent-strava/30 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Login sbg EO (Jakarta Run)</span>
              </button>

              <button
                onClick={() => switchRole("admin")}
                className="px-3.5 py-2 rounded-btn bg-accent-info/10 hover:bg-accent-info/20 text-accent-info text-xs font-bold border border-accent-info/30 transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Login sbg Super Admin</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Public Event Discovery Catalog */}
      <EventDiscoverySection initialEvents={events} />

      {/* 4. Smart Scoring Explainer */}
      <SmartRecommendationExplainer />
    </div>
  );
}
