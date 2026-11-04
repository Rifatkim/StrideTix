"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { RunnerProfileTab } from "@/components/dashboard/RunnerProfileTab";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { getAllUserTickets } from "@/services/ticketService";
import { useRunner } from "@/context/RunnerContext";
import { useAuth } from "@/context/AuthContext";
import { ETicket } from "@/types";
import {
  Ticket,
  Activity,
  Sparkles,
  Bell,
  ShieldCheck,
  Eye,
  KeyRound,
  Mail,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import {
  IosSettingsGroup,
  IosSettingsRow,
} from "@/components/dashboard/IosSettingsGroup";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get("tab");

  const [tickets, setTickets] = useState<ETicket[]>([]);
  const { currentProfile, recommendation } = useRunner();
  const { currentUser } = useAuth();

  // iOS-Style Settings Toggle States (Orange when ON!)
  const [notifyRaceSchedule, setNotifyRaceSchedule] = useState(true);
  const [showEmergencyOnTicket, setShowEmergencyOnTicket] = useState(true);
  const [autoRecommendAi, setAutoRecommendAi] = useState(true);
  const [publicLeaderboardProfile, setPublicLeaderboardProfile] = useState(false);

  // Kelas Baru: Keamanan & 2FA (2FA Gmail dan Google Authenticator)
  const [twoFactorGmail, setTwoFactorGmail] = useState(false);
  const [twoFactorGoogleAuth, setTwoFactorGoogleAuth] = useState(false);

  // Load persistent 2FA status from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const emailKey = currentUser?.email
        ? "stridetix_2fa_gmail_" + currentUser.email.toLowerCase().trim()
        : null;
      const savedUser = emailKey ? localStorage.getItem(emailKey) : null;
      const savedGlobal = localStorage.getItem("stridetix_2fa_gmail_active");

      if (savedUser === "true" || (savedUser === null && savedGlobal === "true")) {
        setTwoFactorGmail(true);
      } else if (savedUser === "false") {
        setTwoFactorGmail(false);
      }
    }
  }, [currentUser]);

  const handleToggle2faGmail = (checked: boolean) => {
    setTwoFactorGmail(checked);
    if (typeof window !== "undefined") {
      if (currentUser?.email) {
        const key =
          "stridetix_2fa_gmail_" + currentUser.email.toLowerCase().trim();
        localStorage.setItem(key, checked ? "true" : "false");
      }
      localStorage.setItem("stridetix_2fa_gmail_active", checked ? "true" : "false");
    }
  };

  // If navigated with legacy query params ?tab=tickets or ?tab=strava, forward cleanly
  useEffect(() => {
    if (tabParam === "tickets") {
      router.replace("/tickets");
    } else if (tabParam === "strava") {
      router.replace("/smart-ai");
    }
  }, [tabParam, router]);

  useEffect(() => {
    async function loadTickets() {
      const data = await getAllUserTickets();
      setTickets(data);
    }
    loadTickets();
  }, []);

  const totalKm = currentProfile
    ? currentProfile.summary.totalDistanceKm.toFixed(1)
    : "0";
  const longestRunKm = currentProfile?.summary.longestRunKm
    ? currentProfile.summary.longestRunKm.toFixed(1)
    : "0";

  return (
    <Container
      as="main"
      className="flex-1 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-32 md:pb-12 max-w-7xl mx-auto"
    >
      <AuthGuard allowedRole="runner">
        {/* Responsive 2-Column iOS Settings Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Kolom Kiri (PC) / Di Bawah (Mobile): Menu Utama, Preferensi, dan Keamanan 2FA */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            {/* Grup 1: Menu Utama */}
            <IosSettingsGroup header="Menu Utama">
              <IosSettingsRow
                icon={<Ticket className="w-4 h-4" />}
                iconBgColor="bg-brand"
                title="Tiket Lomba Saya"
                subtitle="E-Ticket resmi & QR Race Pack"
                badge={`${tickets.length} Tiket`}
                href="/tickets"
              />
              <IosSettingsRow
                icon={<Sparkles className="w-4 h-4" />}
                iconBgColor="bg-brand"
                title="Smart Distance AI"
                subtitle="Rekomendasi jarak & kesiapan"
                value={
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-stone-100 text-stone-800 border border-stone-200 shadow-2xs">
                      {recommendation ? recommendation.recommendedCategory : "5K"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>
                        {recommendation
                          ? Math.round(recommendation.confidencePercentage)
                          : 98}
                        % Siap
                      </span>
                    </span>
                  </div>
                }
                href="/smart-ai"
              />
              <IosSettingsRow
                icon={<Activity className="w-4 h-4" />}
                iconBgColor="bg-brand"
                title="Riwayat Latihan"
                subtitle="Volume total & sesi terjauh"
                value={
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-brand-50 text-brand border border-brand/20 shadow-2xs">
                      {totalKm} km
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                      Max {longestRunKm} km
                    </span>
                  </div>
                }
                href="/smart-ai"
              />
            </IosSettingsGroup>

            {/* Grup 2: Preferensi & Pengaturan */}
            <IosSettingsGroup header="Preferensi & Pengaturan">
              <IosSettingsRow
                icon={<Bell className="w-4 h-4" />}
                iconBgColor="bg-brand"
                title="Notifikasi Jadwal Lomba"
                subtitle="Pengingat race pack & start gate"
                toggle={{
                  id: "toggle-notify",
                  checked: notifyRaceSchedule,
                  onChange: setNotifyRaceSchedule,
                }}
              />
              <IosSettingsRow
                icon={<ShieldCheck className="w-4 h-4" />}
                iconBgColor="bg-brand"
                title="Kontak Darurat di QR"
                subtitle="Akses medis cepat di race village"
                toggle={{
                  id: "toggle-emergency",
                  checked: showEmergencyOnTicket,
                  onChange: setShowEmergencyOnTicket,
                }}
              />
              <IosSettingsRow
                icon={<Sparkles className="w-4 h-4" />}
                iconBgColor="bg-brand"
                title="Rekomendasi AI Otomatis"
                subtitle="Hitung kesiapan saat pilih event"
                toggle={{
                  id: "toggle-ai",
                  checked: autoRecommendAi,
                  onChange: setAutoRecommendAi,
                }}
              />
              <IosSettingsRow
                icon={<Eye className="w-4 h-4" />}
                iconBgColor="bg-brand"
                title="Profil di Leaderboard"
                subtitle="Tampilkan finish time di publik"
                toggle={{
                  id: "toggle-privacy",
                  checked: publicLeaderboardProfile,
                  onChange: setPublicLeaderboardProfile,
                }}
              />
            </IosSettingsGroup>

            {/* Grup 3: Keamanan & Autentikasi (2FA) */}
            <IosSettingsGroup header="Keamanan & Autentikasi (2FA)">
              <IosSettingsRow
                icon={<Mail className="w-4 h-4" />}
                iconBgColor="bg-brand"
                title="2FA Gmail"
                subtitle="Kirim kode verifikasi OTP ke Gmail akun"
                badge="Beta"
                badgeVariant="beta"
                badgePosition="inline"
                toggle={{
                  id: "toggle-2fa-gmail",
                  checked: twoFactorGmail,
                  onChange: handleToggle2faGmail,
                }}
              />
              <IosSettingsRow
                icon={<KeyRound className="w-4 h-4" />}
                iconBgColor="bg-stone-300"
                title="Google Authenticator (2FA)"
                subtitle="Autentikasi dua langkah kode OTP dinamis"
                badge="Beta"
                badgeVariant="beta"
                badgePosition="inline"
                disabled={true}
                toggle={{
                  id: "toggle-2fa-authenticator",
                  checked: false,
                  onChange: () => {},
                  disabled: true,
                }}
              />
              <IosSettingsRow
                icon={<MessageCircle className="w-4 h-4" />}
                iconBgColor="bg-stone-300"
                title="2FA WhatsApp"
                subtitle="Kirim kode verifikasi OTP via nomor WhatsApp"
                badge="Beta"
                badgeVariant="beta"
                badgePosition="inline"
                disabled={true}
                toggle={{
                  id: "toggle-2fa-whatsapp",
                  checked: false,
                  onChange: () => {},
                  disabled: true,
                }}
              />
            </IosSettingsGroup>
          </div>

          {/* Kolom Kanan (PC) / Di Atas (Mobile): Satu Card Terpadu (Profil Pelari + Seluruh Data Penting 2 Baris/Kolom) */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <RunnerProfileTab />
          </div>
        </div>
      </AuthGuard>
    </Container>
  );
}

export default function RunnerDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
      <Footer />
    </div>
  );
}
