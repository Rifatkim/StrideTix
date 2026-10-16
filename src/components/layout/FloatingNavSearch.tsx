"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";

export function FloatingNavSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMobileModalOpen && mobileInputRef.current) {
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [isMobileModalOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsMobileModalOpen(false);

    if (pathname === "/") {
      const eventSection = document.getElementById("jelajahi-event") || document.getElementById("events-section");
      if (eventSection) {
        eventSection.scrollIntoView({ behavior: "smooth" });
      }
      router.push(`/?q=${encodeURIComponent(query.trim())}#jelajahi-event`);
    } else {
      router.push(`/?q=${encodeURIComponent(query.trim())}#jelajahi-event`);
    }
  };

  return (
    <>
      {/* Desktop Search Field */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center relative w-36 lg:w-48 xl:w-60 h-8.5 sm:h-9 rounded-full bg-[#F7F3EE] hover:bg-[#EFEAE2] focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/30 border border-transparent focus-within:border-brand/50 transition-all px-2.5 sm:px-3"
      >
        <Search className="w-3.5 h-3.5 text-espresso-muted shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari event lari..."
          className="w-full bg-transparent text-xs text-espresso placeholder:text-espresso-muted outline-none px-2"
          aria-label="Cari event lari"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-espresso-muted hover:text-espresso p-0.5 rounded-full"
            aria-label="Hapus kata kunci"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </form>

      {/* Mobile Search Button */}
      <button
        type="button"
        onClick={() => setIsMobileModalOpen(true)}
        className="md:hidden w-8 h-8 rounded-full bg-[#F7F3EE] hover:bg-[#EFEAE2] text-espresso-secondary hover:text-espresso flex items-center justify-center transition-colors active:scale-95"
        aria-label="Buka pencarian event"
      >
        <Search className="w-4 h-4" />
      </button>

      {/* Mobile Search Modal Overlay */}
      {isMobileModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 pt-16 animate-in fade-in duration-200"
          onClick={() => setIsMobileModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl p-4 shadow-warm-modal border border-sand-border space-y-3 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-sand-border">
              <span className="text-xs font-bold text-espresso">Cari Event Lari</span>
              <button
                type="button"
                onClick={() => setIsMobileModalOpen(false)}
                className="w-7 h-7 rounded-full bg-sand-warm flex items-center justify-center text-espresso-muted hover:text-espresso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <div className="flex-1 relative flex items-center h-11 rounded-xl bg-[#F7F3EE] border border-sand-border px-3 focus-within:border-brand focus-within:bg-white transition-all">
                <Search className="w-4 h-4 text-espresso-muted shrink-0" />
                <input
                  ref={mobileInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Nama event, kota, atau jarak..."
                  className="w-full bg-transparent text-sm text-espresso placeholder:text-espresso-muted outline-none px-2"
                />
              </div>
              <button
                type="submit"
                className="h-11 px-4 rounded-xl bg-brand text-white font-bold text-xs flex items-center gap-1 shadow-warm shrink-0 active:scale-95"
              >
                <span>Cari</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
