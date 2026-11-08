import React from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AuthShowcaseLayout } from "@/components/auth/AuthShowcaseLayout";

export const metadata = {
  title: "Masuk ke Akun | StrideTix",
  description: "Masuk ke platform e-ticket lomba lari dan Smart Distance Recommendation StrideTix.",
};

export default function LoginPage() {
  return (
    <AuthShowcaseLayout
      type="login"
      title="Selamat Datang Kembali"
      subtitle="Masuk untuk mengakses tiket lomba aktif, rekomendasi jarak, dan konsultasi asisten lari Anda."
    >
      <React.Suspense fallback={<div className="text-center text-xs text-espresso-muted py-8">Memuat formulir masuk...</div>}>
        <LoginForm />
      </React.Suspense>
    </AuthShowcaseLayout>
  );
}
