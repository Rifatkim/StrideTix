"use client";

import React from "react";
import Image from "next/image";

/**
 * HeroAthleticBackdrop
 * 
 * Uses the authentic, high-energy marathon event photo that the user prefers:
 * - Real urban marathon event photo (/images/hero-landingpage.jpg)
 * - Deep espresso directional overlay: 95% opacity on left for crystal-clear text readability,
 *   subtle transparency on right so the vibrant marathon race crowd and arch remain vivid
 * - Smooth top & bottom vignette transitions
 */
export function HeroAthleticBackdrop() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden select-none bg-[#120B07]"
      aria-hidden="true"
    >
      {/* 1. Authentic Marathon Event Photo */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-landingpage.jpg"
          alt="Peserta event lari memenuhi lintasan jalan di kawasan perkotaan."
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_30%] filter brightness-95 contrast-[1.05] saturate-[1.12]"
        />
      </div>

      {/* 2. Soft Base Dark Tint preserving photo vibrancy */}
      <div className="absolute inset-0 bg-[#120B07]/40 pointer-events-none" />

      {/* 3. Directional Gradient: Darker on Left for Typography, Lighter on Right for Marathon Photo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(18,11,7,0.96) 0%, rgba(18,11,7,0.88) 38%, rgba(18,11,7,0.55) 65%, rgba(18,11,7,0.2) 100%)",
        }}
      />

      {/* 4. Top Header Shadow */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#120B07]/70 to-transparent pointer-events-none" />

      {/* 5. Bottom Blend into the Marquee Ticker */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#120B07] to-transparent pointer-events-none" />
    </div>
  );
}
