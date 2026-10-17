"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { formatRupiah } from "@/lib/utils";
import { RunningEvent, TicketCategory, ParticipantData } from "@/types";
import {
  CreditCard,
  QrCode,
  Building2,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const QRCodeSVG = dynamic(
  () => import("qrcode.react").then((mod) => mod.QRCodeSVG),
  { ssr: false }
);

interface PaymentSimulationStepProps {
  event: RunningEvent;
  category: TicketCategory;
  participant: ParticipantData;
  onPaymentSuccess: () => Promise<void>;
  onBackToData: () => void;
  isProcessing: boolean;
}

export function PaymentSimulationStep({
  event,
  category,
  participant,
  onPaymentSuccess,
  onBackToData,
  isProcessing,
}: PaymentSimulationStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<"qris" | "va">("qris");
  const [selectedBank, setSelectedBank] = useState<"bca" | "mandiri" | "bni">("bca");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 menit countdown

  const adminFee = 5000;
  const totalAmount = category.price + adminFee;

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const vaNumbers = {
    bca: "8277081234567890",
    mandiri: "8890881234567890",
    bni: "9880881234567890",
  };

  const currentVa = vaNumbers[selectedBank];

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentVa);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-card p-6 sm:p-7 border border-sand-border shadow-warm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sand-border pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Sandbox Simulator</span>
          </div>
          <h3 className="text-xl font-extrabold text-espresso">
            Simulasi Pembayaran Tiket
          </h3>
          <p className="text-xs text-espresso-muted">
            Pilih metode pembayaran simulasi dan klik tombol bayar untuk menerbitkan tiket.
          </p>
        </div>

        {/* Countdown */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-btn bg-surface-main border border-sand-border text-xs text-espresso font-bold self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-brand animate-pulse" />
          <span>Sisa Waktu: <strong className="text-brand font-mono">{formatTimer(timeLeft)}</strong></span>
        </div>
      </div>

      {/* Total Display */}
      <div className="p-4 rounded-btn bg-brand-50 border border-brand-200 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-brand-800 block">Total Tagihan Pembayaran</span>
          <span className="text-2xl font-black text-espresso tracking-tight">
            {formatRupiah(totalAmount)}
          </span>
        </div>
        <div className="text-right text-xs text-espresso-muted hidden sm:block">
          <span>Kategori: <strong className="text-espresso">{category.name}</strong></span>
          <span className="block">Peserta: <strong className="text-espresso">{participant.fullName}</strong></span>
        </div>
      </div>

      {/* Tabs Metode Pembayaran */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-espresso">Pilih Metode Simulasi</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod("qris")}
            className={`p-3.5 rounded-btn border text-left transition-all flex items-center gap-2.5 ${
              paymentMethod === "qris"
                ? "bg-brand/5 border-brand ring-2 ring-brand/20 shadow-xs"
                : "bg-surface-main border-sand-border hover:bg-white text-espresso-secondary"
            }`}
          >
            <QrCode className={`w-5 h-5 ${paymentMethod === "qris" ? "text-brand" : "text-espresso-muted"}`} />
            <div>
              <span className="text-xs font-bold text-espresso block">QRIS Instan</span>
              <span className="text-[10px] text-espresso-muted">Semua e-Wallet & m-Banking</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("va")}
            className={`p-3.5 rounded-btn border text-left transition-all flex items-center gap-2.5 ${
              paymentMethod === "va"
                ? "bg-brand/5 border-brand ring-2 ring-brand/20 shadow-xs"
                : "bg-surface-main border-sand-border hover:bg-white text-espresso-secondary"
            }`}
          >
            <Building2 className={`w-5 h-5 ${paymentMethod === "va" ? "text-brand" : "text-espresso-muted"}`} />
            <div>
              <span className="text-xs font-bold text-espresso block">Virtual Account</span>
              <span className="text-[10px] text-espresso-muted">BCA, Mandiri, BNI</span>
            </div>
          </button>
        </div>
      </div>

      {/* Body: QRIS Simulator */}
      {paymentMethod === "qris" && (
        <div className="p-5 rounded-card bg-surface-main border border-sand-border flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 bg-white rounded-xl border border-sand-border shadow-xs">
            <QRCodeSVG
              value={`STRIDETIX-QRIS-MOCK-${event.id}-${category.id}-${totalAmount}`}
              size={180}
              level="M"
              fgColor="#241C17"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-espresso block">NMID: ID1020260987654</span>
            <span className="text-xs text-brand font-semibold">StrideTix Official Race Partner</span>
          </div>
          <p className="text-[11px] text-espresso-muted max-w-sm">
            Scan QRIS menggunakan aplikasi GoPay, OVO, Dana, BCA Mobile, Livin Mandiri, atau aplikasi e-wallet apa saja.
          </p>
        </div>
      )}

      {/* Body: Virtual Account Simulator */}
      {paymentMethod === "va" && (
        <div className="p-5 rounded-card bg-surface-main border border-sand-border space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-espresso block">Pilih Bank Virtual Account</span>
            <div className="flex gap-2">
              {(["bca", "mandiri", "bni"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBank(b)}
                  className={`px-3 py-1.5 rounded-btn text-xs font-bold uppercase transition-all ${
                    selectedBank === b
                      ? "bg-espresso text-white shadow-xs"
                      : "bg-white border border-sand-border text-espresso hover:bg-surface-soft"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-btn border border-sand-border flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-espresso-muted block">
                Nomor Virtual Account ({selectedBank.toUpperCase()})
              </span>
              <span className="text-base font-mono font-extrabold text-brand tracking-wider">
                {currentVa}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-btn bg-surface-main hover:bg-sand-border/30 border border-sand-border text-xs font-bold text-espresso flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-espresso-muted" />
                  <span>Salin</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Sandbox Notice Alert */}
      <div className="p-3.5 rounded-btn bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Mode Simulasi:</strong> Anda tidak perlu melakukan transfer riil. Cukup klik tombol <strong>"Simulasikan Pembayaran Berhasil"</strong> di bawah untuk langsung menerbitkan tiket dan QR Code resmi.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          id="simulate-payment-btn"
          type="button"
          onClick={onPaymentSuccess}
          disabled={isProcessing}
          className="w-full py-4 px-6 rounded-btn bg-brand hover:bg-brand-800 text-white font-extrabold text-sm shadow-warm transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi & Menerbitkan E-Ticket...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              <span>Simulasikan Pembayaran Berhasil (Bayar Sekarang)</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBackToData}
          disabled={isProcessing}
          className="w-full py-2.5 px-4 rounded-btn bg-transparent hover:bg-surface-main text-espresso-secondary text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali Ubah Data Diri Peserta</span>
        </button>
      </div>
    </div>
  );
}
