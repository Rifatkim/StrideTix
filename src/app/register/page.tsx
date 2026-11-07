import React from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthShowcaseLayout } from "@/components/auth/AuthShowcaseLayout";

export const metadata = {
  title: "Daftar Akun Baru | StrideTix",
  description: "Daftar akun pelari atau penyelenggara (EO) di platform StrideTix.",
};

export default function RegisterPage() {
  return (
    <AuthShowcaseLayout
      type="register"
      title="Buat Akun Baru"
      subtitle="Pilih jenis akun dan lengkapi data untuk mulai mendaftar tiket event lomba lari."
      heroImage="/images/events/city-marathon.jpg"
      heroHeadline="Mulai Target Lomba & Rekomendasi Jarak Anda."
      heroSubheadline="Bergabunglah dengan ribuan pelari dan event organizer terpercaya di seluruh Indonesia. Amankan slot race resmi dan nikmati pendampingan lari pintar."
    >
      <React.Suspense fallback={<div className="text-center text-xs text-espresso-muted py-8">Memuat formulir pendaftaran...</div>}>
        <RegisterForm />
      </React.Suspense>
    </AuthShowcaseLayout>
  );
}
