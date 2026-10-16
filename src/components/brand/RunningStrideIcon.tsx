import React from "react";

interface RunningStrideIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  primaryColor?: string;
  secondaryColor?: string;
  className?: string;
  title?: string;
}

/**
 * Custom StrideTix Running Stride Vector Icon
 * - High forward-momentum athletic silhouette sprinting toward finish line
 * - Geometric modern stroke styling matching StrideTix brand guidelines
 * - Responsive, lightweight, accessibility-friendly
 */
export function RunningStrideIcon({
  size = 32,
  primaryColor = "#C2410C", // StrideTix Race Orange
  secondaryColor = "#9A3412", // Burnt Orange
  className = "",
  title = "Ikon Pelari StrideTix",
  ...props
}: RunningStrideIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={className}
      role="img"
      aria-label={title}
      {...props}
    >
      <title>{title}</title>

      {/* Dynamic forward speed trail */}
      <path
        d="M3 17.5H10.5M4.5 21.5H9.5M2 13.5H7.5"
        stroke={secondaryColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        opacity="0.65"
      />

      {/* Runner Head with forward aerodynamic lean */}
      <circle cx="22" cy="5.5" r="3" fill={primaryColor} />

      {/* Athletic Torso & Core */}
      <path
        d="M15.5 12.5C16.8 9.8 19 8.2 21.5 8L20 14L15.5 16.5L13.5 20.5"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Front Arm Driving Forward */}
      <path
        d="M18.5 11.5L23.5 12.5L26 9.5"
        stroke={secondaryColor}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Rear Arm Driving Backward */}
      <path
        d="M16 13L11.5 14.5L9 12"
        stroke={secondaryColor}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lead Leg: High Knee Drive Toward Finish Line */}
      <path
        d="M15.5 16.5L20.5 18L24.5 16L27 19.5"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Trailing Leg: Full Power Push-Off Extension */}
      <path
        d="M13.5 20.5L9.5 24L5.5 27.5"
        stroke={primaryColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
