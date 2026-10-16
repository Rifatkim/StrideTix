"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { createEvent } from "@/services/eventService";
import { CategoryFormBuilder } from "./CategoryFormBuilder";
import { EventCreateSummarySidebar } from "./EventCreateSummarySidebar";
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

const BANNER_PRESETS = [
  {
    label: "City Race",
    url: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1600&q=80",
  },
  {
    label: "Sunset Trail",
    url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1600&q=80",
  },
  {
    label: "Morning Marathon",
    url: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=80",
  },
];

export function EventCreateForm() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [organizerName, setOrganizerName] = useState(
    currentUser?.organizerName || "Stride Running Club"
  );
  const [description, setDescription] = useState("");
  const [locationCity, setLocationCity] = useState("Bandung");
  const [locationVenue, setLocationVenue] = useState("");
  const [eventDate, setEventDate] = useState("2026-12-20");
  const [startTime, setStartTime] = useState("05:00 WIB");
  const [registrationDeadline, setRegistrationDeadline] = useState("2026-12-10");
  const [bannerImage, setBannerImage] = useState(BANNER_PRESETS[0].url);
  const [rules, setRules] = useState(
    "1. Peserta wajib berusia minimal sesuai regulasi kategori (5K: 12th, 10K: 15th, HM: 17th).\n2. Membawa identitas resmi saat pengambilan race pack.\n3. Mengikuti rute resmi dengan timing chip yang aktif."
  );

  const [categories, setCategories] = useState<TicketCategory[]>([
    {
      id: "cat-new-5k",
      name: "5K",
      distanceKm: 5,
      price: 200000,
      quota: 500,
      availableQuota: 500,
      description: "Kategori 5K fun run untuk keluarga dan pemula.",
      benefits: ["Jersey", "Finisher Medal", "Timing Chip", "Refreshment"],
    },
    {
      id: "cat-new-10k",
      name: "10K",
      distanceKm: 10,
      price: 350000,
      quota: 800,
      availableQuota: 800,
      description: "Kategori 10K untuk pelari yang ingin mempertajam waktu tempuh.",
      benefits: ["Jersey", "Finisher Medal", "Timing Chip", "Refreshment & Isotonik"],
    },
  ]);

  const handleSubmit = async (targetStatus: "draft" | "published") => {
    if (!title.trim() || !locationVenue.trim()) {
      alert("Harap isi nama event dan venue lomba.");
      return;
    }

    setIsSubmitting(true);
    try {
      const rulesList = rules
        .split("\n")
        .map((r) => r.trim())
        .filter((r) => r.length > 0);

      await createEvent({
        title,
        organizerName,
        organizerLogo:
          "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=120&q=80",
        description: description || `Ajang lari bergengsi ${title} di ${locationCity}.`,
        locationCity,
        locationVenue,
        eventDate,
        startTime,
        registrationDeadline,
        bannerImage,
        status: targetStatus,
        categories,
        rulesAndTerms: rulesList,
        routeHighlights: ["Titik Start & Finish Utama", "Water Station & Medic Support"],
      });

      router.push("/organizer/dashboard");
    } catch (err) {
      console.error("Gagal membuat event:", err);
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
            Lengkapi nama event, lokasi race, tanggal pelaksanaan, dan poster resmi lomba.
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
              placeholder="Contoh: Bandung, Surabaya, Yogyakarta"
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
              Tanggal Pelaksanaan Lomba
            </label>
            <input
              type="date"
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
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="05:00 WIB"
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
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
              placeholder="Tuliskan latar belakang lomba, sertifikasi lintasan, keunikan rute..."
              className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none resize-none"
            />
          </div>

          {/* Banner Image URL & Presets */}
          <div className="sm:col-span-2 space-y-2">
            <label className="block text-[11px] font-bold text-espresso">
              Banner Poster Lomba (URL Gambar)
            </label>
            <input
              type="url"
              value={bannerImage}
              onChange={(e) => setBannerImage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:ring-2 focus:ring-brand outline-none"
            />
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[10px] text-espresso-muted">Preset Banner Cepat:</span>
              {BANNER_PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setBannerImage(p.url)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                    bannerImage === p.url
                      ? "bg-brand text-white border-brand"
                      : "bg-sand-warm text-espresso-secondary border-sand-border hover:border-brand"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
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
