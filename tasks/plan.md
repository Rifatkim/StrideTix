# StrideTix: Full End-to-End UI Architecture & Implementation Plan

## 1. Executive Overview
Dokumen ini merupakan perencanaan arsitektur antarmuka pengguna (**UI/UX**) secara menyeluruh (*End-to-End*) untuk sistem **StrideTix** sesuai dengan spesifikasi kebutuhan produk pada [`PRD.md`](file:///d:/eticket/PRD.md), standar sistem desain pada [`DESIGN.md`](file:///d:/eticket/DESIGN.md), tech stack pada [`techstack.md`](file:///d:/eticket/techstack.md), dan panduan kode pada [`AGENTS.md`](file:///d:/eticket/AGENTS.md).

Platform ini melayani **3 peran utama pengguna**:
1. **Runner / Public User**: Eksplorasi event, analisis Strava & Smart Distance Recommendation, alur registrasi & login, pemesanan tiket, e-ticket QR Code, portal *Runner Dashboard*, dan *AI Running Assistant*.
2. **Event Organizer**: Portal manajemen event, pembuatan & pengeditan lomba/kategori, pengelolaan daftar peserta, ringkasan analitik penjualan, dan terminal scanner *Gate Check-in QR*.
3. **Administrator**: Portal pengawasan sistem, verifikasi kredensial organizer, moderasi publikasi event, dan audit transaksi tiket.

---

## 2. Arsitektur Modul UI & Sitemaps

```
StrideTix UI Architecture
├── 1. Public & Runner Experience
│   ├── / (Homepage / Event Discovery, Filter, & Feature Explainer)
│   ├── /events/[id] (Event Detail, Category Selector, Smart Recommendation, Safety Modal)
│   ├── /checkout (3-Step Checkout: Data Peserta -> Review/Bayar -> Terbit Tiket)
│   ├── /tickets/[ticketCode] (E-Ticket Digital Resmi + QR Code Generator)
│   ├── /auth/login & /auth/register (Autentikasi Multi-role)
│   ├── /dashboard (Runner Portal: Tiket Saya, Metrik Strava, Riwayat Rekomendasi)
│   └── Floating Chatbot (AI Running Assistant dengan Safety Guardrails)
│
├── 2. Event Organizer Experience
│   ├── /organizer/dashboard (Statistik Penjualan, Kuota, & Ringkasan Event)
│   ├── /organizer/events/new (Form Pembuatan Event, Multi-kategori 5K/10K/HM/FM, Rute)
│   ├── /organizer/events/[id]/participants (Tabel Peserta, Filter BIB, Status Check-in)
│   └── /organizer/check-in (Terminal Scanner QR Camera & Manual Input Anti-Ganda)
│
└── 3. Administrator Experience
    ├── /admin/dashboard (Metrik Platform, Volume Transaksi, Status Sistem)
    ├── /admin/organizers (Verifikasi Dokumen & Persetujuan Akun Organizer)
    ├── /admin/events (Moderasi & Approval Publikasi Event)
    └── /admin/transactions (Monitoring Transaksi & Audit Log)
```

---

## 3. Prinsip Desain & Rekayasa (Architecture Decisions)

1. **Strict Separation of Concerns (Service & In-Memory Store):**
   - Seluruh modul data (Auth, Event, Registrasi, Tiket, Verifikasi Organizer, Audit) menggunakan abstraksi *service* di `src/services/` dengan dukungan *mock store* reaktif yang tersinkronisasi via `localStorage` sehingga seluruh interaksi demo tersimpan stabil saat browser direfresh.
   - Siap 100% dialihkan ke Supabase PostgreSQL tanpa mengubah komponen UI satu baris pun.

2. **Kepatuhan Desain Mutlak (DESIGN.md):**
   - Brand utama: **Race Orange** (`#C2410C`), teks utama **Espresso** (`#241C17`), background **Warm White** (`#FFFCF8`) & **Soft Cream** (`#FFF8EE`), AI Accent **Electric Purple** (`#7C3AED`).
   - Font: **Plus Jakarta Sans** (Weights: 400, 500, 600, 700, 800).
   - Radius komponen: Button & Input 12px, Card 18px, Ticket & Modal 20-24px.
   - Shadow bernuansa cokelat hangat (`rgba(58, 39, 24, 0.08)` s/d `0.14`).

3. **Modularitas Ketat (AGENTS.md):**
   - **Batas Maksimal 500 Baris per File:** Tidak ada file yang mendekati 500 baris. Komponen besar selalu dipecah menjadi sub-komponen terisolasi di dalam `src/components/[domain]/`.

4. **Safety & Non-Medical Guardrails (PRD.md):**
   - Rekomendasi kategori dan AI Chatbot selalu menyertakan disclaimer non-medis.
   - Pemilihan kategori di atas kesiapan fisik pelari wajib memunculkan *Safety Warning Dialog* dengan persetujuan eksplisit pengguna.

---

## 4. Pembagian Fase Pengerjaan (Vertical Slices)

### Slice A: Authentication & User State (Runner, Organizer, Admin)
- Halaman Login & Registrasi dengan opsi pemilihan peran demo (Runner / Organizer / Admin) untuk navigasi instan.
- Navbar dinamis yang merender status login, avatar, dan tautan dashboard sesuai peran aktif.

### Slice B: Runner Portal / User Dashboard (`/dashboard`)
- Tab 1: **Tiket Aktif & Riwayat Lomba** (Kartu tiket digital dengan tombol modal QR dan cetak PDF).
- Tab 2: **Analisis Strava & Rekomendasi Jarak** (Grafik volume mingguan, breakdown indikator latihan, riwayat kalkulasi).
- Tab 3: **Profil Pelari** (Data kontak darurat, golongan darah, nomor dada favorit).

### Slice C: Organizer Management Portal (`/organizer`)
- Dashboard analitik ringkasan kuota, total pendaftar, dan pendapatan kotor.
- Form pembuatan event baru (Informasi umum, tanggal, kuota, harga, rute, regulasi).
- Tabel daftar peserta event lengkap dengan status pembayaran, nomor BIB, dan status check-in.
- Scanner check-in QR interaktif (kamera / manual) dengan feedback audio/visual anti-duplikasi.

### Slice D: Administrator Moderation Portal (`/admin`)
- Dashboard metrik platform (total pelari, organizer aktif, total event).
- Portal verifikasi organizer (Approve / Reject dengan input catatan revisi).
- Portal moderasi event (Meninjau event draft sebelum tayang di beranda publik).
- Tabel audit transaksi dan pemantauan aktivitas sistem.

### Slice E: UI Polish, Micro-interactions & Responsiveness
- Animasi transisi halus (modal zoom, drawer slide, toast notifications).
- Optimasi tampilan layar mobile (touch targets $\ge 44 \times 44$px, bottom sheets).
- Verifikasi komprehensif seluruh alur dari pendaftaran lomba hingga moderasi admin.

---

## 5. Matriks Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
| :--- | :--- | :--- |
| **Komponen Dashboard Terlalu Padat** | Melanggar batas 500 baris kode | Pisahkan tabel, kartu statistik, dan modal ke sub-komponen terpisah (`StatCards.tsx`, `EventTable.tsx`, `ParticipantList.tsx`). |
| **Peralihan Peran Rumit untuk Demo** | Penguji kesulitan beralih antar role | Sediakan *Demo Role Switcher* cepat di header atau floating bar (Runner $\leftrightarrow$ Organizer $\leftrightarrow$ Admin). |
| **State Reset saat Navigasi** | Pengalaman demo terganggu | Simpan data event baru, permohonan organizer, dan tiket di `localStorage` dengan fallback seed data. |
| **Kesesuaian Desain Antar Portal** | Tampilan admin/organizer terlihat kaku seperti template generik | Gunakan token desain yang sama (Race Orange, warm cream zebra-rows, Plus Jakarta Sans, dan border sand). |
