"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Phone,
  HeartHandshake,
  AlertCircle,
  CheckCircle2,
  Save,
  Shirt,
  Droplet,
  ShieldCheck,
} from "lucide-react";

interface RunnerProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  bloodType: string;
  jerseySize: string;
  medicalNotes: string;
}

const STORAGE_KEY = "stridetix_runner_profile";

const EMPTY_PROFILE: RunnerProfileData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  city: "",
  emergencyName: "",
  emergencyRelation: "",
  emergencyPhone: "",
  bloodType: "O",
  jerseySize: "M",
  medicalNotes: "",
};

export function RunnerProfileTab() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<RunnerProfileData>(EMPTY_PROFILE);
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setProfile({
            ...parsed,
            fullName: parsed.fullName || currentUser?.name || "",
            email: parsed.email || currentUser?.email || "",
          });
        } else if (currentUser) {
          setProfile((prev) => ({
            ...prev,
            fullName: currentUser.name || "",
            email: currentUser.email || "",
          }));
        }
      } catch {
        // Fallback default
      }
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      }
      setIsSubmitting(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    }, 400);
  };

  return (
    <div className="bg-white rounded-card border border-sand-border p-6 shadow-warm w-full">
      <div className="border-b border-sand-border pb-4 mb-6">
        <h2 className="text-base font-bold text-espresso">Data Diri & Kontak Darurat</h2>
        <p className="text-xs text-espresso-secondary mt-1">
          Informasi ini digunakan oleh pihak race management untuk administrasi BIB e-ticket dan penanganan medis darurat jika diperlukan.
        </p>
      </div>

      {isSaved && (
        <div className="mb-6 p-4 rounded-card bg-accent-success/10 border border-accent-success/30 flex items-center gap-3 text-xs text-accent-success font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Profil berhasil disimpan! Data Anda telah disinkronkan ke sesi race lokal.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Identitas Pribadi */}
        <div>
          <h3 className="text-xs font-bold text-espresso uppercase tracking-wider mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-brand" />
            1. Identitas Pelari
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Nama Lengkap (Sesuai KTP)
              </label>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Alamat Email
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Nomor WhatsApp Aktif
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={profile.phoneNumber}
                  onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand pl-8"
                />
                <Phone className="w-3.5 h-3.5 text-espresso-muted absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Kota Domisili
              </label>
              <input
                type="text"
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Kontak Darurat */}
        <div className="pt-4 border-t border-sand-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-espresso uppercase tracking-wider flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-brand" />
              2. Kontak Darurat (Emergency Contact)
            </h3>
            <span className="text-[10px] text-brand bg-brand-50 px-2 py-0.5 rounded-full font-bold">
              Wajib untuk Race Safety
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Nama Kontak Darurat
              </label>
              <input
                type="text"
                required
                value={profile.emergencyName}
                onChange={(e) => setProfile({ ...profile, emergencyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Hubungan
              </label>
              <select
                value={profile.emergencyRelation}
                onChange={(e) => setProfile({ ...profile, emergencyRelation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="Pasangan">Pasangan (Suami/Istri)</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Saudara Kandung">Saudara Kandung</option>
                <option value="Teman/Rekan Kerja">Teman / Rekan Kerja</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Nomor Telepon Darurat
              </label>
              <input
                type="tel"
                required
                value={profile.emergencyPhone}
                onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Informasi Fisik & Medis Lomba */}
        <div className="pt-4 border-t border-sand-border">
          <h3 className="text-xs font-bold text-espresso uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand" />
            3. Data Medis & Merchandise
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-espresso-muted" />
                Ukuran Jersey Lari
              </label>
              <select
                value={profile.jerseySize}
                onChange={(e) => setProfile({ ...profile, jerseySize: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="XS">XS (Dada 90cm)</option>
                <option value="S">S (Dada 94cm)</option>
                <option value="M">M (Dada 98cm)</option>
                <option value="L">L (Dada 104cm)</option>
                <option value="XL">XL (Dada 110cm)</option>
                <option value="XXL">XXL (Dada 116cm)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-espresso mb-1 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-brand" />
                Golongan Darah
              </label>
              <select
                value={profile.bloodType}
                onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
                <option value="O">O</option>
                <option value="Tidak Tahu">Belum Tahu</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-espresso mb-1">
                Catatan Alergi / Kondisi Medis Penting
              </label>
              <textarea
                rows={2}
                value={profile.medicalNotes}
                onChange={(e) => setProfile({ ...profile, medicalNotes: e.target.value })}
                placeholder="Contoh: Alergi penisilin, asma ringan jika cuaca dingin, dll."
                className="w-full px-3.5 py-2.5 rounded-btn bg-sand-warm border border-sand-border text-xs text-espresso focus:outline-none focus:ring-2 focus:ring-brand resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Menyimpan..." : "Simpan Perubahan Profil"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
