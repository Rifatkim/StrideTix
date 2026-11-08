"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Film, ExternalLink, Link2, Check } from "lucide-react";

export interface RunningFootage {
  id: string;
  label: string;
  title: string;
  youtubeId: string;
  url: string;
  posterImage: string;
}

export const RUNNING_FOOTAGES: RunningFootage[] = [
  {
    id: "marathon-runners",
    label: "Footage 1",
    title: "Run Marathon Race (Kaki & Pelari Marathon)",
    youtubeId: "gdQpR5gYUfI",
    url: "https://www.youtube.com/watch?v=gdQpR5gYUfI",
    posterImage: "/images/hero-landingpage.jpg",
  },
  {
    id: "people-jogging",
    label: "Footage 2",
    title: "People Jogging & Workout (Cinematic Runner Pace)",
    youtubeId: "G1QPcqeHnNY",
    url: "https://www.youtube.com/watch?v=G1QPcqeHnNY",
    posterImage: "/images/events/city-marathon.jpg",
  },
  {
    id: "jogging-outdoor",
    label: "Footage 3",
    title: "Jogging & Road Running (Outdoor Pace)",
    youtubeId: "65fIV7EwBTc",
    url: "https://www.youtube.com/watch?v=65fIV7EwBTc",
    posterImage: "/images/events/night-run.jpg",
  },
];

/**
 * Helper to extract YouTube 11-char ID from various URL formats
 */
function extractYoutubeId(input: string): string | null {
  const clean = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
}

interface AuthVideoBackdropProps {
  initialFootageIndex?: number;
}

export function AuthVideoBackdrop({ initialFootageIndex = 0 }: AuthVideoBackdropProps) {
  const [activeFootageIdx, setActiveFootageIdx] = useState(initialFootageIndex);
  const [customYoutubeId, setCustomYoutubeId] = useState<string | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customError, setCustomError] = useState("");

  const currentFootage = RUNNING_FOOTAGES[activeFootageIdx] || RUNNING_FOOTAGES[0];
  const activeYoutubeId = customYoutubeId || currentFootage.youtubeId;

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedId = extractYoutubeId(customInput);
    if (!parsedId) {
      setCustomError("Link YouTube tidak valid. Masukkan URL atau ID 11 karakter.");
      return;
    }
    setCustomYoutubeId(parsedId);
    setCustomError("");
    setShowCustomModal(false);
  };

  const handleSelectPreset = (idx: number) => {
    setCustomYoutubeId(null);
    setActiveFootageIdx(idx);
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none bg-[#120B07]">
      {/* 1. Underlying Poster Image (Instant Fallback / Offline / Preload) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentFootage.posterImage}
          alt={currentFootage.title}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-center brightness-90 contrast-[1.05]"
        />
      </div>

      {/* 2. Embedded Video Iframe (People Running Footage) */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <iframe
          key={activeYoutubeId}
          src={`https://www.youtube.com/embed/${activeYoutubeId}?autoplay=1&mute=1&loop=1&playlist=${activeYoutubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1`}
          title={`Running Footage: ${currentFootage.title}`}
          className="w-[160%] h-[160%] -translate-x-[18%] -translate-y-[18%] object-cover pointer-events-none scale-125 border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          loading="eager"
        />
      </div>

      {/* 3. Dark Color Block Filter with Opacity (Reflecting SS 3 / Oscar Tambunan Reference) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(18, 11, 7, 0.72) 0%, rgba(18, 11, 7, 0.65) 45%, rgba(18, 11, 7, 0.88) 100%)",
        }}
      />

      {/* 4. Subtle Radial Warmth Tint in the Center */}
      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.35) 0%, transparent 70%)",
        }}
      />

      {/* 5. Interactive Footage Controller (Bottom Left Corner) */}
      <div className="absolute bottom-5 left-8 xl:left-12 z-30 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[11px] text-stone-300 shadow-md">
          <Film className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span className="font-semibold text-[10px] uppercase tracking-wider text-stone-400">Footage:</span>
          
          <div className="flex items-center gap-1">
            {RUNNING_FOOTAGES.map((footage, idx) => {
              const isSelected = !customYoutubeId && activeFootageIdx === idx;
              return (
                <button
                  key={footage.id}
                  type="button"
                  onClick={() => handleSelectPreset(idx)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand text-white shadow-xs"
                      : "text-stone-300 hover:text-white hover:bg-white/15"
                  }`}
                  title={`${footage.label}: ${footage.title}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <span className="w-px h-3 bg-white/20 mx-0.5" />

          {/* Direct link to current video */}
          <a
            href={customYoutubeId ? `https://www.youtube.com/watch?v=${customYoutubeId}` : currentFootage.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-stone-300 hover:text-white hover:underline transition-colors ml-0.5"
            title="Buka Video di YouTube"
          >
            <span>Link</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>

          <span className="w-px h-3 bg-white/20 mx-0.5" />

          {/* Custom Link Toggle */}
          <button
            type="button"
            onClick={() => setShowCustomModal((prev) => !prev)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
              customYoutubeId ? "text-orange-400 font-bold" : "text-stone-400 hover:text-stone-200"
            }`}
            title="Ganti dengan link video YouTube pilihan Anda"
          >
            <Link2 className="w-3 h-3" />
            <span>{customYoutubeId ? "Kustom" : "Ubah"}</span>
          </button>
        </div>

        {/* Custom URL Input Popover */}
        {showCustomModal && (
          <div className="w-full sm:w-80 p-3 rounded-xl bg-stone-900/95 backdrop-blur-xl border border-white/20 text-white shadow-2xl space-y-2 mt-1">
            <div className="flex items-center justify-between text-xs font-bold text-stone-200">
              <span>Masukkan Link YouTube Baru:</span>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleApplyCustomUrl} className="space-y-2">
              <input
                type="text"
                placeholder="Contoh: https://youtube.com/watch?v=..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-orange-500"
              />
              {customError && (
                <p className="text-[10px] text-red-400 leading-tight">{customError}</p>
              )}
              <div className="flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCustomYoutubeId(null);
                    setShowCustomModal(false);
                  }}
                  className="px-2 py-1 rounded text-[11px] text-stone-400 hover:text-white"
                >
                  Reset Default
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-brand hover:bg-brand-800 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                  <span>Terapkan</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

