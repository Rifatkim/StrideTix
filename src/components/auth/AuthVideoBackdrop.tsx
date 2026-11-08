"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * AuthVideoBackdrop
 * 
 * Background video murni untuk halaman Login & Register:
 * - Menggunakan native HTML5 <video> (MP4 lokal) sehingga 100% bebas dari kontrol player YouTube (tidak ada icon pause, skip, watermark, atau delay).
 * - Menampilkan 2 footage pilihan:
 *   1. Marathon Slow Motion (Qp15FIkXKJQ)
 *   2. Run Marathon Race Legs & Pace (gdQpR5gYUfI)
 * - Transisi crossfade lembut (fade-in / fade-out) otomatis bergantian.
 * - Dilapisi filter blok gelap ber-opacity dan radial warmth sesuai referensi desain.
 * - Tanpa tombol selector, tanpa link, tanpa tombol ubah (bersih & fokus).
 */
export function AuthVideoBackdrop() {
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Memastikan kedua video langsung terputar di background tanpa menunggu
    const playSafe = async (videoEl: HTMLVideoElement | null) => {
      if (!videoEl) return;
      try {
        await videoEl.play();
      } catch {
        // Browser autoplay policy graceful fallback
      }
    };

    playSafe(video1Ref.current);
    playSafe(video2Ref.current);

    // Transisi cross-fade lembut bergantian antara kedua video setiap 10 detik
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev === 1 ? 2 : 1));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none bg-[#120B07] pointer-events-none">
      {/* Footage 1: Marathon Slow Motion (Qp15FIkXKJQ) */}
      <video
        ref={video1Ref}
        src="/videos/auth-marathon-1.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Footage 2: Run Marathon Race Pace (gdQpR5gYUfI) */}
      <video
        ref={video2Ref}
        src="/videos/auth-marathon-2.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          activeVideo === 2 ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Dark Color Block Filter with Opacity (Reflecting SS 3 / Oscar Tambunan Reference) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(18, 11, 7, 0.72) 0%, rgba(18, 11, 7, 0.65) 45%, rgba(18, 11, 7, 0.88) 100%)",
        }}
      />

      {/* Subtle Radial Warmth Tint in the Center */}
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.35) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
