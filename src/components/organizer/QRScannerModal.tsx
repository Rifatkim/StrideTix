"use client";

import React, { useState, useEffect, useRef } from "react";
import { getAllUserTickets } from "@/services/ticketService";
import { ETicket } from "@/types";
import {
  Camera,
  X,
  Flashlight,
  RefreshCw,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Ticket,
} from "lucide-react";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (scannedCode: string) => void;
}

// Extract ticket code from any payload variation
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

// Play race gate beep sound
function playScannerBeep(isSuccess = true) {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    // Ignore audio errors on unsupported environments
  }
}

export function QRScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
}: QRScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [sampleTickets, setSampleTickets] = useState<ETicket[]>([]);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [torchOn, setTorchOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  // Load sample tickets for quick demo testing
  useEffect(() => {
    if (isOpen) {
      getAllUserTickets().then((tix) => setSampleTickets(tix.slice(0, 5)));
    }
  }, [isOpen]);

  // Start Camera Stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    let isSubscribed = true;

    async function initCamera() {
      try {
        setCameraError(null);
        if (!navigator?.mediaDevices?.getUserMedia) {
          throw new Error("Kamera tidak didukung pada browser ini.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (!isSubscribed) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCamera(true);
      } catch (err: unknown) {
        if (!isSubscribed) return;
        setHasCamera(false);
        const msg = err instanceof Error ? err.message : "Tidak dapat mengakses kamera.";
        setCameraError(msg);
      }
    }

    initCamera();

    return () => {
      isSubscribed = false;
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // BarcodeDetector automatic scanning loop
  useEffect(() => {
    if (!isOpen || !hasCamera) return;

    let animationFrameId: number;
    let detector: any = null;

    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      try {
        detector = new (window as any).BarcodeDetector({ formats: ["qr_code"] });
      } catch {
        detector = null;
      }
    }

    const checkFrame = async () => {
      if (videoRef.current && videoRef.current.readyState >= 2 && detector) {
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes && barcodes.length > 0) {
            const rawValue = barcodes[0].rawValue;
            if (rawValue) {
              handleCodeDetected(rawValue);
              return;
            }
          }
        } catch {
          // Frame decode exception, ignore and continue loop
        }
      }
      animationFrameId = requestAnimationFrame(checkFrame);
    };

    if (detector) {
      animationFrameId = requestAnimationFrame(checkFrame);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, hasCamera]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCodeDetected = (code: string) => {
    if (isScanning) return;
    setIsScanning(true);
    playScannerBeep(true);

    const cleanCode = extractTicketCode(code);
    setTimeout(() => {
      setIsScanning(false);
      onScanSuccess(cleanCode);
      onClose();
    }, 350);
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && "applyConstraints" in track) {
      try {
        const nextState = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setTorchOn(nextState);
      } catch {
        // Torch not supported on device
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-modal border border-sand-border shadow-warm-modal max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-espresso text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">Live QR Scanner Gate</h3>
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

        {/* Viewfinder Section */}
        <div className="relative bg-black h-72 sm:h-80 flex items-center justify-center overflow-hidden">
          {hasCamera && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}

          {/* Viewfinder Target Frame */}
          <div className="relative z-10 w-56 h-56 border-2 border-brand/60 rounded-2xl flex items-center justify-center shadow-2xl">
            {/* 4 Corner Markers */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-brand rounded-tl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-brand rounded-tr" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-brand rounded-bl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-brand rounded-br" />

            {/* Red Laser Scanning Beam */}
            <div className="absolute left-2 right-2 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-bounce" />

            {/* Center Reticle */}
            <div className="w-3 h-3 border border-white/40 rounded-full" />
          </div>

          {/* Fallback info when camera is unavailable or not granted */}
          {hasCamera === false && (
            <div className="relative z-10 px-6 text-center text-white space-y-2 max-w-xs">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-xs font-semibold">
                Kamera fisik tidak aktif ({cameraError || "Izin diblokir"})
              </p>
              <p className="text-[11px] text-white/70">
                Gunakan tombol <strong>Simulasi Scan Cepat</strong> di bawah untuk menguji validasi gate.
              </p>
            </div>
          )}

          {/* Controls Bar over Video */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3 z-20">
            <button
              type="button"
              onClick={toggleTorch}
              className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/20 flex items-center gap-1.5 hover:bg-black/80 transition-colors"
            >
              <Flashlight className={`w-3.5 h-3.5 ${torchOn ? "text-amber-400" : "text-white"}`} />
              <span>{torchOn ? "Flash Nyala" : "Flash"}</span>
            </button>

            <button
              type="button"
              onClick={() => setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))}
              className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium border border-white/20 flex items-center gap-1.5 hover:bg-black/80 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Putar Kamera</span>
            </button>
          </div>
        </div>

        {/* Quick Demo Simulator Section */}
        <div className="p-4 sm:p-5 space-y-3 bg-surface-main overflow-y-auto">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-espresso-muted flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand" />
              <span>Simulasi Scan QR Tiket Peserta (1-Click Test):</span>
            </span>
            <span className="text-[10px] text-espresso-muted">Pilih untuk scan instan</span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {sampleTickets.map((t) => (
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
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-sand-border bg-white flex items-center justify-between text-xs">
          <span className="text-[11px] text-espresso-muted">
            Format QR: <code>STX-2026-XXXX-XXXX</code>
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
