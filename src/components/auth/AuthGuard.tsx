"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";
import {
  Lock,
  ShieldAlert,
  LogIn,
  User,
  Users,
  Shield,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface AuthGuardProps {
  allowedRole: UserRole;
  children: React.ReactNode;
}

const ROLE_INFO: Record<
  UserRole,
  { label: string; icon: any; title: string; desc: string }
> = {
  runner: {
    label: "Pelari (Runner)",
    icon: User,
    title: "Portal Peserta Lomba Lari",
    desc: "Akses tiket aktif, riwayat latihan Strava, dan profil kontak darurat Anda.",
  },
  organizer: {
    label: "Penyelenggara (Organizer)",
    icon: Users,
    title: "Portal Manajemen Penyelenggara Lomba",
    desc: "Kelola kuota pendaftaran event, buat lomba baru, dan operasikan gate check-in.",
  },
  admin: {
    label: "Administrator",
    icon: Shield,
    title: "Panel Kontrol Tata Kelola Platform",
    desc: "Akses terbatas untuk moderasi event, verifikasi kelayakan EO, dan audit transaksi.",
  },
};

export function AuthGuard({ allowedRole, children }: AuthGuardProps) {
  const router = useRouter();
  const { currentUser, role, logout } = useAuth();
  const [isMounting, setIsMounting] = useState(true);

  useEffect(() => {
    setIsMounting(false);
  }, []);

  if (isMounting) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
      </div>
    );
  }

  const roleInfo = ROLE_INFO[allowedRole];

  // Case 1: Belum login sama sekali (Guest)
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-modal border border-sand-border shadow-warm-modal text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-brand-50 text-brand flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand bg-brand-50 px-2.5 py-0.5 rounded-full">
            Autentikasi Diperlukan
          </span>
          <h2 className="text-xl font-black text-espresso mt-2">
            {roleInfo.title}
          </h2>
          <p className="text-xs text-espresso-secondary">
            {roleInfo.desc} Silakan masuk terlebih dahulu menggunakan akun terdaftar.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <Link
            href="/login"
            className="w-full py-2.5 px-4 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Akun ({roleInfo.label})</span>
          </Link>

          <Link
            href="/register"
            className="w-full py-2.5 px-4 rounded-btn bg-sand-warm border border-sand-border text-espresso font-semibold text-xs hover:border-brand transition-colors flex items-center justify-center gap-2"
          >
            <span>Belum Punya Akun? Daftar Baru</span>
          </Link>
        </div>

        <div className="pt-2 border-t border-sand-border">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-espresso-muted hover:text-espresso font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>
      </div>
    );
  }

  // Case 2: Logged in, but wrong role (e.g. Runner viewing Admin)
  if (role !== allowedRole) {
    const currentRoleInfo = ROLE_INFO[role || "runner"];

    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-modal border border-amber-300 shadow-warm-modal text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
            Peran Akun Berbeda
          </span>
          <h2 className="text-xl font-black text-espresso mt-2">
            Hak Akses {roleInfo.label}
          </h2>
          <p className="text-xs text-espresso-secondary">
            Anda sedang masuk sebagai <strong>{currentUser.name}</strong> dengan peran{" "}
            <strong>{currentRoleInfo.label}</strong>. Halaman ini hanya dapat diakses oleh akun{" "}
            <strong>{roleInfo.label}</strong>.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            type="button"
            onClick={() => {
              if (role === "runner") router.push("/dashboard");
              else if (role === "organizer") router.push("/organizer/dashboard");
              else if (role === "admin") router.push("/admin/dashboard");
              else router.push("/");
            }}
            className="w-full py-2.5 px-4 rounded-btn bg-brand text-white font-bold text-xs shadow-warm hover:bg-brand-800 transition-colors"
          >
            Menuju Dashboard Saya ({currentRoleInfo.label})
          </button>

          <button
            type="button"
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-full py-2.5 px-4 rounded-btn bg-sand-warm border border-sand-border text-espresso font-semibold text-xs hover:border-brand transition-colors"
          >
            Keluar & Masuk dengan Akun Lain
          </button>
        </div>
      </div>
    );
  }

  // Case 3: Role is correct
  return <>{children}</>;
}
