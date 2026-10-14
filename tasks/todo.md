# Task List: StrideTix End-to-End UI Implementation

## Previous Foundation & Core Ticketing (Completed)
- [x] Phase 1: Foundation & Design System Setup (Tasks 1–3)
- [x] Phase 2: Mock Data Store & Pure Scoring Engine (Tasks 4–5)
- [x] Phase 3: Vertical Slice 1 — Event Discovery & Detail Page (Tasks 6–8)
- [x] Phase 4: Vertical Slice 2 — Strava Simulator & Recommendation (Tasks 9–11)
- [x] Phase 5: Vertical Slice 3 — Checkout, QR E-Ticket & Check-in Simulator (Tasks 12–15)

---

## Phase A: Multi-Role Authentication & Session State

### Task 16: Setup Multi-Role Authentication State & Mock Service
**Description:** Membangun lapisan data sesi pengguna multi-role (`runner`, `organizer`, `admin`) di `src/services/authService.ts` dan `src/context/AuthContext.tsx` yang menyimpan state pengguna aktif, histori login, dan izin akses dashboard berbasis role sesuai PRD FR-AUTH-01 s/d FR-AUTH-07.
**Acceptance criteria:**
- [x] Definisi tipe `UserRole` ("runner" | "organizer" | "admin") dan `AuthUser`.
- [x] Service `authService.ts` menyediakan helper async: `login(email, password, role)`, `register(data)`, `logout()`, `getCurrentUser()`.
- [x] `AuthContext` menyediakan akses global `currentUser`, `role`, `login()`, `logout()`, dan opsi *Quick Switch Role* untuk mempermudah demonstrasi pengujian.
**Verification:**
- [x] `npx tsc --noEmit` bersih tanpa error.
- [x] Mengubah role aktif memperbarui status sesi secara reaktif.
**Dependencies:** Task 3
**Files likely touched:**
- `src/types/auth.ts`
- `src/services/authService.ts`
- `src/context/AuthContext.tsx`
- `src/components/providers/AppProviders.tsx`
**Estimated scope:** Medium (4 files)

---

### Task 17: Build Login and Registration Pages
**Description:** Membangun halaman antarmuka masuk (`src/app/auth/login/page.tsx`) dan pendaftaran (`src/app/auth/register/page.tsx`) dengan desain hangat berkarakter StrideTix (Brand Race Orange + Espresso), tab seleksi peran (*Runner* / *Organizer*), dan validasi input formulir sesuai PRD US-01 & US-02.
**Acceptance criteria:**
- [x] Halaman login dengan input email, password, tombol masuk, dan tombol cepat *"Login sebagai Demo Runner / Organizer / Admin"*.
- [x] Halaman registrasi dengan input nama, email, password, konfirmasi password, dan pilihan jenis akun (Pelari / Penyelenggara Event).
- [x] Feedback visual yang jelas saat registrasi/login berhasil dan redirect otomatis ke dashboard yang sesuai peran.
**Verification:**
- [x] Buka `/auth/login` dan `/auth/register` di browser, uji login demo runner $\rightarrow$ diarahkan ke `/dashboard`.
**Dependencies:** Task 16
**Files likely touched:**
- `src/app/auth/login/page.tsx`
- `src/app/auth/register/page.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
**Estimated scope:** Medium (4 files)

---

### Task 18: Update Navbar with Dynamic Auth State & Role Links
**Description:** Memperbarui komponen navigasi atas (`src/components/layout/Navbar.tsx`) agar secara dinamis menampilkan avatar pengguna, lencana peran (*Runner*, *Organizer*, *Admin*), tautan portal sesuai peran, dan menu dropdown *Logout*.
**Acceptance criteria:**
- [x] Jika belum login: Menampilkan tombol "Masuk" dan "Daftar".
- [x] Jika login sebagai Runner: Menampilkan tautan ke "Tiket Saya" & "Dashboard Pelari".
- [x] Jika login sebagai Organizer: Menampilkan tautan ke "Portal Organizer" & "Check-in Gate".
- [x] Jika login sebagai Admin: Menampilkan tautan ke "Panel Admin" & "Moderasi Event".
**Verification:**
- [x] Navigasi atas berubah secara reaktif saat login sebagai Runner vs Organizer vs Admin.
**Dependencies:** Task 16, Task 17
**Files likely touched:**
- `src/components/layout/Navbar.tsx`
- `src/components/layout/UserNavDropdown.tsx`
**Estimated scope:** Small (2 files)

---

## Checkpoint A: Authentication Verification
- [x] Alur masuk dan pendaftaran multi-role berjalan lancar.
- [x] Navbar mencerminkan hak akses peran pengguna aktif.

---

## Phase B: Runner Portal / User Dashboard (`/dashboard`)

### Task 19: Build Runner Dashboard Shell & Overview
**Description:** Membangun tata letak halaman dashboard pelari (`src/app/dashboard/page.tsx`) lengkap dengan ringkasan metrik pelari (Total Event Diikuti, Jarak Tempuh Akumulatif, Kategori Rekomendasi Aktif) dan navigasi tab: *Tiket Saya*, *Analisis Strava*, dan *Profil Akun*.
**Acceptance criteria:**
- [x] Header profil pelari dengan foto avatar, nama, kota, dan status koneksi Strava aktif.
- [x] Ringkasan statistik cepat (*quick metric cards*) berdesain warm card.
- [x] Tab selector responsif (*Tiket Saya*, *Analisis Strava*, *Data Profil*).
**Verification:**
- [x] Buka `/dashboard`, periksa tata letak desktop dan mobile (viewport < 768px). Status 200 OK.
**Dependencies:** Task 18
**Files likely touched:**
- `src/app/dashboard/page.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
**Estimated scope:** Small (2 files)

---

### Task 20: Build "Tiket Saya" Active & Past Tickets Tab
**Description:** Membangun tab daftar tiket peserta (`src/components/dashboard/MyTicketsTab.tsx`) yang menampilkan seluruh tiket aktif dan tiket lomba yang telah selesai, dilengkapi tombol cepat buka modal QR Code dan opsi unduh/cetak tiket fisik.
**Acceptance criteria:**
- [x] Menampilkan kartu tiket aktif dengan nama event, kategori jarak, nomor BIB, dan tanggal flag-off.
- [x] Tombol "Tampilkan QR Code" yang membuka dialog modal QR E-Ticket instan tanpa harus pindah halaman.
- [x] Tombol "Lihat E-Ticket Lengkap" yang membuka `/tickets/[ticketCode]`.
- [x] Menampilkan *empty state* yang ramah jika pelari belum memiliki tiket beserta ajakan menjelajahi event.
**Verification:**
- [x] Klik "Tampilkan QR Code" pada tiket aktif memunculkan modal QR dengan payload valid.
**Dependencies:** Task 19, Task 13
**Files likely touched:**
- `src/components/dashboard/MyTicketsTab.tsx`
- `src/components/dashboard/TicketQRModal.tsx`
**Estimated scope:** Small (2 files)

---

### Task 21: Build "Analisis Strava & Rekomendasi" Tab
**Description:** Membangun tab analisis kebugaran pelari (`src/components/dashboard/StravaAnalyticsTab.tsx`) yang memvisualisasikan ringkasan volume mingguan, grafik long run, konsistensi latihan, serta riwayat kartu rekomendasi kategori lari personal sesuai PRD FR-STR-06 & US-06.
**Acceptance criteria:**
- [x] Menampilkan status koneksi Strava terakhir beserta tombol "Sinkronkan Ulang".
- [x] Breakdown indikator numerik: Rata-rata jarak (km), Long Run terpanjang, Frekuensi mingguan, dan Pace rata-rata.
- [x] Kartu penjelasan hasil Smart Distance Recommendation lengkap dengan confidence progress bar.
- [x] Tombol "Putus Akses Strava" sesuai prinsip privasi PRD Bagian 16.4.
**Verification:**
- [x] Mengganti profil di Strava Simulator Bar memperbarui metrik dan grafik di tab ini secara instan.
**Dependencies:** Task 19, Task 10
**Files likely touched:**
- `src/components/dashboard/StravaAnalyticsTab.tsx`
- `src/components/dashboard/WeeklyMileageChart.tsx`
**Estimated scope:** Small (2 files)

---

### Task 22: Build "Profil & Emergency Contacts" Tab
**Description:** Membangun tab data diri pelari (`src/components/dashboard/RunnerProfileTab.tsx`) untuk mengelola kontak darurat, golongan darah, nomor dada favorit, serta riwayat persetujuan safety warning sesuai PRD FR-AUTH-04.
**Acceptance criteria:**
- [x] Form edit identitas dasar, nomor telepon WhatsApp, dan alamat domisili.
- [x] Pengelolaan kontak darurat (Nama kontak, hubungan, nomor telepon).
- [x] Tombol simpan perubahan profil dengan toast notifikasi sukses.
**Verification:**
- [x] Mengubah nomor kontak darurat dan menyimpan berhasil memperbarui data di context/storage.
**Dependencies:** Task 19
**Files likely touched:**
- `src/components/dashboard/RunnerProfileTab.tsx`
**Estimated scope:** Small (1 file)

---

## Checkpoint B: Runner Portal Verification
- [x] Seluruh fungsi dashboard pelari (tiket, QR modal, metrik Strava, profil) terintegrasi mulus.
- [x] Kode tetap modular dan di bawah 500 baris per file.

---

## Phase C: Event Organizer Experience (`/organizer`)

### Task 23: Build Organizer Dashboard Overview & Managed Events
**Description:** Membangun halaman beranda portal organizer (`src/app/organizer/dashboard/page.tsx`) yang menampilkan metrik agregat penjualan tiket (Total Tiket Terjual, Total Pendapatan Kotor, Sisa Kuota, Peserta Sudah Check-in) serta daftar event yang dikelola organizer tersebut sesuai PRD US-11 & FR-ORG-06.
**Acceptance criteria:**
- [x] Kartu metrik analitik penjualan dengan indikator tren dan persentase kuota terisi.
- [x] Tabel/daftar event yang dikelola dengan badge status (*Active*, *Draft*, *Completed*).
- [x] Tombol aksi cepat pada setiap event: "Kelola Peserta", "Buka Gate Check-in", "Edit Event".
- [x] Tombol utama "+ Buat Event Lari Baru".
**Verification:**
- [x] Buka `/organizer/dashboard`, pastikan event yang dikelola tampil dengan data kuota dan pendapatan yang akurat. Status 200 OK.
**Dependencies:** Task 18, Task 4
**Files likely touched:**
- `src/app/organizer/dashboard/page.tsx`
- `src/components/organizer/OrganizerStatCards.tsx`
- `src/components/organizer/ManagedEventsList.tsx`
**Estimated scope:** Medium (3 files)

---

### Task 24: Build Event Creation Multi-Step Form
**Description:** Membangun form pembuatan event lari baru (`src/app/organizer/events/new/page.tsx`) dengan pembagian seksi terstruktur: Informasi Umum (Nama, Tanggal, Lokasi, Banner URL), Konfigurasi Multi-Kategori Tiket (5K, 10K, HM, FM, Harga IDR, Kuota Peserta), serta Rute & Regulasi Lomba sesuai PRD US-11 & US-12.
**Acceptance criteria:**
- [x] Form input informasi umum event lengkap dengan preview gambar banner.
- [x] Dynamic category builder: Organizer dapat menambah dan menghapus kategori (5K, 10K, HM, FM) serta menentukan harga dan kuota masing-masing.
- [x] Opsi tombol "Simpan sebagai Draft" atau "Kirim untuk Moderasi Admin".
- [x] Event baru otomatis tersimpan di state event lokal dan muncul di daftar event.
**Verification:**
- [x] Buat event baru melalui form, submit $\rightarrow$ event baru terdaftar di dashboard organizer dan beranda. Status 200 OK.
**Dependencies:** Task 23
**Files likely touched:**
- `src/app/organizer/events/new/page.tsx`
- `src/components/organizer/EventCreateForm.tsx`
- `src/components/organizer/CategoryFormBuilder.tsx`
**Estimated scope:** Medium (3 files)

---

### Task 25: Build Event Participants Management Table
**Description:** Membangun halaman pengelolaan peserta untuk suatu event (`src/app/organizer/events/[id]/participants/page.tsx`) yang menampilkan tabel peserta terdaftar, nomor BIB, kategori jarak, status pembayaran, dan status check-in gate sesuai PRD US-13 & FR-ORG-05.
**Acceptance criteria:**
- [x] Tabel peserta komprehensif: Nama, Email, Kategori Lari, Nomor BIB, Status Tiket, Waktu Check-in.
- [x] Fitur pencarian instan berdasarkan nama peserta atau nomor BIB.
- [x] Filter berdasarkan kategori jarak (5K/10K/HM/FM) dan status check-in (Belum Check-in / Sudah Check-in).
- [x] Tombol manual "Check-in Peserta" langsung dari tabel baris.
**Verification:**
- [x] Buka `/organizer/events/evt-jkt-marathon-2026/participants`, lakukan pencarian BIB atau filter kategori. Status 200 OK.
**Dependencies:** Task 23, Task 12
**Files likely touched:**
- `src/app/organizer/events/[id]/participants/page.tsx`
- `src/components/organizer/ParticipantsTable.tsx`
- `src/components/organizer/ParticipantsFilterBar.tsx`
**Estimated scope:** Medium (3 files)

---

## Checkpoint C: Organizer Portal Verification
- [x] Organizer dashboard, form pembuatan lomba, dan tabel peserta bekerja secara end-to-end.
- [x] Check-in gate terminal terhubung sinkron dengan tabel peserta.

---

## Phase D: Administrator Experience (`/admin`)

### Task 26: Build Admin Dashboard Overview & Platform Health
**Description:** Membangun halaman pengawasan administrator (`src/app/admin/dashboard/page.tsx`) yang menyajikan metrik kesehatan platform StrideTix: Total Pengguna Terdaftar, Total Organizer, Total Event Terbit, Volume Transaksi Tiket (IDR), dan log aktivitas audit terkini sesuai PRD FR-ADM-01 s/d 07.
**Acceptance criteria:**
- [x] Kartu metrik platform tingkat tinggi (*Platform KPI Cards*).
- [x] Panel ringkasan permohonan verifikasi organizer yang menunggu peninjauan.
- [x] Panel ringkasan event lomba yang menunggu persetujuan publikasi.
- [x] Navigasi header/tab admin yang rapi (Overview, Verifikasi EO, Moderasi Event, Transaksi).
**Verification:**
- [x] Buka `/admin/dashboard`, pastikan kartu metrik platform dan daftar tugas admin termuat rapi. Status 200 OK.
**Dependencies:** Task 18
**Files likely touched:**
- `src/app/admin/dashboard/page.tsx`
- `src/components/admin/AdminHeader.tsx`
- `src/components/admin/AdminStatCards.tsx`
**Estimated scope:** Medium (3 files)

---

### Task 27: Build Organizer Verification Portal
**Description:** Membangun portal verifikasi penyelenggara lomba (`src/app/admin/organizers/page.tsx`) di mana admin dapat meninjau profil EO, dokumen legalitas/identitas komunitas, serta menyetujui (*Approve*) atau menolak (*Reject*) permohonan dengan catatan alasan sesuai PRD US-14 & FR-ADM-02.
**Acceptance criteria:**
- [x] Daftar kartu permohonan EO: Nama EO, Penanggung Jawab, Kontak, Portofolio Event, Dokumen Pendukung.
- [x] Tombol aksi "Verifikasi / Setujui" yang mengubah status akun EO menjadi *Verified*.
- [x] Tombol aksi "Tolak" yang memunculkan modal dialog untuk mengisi alasan penolakan.
- [x] Riwayat status verifikasi tersimpan reaktif.
**Verification:**
- [x] Klik "Setujui" pada salah satu permohonan EO $\rightarrow$ status otomatis berubah menjadi Verified. Status 200 OK.
**Dependencies:** Task 26
**Files likely touched:**
- `src/app/admin/organizers/page.tsx`
- `src/components/admin/OrganizerVerificationList.tsx`
- `src/components/admin/RejectOrganizerModal.tsx`
**Estimated scope:** Medium (3 files)

---

### Task 28: Build Event Moderation Portal
**Description:** Membangun portal moderasi event lari (`src/app/admin/events/page.tsx`) untuk meninjau event yang disubmit oleh organizer sebelum dapat tayang di beranda publik sesuai PRD US-15 & FR-ADM-03.
**Acceptance criteria:**
- [x] Daftar event berstatus *Pending Review*, *Published*, dan *Rejected*.
- [x] Tinjau kelengkapan rincian event: Deskripsi rute, kelayakan kuota, harga wajar, dan regulasi keselamatan.
- [x] Tombol "Publikasikan Event" yang mengubah status menjadi *Published* dan langsung membuatnya muncul di Beranda publik.
- [x] Tombol "Minta Revisi / Tolak" dengan catatan admin.
**Verification:**
- [x] Admin menyetujui event berstatus Pending $\rightarrow$ Event langsung muncul di katalog Beranda (`/`). Status 200 OK.
**Dependencies:** Task 26, Task 24
**Files likely touched:**
- `src/app/admin/events/page.tsx`
- `src/components/admin/EventModerationList.tsx`
**Estimated scope:** Medium (2 files)

---

### Task 29: Build Transaction Monitoring & Audit Log Table
**Description:** Membangun tabel pemantauan transaksi tiket dan log audit aktivitas sistem (`src/app/admin/transactions/page.tsx`) untuk melacak seluruh pesanan tiket digital, status pembayaran, serta log administratif sesuai PRD FR-ADM-04 & FR-ADM-07.
**Acceptance criteria:**
- [x] Tabel transaksi lengkap: Kode Pesanan, Tanggal Transaksi, Event, Kategori, Nama Peserta, Total Nominal (IDR), Status.
- [x] Fitur filter status transaksi (*Paid*, *Pending*, *Cancelled*) dan pencarian cepat.
- [x] Tab Audit Log yang mencatat aksi penting sistem (Verifikasi EO, Publikasi Event, Transaksi).
**Verification:**
- [x] Transaksi baru dari alur checkout otomatis muncul di tabel audit transaksi admin. Status 200 OK.
**Dependencies:** Task 26, Task 12
**Files likely touched:**
- `src/app/admin/transactions/page.tsx`
- `src/components/admin/TransactionsAuditTable.tsx`
**Estimated scope:** Small (2 files)

---

## Checkpoint D: Administrator Portal Verification
- [x] Seluruh fitur admin (dashboard, verifikasi EO, moderasi event, audit transaksi) berfungsi penuh.
- [x] Perubahan moderasi berdampak langsung pada katalog publik.

---

## Phase E: Final End-to-End Polish & Verification

### Task 30: System Polish, Role Switcher in Simulator Bar, & Mobile Ergonomics
**Description:** Melakukan penyempurnaan menyeluruh (*polish*): menambahkan kontrol *Role Switcher* cepat pada simulator bar untuk berpindah perspektif (*Runner* / *Organizer* / *Admin*) dalam 1-klik, menghaluskan animasi interaksi ala Emil Kowalski, memastikan kontras aksesibilitas, dan uji coba seluruh alur end-to-end tanpa kendala.
**Acceptance criteria:**
- [x] Simulator bar di bawah layar dilengkapi dropdown peran: "Mode: Runner (Budi)", "Mode: Organizer (Stride JKT)", "Mode: Admin".
- [x] Seluruh alur (Login $\rightarrow$ Eksplorasi $\rightarrow$ Rekomendasi Strava $\rightarrow$ Safety Warning $\rightarrow$ Checkout $\rightarrow$ E-Ticket $\rightarrow$ Organizer Check-in $\rightarrow$ Admin Moderasi) berjalan tanpa reload crash.
- [x] Seluruh halaman responsif pada viewport mobile (375px s/d 428px).
- [x] Tidak ada satupun file kode yang melanggar batas 500 baris (`AGENTS.md`).
**Verification:**
- [x] `npx tsc --noEmit` bersih (0 errors).
- [x] `npm run lint` bersih (0 warnings/errors).
- [x] Uji coba menyeluruh seluruh 15 halaman HTTP 200 OK.
**Dependencies:** Task 16 s/d Task 29
**Files likely touched:**
- `src/components/strava/StravaSimulatorBar.tsx`
- `src/app/globals.css`
**Estimated scope:** Small (2 files)

---

## Checkpoint E: Complete End-to-End System Signoff
- [x] Seluruh kebutuhan PRD untuk 3 role (*Runner*, *Organizer*, *Admin*) terimplementasikan dalam antarmuka yang kohesif.
- [x] Desain konsisten dengan Race Orange, Espresso, dan Warm White dari `DESIGN.md`.
