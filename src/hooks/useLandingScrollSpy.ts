"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

export type LandingNavSectionId = "jelajahi-event" | "kalender-lomba" | "smart-distance-ai";

interface UseLandingScrollSpyReturn {
  activeSection: LandingNavSectionId | null;
  scrollToSection: (sectionId: LandingNavSectionId) => void;
}

const SECTION_IDS: LandingNavSectionId[] = [
  "kalender-lomba",
  "jelajahi-event",
  "smart-distance-ai",
];

export function useLandingScrollSpy(): UseLandingScrollSpyReturn {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const [activeSection, setActiveSection] = useState<LandingNavSectionId | null>(null);

  const calculateActiveSection = useCallback(() => {
    if (typeof window === "undefined" || !isLandingPage) {
      setActiveSection(null);
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // 1. Hero Zone (Top of page): No nav item should be forcefully active
    if (scrollY < 260) {
      setActiveSection(null);
      return;
    }

    // 2. Footer Zone (Bottom of page): Clear active state
    if (windowHeight + scrollY >= docHeight - 160) {
      setActiveSection(null);
      return;
    }

    // 3. Focal detection line in viewport (35% from the top, accounts for navbar height)
    const focalPoint = windowHeight * 0.36;

    // Evaluate candidate sections
    let currentActive: LandingNavSectionId | null = null;

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;

      const rect = el.getBoundingClientRect();

      // Check if focal point lies inside this section
      if (rect.top <= focalPoint && rect.bottom > focalPoint) {
        currentActive = id;
        break;
      }
    }

    // If between sections (e.g. passing short Role Simulation banner), retain nearest active section
    if (currentActive !== null) {
      setActiveSection(currentActive);
    }
  }, [isLandingPage]);

  useEffect(() => {
    if (!isLandingPage) {
      setActiveSection(null);
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Calculate once on mount or route transition
    calculateActiveSection();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isLandingPage, calculateActiveSection]);

  const scrollToSection = useCallback(
    (sectionId: LandingNavSectionId) => {
      if (typeof window === "undefined") return;

      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        // Set immediately for instant visual feedback
        setActiveSection(sectionId);

        targetEl.scrollIntoView({ behavior: "smooth" });

        // Update URL hash without causing page reload
        if (window.history.pushState) {
          window.history.pushState(null, "", `#${sectionId}`);
        }
      }
    },
    []
  );

  return { activeSection, scrollToSection };
}
