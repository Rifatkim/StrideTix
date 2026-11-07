"use client";

import React from "react";
import Image from "next/image";

/**
 * HeroAthleticBackdrop
 * 
 * Cinematic, high-speed athletic photography canvas:
 * - Photographic athlete in forward sprint with silky smooth glowing orange/amber light trails
 * - ABSOLUTELY ZERO sparks, particles, dots, or grain
 * - Warm crimson/red undertones inspired by the Pelmatech aesthetic
 * - Left-side dark directional vignette for maximum typography contrast
 * - Bottom ambient blend into the marquee ticker tape
 */
export function HeroAthleticBackdrop() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden select-none bg-[#0E0302]"
      aria-hidden="true"
    >
      {/* 1. Real Photographic Runner with Silky Fluid Light Trails (Zero Sparks/Particles) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/hero-runner-smooth.jpg"
          alt="Cinematic Athletic Marathon Runner in Motion"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[78%_center] sm:object-[70%_center] lg:object-[64%_center] brightness-[0.98] contrast-[1.04]"
        />
      </div>

      {/* 2. Editorial Typography Scrim (Left-to-Right Dark Gradient for Crisp Text Legibility) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(14,3,2,0.95) 0%, rgba(14,3,2,0.85) 32%, rgba(14,3,2,0.4) 62%, rgba(14,3,2,0.1) 100%)",
        }}
      />

      {/* 3. Warm Crimson/Red Ambient Glow Overlay (Reflecting Pelmatech Tone) */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 65% 45%, rgba(234,88,12,0.4) 0%, rgba(185,28,28,0.3) 45%, transparent 80%)",
        }}
      />

      {/* 4. Top Subtle Shadow */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

      {/* 5. Bottom Blend into the Marquee Ticker */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#120503] via-[#120503]/70 to-transparent pointer-events-none" />

      {/* 6. Subtle Warm Athletic Ambient Glow behind the Race BIB on the right */}
      <div className="absolute top-1/2 right-[8%] -translate-y-1/2 w-80 h-80 rounded-full bg-brand/20 blur-3xl pointer-events-none" />
    </div>
  );
}
