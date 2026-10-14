import React from "react";
import { Activity, ShieldAlert, Cpu, Sparkles, CheckCircle2 } from "lucide-react";

export function SmartRecommendationExplainer() {
  return (
    <section id="recommendation-info" className="py-16 sm:py-20 bg-surface-soft border-y border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-accent-ai/10 text-accent-ai border border-accent-ai/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fitur Unggulan StrideTix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-espresso">
            Smart Distance Recommendation
          </h2>
          <p className="text-sm sm:text-base text-espresso-secondary">
            Bukan sekadar tebak-tebakan. Kami menghubungkan riwayat lari mingguan Anda dari Strava ke mesin kalkulasi deterministik untuk merekomendasikan jarak lomba yang paling aman dan terukur.
          </p>
        </div>

        {/* 3 Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-card p-6 border border-sand-border shadow-warm space-y-3 relative">
            <div className="w-12 h-12 rounded-btn bg-accent-strava/10 text-accent-strava flex items-center justify-center font-extrabold text-xl">
              1
            </div>
            <h3 className="text-lg font-bold text-espresso">
              1. Sinkronisasi Data Strava
            </h3>
            <p className="text-xs text-espresso-secondary leading-relaxed">
              Sistem mengambil data aktivitas lari (*distance*, *longest run*, *weekly frequency*, dan *pace*) secara aman melalui OAuth 2.0.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-card p-6 border border-sand-border shadow-warm space-y-3 relative">
            <div className="w-12 h-12 rounded-btn bg-brand-50 text-brand flex items-center justify-center font-extrabold text-xl">
              2
            </div>
            <h3 className="text-lg font-bold text-espresso">
              2. Rule-Based Scoring Engine
            </h3>
            <p className="text-xs text-espresso-secondary leading-relaxed">
              Algoritma deterministik mencocokkan riwayat latihan Anda dengan standar kesiapan kategori 5K, 10K, Half Marathon, atau Full Marathon.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-card p-6 border border-sand-border shadow-warm space-y-3 relative">
            <div className="w-12 h-12 rounded-btn bg-accent-ai/10 text-accent-ai flex items-center justify-center font-extrabold text-xl">
              3
            </div>
            <h3 className="text-lg font-bold text-espresso">
              3. Rekomendasi & Safety Alert
            </h3>
            <p className="text-xs text-espresso-secondary leading-relaxed">
              Tiket yang direkomendasikan ditandai lencana khusus. Jika memilih jarak berisiko, sistem menampilkan peringatan keselamatan (*Safety Warning*).
            </p>
          </div>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="bg-accent-warning-bg rounded-card p-5 border border-accent-warning-border flex items-start gap-3.5 max-w-3xl mx-auto shadow-sm">
          <ShieldAlert className="w-5 h-5 text-accent-warning shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-accent-warning">
              Komitmen Keselamatan Lari (Non-Medical Disclaimer)
            </h4>
            <p className="text-espresso-secondary leading-relaxed">
              Sistem rekomendasi StrideTix dirancang murni untuk membantu edukasi perencanaan jarak berdasarkan volume latihan. Sistem ini tidak memberikan diagnosis medis fisik. Pelari tetap memegang kendali penuh atas keputusan pendaftarannya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
