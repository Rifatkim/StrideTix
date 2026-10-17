"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { createEvent, uploadEventPoster } from "@/services/eventService";
import { CategoryFormBuilder } from "./CategoryFormBuilder";
import { EventCreateSummarySidebar } from "./EventCreateSummarySidebar";
import { PosterUploadField, INTERNAL_BANNER_PRESETS } from "./PosterUploadField";
import { TimePickerInput } from "./TimePickerInput";
import { RunningEvent, TicketCategory } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  Save,
  Send,
  Building2,
  FileText,
} from "lucide-react";

export function EventCreateForm() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload & Poster state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  // Form states - Empty by default with background placeholders
  const [title, setTitle] = useState("");
  const [organizerName, setOrganizerName] = useState(
    currentUser?.organizerName || ""
  );
  const [description, setDescription] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationVenue, setLocationVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [bannerImage, setBannerImage] = useState(INTERNAL_BANNER_PRESETS[0].url);
  const [rules, setRules] = useState("");

  const [categories, setCategories] = useState<TicketCategory[]>([
    {
      id: "cat-new-5k",
      name: "5K",
      distanceKm: 5,
      price: 0,
      quota: 0,
      availableQuota: 0,
      description: "",
      benefits: ["Jersey", "Finisher Medal", "Timing Chip", "Refreshment"],
    },
  ]);

  const handleDeletePoster = () => {
    if (posterPreview && posterPreview.startsWith("blob:")) {
      URL.revokeObjectURL(posterPreview);
    }
    setSelectedFile(null);
    setPosterPreview(null);
    setBannerImage(INTERNAL_BANNER_PRESETS[0].url);
  };

  const handleSubmit = async (targetStatus: "draft" | "published") => {
    if (!title.trim() || !locationVenue.trim() || !eventDate.trim()) {
      alert("Harap isi nama event, tanggal pelaksanaan, dan venue lomba.");
      return;
    }

    const validCategories = categories.filter((c) => (c.quota || 0) > 0);
    if (validCategories.length === 0) {
      alert("Harap tentukan minimal satu kategori dengan kuota peserta (> 0).");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload custom poster file to Supabase Storage if selected
      let finalBannerUrl = bannerImage;
      if (selectedFile) {
        try {
          finalBannerUrl = await uploadEventPoster(selectedFile);
        } catch (uploadErr: any) {
          console.warn("Upload poster gagal, menggunakan template lokal:", uploadErr);
          alert(
            `Pemberitahuan: Foto belum dapat diunggah ke Supabase Storage (${uploadErr.message}). Event tetap disimpan menggunakan poster template internal. Pastikan Anda telah menjalankan skrip SQL storage di Supabase SQL Editor.`
          );
          finalBannerUrl = INTERNAL_BANNER_PRESETS[0].url;
        }
      }

      const rulesList = rules.trim()
        ? rules
            .split("\n")
            .map((r) => r.trim())
            .filter((r) => r.length > 0)
        : [
            "Peserta dalam kondisi fisik sehat dan siap mengikuti lomba.",
            "Membawa kartu identitas resmi saat penukaran race pack (RPC).",
            "Nomor dada (BIB) resmi wajib dikenakan selama perlombaan.",
          ];

      await createEvent({
        organizerId: currentUser?.id,
        title,
        organizerName: organizerName.trim() || currentUser?.organizerName || currentUser?.name || "Stride Organizer",
        organizerLogo: "/brand/stridetix-symbol-dark.svg",
        description:
          description.trim() ||
          `Ajang lomba lari bergengsi ${title} di ${locationCity || "Indonesia"}.`,
        locationCity: locationCity.trim() || "Indonesia",
        locationVenue,
        eventDate,
        startTime: startTime.trim() || "05:30 AM",
        registrationDeadline: registrationDeadline.trim() || eventDate,
        bannerImage: finalBannerUrl.trim() || INTERNAL_BANNER_PRESETS[0].url,
        status: targetStatus,
        categories: validCategories,
        rulesAndTerms: rulesList,
        routeHighlights: ["Titik Start & Finish Utama", "Water Station & Medic Support"],
      });

      router.push("/organizer/dashboard");
    } catch (err: any) {
      console.error("Gagal membuat event:", err);
      alert(`Gagal membuat event: ${err?.message || "Terjadi kesalahan sistem."}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Form Inputs (lg:col-span-8) */}
      <div className="lg:col-span-8 bg-white rounded-card border border-sand-border p-6 sm:p-8 shadow-warm space-y-8">
        {/* 1. Informasi Umum Event */}
        <div className="space-y-4">
          <div className="border-b border-sand-border pb-3">
            <h2 className="text-sm font-black text-espresso uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand" />
              1. Informasi Dasar Lomba
            </h2>
            <p className="text-xs text-espresso-secondary mt-1">
              Lengkapi nama event, lokasi race, tanggal pelaksanaan, dan poster lomba. Contoh tertera di latar belakang.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Nama Event Lari *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Bandung Heritage Half Marathon 2026"
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Nama Penyelenggara (Organizer)
              </label>
              <input
                type="text"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                placeholder="Contoh: Stride Running Club / Danamon Run"
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Kota Penyelenggaraan
              </label>
              <input
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="Contoh: Bandung, Surabaya, Jakarta, Denpasar"
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
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
                placeholder="Contoh: Plaza Gedung Sate, Jl. Diponegoro No. 22"
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Tanggal Pelaksanaan Lomba *
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-espresso mb-1">
                  Jam Flag-off
                </label>
                <TimePickerInput
                  value={startTime}
                  onChange={(val) => setStartTime(val)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-espresso mb-1">
                  Tenggat Registrasi
                </label>
                <input
                  type="date"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Deskripsi Event
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tuliskan latar belakang lomba, keunikan rute lari, standar fasilitas, atau cut-off time..."
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none resize-none"
              />
            </div>

            {/* Banner Poster Upload & Delete Section */}
            <div className="sm:col-span-2 pt-2 border-t border-sand-border">
              <PosterUploadField
                selectedFile={selectedFile}
                posterPreview={posterPreview}
                bannerImage={bannerImage}
                onFileSelect={(file) => {
                  setSelectedFile(file);
                  const preview = URL.createObjectURL(file);
                  setPosterPreview(preview);
                  setBannerImage(preview);
                }}
                onDeletePoster={handleDeletePoster}
                onSelectPreset={(url) => {
                  handleDeletePoster();
                  setBannerImage(url);
                }}
              />
            </div>
          </div>
        </div>

      {/* 2. Builder Kategori Tiket */}
      <div className="pt-4 border-t border-sand-border">
        <CategoryFormBuilder categories={categories} onChange={setCategories} />
      </div>

      {/* 3. Regulasi & Syarat Ketentuan */}
      <div className="pt-4 border-t border-sand-border space-y-3">
        <h3 className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand" />
          3. Regulasi & Syarat Ketentuan Lomba
        </h3>
        <p className="text-[11px] text-espresso-muted">
          Tuliskan 1 aturan per baris untuk ditampilkan kepada peserta di halaman detail lomba dan saat checkout.
        </p>
        <textarea
          rows={4}
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          placeholder={"Contoh format regulasi (1 per baris):\n1. Peserta wajib berusia minimal sesuai regulasi kategori.\n2. Membawa e-ticket resmi & kartu identitas saat pengambilan race pack.\n3. Mengikuti rute resmi dengan timing chip yang aktif."}
          className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none resize-none font-mono"
        />
      </div>

      {/* Submit Action Buttons */}
      <div className="pt-6 border-t border-sand-border flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit("draft")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-espresso font-bold text-xs hover:border-brand transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4 text-espresso-muted" />
          <span>Simpan sebagai Draft</span>
        </button>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit("published")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? "Mempublikasikan..." : "Publikasikan Event"}</span>
        </button>
      </div>
      </div>

      {/* Kolom Kanan: Summary Progress Sidebar (lg:col-span-4) */}
      <div className="lg:col-span-4">
        <EventCreateSummarySidebar
          title={title}
          organizerName={organizerName}
          locationCity={locationCity}
          locationVenue={locationVenue}
          eventDate={eventDate}
          startTime={startTime}
          bannerImage={bannerImage}
          categories={categories}
          rules={rules}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
