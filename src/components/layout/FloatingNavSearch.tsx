"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";

interface FloatingNavSearchProps {
  isDark?: boolean;
}

function FloatingNavSearchInner({ isDark = false }: FloatingNavSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams?.get("q") ?? "";

  const [query, setQuery] = useState(qFromUrl);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if URL search param changes
  useEffect(() => {
    if (qFromUrl !== undefined) {
      setQuery(qFromUrl);
    }
  }, [qFromUrl]);

  // Sync state if user types in main EventFilterBar
  useEffect(() => {
    const handleNavSync = (e: Event) => {
      const val = (e as CustomEvent<string>).detail ?? "";
      setQuery(val);
    };
    window.addEventListener("stridetix:nav-sync", handleNavSync);
    return () => window.removeEventListener("stridetix:nav-sync", handleNavSync);
  }, []);

  useEffect(() => {
    if (isMobileModalOpen && mobileInputRef.current) {
      setTimeout(() => mobileInputRef.current?.focus(), 100);
    }
  }, [isMobileModalOpen]);

  const executeSearch = (targetQuery: string) => {
    const trimmed = targetQuery.trim();

    // 1. Instant event dispatch for immediate in-page reactivity
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("stridetix:search", { detail: trimmed })
      );
    }

    // 2. Smooth scroll to event catalog
    const eventSection =
      document.getElementById("jelajahi-event") ||
      document.getElementById("events-section");
    if (eventSection) {
      eventSection.scrollIntoView({ behavior: "smooth" });
    }

    // 3. Update URL with query param
    if (trimmed) {
      router.push(`/?q=${encodeURIComponent(trimmed)}#jelajahi-event`, {
        scroll: false,
      });
    } else {
      router.push(`/#jelajahi-event`, { scroll: false });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMobileModalOpen(false);
    executeSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    executeSearch("");
  };

  return (
    <>
      {/* Desktop Search Field */}
      <form
        onSubmit={handleSearchSubmit}
        className={`hidden md:flex items-center relative w-36 lg:w-48 xl:w-60 h-8.5 sm:h-9 rounded-full transition-all px-2.5 sm:px-3 ${
          isDark
            ? "bg-white/10 hover:bg-white/15 focus-within:bg-black/70 border border-white/20 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30"
            : "bg-[#F7F3EE] hover:bg-[#EFEAE2] focus-within:bg-white focus-within:ring-2 focus-within:ring-brand/30 border border-transparent focus-within:border-brand/50"
        }`}
      >
        <Search
          className={`w-3.5 h-3.5 shrink-0 ${
            isDark ? "text-stone-300" : "text-espresso-muted"
          }`}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari event lari..."
          className={`w-full bg-transparent text-xs outline-none px-2 ${
            isDark
              ? "text-white placeholder:text-stone-400"
              : "text-espresso placeholder:text-espresso-muted"
          }`}
          aria-label="Cari event lari"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={`p-0.5 rounded-full ${
              isDark
                ? "text-stone-400 hover:text-white"
                : "text-espresso-muted hover:text-espresso"
            }`}
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
        className={`md:hidden w-8 h-8 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
          isDark
            ? "bg-white/15 text-white hover:bg-white/25"
            : "bg-[#F7F3EE] hover:bg-[#EFEAE2] text-espresso-secondary hover:text-espresso"
        }`}
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
                  placeholder="Nama event, kota, atau rute..."
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

export function FloatingNavSearch({ isDark = false }: FloatingNavSearchProps) {
  return (
    <Suspense
      fallback={
        <div className={`hidden md:flex w-36 lg:w-48 xl:w-60 h-8.5 sm:h-9 rounded-full animate-pulse ${isDark ? "bg-white/10" : "bg-[#F7F3EE]"}`} />
      }
    >
      <FloatingNavSearchInner isDark={isDark} />
    </Suspense>
  );
}
