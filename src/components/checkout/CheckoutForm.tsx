"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ParticipantData, RunningEvent, TicketCategory } from "@/types";
import { createTicketOrder } from "@/services/ticketService";
import { CreditCard, Lock, Sparkles, UserCheck } from "lucide-react";

interface CheckoutFormProps {
  event: RunningEvent;
  category: TicketCategory;
}

export function CheckoutForm({ event, category }: CheckoutFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State with sensible defaults for quick testing
  const [formData, setFormData] = useState<ParticipantData>({
    fullName: "Budi Pratama",
    email: "budi.pratama@example.com",
    phoneNumber: "081234567890",
    gender: "male",
    dateOfBirth: "1995-08-17",
    bibName: "BUDI P.",
    emergencyContactName: "Dewi Pratama",
    emergencyContactPhone: "081298765432",
    bloodType: "O",
  });

  const [agreedToTerms, setAgreedToTerms] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;

    setIsSubmitting(true);
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
        participant: formData,
      });

      // Redirect to the newly generated e-ticket
      router.push(`/tickets/${ticket.ticketCode}`);
    } catch (err) {
      console.error("Order creation failed", err);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-card p-6 sm:p-7 border border-sand-border shadow-warm space-y-6">
      <div className="border-b border-sand-border pb-4">
        <h3 className="text-lg font-extrabold text-espresso flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-brand" />
          <span>Informasi & Data Diri Peserta Lomba</span>
        </h3>
        <p className="text-xs text-espresso-muted">
          Pastikan data identitas sesuai KTP/Passport untuk keperluan verifikasi pengambilan Race Pack.
        </p>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-espresso">Nama Lengkap (sesuai identitas)</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Email Aktif</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Nomor WhatsApp / HP</label>
          <input
            type="tel"
            required
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        {/* BIB Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Nama Cetak di Nomor Dada (BIB)</label>
          <input
            type="text"
            maxLength={12}
            required
            value={formData.bibName}
            onChange={(e) => setFormData({ ...formData, bibName: e.target.value.toUpperCase() })}
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso uppercase font-bold focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <span className="text-[10px] text-espresso-muted">Maksimal 12 karakter kapital</span>
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Jenis Kelamin</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as "male" | "female" })}
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="male">Laki-laki (Male)</option>
            <option value="female">Perempuan (Female)</option>
          </select>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Kontak Darurat (Nama)</label>
          <input
            type="text"
            required
            value={formData.emergencyContactName}
            onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-espresso">Nomor HP Kontak Darurat</label>
          <input
            type="tel"
            required
            value={formData.emergencyContactPhone}
            onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-input bg-surface-main border border-sand-border text-sm text-espresso focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="pt-2 border-t border-sand-border">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded text-brand focus:ring-brand border-sand-border cursor-pointer"
          />
          <span className="text-xs text-espresso select-none leading-relaxed">
            Saya menyetujui seluruh Syarat & Ketentuan lomba, memahami cut-off time (COT), serta menyatakan kondisi fisik dalam keadaan sehat untuk berpartisipasi.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!agreedToTerms || isSubmitting}
          className="w-full py-3.5 px-6 rounded-btn bg-brand hover:bg-brand-800 text-white font-extrabold text-sm shadow-warm transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-4 h-4" />
          <span>
            {isSubmitting ? "Memproses Transaksi..." : "Bayar & Terbitkan Tiket (Sandbox Simulator)"}
          </span>
        </button>
        <span className="text-[11px] text-espresso-muted text-center block mt-2 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-accent-success" />
          <span>Simulasi instan tanpa kartu kredit / payment gateway eksternal</span>
        </span>
      </div>
    </form>
  );
}
