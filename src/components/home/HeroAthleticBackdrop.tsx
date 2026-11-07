"use client";

import React from "react";
import Image from "next/image";

/**
 * HeroAthleticBackdrop
 * 
 * Cinematic, high-speed sports photography canvas:
 * - Real photographic athlete in forward sprint with blazing golden-orange light trails
 * - Left-side dark directional vignette for maximum typography contrast
 * - Top & bottom ambient blends for seamless integration with the navbar and marquee ticker
 * - Zero noisy SVG filters or dithering artifacts
 */
export function HeroAthleticBackdrop() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden select-none bg-[#0D0402]"
      aria-hidden="true"
    >
      {/* 1. Real Photographic Runner with Camera Shutter Speed Trails */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-runner-motion.jpg"
          alt="Cinematic Athletic Marathon Runner in Motion"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[70%_center] sm:object-[65%_center] lg:object-[60%_center] brightness-95 contrast-[1.05]"
        />
      </div>

      {/* 2. Editorial Typography Scrim (Left-to-Right Dark Gradient) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(13,4,2,0.95) 0%, rgba(13,4,2,0.85) 35%, rgba(13,4,2,0.4) 65%, rgba(13,4,2,0.15) 100%)",
        }}
      />

      {/* 3. Top Scrim for Navbar Legibility */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* 4. Bottom Blend into the Marquee Ticker */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#110603] via-[#110603]/70 to-transparent pointer-events-none" />

      {/* 5. Subtle Warm Athletic Ambient Glow behind the Race BIB on the right */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-80 h-80 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
    </div>
  );
}
