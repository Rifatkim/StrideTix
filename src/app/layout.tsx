import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFCF8" },
    { media: "(prefers-color-scheme: dark)", color: "#241C17" },
  ],
};

export const metadata: Metadata = {
  title: "StrideTix: Platform E-Ticket Event Lari & Rekomendasi Jarak",
  description:
    "Cari event lari resmi, beli tiket lomba, dan dapatkan rekomendasi kategori jarak lari berdasarkan analisis riwayat latihan Anda.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/brand/stridetix-symbol.svg",
  },
};

import { AppProviders } from "@/components/providers/AppProviders";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="min-h-screen flex flex-col bg-surface-main text-espresso antialiased">
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
