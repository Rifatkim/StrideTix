"use client";

import React, { useState, useEffect } from "react";
import { checkInTicket, getTicketByCode } from "@/services/ticketService";
import { ETicket } from "@/types";
import { QRScannerModal, extractTicketCode } from "./QRScannerModal";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Ticket,
  Calendar,
  Users,
  RefreshCw,
  Camera,
} from "lucide-react";

interface CheckInValidatorProps {
  initialCode?: string;
}

export function CheckInValidator({ initialCode = "" }: CheckInValidatorProps) {
  const [ticketCodeInput, setTicketCodeInput] = useState(initialCode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    ticket?: ETicket;
  } | null>(null);

  useEffect(() => {
    if (initialCode) {
      setTicketCodeInput(initialCode);
    }
  }, [initialCode]);

  const handleVerify = async (codeToVerify?: string) => {
    const raw = (codeToVerify || ticketCodeInput).trim();
    if (!raw) return;

    const code = extractTicketCode(raw);
    setIsProcessing(true);
    // Simulate brief scan verification delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const result = await checkInTicket(code);
    setVerificationResult(result);
    setIsProcessing(false);
  };

  const handleScanSuccess = (scannedCode: string) => {
    setTicketCodeInput(scannedCode);
    handleVerify(scannedCode);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-accent-info/10 text-accent-info border border-accent-info/20">
          <QrCode className="w-3.5 h-3.5" />
          <span>Organizer Gate Check-in Terminal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-espresso">
          Validasi E-Ticket Peserta
        </h1>
        <p className="text-xs text-espresso-secondary">
          Masukkan kode tiket atau scan QR Code peserta untuk memverifikasi keaslian dan mencegah tiket ganda.
        </p>
      </div>

      {/* Primary Action: QR Scanner Camera Launch Card */}
      <div className="bg-brand-50/70 p-4 rounded-card border border-brand-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center shrink-0 shadow-sm">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-espresso">Live Camera QR Scanner</h3>
            <p className="text-[11px] text-espresso-secondary">
              Arahkan kamera ke QR Code e-ticket peserta atau gunakan simulasi scan cepat
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsScannerOpen(true)}
          className="px-4 py-2.5 rounded-btn bg-espresso hover:bg-black text-white font-bold text-xs shadow-warm flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <QrCode className="w-4 h-4 text-brand" />
          <span>Buka Scanner Kamera</span>
        </button>
      </div>

      {/* Input Verification Box */}
      <div className="bg-white rounded-card p-6 border border-sand-border shadow-warm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-espresso block">
              Kode E-Ticket Peserta (Manual / Hasil Scan)
            </label>
            <span className="text-[10px] text-espresso-muted">Format: STX-2026-XXXX-XXXX</span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso-muted" />
            <input
              type="text"
              placeholder="Contoh: STX-2026-JKT-8492"
              value={ticketCodeInput}
              onChange={(e) => setTicketCodeInput(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-24 py-3 rounded-input bg-surface-main border border-sand-border text-sm font-mono font-bold text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              title="Pindai QR dengan Kamera"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-btn bg-brand-50 hover:bg-brand text-brand hover:text-white border border-brand-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan QR</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={!ticketCodeInput.trim() || isProcessing}
            className="w-full py-3.5 px-6 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-sm shadow-warm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>{isProcessing ? "Memeriksa Tiket..." : "Verifikasi & Check-in Tiket"}</span>
          </button>
        </form>

        {/* Quick Testing Shortcuts */}
        <div className="pt-3 border-t border-sand-border space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-espresso-muted block">
            Shortcut Uji Coba Cepat (Tiket Live):
          </span>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => {
                setTicketCodeInput("STX-2026-YOG-6041");
                handleVerify("STX-2026-YOG-6041");
              }}
              className="px-2.5 py-1.5 rounded-btn bg-surface-main hover:bg-brand-50 border border-sand-border text-espresso font-semibold transition-colors"
            >
              Uji Tiket (Bams): STX-2026-YOG-6041
            </button>
            <button
              onClick={() => {
                setTicketCodeInput("STX-2026-YOG-6942");
                handleVerify("STX-2026-YOG-6942");
              }}
              className="px-2.5 py-1.5 rounded-btn bg-surface-main hover:bg-brand-50 border border-sand-border text-espresso font-semibold transition-colors"
            >
              Uji Tiket 2: STX-2026-YOG-6942
            </button>
          </div>
        </div>
      </div>

      {/* Verification Result Feedback Box */}
      {verificationResult && (
        <div
          className={`rounded-card p-6 border shadow-warm animate-in zoom-in-95 duration-200 space-y-4 ${
            verificationResult.success
              ? "bg-accent-success/10 border-accent-success text-espresso"
              : "bg-accent-error/10 border-accent-error text-espresso"
          }`}
        >
          <div className="flex items-start gap-3">
            {verificationResult.success ? (
              <div className="w-10 h-10 rounded-full bg-accent-success text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent-error text-white flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
            )}

            <div className="space-y-1">
              <h3
                className={`text-base font-extrabold ${
                  verificationResult.success ? "text-accent-success" : "text-accent-error"
                }`}
              >
                {verificationResult.success
                  ? "VERIFIKASI BERHASIL — CHECK-IN DITERIMA"
                  : "CHECK-IN DITOLAK / TIDAK VALID"}
              </h3>
              <p className="text-xs leading-relaxed text-espresso-secondary">
                {verificationResult.message}
              </p>
            </div>
          </div>

          {/* Ticket Information Breakdown */}
          {verificationResult.ticket && (
            <div className="bg-white p-4 rounded-btn border border-sand-border space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-espresso-muted block">Peserta</span>
                  <strong className="text-espresso font-bold">
                    {verificationResult.ticket.participantName}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-espresso-muted block">BIB Name</span>
                  <strong className="text-brand font-bold font-mono">
                    {verificationResult.ticket.bibName}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-espresso-muted block">Kategori</span>
                  <strong className="text-espresso font-bold">
                    {verificationResult.ticket.categoryName}
                  </strong>
                </div>
                <div>
                  <span className="text-[10px] text-espresso-muted block">Status Tiket</span>
                  <span
                    className={`font-bold uppercase text-[11px] ${
                      verificationResult.ticket.status === "checked_in"
                        ? "text-accent-ai"
                        : "text-accent-success"
                    }`}
                  >
                    {verificationResult.ticket.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
}
