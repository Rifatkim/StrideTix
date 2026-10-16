"use client";

import React from "react";

export interface StrideTixLogoProps {
  variant?: "symbol" | "lockup" | "icon-box";
  theme?: "default" | "dark" | "white";
  size?: number; // size in px
  className?: string;
  showSubtitle?: boolean;
  subtitle?: string;
}

/**
 * Pure SVG Symbol of StrideTix
 * Features: Ticket stub with perforated side notches and carved negative-space 'S' running track.
 */
export function StrideTixSymbol({
  className = "",
  size = 36,
  color = "#C2410C",
}: {
  className?: string;
  size?: number;
  color?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="StrideTix Symbol"
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M 64 28 L 192 28 A 36 36 0 0 1 228 64 L 228 108 A 20 20 0 0 0 228 148 L 228 192 A 36 36 0 0 1 192 228 L 64 228 A 36 36 0 0 1 28 192 L 28 148 A 20 20 0 0 0 28 108 L 28 64 A 36 36 0 0 1 64 28 Z M 180 64 L 126 64 C 98 64 76 86 76 114 C 76 130 86 142 100 148 L 148 164 C 158 167 164 174 164 184 C 164 195 155 204 142 204 L 76 204 L 76 180 L 140 180 C 146 180 150 176 150 171 C 150 166 145 162 138 160 L 90 144 C 70 137 56 122 56 102 C 56 76 78 54 110 54 L 180 54 Z"
      />
    </svg>
  );
}

/**
 * Full Brand Logo Component with Lockup & Styling variants
 */
export function StrideTixLogo({
  variant = "lockup",
  theme = "default",
  size = 36,
  className = "",
  showSubtitle = true,
  subtitle = "Smart Race Ticketing",
}: StrideTixLogoProps) {
  // Color decisions per theme
  const symbolColor =
    theme === "white" ? "#FFFFFF" : theme === "dark" ? "#241C17" : "#C2410C";

  const strideColor = theme === "white" ? "text-white" : "text-espresso";
  const tixColor = theme === "white" ? "text-white/90" : "text-brand";
  const subColor = theme === "white" ? "text-white/70" : "text-espresso-muted";

  if (variant === "symbol") {
    return <StrideTixSymbol size={size} color={symbolColor} className={className} />;
  }

  if (variant === "icon-box") {
    return (
      <div
        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-btn bg-brand flex items-center justify-center text-white shadow-warm ${className}`}
      >
        <StrideTixSymbol size={size || 24} color="#FFFFFF" />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Badge */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-btn bg-brand flex items-center justify-center text-white shadow-warm shrink-0 transition-transform active:scale-95">
        <StrideTixSymbol size={24} color="#FFFFFF" />
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="text-xl sm:text-2xl font-black tracking-tight">
          <span className={strideColor}>Stride</span>
          <span className={tixColor}>Tix</span>
        </span>
        {showSubtitle && (
          <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mt-0.5 ${subColor}`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
