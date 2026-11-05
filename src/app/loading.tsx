import React from "react";
import { StrideTixSymbol } from "@/components/brand/StrideTixLogo";

/**
 * Global Instant Route Loading Boundary (Next.js App Router)
 * Provides immediate visual feedback (0ms transition) during page/menu navigation,
 * preventing UI freeze while streaming server component payloads.
 */
export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-main/80 backdrop-blur-xs transition-opacity duration-150"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Top subtle indeterminate progress bar */}
      <div className="fixed top-0 inset-x-0 h-1 bg-brand/15 overflow-hidden">
        <div className="h-full bg-brand animate-pulse w-2/5 rounded-full" />
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white border border-sand-border shadow-warm flex items-center justify-center animate-pulse">
          <StrideTixSymbol size={24} color="#F97316" />
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-espresso-muted tracking-tight">
          <span>Memuat halaman</span>
          <span className="inline-flex gap-0.5 text-brand font-black">
            <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
