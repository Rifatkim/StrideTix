"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Compass, Calendar, Activity } from "lucide-react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";
import { FloatingNavSearch } from "./FloatingNavSearch";
import { FloatingNavMoreMenu } from "./FloatingNavMoreMenu";
import { UserNavDropdown } from "./UserNavDropdown";
import { LandingNavSectionId } from "@/hooks/useLandingScrollSpy";

interface FloatingNavGuestProps {
  activeSection?: LandingNavSectionId | null;
  scrollToSection?: (sectionId: LandingNavSectionId) => void;
}

export function FloatingNavGuest({
  activeSection,
  scrollToSection,
}: FloatingNavGuestProps) {
  return (
    <div className="w-full flex items-center justify-between gap-2 sm:gap-3">
      {/* 1. Logo Left */}
      <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="StrideTix Homepage">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand flex items-center justify-center text-white shadow-warm group-hover:bg-brand-800 transition-all active:scale-95">
          <StrideTixSymbol size={18} color="#FFFFFF" />
        </div>
        <span className="hidden sm:inline text-base sm:text-lg font-black tracking-tight text-espresso leading-none">
          Stride<span className="text-brand">Tix</span>
        </span>
      </Link>

      {/* 2. Middle: Desktop Active Nav Items + Search */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
        {/* Navigation Pills (Desktop lg+) */}
        <div className="hidden lg:flex items-center gap-1">
          <Link
            href="/#jelajahi-event"
            onClick={(e) => {
              if (scrollToSection) {
                e.preventDefault();
                scrollToSection("jelajahi-event");
              }
            }}
            aria-current={activeSection === "jelajahi-event" ? "page" : undefined}
            className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
              activeSection === "jelajahi-event"
                ? "bg-[#FFF7ED] text-brand font-bold border border-brand/20 shadow-xs"
                : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${activeSection === "jelajahi-event" ? "text-brand" : "text-espresso-muted"}`} />
            <span>Jelajahi Event</span>
          </Link>

          <Link
            href="/#kalender-lomba"
            onClick={(e) => {
              if (scrollToSection) {
                e.preventDefault();
                scrollToSection("kalender-lomba");
              }
            }}
            aria-current={activeSection === "kalender-lomba" ? "page" : undefined}
            className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
              activeSection === "kalender-lomba"
                ? "bg-[#FFF7ED] text-brand font-bold border border-brand/20 shadow-xs"
                : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${activeSection === "kalender-lomba" ? "text-brand" : "text-espresso-muted"}`} />
            <span>Kalender Lomba</span>
          </Link>

          <Link
            href="/#smart-distance-ai"
            onClick={(e) => {
              if (scrollToSection) {
                e.preventDefault();
                scrollToSection("smart-distance-ai");
              }
            }}
            aria-current={activeSection === "smart-distance-ai" ? "page" : undefined}
            className={`px-3 py-1.5 rounded-full text-xs transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
              activeSection === "smart-distance-ai"
                ? "bg-purple-50 text-purple-700 font-bold border border-purple-200 shadow-xs"
                : "text-espresso-secondary hover:text-espresso hover:bg-[#F7F3EE] font-semibold"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeSection === "smart-distance-ai" ? "text-purple-600" : "text-accent-strava"}`} />
            <span>Tentang Smart AI</span>
          </Link>
        </div>

        {/* Search Input Field */}
        <FloatingNavSearch />

        {/* Standalone Smart AI Pill on mobile / tablet */}
        <Link
          href="/#smart-distance-ai"
          onClick={(e) => {
            if (scrollToSection) {
              e.preventDefault();
              scrollToSection("smart-distance-ai");
            }
          }}
          className={`lg:hidden inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${
            activeSection === "smart-distance-ai"
              ? "bg-purple-100 text-purple-700 border border-purple-300"
              : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
          }`}
          title="Smart Distance Recommendation"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span className="hidden sm:inline">Smart AI</span>
        </Link>
      </div>

      {/* 3. Right: Auth Masuk & More Menu */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <UserNavDropdown compact={true} />
        <FloatingNavMoreMenu
          role="guest"
          activeSection={activeSection}
          onSelectSection={scrollToSection}
        />
      </div>
    </div>
  );
}
