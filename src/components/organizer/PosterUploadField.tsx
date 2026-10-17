"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { UploadCloud, Trash2 } from "lucide-react";

export const INTERNAL_BANNER_PRESETS = [
  { label: "City Marathon", url: "/images/events/city-marathon.jpg" },
  { label: "Trail Nature", url: "/images/events/trail-run.jpg" },
  { label: "City Night Run", url: "/images/events/night-run.jpg" },
  { label: "Hero Runner", url: "/images/events/hero-runner.jpg" },
];

interface PosterUploadFieldProps {
  selectedFile: File | null;
  posterPreview: string | null;
  bannerImage: string;
  onFileSelect: (file: File) => void;
  onDeletePoster: () => void;
  onSelectPreset: (url: string) => void;
}

export function PosterUploadField({
  selectedFile,
  posterPreview,
  bannerImage,
  onFileSelect,
  onDeletePoster,
  onSelectPreset,
}: PosterUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Harap pilih file gambar (JPG, PNG, atau WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB.");
      return;
    }

    onFileSelect(file);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-bold text-espresso mb-1">
          Poster Resmi Lomba (Upload Foto)
        </label>
        <p className="text-[10px] text-espresso-muted">
          Unggah file foto poster lomba dari perangkat Anda. Foto baru hanya akan disimpan ke server saat Anda menekan tombol Simpan/Publikasikan.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {selectedFile && posterPreview ? (
        /* Preview Card with Delete Action */
        <div className="p-3.5 rounded-card bg-sand-warm/60 border border-brand/30 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-12 rounded overflow-hidden bg-sand-border shrink-0 border border-sand-border">
              <Image
                src={posterPreview}
                alt="Preview Upload"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-espresso block truncate max-w-xs sm:max-w-md">
                {selectedFile.name}
              </span>
              <span className="text-[10px] text-espresso-muted block">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Siap disimpan ke server
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onDeletePoster}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-100 transition-colors active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Foto</span>
          </button>
        </div>
      ) : (
        /* Upload Drag & Drop Trigger */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-sand-border hover:border-brand rounded-card p-6 text-center cursor-pointer transition-colors bg-sand-warm/30 hover:bg-brand-50/20 group space-y-2"
        >
          <div className="w-10 h-10 rounded-full bg-brand-50 text-brand flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-espresso block group-hover:text-brand transition-colors">
              Klik di sini untuk upload foto poster lomba
            </span>
            <span className="text-[10px] text-espresso-muted block mt-0.5">
              Format didukung: JPG, PNG, WEBP (Maksimal 5MB)
            </span>
          </div>
        </div>
      )}

      {/* Template Poster Bawaan (Opsional) */}
      <div className="pt-1">
        <span className="text-[10px] font-bold text-espresso-secondary block mb-1.5">
          Atau pilih dari template poster bawaan (internal):
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {INTERNAL_BANNER_PRESETS.map((p) => {
            const isSelected = !selectedFile && bannerImage === p.url;
            return (
              <button
                type="button"
                key={p.label}
                onClick={() => onSelectPreset(p.url)}
                className={`relative rounded-btn overflow-hidden border text-left transition-all ${
                  isSelected
                    ? "border-brand ring-2 ring-brand/30 shadow-xs"
                    : "border-sand-border opacity-70 hover:opacity-100"
                }`}
              >
                <div className="relative aspect-[16/10] w-full bg-sand-warm">
                  <Image
                    src={p.url}
                    alt={p.label}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
                  {isSelected && (
                    <div className="absolute top-1 right-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-brand text-white flex items-center justify-center text-[9px]">
                        ✓
                      </span>
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-bold text-white truncate block">
                    {p.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
