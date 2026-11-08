"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRunner } from "@/context/RunnerContext";
import {
  User,
  Mail,
  Phone,
  MapPin,
  HeartHandshake,
  Shirt,
  Droplet,
  ShieldCheck,
  CheckCircle2,
  Users,
  Save,
} from "lucide-react";
import { ProfileFieldItem } from "./ProfileFieldItem";
import { RunnerProfileHeader } from "./RunnerProfileHeader";
import {
  RunnerProfileData,
  EMPTY_PROFILE,
  getRunnerProfile,
  saveRunnerProfile,
} from "@/services/runnerProfileService";

export type { RunnerProfileData };

export function RunnerProfileTab() {
  const { currentUser } = useAuth();
  const { currentProfile, isConnectedToStrava } = useRunner();

  const [profile, setProfile] = useState<RunnerProfileData>(EMPTY_PROFILE);
  const [formData, setFormData] = useState<RunnerProfileData>(EMPTY_PROFILE);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedLabel, setSavedLabel] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      const data = await getRunnerProfile(
        currentUser?.id,
        currentUser?.email,
        currentUser?.name
      );
      if (isMounted) {
        setProfile(data);
        setFormData(data);
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const photoUrl =
    currentUser?.avatarUrl ||
    currentProfile?.athlete.profileMedium ||
    null;

  const startEditSection = (sectionNumber: number) => {
    setFormData({ ...profile });
    setActiveSection(sectionNumber);
  };

  const cancelEditSection = () => {
    setFormData({ ...profile });
    setActiveSection(null);
  };

  const saveSection = async (sectionNumber: number, label: string) => {
    setProfile(formData);
    setActiveSection(null);
    setSavedLabel(label);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    // Persist to Supabase and sync cross-device
    await saveRunnerProfile(currentUser?.id, formData);
  };

  const getChestSize = (size: string) => {
    switch (size) {
      case "XS":
        return "90cm";
      case "S":
        return "94cm";
      case "M":
        return "98cm";
      case "L":
        return "104cm";
      case "XL":
        return "110cm";
      case "XXL":
        return "116cm";
      default:
        return "98cm";
    }
  };

  return (
    <div id="data-pelari" className="space-y-4 scroll-mt-24">
      {/* Toast Notifikasi Berhasil Simpan */}
      {isSaved && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2.5 animate-in fade-in duration-200 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedLabel} berhasil diperbarui.</span>
        </div>
      )}

      {/* SATU CARD TERPADU: PROFIL & SELURUH DATA PENTING PELARI */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_1px_3px_rgba(43,30,22,0.04)] overflow-hidden">
        {/* 1. Header Profil Terintegrasi (Avatar + Nama + Status) */}
        <RunnerProfileHeader
          name={profile.fullName || currentUser?.name || "Pelari StrideTix"}
          email={profile.email || currentUser?.email || "runner@stridetix.shop"}
          city={profile.city || currentProfile?.athlete.city || "Indonesia"}
          avatarUrl={photoUrl}
          isConnectedToStrava={isConnectedToStrava}
        />

        {/* 2. Kategori 1: Identitas Pelari */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              1. Identitas Pelari
            </h3>
            {activeSection === 1 ? (
              <div className="flex items-center gap-2 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={cancelEditSection}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => saveSection(1, "Identitas Pelari")}
                  className="px-3 py-1 rounded-lg bg-brand hover:bg-brand-800 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => startEditSection(1)}
                className="text-xs font-bold text-brand hover:text-brand-800 transition-colors px-2 py-1 rounded-md hover:bg-orange-50"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <ProfileFieldItem
              label="Nama Lengkap"
              icon={<User className="w-3.5 h-3.5" />}
              displayValue={profile.fullName || currentUser?.name || "Pelari StrideTix"}
              isEditing={activeSection === 1}
              onBoxClick={() => startEditSection(1)}
              renderInput={() => (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
                  placeholder="Masukkan nama lengkap"
                />
              )}
            />

            <ProfileFieldItem
              label="Alamat Email"
              icon={<Mail className="w-3.5 h-3.5" />}
              displayValue={profile.email || currentUser?.email || "runner@stridetix.shop"}
              isEditing={activeSection === 1}
              onBoxClick={() => startEditSection(1)}
              renderInput={() => (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
                  placeholder="nama@email.com"
                />
              )}
            />

            <ProfileFieldItem
              label="Nomor WhatsApp"
              icon={<Phone className="w-3.5 h-3.5" />}
              displayValue={profile.phoneNumber || "Belum diatur"}
              isEditing={activeSection === 1}
              onBoxClick={() => startEditSection(1)}
              renderInput={() => (
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
                  placeholder="08xxxxxxxxxx"
                />
              )}
            />

            <ProfileFieldItem
              label="Kota Domisili"
              icon={<MapPin className="w-3.5 h-3.5" />}
              displayValue={profile.city || "Jakarta, ID"}
              isEditing={activeSection === 1}
              onBoxClick={() => startEditSection(1)}
              renderInput={() => (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
                  placeholder="Contoh: Jakarta, ID"
                />
              )}
            />
          </div>
        </div>

        <div className="border-t border-stone-100" />

        {/* 3. Kategori 2: Kontak Darurat */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              2. Kontak Darurat
            </h3>
            {activeSection === 2 ? (
              <div className="flex items-center gap-2 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={cancelEditSection}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => saveSection(2, "Kontak Darurat")}
                  className="px-3 py-1 rounded-lg bg-brand hover:bg-brand-800 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => startEditSection(2)}
                className="text-xs font-bold text-brand hover:text-brand-800 transition-colors px-2 py-1 rounded-md hover:bg-orange-50"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <ProfileFieldItem
              label="Nama Kontak Darurat"
              icon={<HeartHandshake className="w-3.5 h-3.5" />}
              displayValue={profile.emergencyName || "Belum diatur"}
              isEditing={activeSection === 2}
              onBoxClick={() => startEditSection(2)}
              renderInput={() => (
                <input
                  type="text"
                  value={formData.emergencyName}
                  onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
                  placeholder="Contoh: Siti Rahma"
                />
              )}
            />

            <ProfileFieldItem
              label="Hubungan Kontak"
              icon={<Users className="w-3.5 h-3.5" />}
              displayValue={profile.emergencyRelation || "Pasangan"}
              isEditing={activeSection === 2}
              onBoxClick={() => startEditSection(2)}
              renderInput={() => (
                <select
                  value={formData.emergencyRelation}
                  onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
                >
                  <option value="Pasangan">Pasangan (Suami/Istri)</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Saudara Kandung">Saudara Kandung</option>
                  <option value="Teman/Rekan Kerja">Teman / Rekan Kerja</option>
                </select>
              )}
            />

            <ProfileFieldItem
              label="Telepon Darurat"
              icon={<Phone className="w-3.5 h-3.5" />}
              displayValue={profile.emergencyPhone || "Belum diatur"}
              isEditing={activeSection === 2}
              colSpan="col-span-1 sm:col-span-2"
              onBoxClick={() => startEditSection(2)}
              renderInput={() => (
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
                  placeholder="08xxxxxxxxxx"
                />
              )}
            />
          </div>
        </div>

        <div className="border-t border-stone-100" />

        {/* 4. Kategori 3: Data Medis & Merchandise */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              3. Data Tambahan
            </h3>
            {activeSection === 3 ? (
              <div className="flex items-center gap-2 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={cancelEditSection}
                  className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-xs font-semibold text-stone-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => saveSection(3, "Data Tambahan")}
                  className="px-3 py-1 rounded-lg bg-brand hover:bg-brand-800 text-xs font-bold text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => startEditSection(3)}
                className="text-xs font-bold text-brand hover:text-brand-800 transition-colors px-2 py-1 rounded-md hover:bg-orange-50"
              >
                Edit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <ProfileFieldItem
              label="Ukuran Jersey Lari"
              icon={<Shirt className="w-3.5 h-3.5" />}
              displayValue={`${profile.jerseySize || "M"} (Dada ${getChestSize(profile.jerseySize || "M")})`}
              isEditing={activeSection === 3}
              onBoxClick={() => startEditSection(3)}
              renderInput={() => (
                <select
                  value={formData.jerseySize}
                  onChange={(e) => setFormData({ ...formData, jerseySize: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
                >
                  <option value="XS">XS (Dada 90cm)</option>
                  <option value="S">S (Dada 94cm)</option>
                  <option value="M">M (Dada 98cm)</option>
                  <option value="L">L (Dada 104cm)</option>
                  <option value="XL">XL (Dada 110cm)</option>
                  <option value="XXL">XXL (Dada 116cm)</option>
                </select>
              )}
            />

            <ProfileFieldItem
              label="Golongan Darah"
              icon={<Droplet className="w-3.5 h-3.5" />}
              displayValue={profile.bloodType || "O"}
              isEditing={activeSection === 3}
              onBoxClick={() => startEditSection(3)}
              renderInput={() => (
                <select
                  value={formData.bloodType}
                  onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                  <option value="Tidak Tahu">Belum Tahu</option>
                </select>
              )}
            />

            <ProfileFieldItem
              label="Catatan Alergi / Medis"
              icon={<ShieldCheck className="w-3.5 h-3.5" />}
              displayValue={
                profile.medicalNotes
                  ? profile.medicalNotes
                  : "Tidak ada catatan khusus"
              }
              isEditing={activeSection === 3}
              colSpan="col-span-1 sm:col-span-2"
              onBoxClick={() => startEditSection(3)}
              renderInput={() => (
                <textarea
                  rows={2}
                  value={formData.medicalNotes}
                  onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-brand/60 text-sm text-espresso font-medium focus:outline-none focus:ring-2 focus:ring-brand shadow-xs resize-none"
                  placeholder="Contoh: Alergi obat tertentu, asma ringan jika cuaca dingin, dll."
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
