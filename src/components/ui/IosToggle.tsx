"use client";

import React from "react";

interface IosToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  ariaLabel?: string;
}

/**
 * iOS-Style Minimalist Switch Component
 * - Classic Apple HIG switch proportions: 48px x 28px pill, 24px circular knob
 * - Custom Brand Orange (#EA580C / #C2410C) when ON instead of Apple Green
 * - Neutral soft stone-300 (#E5E5EA) when OFF
 */
export function IosToggle({
  checked,
  onChange,
  disabled = false,
  id,
  ariaLabel,
}: IosToggleProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${checked ? "bg-[#EA580C]" : "bg-stone-300"}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.22)] ring-0 transition-transform duration-200 ease-in-out ${
          checked ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}
