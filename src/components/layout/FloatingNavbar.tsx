"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { FloatingNavGuest } from "./FloatingNavGuest";
import { FloatingNavRunner } from "./FloatingNavRunner";
import { FloatingNavOrganizer } from "./FloatingNavOrganizer";
import { FloatingNavAdmin } from "./FloatingNavAdmin";

import { LandingNavSectionId } from "@/hooks/useLandingScrollSpy";

interface FloatingNavbarProps {
  isScrolled: boolean;
  activeSection?: LandingNavSectionId | null;
  scrollToSection?: (sectionId: LandingNavSectionId) => void;
}

export function FloatingNavbar({
  isScrolled,
  activeSection,
  scrollToSection,
}: FloatingNavbarProps) {
  const { currentUser, role } = useAuth();

  return (
    <aside
      aria-label="Floating Navigation Bar"
      className={`fixed top-2.5 sm:top-4 md:top-5 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-20px)] sm:w-[calc(100%-32px)] max-w-4xl lg:max-w-5xl h-14 sm:h-16 px-3 sm:px-4 md:px-5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8DDD0] shadow-[0_12px_36px_rgba(36,28,23,0.14),0_2px_8px_rgba(36,28,23,0.06)] flex items-center justify-between transition-all duration-300 motion-reduce:transition-none ${
        isScrolled
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto ease-out"
          : "opacity-0 -translate-y-4 scale-95 pointer-events-none ease-in"
      }`}
    >
      {!currentUser && (
        <FloatingNavGuest
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />
      )}
      {currentUser && role === "runner" && <FloatingNavRunner />}
      {currentUser && role === "organizer" && <FloatingNavOrganizer />}
      {currentUser && role === "admin" && <FloatingNavAdmin />}
    </aside>
  );
}
