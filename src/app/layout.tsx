import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StrideTix — Platform E-Ticket Event Lari & Smart Distance Recommendation",
  description:
    "Temukan event lari impian, beli tiket dengan aman, dan dapatkan rekomendasi kategori jarak lari (5K, 10K, Half Marathon, Full Marathon) berdasarkan analisis aktivitas Strava Anda.",
};

import { AppProviders } from "@/components/providers/AppProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen flex flex-col bg-surface-main text-espresso antialiased pb-14">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
