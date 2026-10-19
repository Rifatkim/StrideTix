"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RunningEvent, TicketCategory, ParticipantData, ETicket } from "@/types";
import { createTicketOrder } from "@/services/ticketService";
import { CheckoutForm } from "./CheckoutForm";
import { OrderSummary } from "./OrderSummary";
import { PaymentSimulationStep } from "./PaymentSimulationStep";
import { ETicketCard } from "@/components/tickets/ETicketCard";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Ticket,
  AlertCircle,
} from "lucide-react";

interface CheckoutFlowContainerProps {
  event: RunningEvent;
  category: TicketCategory;
}

export function CheckoutFlowContainer({
  event,
  category,
}: CheckoutFlowContainerProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [participantData, setParticipantData] = useState<ParticipantData | null>(null);
  const [issuedTicket, setIssuedTicket] = useState<ETicket | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleProceedToPayment = (data: ParticipantData) => {
    setParticipantData(data);
    setCurrentStep(2);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBackToData = () => {
    setCurrentStep(1);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleExecutePayment = async () => {
    if (!participantData) return;
    setIsProcessingPayment(true);
    setErrorMessage(null);

    try {
      const ticket = await createTicketOrder({
        event: {
          id: event.id,
          title: event.title,
          bannerImage: event.bannerImage,
          eventDate: event.eventDate,
          startTime: event.startTime,
          locationVenue: event.locationVenue,
          locationCity: event.locationCity,
        },
        category: {
          id: category.id,
          name: category.name,
          price: category.price,
        },
        participant: participantData,
      });

      setIssuedTicket(ticket);
      setCurrentStep(3);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menerbitkan tiket. Silakan coba kembali.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Progress Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-border pb-6">
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-espresso-secondary hover:text-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Detail Event</span>
        </Link>

        {/* Steps */}
        <div className="flex items-center gap-2 text-xs font-bold">
          {/* Step 1 */}
          <span
            className={`flex items-center gap-1.5 transition-colors ${
              currentStep === 1
                ? "text-brand"
                : currentStep > 1
                ? "text-emerald-700"
                : "text-espresso-muted"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                currentStep === 1
                  ? "bg-brand text-white shadow-xs"
                  : currentStep > 1
                  ? "bg-emerald-600 text-white"
                  : "bg-sand-border text-espresso-secondary"
              }`}
            >
              {currentStep > 1 ? "✓" : "1"}
            </span>
            <span>Data Peserta</span>
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-espresso-muted" />

          {/* Step 2 */}
          <span
            className={`flex items-center gap-1.5 transition-colors ${
              currentStep === 2
                ? "text-brand"
                : currentStep > 2
                ? "text-emerald-700"
                : "text-espresso-muted"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                currentStep === 2
                  ? "bg-brand text-white shadow-xs"
                  : currentStep > 2
                  ? "bg-emerald-600 text-white"
                  : "bg-sand-border text-espresso-secondary"
              }`}
            >
              {currentStep > 2 ? "✓" : "2"}
            </span>
            <span>Pembayaran</span>
          </span>

          <ChevronRight className="w-3.5 h-3.5 text-espresso-muted" />

          {/* Step 3 */}
          <span
            className={`flex items-center gap-1.5 transition-colors ${
              currentStep === 3 ? "text-brand font-black" : "text-espresso-muted"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-all ${
                currentStep === 3
                  ? "bg-brand text-white shadow-xs"
                  : "bg-sand-border text-espresso-secondary"
              }`}
            >
              3
            </span>
            <span>E-Ticket QR</span>
          </span>
        </div>
      </div>

      {/* Global Error Notice */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-accent-error/10 border border-accent-error/20 flex items-start gap-2.5 text-xs text-accent-error animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Form Pengisian Data Peserta */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
          <div className="lg:col-span-7">
            <CheckoutForm
              event={event}
              category={category}
              initialData={participantData || undefined}
              onProceedToPayment={handleProceedToPayment}
            />
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <OrderSummary event={event} category={category} />
          </div>
        </div>
      )}

      {/* STEP 2: Simulasi Pembayaran (QRIS / VA) */}
      {currentStep === 2 && participantData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
          <div className="lg:col-span-7">
            <PaymentSimulationStep
              event={event}
              category={category}
              participant={participantData}
              isProcessing={isProcessingPayment}
              onPaymentSuccess={handleExecutePayment}
              onBackToData={handleBackToData}
            />
          </div>

          <div className="lg:col-span-5 sticky top-24">
            <OrderSummary event={event} category={category} />
          </div>
        </div>
      )}

      {/* STEP 3: E-Ticket QR Code Sukses Diterbitkan */}
      {currentStep === 3 && issuedTicket && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {/* Success Banner */}
          <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-card bg-emerald-50 border border-emerald-200 text-center space-y-2 shadow-xs no-print">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
              Pembayaran Berhasil Dikonfirmasi!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
              E-Ticket resmi Anda telah diterbitkan dan tersimpan di database. Simpan atau bawa QR Code tiket ini untuk proses pengambilan Race Pack dan Gate Check-in hari-H.
            </p>
          </div>

          {/* E-Ticket Card Display */}
          <ETicketCard ticket={issuedTicket} />

          {/* Bottom Actions */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 no-print">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-btn bg-brand hover:bg-brand-800 text-white font-bold text-xs shadow-warm transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" />
              <span>Lihat di Menu Tiket Saya</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 rounded-btn bg-white hover:bg-surface-soft border border-sand-border text-espresso font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Cari Event Lomba Lainnya</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
