"use client";

import { useState, useEffect } from "react";

interface UseScrollThresholdOptions {
  threshold?: number;
  hysteresis?: number;
}

/**
 * Custom hook to detect when window scroll surpasses a given threshold with hysteresis.
 * Uses requestAnimationFrame and passive scroll listeners for maximum 60fps performance.
 *
 * @param options.threshold Scroll distance in px to trigger active state (default: 120)
 * @param options.hysteresis Distance in px below threshold required to deactivate (default: 40)
 * @returns boolean `isScrolled`
 */
export function useScrollThreshold({
  threshold = 120,
  hysteresis = 40,
}: UseScrollThresholdOptions = {}): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let ticking = false;
    const lowerBound = Math.max(0, threshold - hysteresis);

    const updateScrollState = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (!isScrolled && scrollY > threshold) {
        setIsScrolled(true);
      } else if (isScrolled && scrollY < lowerBound) {
        setIsScrolled(false);
      }
      ticking = false;
    };

    // Initial check on mount
    updateScrollState();

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [isScrolled, threshold, hysteresis]);

  return isScrolled;
}
