"use client";

import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { getAllUserTickets } from "@/services/ticketService";
import { ETicket } from "@/types";
import {
  Camera,
  X,
  QrCode,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedCode: string) => void;
}

// Ekstrak kode tiket unik dari berbagai variasi payload QR
export function extractTicketCode(rawPayload: string): string {
  const trimmed = rawPayload.trim();
  const matchToken = trimmed.match(/STRIDETIX-TOKEN-([A-Z0-9-]+)-VERIFIED/i);
  if (matchToken && matchToken[1]) return matchToken[1].toUpperCase();

  const matchUrl = trimmed.match(/tickets\/([A-Z0-9-]+)/i);
  if (matchUrl && matchUrl[1]) return matchUrl[1].toUpperCase();

  const matchStx = trimmed.match(/(STX-[A-Z0-9-]+)/i);
  if (matchStx && matchStx[1]) return matchStx[1].toUpperCase();

  return trimmed.toUpperCase();
}

// Efek audio beep sukses scan gate
function playScannerBeep(isSuccess = true) {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(isSuccess ? 880 : 300, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch {
    // Abaikan jika browser tidak mendukung Web Audio
  }
}

export function QRScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
}: QRScannerModalProps) {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [sampleTickets, setSampleTickets] = useState<ETicket[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const scannerInstanceRef = useRef<Html5Qrcode | null>(null);

  // Ambil daftar tiket nyata dari database untuk simulasi uji coba instan
  useEffect(() => {
    if (isOpen) {
      getAllUserTickets().then((tix) => setSampleTickets(tix.slice(0, 5)));
    }
  }, [isOpen]);

  const handleCodeDetected = (code: string) => {
    if (isScanning) return;
    setIsScanning(true);
    playScannerBeep(true);

    const cleanCode = extractTicketCode(code);
    setTimeout(() => {
      setIsScanning(false);
      onScanSuccess(cleanCode);
      onClose();
    }, 300);
  };

  // Inisialisasi Html5Qrcode Scanner ke kamera fisik
  useEffect(() => {
    if (!isOpen) return;

    const elementId = "html5qr-code-scanner";
    let isMounted = true;
    let html5QrCode: Html5Qrcode | null = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        // Pastikan container DOM siap
        const container = document.getElementById(elementId);
        if (!container) return;

        html5QrCode = new Html5Qrcode(elementId);
        scannerInstanceRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 220, height: 220 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            if (isMounted) {
              handleCodeDetected(decodedText);
            }
          },
          () => {
            // Frame tanpa QR, abaikan
          }
        );

        if (isMounted) {
          setHasCamera(true);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setHasCamera(false);
        const msg = err instanceof Error ? err.message : "Tidak dapat mengakses kamera perangkat.";
        setCameraError(msg);
      }
    };

    const timer = setTimeout(startCamera, 150);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (html5QrCode) {
        try {
          if (html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
              html5QrCode?.clear();
            }).catch(() => {});
          } else {
            html5QrCode.clear();
          }
        } catch {
          // Ignore cleanup errors
        }
      }
      scannerInstanceRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-modal border border-sand-border shadow-warm-modal max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-espresso text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Live Camera QR Scanner</h3>
              <p className="text-[10px] text-warm-white/70">Arahkan kamera ke QR Code e-ticket peserta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-warm-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Kamera Live */}
        <div className="relative bg-black min-h-[280px] max-h-[340px] flex items-center justify-center overflow-hidden">
          {/* Container Html5Qrcode Scanner */}
          <div
            id="html5qr-code-scanner"
            className="w-full h-full max-w-[320px] max-h-[320px] overflow-hidden rounded-lg"
          />

          {/* Fallback jika kamera tidak aktif / diblokir */}
          {hasCamera === false && (
            <div className="absolute inset-0 z-10 px-6 flex flex-col items-center justify-center text-center text-white space-y-2 bg-espresso/90">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs font-semibold">
                Kamera tidak aktif ({cameraError || "Izin diblokir"})
              </p>
              <p className="text-[11px] text-white/70">
                Gunakan tombol <strong>Simulasi Scan Cepat</strong> di bawah atau input manual kode tiket.
              </p>
            </div>
          )}

          {/* Indikator Membaca QR */}
          {isScanning && (
            <div className="absolute inset-0 z-20 bg-brand/80 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold">QR Terdeteksi! Memverifikasi tiket...</span>
            </div>
          )}
        </div>

        {/* Bagian Simulasi Cepat (1-Click Test) untuk Pengujian Langsung */}
        <div className="p-4 sm:p-5 space-y-3 bg-surface-main overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-espresso-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>Simulasi Scan QR Tiket Peserta (1-Click Test):</span>
            </span>
            <span className="text-[10px] text-espresso-muted">Pilih untuk scan instan</span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {sampleTickets.length > 0 ? (
              sampleTickets.map((t) => (
                <button
                  key={t.ticketCode}
                  type="button"
                  onClick={() => handleCodeDetected(t.ticketCode)}
                  className="w-full text-left p-2.5 rounded-btn bg-white hover:bg-brand-50 border border-sand-border text-xs flex items-center justify-between gap-3 transition-colors shadow-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-50 text-brand flex items-center justify-center shrink-0 group-hover:bg-brand group-hover:text-white transition-colors">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-espresso block font-mono text-[11px]">
                        {t.ticketCode}
                      </span>
                      <span className="text-[10px] text-espresso-secondary">
                        {t.participantName} • {t.categoryName} ({t.bibName})
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "checked_in"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {t.status === "checked_in" ? "Sudah Check-in" : "Siap Masuk"}
                    </span>
                    <span className="text-[10px] text-brand block font-semibold mt-0.5">
                      Scan Ini →
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-espresso-muted bg-white rounded-btn border border-sand-border">
                Belum ada tiket yang terbit di database. Silakan beli tiket terlebih dahulu melalui katalog event.
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-5 py-3 border-t border-sand-border bg-white flex items-center justify-between text-xs">
          <span className="text-[11px] text-espresso-muted">
            Format QR: <code>STRIDETIX-TOKEN-[KODE]-VERIFIED</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-btn bg-surface-main hover:bg-sand-border text-espresso font-bold transition-colors"
          >
            Tutup Scanner
          </button>
        </div>
      </div>
    </div>
  );
}
