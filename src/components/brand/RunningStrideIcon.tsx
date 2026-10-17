import React, { useId } from "react";

export interface RunningStrideIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: "badge" | "glyph";
  className?: string;
  title?: string;
}

/**
 * Custom StrideTix Running Stride Vector Icon & Athletic Crest
 * - Crafted using athletic geometry principles (forward lean, high knee drive, aerodynamic speed chevrons)
 * - Supports "badge" (default: premium athletic crest squircle with glass rim highlight)
 *   and "glyph" (freestanding gradient sprinter)
 * - Uses React useId for unique SVG gradient defs to avoid DOM ID collisions
 */
export function RunningStrideIcon({
  size = 34,
  variant = "badge",
  className = "",
  title = "Ikon Pelari StrideTix",
  ...props
}: RunningStrideIconProps) {
  const uid = useId().replace(/:/g, "_");
  const badgeGradId = `strideBadgeBg_${uid}`;
  const glossGradId = `strideGloss_${uid}`;
  const glyphGradId = `strideGlyphGrad_${uid}`;
  const trailGradId = `strideTrailGrad_${uid}`;

  if (variant === "glyph") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        className={className}
        role="img"
        aria-label={title}
        {...props}
      >
        <title>{title}</title>
        <defs>
          <linearGradient id={glyphGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="50%" stopColor="#EA580C" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <linearGradient id={trailGradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Speed Motion Trails */}
        <line x1="4" y1="21" x2="14" y2="21" stroke={`url(#${trailGradId})`} strokeWidth="2.4" strokeLinecap="round" />
        <line x1="7" y1="25.5" x2="19" y2="25.5" stroke={`url(#${trailGradId})`} strokeWidth="2.8" strokeLinecap="round" />
        <line x1="5" y1="30" x2="15" y2="30" stroke={`url(#${trailGradId})`} strokeWidth="2.4" strokeLinecap="round" />

        {/* Head */}
        <circle cx="33" cy="11.5" r="4.2" fill={`url(#${glyphGradId})`} />

        {/* Torso & Core Lean */}
        <line x1="23.5" y1="26.5" x2="30" y2="17.5" stroke={`url(#${glyphGradId})`} strokeWidth="4.2" strokeLinecap="round" />

        {/* Front Arm Drive */}
        <polyline points="29,18.5 37,21.5 38.5,16" stroke={`url(#${glyphGradId})`} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Rear Arm Drive */}
        <polyline points="26,19.5 19,20.5 15.5,15.5" stroke={`url(#${glyphGradId})`} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Front High Knee Drive */}
        <polyline points="23.5,26.5 31.5,30.5 28.5,41" stroke={`url(#${glyphGradId})`} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Rear Full Extension Push-Off */}
        <polyline points="23.5,26.5 14.5,33.5 7,39" stroke={`url(#${glyphGradId})`} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Default: variant === "badge" (Athletic Crest Squircle with Glass Rim & White Sprinter)
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      className={className}
      role="img"
      aria-label={title}
      {...props}
    >
      <title>{title}</title>
      <defs>
        <linearGradient id={badgeGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A1A" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>
        <linearGradient id={glossGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Squircle Base with Athletic Gradient */}
      <rect x="2" y="2" width="44" height="44" rx="12" fill={`url(#${badgeGradId})`} />

      {/* Top Glass Highlight Rim */}
      <path d="M4 14 C4 8.5 8.5 4 14 4 H34 C39.5 4 44 8.5 44 14 V17 C35 15 15 17 4 23 Z" fill={`url(#${glossGradId})`} />

      {/* Subtle Inner Border */}
      <rect x="3" y="3" width="42" height="42" rx="11" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.2" />

      {/* Speed Chevrons Behind Runner (Smart Distance / Velocity Indicator) */}
      <path d="M8 20.5 L12 24 L8 27.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.35" />
      <path d="M12.5 19.5 L17.5 24 L12.5 28.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.65" />

      {/* Dynamic Athletic Runner (Olympic Power Stride) in Pure White */}
      <g fill="#FFFFFF" stroke="#FFFFFF">
        {/* Aerodynamic Head */}
        <circle cx="31.5" cy="13.5" r="3.6" stroke="none" />

        {/* Torso (Muscular Core Lean) */}
        <path d="M25 25.5 L30.5 17.5 C31.5 18 33 19 32.5 20.5 L29 26.5 Z" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Front Arm (Driving Forward) */}
        <path d="M29.5 18.5 L36.5 21.5 L37 17.5" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

        {/* Rear Arm (Pumping Back) */}
        <path d="M27.5 19.5 L20.5 20.5 L17.5 16" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />

        {/* High Knee Drive (Lead Leg) */}
        <path d="M27.5 26.5 L34 29.5 L31.5 38.5" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Power Push-Off (Trailing Leg) */}
        <path d="M26.5 26.5 L18 32.5 L11.5 37" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
