"use client";

import React, { useState, useRef } from "react";
import { useRunner } from "@/context/RunnerContext";
import {
  UploadCloud,
  FileText,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

export function FitnessSyncMethods() {
  const {
    uploadFitnessFiles,
    submitManualAssessment,
    isLoading,
    syncErrorMessage,
  } = useRunner();

  const [activeTab, setActiveTab] = useState<"upload" | "manual">("upload");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // State untuk form manual
  const [longestRunKm, setLongestRunKm] = useState<number>(10);
  const [weeklyFrequency, setWeeklyFrequency] = useState<number>(3);
  const [averagePace, setAveragePace] = useState<number>(5.5); // 5:30 min/km

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
      setUploadSuccess(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    const res = await uploadFitnessFiles(selectedFiles);
    if (res.success) {
      setUploadSuccess(res.message);
      setSelectedFiles([]);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await submitManualAssessment({
      longestRunKm,
      weeklyFrequency,
      averagePaceMinPerKm: averagePace,
    });
    if (res.success) {
      setUploadSuccess(res.message);
    }
  };


  return (
    <div className="bg-white rounded-card p-6 sm:p-8 border border-sand-border shadow-warm space-y-6 max-w-xl mx-auto">
      {/* Header & Deskripsi */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand text-[11px] font-extrabold uppercase tracking-wider border border-brand-200/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal Fitness Sync</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-espresso">
          Hubungkan Riwayat Lari Anda
        </h3>
        <p className="text-xs text-espresso-secondary max-w-md mx-auto leading-relaxed">
          Pilih metode sinkronisasi data latihan untuk mengaktifkan fitur <strong>Smart Distance Recommendation</strong> berbasis analitik deterministik.
        </p>
      </div>

      {/* 2 Tab Selector: Upload File & Formulir Manual */}
      <div className="flex rounded-btn bg-surface-soft p-1 border border-sand-border text-xs font-bold text-espresso">
        <button
          type="button"
          onClick={() => {
            setActiveTab("upload");
            setUploadSuccess(null);
          }}
          className={`flex-1 py-2 rounded-btn transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "upload"
              ? "bg-white text-brand shadow-sm"
              : "text-espresso-muted hover:text-espresso"
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload File (GPX/CSV)</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("manual");
            setUploadSuccess(null);
          }}
          className={`flex-1 py-2 rounded-btn transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "manual"
              ? "bg-white text-brand shadow-sm"
              : "text-espresso-muted hover:text-espresso"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Input Manual Data Lari</span>
        </button>
      </div>

      {/* Feedback Messages */}
      {uploadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-btn text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}
      {syncErrorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-btn text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{syncErrorMessage}</span>
        </div>
      )}

      {/* --- TAB 1: UPLOAD GPX / CSV --- */}
      {activeTab === "upload" && (
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-sand-border hover:border-brand/60 rounded-card p-6 text-center cursor-pointer transition-colors bg-surface-main hover:bg-brand-50/30 space-y-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".gpx,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-brand-50 text-brand flex items-center justify-center mx-auto">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-espresso">
                Klik untuk memilih file <span className="text-brand">.GPX</span> atau <span className="text-brand">.CSV</span>
              </p>
              <p className="text-[11px] text-espresso-muted">
                Bisa menggunakan berkas ekspor gratis dari Strava, Garmin, Coros, Nike Run Club, dll.
              </p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="bg-sand-warm/60 p-3 rounded-btn border border-sand-border space-y-1 text-xs">
              <div className="font-bold text-espresso flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand" />
                <span>{selectedFiles.length} file dipilih:</span>
              </div>
              <ul className="text-[11px] text-espresso-muted list-disc list-inside">
                {selectedFiles.map((f, i) => (
                  <li key={i} className="truncate">{f.name} ({(f.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={selectedFiles.length === 0 || isLoading}
            className="w-full py-3 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses File Riwayat...</span>
              </>
            ) : (
              <span>Ekstrak & Analisis Kesiapan Lari</span>
            )}
          </button>
        </form>
      )}

      {/* --- TAB 2: MANUAL FORM --- */}
      {activeTab === "manual" && (
        <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-espresso">
              <label>Lari Terjauh dalam 1–2 Bulan (Long Run):</label>
              <span className="text-brand font-black">{longestRunKm} km</span>
            </div>
            <input
              type="range"
              min={2}
              max={42}
              step={0.5}
              value={longestRunKm}
              onChange={(e) => setLongestRunKm(parseFloat(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
            <p className="text-[10px] text-espresso-muted">Jarak tempuh lari terjauh tanpa henti yang pernah dicapai.</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-espresso">
              <label>Frekuensi Latihan Mingguan:</label>
              <span className="text-brand font-black">{weeklyFrequency}x / minggu</span>
            </div>
            <input
              type="range"
              min={1}
              max={7}
              step={1}
              value={weeklyFrequency}
              onChange={(e) => setWeeklyFrequency(parseInt(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-espresso">
              <label>Pace Rata-rata Lari Nyaman:</label>
              <span className="text-brand font-black">
                {Math.floor(averagePace)}:{String(Math.round((averagePace % 1) * 60)).padStart(2, "0")} /km
              </span>
            </div>
            <input
              type="range"
              min={4.0}
              max={9.0}
              step={0.1}
              value={averagePace}
              onChange={(e) => setAveragePace(parseFloat(e.target.value))}
              className="w-full accent-brand cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghitung Rekomendasi...</span>
              </>
            ) : (
              <span>Simpan & Hitung Rekomendasi Jarak</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
