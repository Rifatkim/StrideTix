# Implementation Plan: Integrasi Foto Event Lari pada Hero Landing Page (hero-landingpage.jpg)

## Overview
Menampilkan foto event lari perkotaan asli (`hero-landingpage.jpg`) sebagai visual utama pada kolom kanan hero landing page publik StrideTix. Layout dua kolom desktop (52-55% teks di kiri, 45-48% foto di kanan) dirancang seimbang sehingga pengunjung langsung mengenali konteks event lari StrideTix tanpa mengurangi keterbacaan headline. Komposisi diperkuat dengan 2 floating preview cards fungsional (Recommended Distance & Race Match) serta aksen lintasan rute tipis.

---

## Architecture Decisions
1. **Foto Event Utama (`hero-landingpage.jpg`):**
   - Disimpan di `public/images/hero-landingpage.jpg`.
   - Menggunakan Next.js `<Image priority fill ...>` dengan `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 45vw"`.
   - Aspect ratio 4:3 (`aspect-[4/3]`) dengan `object-fit: cover` dan titik fokus crop pada lintasan peserta di tengah (`object-[50%_40%]`).
   - Radius 28px (`rounded-[28px]`), border halus `#E8DDD0`, dan bayangan hangat `shadow-[0_20px_50px_rgba(43,30,22,0.12)]`.
   - Gradient transparan di sisi kiri foto (`from-[#FFF8EE]/50 via-transparent to-transparent`) untuk menyatukan tepi foto dengan background hero.
   - Peningkatan visual halus: kontras dan saturasi optimal (`contrast-[1.03] saturate-[1.05]`).
   - Alt text objektif: `Peserta event lari memenuhi lintasan jalan di kawasan perkotaan.`

2. **Dua Floating Product Cards:**
   - **Card 1 (Smart Recommendation):**
     - Posisi: Melayang di kiri atas foto (`-top-4 -left-4 sm:-left-6 z-20`).
     - Label: `Recommended Distance`
     - Nilai utama: `10K`
     - Keterangan: `Berdasarkan aktivitas latihan`
     - Ikon: `Activity` / `Sparkles` dengan warna Race Orange.
     - Background putih, border `#E8DDD0`, radius 18px (`rounded-2xl`), shadow lembut.
   - **Card 2 (Event Match):**
     - Posisi: Melayang di kanan bawah foto (`-bottom-5 -right-3 sm:-right-6 z-20`).
     - Label: `Race Match`
     - Nilai utama: `Jakarta 10K`
     - Badge: `Cocok untuk Anda` (Race Orange / soft orange badge).
     - Ikon: `Ticket` / `MapPin`.
     - Background putih, border `#E8DDD0`, radius 18px (`rounded-2xl`), shadow lembut.

3. **Elemen Aksen Visual Pendukung:**
   - Lingkaran ambient glow transparan di belakang foto.
   - Garis rute tipis melengkung Race Orange dengan penanda start/finish kecil.
   - Pattern titik sangat samar (opasitas 6-8%).
   - Tanpa emoji, efek neon, atau animasi tak henti.

4. **Keseimbangan Komposisi & Responsivitas:**
   - Kolom kiri: Eyebrow pill, Headline, Deskripsi, 2 CTA buttons, 3 Trust points.
   - Kolom kanan: Foto + 2 floating cards.
   - Desktop & Laptop: 2 kolom berdampingan.
   - Tablet & Mobile: 1 kolom responsif (teks & CTA di atas, foto di bawah, floating card tertata rapi tanpa horizontal overflow).

---

## Tasks
- [ ] Task 1: Verifikasi aset gambar di `public/images/hero-landingpage.jpg`
- [ ] Task 2: Implementasi `HeroProductPreview.tsx` dengan foto event lari dan 2 floating cards
- [ ] Task 3: Penyesuaian layout dan grid di `HeroSection.tsx`
- [ ] Task 4: Verifikasi kompilasi TypeScript dan visual audit multi-resolusi
