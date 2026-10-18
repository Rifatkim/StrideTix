"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RunningEvent, TicketCategory, DistanceCategory, EventStatus } from "@/types";
import { updateEvent, uploadEventPoster } from "@/services/eventService";
import { PosterUploadField, INTERNAL_BANNER_PRESETS } from "./PosterUploadField";
import { TimePickerInput } from "./TimePickerInput";
import { formatRupiah } from "@/lib/utils";
import {
  X,
  Save,
  Loader2,
  Calendar,
  MapPin,
  Tag,
  Building2,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";

interface EditEventModalProps {
  event: RunningEvent;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedEvent: RunningEvent) => void;
}

export function EditEventModal({ event, isOpen, onClose, onSaved }: EditEventModalProps) {
  const [title, setTitle] = useState(event.title);
  const [eventDate, setEventDate] = useState(event.eventDate);
  const [startTime, setStartTime] = useState(event.startTime || "05:30 WIB");
  const [locationCity, setLocationCity] = useState(event.locationCity);
  const [locationVenue, setLocationVenue] = useState(event.locationVenue);
  const [description, setDescription] = useState(event.description || "");
  const [status, setStatus] = useState<EventStatus>(event.status);
  const [bannerImage, setBannerImage] = useState(
    event.bannerImage || "/images/events/city-marathon.jpg"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const [categories, setCategories] = useState<TicketCategory[]>(
    event.categories.map((c) => ({ ...c }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleDeletePoster = () => {
    if (posterPreview && posterPreview.startsWith("blob:")) {
      URL.revokeObjectURL(posterPreview);
    }
    setSelectedFile(null);
    setPosterPreview(null);
    setBannerImage(INTERNAL_BANNER_PRESETS[0].url);
  };

  const handleUpdateCategory = (index: number, field: keyof TicketCategory, val: any) => {
    const next = [...categories];
    next[index] = { ...next[index], [field]: val };
    setCategories(next);
  };

  const handleAddCategory = () => {
    const existing = new Set(categories.map((c) => c.name));
    const all: DistanceCategory[] = ["5K", "10K", "Half Marathon", "Full Marathon"];
    const pick = all.find((n) => !existing.has(n)) || "10K";
    const kmMap: Record<DistanceCategory, number> = {
      "5K": 5,
      "10K": 10,
      "Half Marathon": 21.0975,
      "Full Marathon": 42.195,
    };

    setCategories([
      ...categories,
      {
        id: `cat-new-${Date.now()}`,
        name: pick,
        distanceKm: kmMap[pick] || 10,
        price: 250000,
        quota: 300,
        availableQuota: 300,
        description: `Kategori jarak ${pick}`,
        benefits: ["Jersey", "Finisher Medal", "Timing Chip"],
      },
    ]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationVenue.trim() || !eventDate.trim()) {
      setErrorMsg("Nama event, tanggal, dan venue tidak boleh kosong.");
      return;
    }

    if (categories.length === 0) {
      setErrorMsg("Event harus memiliki minimal 1 kategori lomba.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      let finalBanner = bannerImage;
      if (selectedFile) {
        try {
          finalBanner = await uploadEventPoster(selectedFile);
        } catch (uploadErr: any) {
          console.warn("Storage upload warning:", uploadErr);
          setErrorMsg(`Peringatan: Gagal unggah foto ke Storage (${uploadErr.message}). Gunakan template internal.`);
          finalBanner = INTERNAL_BANNER_PRESETS[0].url;
        }
      }

      const updated = await updateEvent(
        event.id,
        {
          title: title.trim(),
          eventDate,
          locationCity: locationCity.trim() || "Indonesia",
          locationVenue: locationVenue.trim(),
          description: description.trim(),
          bannerImage: finalBanner.trim() || "/images/events/city-marathon.jpg",
          status,
          startTime: startTime.trim() || "05:30 WIB",
        },
        categories
      );

      if (updated) {
        onSaved(updated);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Gagal memperbarui event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-card border border-sand-border shadow-warm max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header Modal */}
        <div className="p-5 border-b border-sand-border flex items-center justify-between bg-sand-warm/30 shrink-0">
          <div>
            <h3 className="text-base font-black text-espresso flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand" />
              Kelola & Edit Event Lomba
            </h3>
            <p className="text-xs text-espresso-secondary">
              Ubah tanggal pelaksanaan, lokasi, harga tiket, dan kapasitas kuota peserta.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-espresso-muted hover:text-espresso hover:bg-sand-warm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSave} className="p-5 space-y-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 rounded-btn bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Bagian 1: Data Utama Event */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand" />
              1. Informasi Pelaksanaan & Lokasi
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-espresso mb-1">
                  Nama Event Lari *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-espresso focus:ring-1 focus:ring-brand outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-espresso mb-1">
                  Tanggal Lomba (Race Day) *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-espresso focus:ring-1 focus:ring-brand outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-espresso mb-1">
                  Jam Flag-off
                </label>
                <TimePickerInput
                  value={startTime}
                  onChange={(val) => setStartTime(val)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-espresso mb-1">
                  Kota Penyelenggaraan
                </label>
                <input
                  type="text"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-espresso focus:ring-1 focus:ring-brand outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-espresso mb-1">
                  Venue / Titik Start & Finish *
                </label>
                <input
                  type="text"
                  required
                  value={locationVenue}
                  onChange={(e) => setLocationVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-espresso focus:ring-1 focus:ring-brand outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-espresso mb-1">
                  Deskripsi Singkat Lomba
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-btn bg-sand-warm border border-sand-border text-espresso focus:ring-1 focus:ring-brand outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Bagian 2: Poster Lomba (Upload Foto & Delete) */}
          <div className="pt-3 border-t border-sand-border">
            <PosterUploadField
              selectedFile={selectedFile}
              posterPreview={posterPreview}
              bannerImage={bannerImage}
              onFileSelect={(file) => {
                setSelectedFile(file);
                const preview = URL.createObjectURL(file);
                setPosterPreview(preview);
                setBannerImage(preview);
                setErrorMsg("");
              }}
              onDeletePoster={handleDeletePoster}
              onSelectPreset={(url) => {
                handleDeletePoster();
                setBannerImage(url);
              }}
            />
          </div>

          {/* Bagian 3: Kelola Kategori, Harga & Kapasitas Kuota */}
          <div className="space-y-3 pt-3 border-t border-sand-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-brand" />
                  3. Kategori Lomba, Harga & Kapasitas Kuota
                </h4>
                <p className="text-[11px] text-espresso-muted">
                  Kurangi atau tambah kapasitas kuota, dan atur harga tiket resmi.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCategory}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-brand-50 text-brand border border-brand/20 font-bold text-xs hover:bg-brand hover:text-white transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Jarak</span>
              </button>
            </div>

            <div className="space-y-3">
              {categories.map((cat, idx) => {
                const sold = Math.max(0, (cat.quota || 0) - (cat.availableQuota || 0));
                return (
                  <div
                    key={cat.id || idx}
                    className="p-3.5 rounded-card bg-sand-warm/60 border border-sand-border space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-espresso text-xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-brand" />
                        Kategori: {cat.name} ({cat.distanceKm}K)
                      </span>
                      {sold > 0 && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {sold} tiket telah terjual
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-espresso mb-1">
                          Nama Jarak
                        </label>
                        <select
                          value={cat.name}
                          onChange={(e) =>
                            handleUpdateCategory(idx, "name", e.target.value as DistanceCategory)
                          }
                          className="w-full px-2 py-1.5 rounded bg-white border border-sand-border text-espresso focus:ring-1 focus:ring-brand outline-none"
                        >
                          <option value="5K">5K</option>
                          <option value="10K">10K</option>
                          <option value="Half Marathon">Half Marathon (21K)</option>
                          <option value="Full Marathon">Full Marathon (42K)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-espresso mb-1">
                          Harga Tiket (IDR)
                        </label>
                        <input
                          type="number"
                          step={10000}
                          min={0}
                          value={cat.price}
                          onChange={(e) =>
                            handleUpdateCategory(idx, "price", Number(e.target.value))
                          }
                          className="w-full px-2 py-1.5 rounded bg-white border border-sand-border text-espresso focus:ring-1 focus:ring-brand outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-espresso mb-1">
                          Kapasitas Kuota (Total)
                        </label>
                        <input
                          type="number"
                          min={sold}
                          value={cat.quota}
                          onChange={(e) =>
                            handleUpdateCategory(idx, "quota", Number(e.target.value))
                          }
                          className="w-full px-2 py-1.5 rounded bg-white border border-sand-border text-espresso focus:ring-1 focus:ring-brand outline-none"
                          title={`Minimal kuota adalah ${sold} karena tiket telah terjual.`}
                        />
                        <span className="text-[9px] text-espresso-muted mt-0.5 block">
                          Sisa slot tersedia: {Math.max(0, cat.quota - sold)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-sand-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-btn bg-sand-warm text-espresso font-semibold text-xs hover:bg-sand-border/50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
