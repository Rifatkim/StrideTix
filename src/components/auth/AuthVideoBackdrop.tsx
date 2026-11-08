"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Video, Film, Sparkles } from "lucide-react";

export interface RunningFootage {
  id: string;
  label: string;
  title: string;
  youtubeId: string;
  posterImage: string;
}

export const RUNNING_FOOTAGES: RunningFootage[] = [
  {
    id: "marathon-start",
    label: "Footage 1",
    title: "Marathon Race Start",
    youtubeId: "8bDbYxL6C0c",
    posterImage: "/images/hero-landingpage.jpg",
  },
  {
    id: "athletic-sprint",
    label: "Footage 2",
    title: "Track Sprint & Speed",
    youtubeId: "2OEl4Pkh84I",
    posterImage: "/images/events/city-marathon.jpg",
  },
  {
    id: "trail-sunrise",
    label: "Footage 3",
    title: "Scenic Trail Running",
    youtubeId: "LXb3EKWsInQ",
    posterImage: "/images/events/night-run.jpg",
  },
];

interface AuthVideoBackdropProps {
  initialFootageIndex?: number;
}

export function AuthVideoBackdrop({ initialFootageIndex = 0 }: AuthVideoBackdropProps) {
  const [activeFootageIdx, setActiveFootageIdx] = useState(initialFootageIndex);
  const currentFootage = RUNNING_FOOTAGES[activeFootageIdx] || RUNNING_FOOTAGES[0];

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
          key={currentFootage.youtubeId}
          src={`https://www.youtube-nocookie.com/embed/${currentFootage.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${currentFootage.youtubeId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1&enablejsapi=1`}
          title={`Running Footage: ${currentFootage.title}`}
          className="w-[160%] h-[160%] -translate-x-[18%] -translate-y-[18%] object-cover pointer-events-none scale-125"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

      {/* 5. Minimal Footage Selector (Bottom Left Corner) */}
      <div className="absolute bottom-5 left-8 xl:left-12 z-30 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] text-stone-300">
          <Film className="w-3 h-3 text-orange-400" />
          <span className="font-semibold text-[10px] uppercase tracking-wider text-stone-400">Footage:</span>
          <div className="flex items-center gap-1">
            {RUNNING_FOOTAGES.map((footage, idx) => (
              <button
                key={footage.id}
                type="button"
                onClick={() => setActiveFootageIdx(idx)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                  activeFootageIdx === idx
                    ? "bg-brand text-white shadow-xs"
                    : "text-stone-300 hover:text-white hover:bg-white/15"
                }`}
                title={footage.title}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
