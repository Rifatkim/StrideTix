import React from "react";
import Link from "next/link";
import { Ticket, Heart, ShieldAlert } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-espresso text-surface-main pt-14 pb-10 border-t border-sand-border-strong/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-btn bg-brand flex items-center justify-center text-white">
                <Ticket className="w-5 h-5 -rotate-12 transform" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Stride<span className="text-brand-400">Tix</span>
              </span>
            </Link>
            <p className="text-espresso-muted text-sm max-w-sm leading-relaxed">
              Platform e-ticket lomba lari dengan fitur Smart Distance Recommendation yang menganalisis latihan Strava Anda untuk pemilihan kategori jarak lomba yang tepat dan aman.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-300 bg-brand-900/40 border border-brand-800/60 rounded-btn p-3 max-w-md">
              <ShieldAlert className="w-4 h-4 shrink-0 text-brand-400" />
              <span>
                <strong>Catatan Keselamatan:</strong> Rekomendasi sistem bersifat edukasi latihan non-medis. Selalu dengarkan sinyal tubuh Anda.
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white/90">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-espresso-muted">
              <li>
                <Link href="/" className="hover:text-brand-300 transition-colors">
                  Cari Event Lari
                </Link>
              </li>
              <li>
                <Link href="/#recommendation-info" className="hover:text-brand-300 transition-colors">
                  Smart Distance AI
                </Link>
              </li>
              <li>
                <Link href="/organizer/check-in" className="hover:text-brand-300 transition-colors">
                  Portal Organizer Check-in
                </Link>
              </li>
            </ul>
          </div>

          {/* Distance Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-white/90">
              Kategori Jarak
            </h4>
            <ul className="space-y-2 text-sm text-espresso-muted">
              <li>5K Fun Run</li>
              <li>10K City Race</li>
              <li>Half Marathon (21.1K)</li>
              <li>Full Marathon (42.2K)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-espresso-muted gap-4">
          <p>© {new Date().getFullYear()} StrideTix. Every Stride Leads to a Race.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-brand fill-brand" />
            <span>untuk Komunitas Pelari Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
