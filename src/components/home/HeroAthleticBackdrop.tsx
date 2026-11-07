"use client";

import React from "react";

/**
 * HeroAthleticBackdrop
 * 
 * Energetic, cinematic athletic canvas inspired by high-speed sports motion:
 * - Deep espresso/crimson base gradient (#130704 to #220A06)
 * - Blazing radial amber/orange motion streak core
 * - Fine vertical track lanes / speed telemetry slats
 * - Athletic sprinting runner silhouette with horizontal SVG motion blur and ghost trails
 * - Edge vignettes for smooth integration with the fixed navbar and marquee ticker
 */
export function HeroAthleticBackdrop() {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#130704]"
      aria-hidden="true"
    >
      {/* 1. Base Gradient Foundation (Deep Espresso, Mahogany, & Burnt Terracotta) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#110603] via-[#1E0905] to-[#120503]"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% -10%, #2A0D07 0%, #150603 60%, #0E0402 100%)",
        }}
      />

      {/* 2. Primary Energetic Speed Flare (Radiant Amber to Race Orange Glow) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-[45%] -translate-y-1/2 w-[850px] sm:w-[1100px] lg:w-[1300px] h-[550px] sm:h-[650px] rounded-[100%] opacity-90 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 52% 48%, rgba(251, 191, 36, 0.5) 0%, rgba(234, 88, 12, 0.65) 30%, rgba(194, 65, 12, 0.45) 55%, rgba(124, 45, 18, 0.25) 75%, transparent 100%)",
        }}
      />

      {/* 3. Directional Horizontal Motion Streaks (High-Speed Marathon Rush) */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
        <div className="absolute top-[28%] -left-20 w-[120%] h-32 bg-gradient-to-r from-transparent via-orange-500/35 to-transparent blur-2xl transform -skew-x-12" />
        <div className="absolute top-[48%] -left-10 w-[110%] h-44 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent blur-3xl transform -skew-x-6" />
        <div className="absolute top-[64%] -left-20 w-[120%] h-24 bg-gradient-to-r from-transparent via-red-600/25 to-transparent blur-xl transform -skew-x-12" />
      </div>

      {/* 4. Fine Vertical Track Lines / Stadium Telemetry Slats */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.12) 0px, rgba(255, 255, 255, 0.12) 1px, transparent 1px, transparent 24px)",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 95%)",
        }}
      />

      {/* 5. Cinematic Sprinting Runner Silhouette with Horizontal Motion Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[42%] -translate-y-1/2 w-[600px] sm:w-[750px] lg:w-[900px] h-[550px] sm:h-[650px] opacity-75 pointer-events-none">
        <svg
          viewBox="0 0 600 500"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Extreme horizontal motion blur for athletic speed trails */}
            <filter id="speedTrailBlur" x="-80%" y="-40%" width="260%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="28 1.5" />
            </filter>
            {/* Medium speed streak filter */}
            <filter id="runnerMotionBlur" x="-50%" y="-30%" width="200%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="14 1.2" />
            </filter>
            {/* Soft inner glow */}
            <radialGradient id="runnerBackGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#FB923C" stopOpacity="0.5" />
              <stop offset="80%" stopColor="#EA580C" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#7C2D12" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Glowing Aura directly behind the runner's core center of gravity */}
          <ellipse
            cx="300"
            cy="240"
            rx="200"
            ry="160"
            fill="url(#runnerBackGlow)"
            className="opacity-70 blur-2xl"
          />

          {/* TRAIL 1: Extreme Leading Motion Trail (Golden Amber Burst) */}
          <g filter="url(#speedTrailBlur)" transform="translate(-50, 0)" opacity="0.45">
            {/* Athletic Sprinter in Forward Motion Path */}
            {/* Head */}
            <circle cx="340" cy="110" r="28" fill="#F59E0B" />
            {/* Torso & Leading Chest */}
            <path
              d="M310 135 C325 130 355 140 355 170 L345 235 C345 255 315 265 295 255 L285 200 Z"
              fill="#F59E0B"
            />
            {/* Forward Driving Knee / Front Leg */}
            <path
              d="M315 245 Q360 270 380 305 Q370 345 355 390 L340 385 Q355 340 350 310 Q335 285 305 265 Z"
              fill="#F59E0B"
            />
            {/* Back Push-off Leg Extended in Full Stride */}
            <path
              d="M290 255 Q245 285 210 320 Q175 355 140 400 L125 390 Q160 345 200 305 Q240 270 280 245 Z"
              fill="#F59E0B"
            />
            {/* Front Arm Driving Forward High */}
            <path
              d="M335 155 Q375 160 410 175 Q420 180 415 195 Q385 190 350 180 Z"
              fill="#F59E0B"
            />
            {/* Rear Arm Driving Back High */}
            <path
              d="M315 165 Q275 175 240 195 Q230 200 235 215 Q265 200 305 185 Z"
              fill="#F59E0B"
            />
          </g>

          {/* TRAIL 2: Medium Ghosting Motion Trail (Terracotta Orange) */}
          <g filter="url(#runnerMotionBlur)" transform="translate(-25, 0)" opacity="0.6">
            <circle cx="340" cy="110" r="28" fill="#EA580C" />
            <path
              d="M310 135 C325 130 355 140 355 170 L345 235 C345 255 315 265 295 255 L285 200 Z"
              fill="#EA580C"
            />
            <path
              d="M315 245 Q360 270 380 305 Q370 345 355 390 L340 385 Q355 340 350 310 Q335 285 305 265 Z"
              fill="#EA580C"
            />
            <path
              d="M290 255 Q245 285 210 320 Q175 355 140 400 L125 390 Q160 345 200 305 Q240 270 280 245 Z"
              fill="#EA580C"
            />
            <path
              d="M335 155 Q375 160 410 175 Q420 180 415 195 Q385 190 350 180 Z"
              fill="#EA580C"
            />
            <path
              d="M315 165 Q275 175 240 195 Q230 200 235 215 Q265 200 305 185 Z"
              fill="#EA580C"
            />
          </g>

          {/* MAIN RUNNER: Dark Athletic Silhouette with Soft Speed Blur Edge */}
          <g filter="url(#runnerMotionBlur)" opacity="0.92">
            <circle cx="340" cy="110" r="28" fill="#1C0804" />
            <path
              d="M310 135 C325 130 355 140 355 170 L345 235 C345 255 315 265 295 255 L285 200 Z"
              fill="#1C0804"
            />
            <path
              d="M315 245 Q360 270 380 305 Q370 345 355 390 L340 385 Q355 340 350 310 Q335 285 305 265 Z"
              fill="#1C0804"
            />
            <path
              d="M290 255 Q245 285 210 320 Q175 355 140 400 L125 390 Q160 345 200 305 Q240 270 280 245 Z"
              fill="#1C0804"
            />
            <path
              d="M335 155 Q375 160 410 175 Q420 180 415 195 Q385 190 350 180 Z"
              fill="#1C0804"
            />
            <path
              d="M315 165 Q275 175 240 195 Q230 200 235 215 Q265 200 305 185 Z"
              fill="#1C0804"
            />
          </g>
        </svg>
      </div>

      {/* 6. Soft Top & Bottom Transition Vignettes */}
      <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-[#110603] to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#110603] via-[#110603]/70 to-transparent pointer-events-none" />
    </div>
  );
}
