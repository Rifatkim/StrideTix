# Dokumentasi Arsitektur & Tech Stack (TechStack.md)
## Proyek: StrideTix — Platform E-Ticket Event Lari dengan Smart Distance Recommendation

**Versi Dokumen:** 1.0  
**Pendekatan Arsitektur:** Monolithic Fullstack Web Application (Serverless-ready)  
**Target Pengembangan:** Minimum Viable Product (MVP) Tugas Akhir  

---

## 1. Ringkasan Tech Stack Utama

Pemilihan teknologi pada **StrideTix** dirancang agar pengembangan fitur *core ticketing*, integrasi pihak ketiga, dan pemrosesan AI dapat berjalan dalam satu repositori (*unified codebase*) yang cepat, aman, dan memiliki latensi rendah.

| Layer / Komponen | Teknologi Utama | Peran dalam Sistem StrideTix |
| :--- | :--- | :--- |
| **Fullstack Framework** | **Next.js (App Router)** | Menangani antarmuka pengguna (SSR/CSR), *routing* halaman multi-role, serta *Backend API Routes* / *Server Actions*. |
| **Bahasa Pemrograman** | **TypeScript** | Menjaga *type-safety* pada pengolahan data metrik Strava, respons API Groq, dan transaksi tiket. |
| **Styling & UI Components** | **Tailwind CSS + shadcn/ui + GSAP Animation** | Membangun antarmuka responsif untuk katalog event, *badge* rekomendasi, modal *safety warning*, dan dashboard. |
| **Database & Backend-as-a-Service** | **Supabase (PostgreSQL)** | Menyimpan data relasional, autentikasi pengguna (*Supabase Auth*), proteksi akses (*Row Level Security*), dan penyimpanan gambar banner event (*Supabase Storage*). |
| **Data Kebugaran & Aktivitas Lari** | **Universal Fitness Sync (GPX, CSV, Manual Assessment, & Strava)** | Mengambil dan mem-parse riwayat aktivitas lari pengguna (*distance, moving time, pace, frequency*) secara aman dan fleksibel tanpa hambatan paywall API eksternal. |
| **AI & LLM Inference Engine** | **Groq Cloud API** | Menghasilkan penjelasan naratif dari hasil *Rule-Based Scoring Engine* serta menjalankan fitur *AI Running Assistant (Chatbot)* dengan kecepatan tinggi (*ultra-low latency*). |
| **QR Code Utility** | **`qrcode.react` & `html5-qrcode`** | Membuat kode QR unik pada E-Ticket peserta dan memindai QR melalui kamera/input pada dashboard Event Organizer. |

---

## 2. Detail Arsitektur per Layer

### 2.1 Frontend & Backend Layer: Fullstack Next.js
Menggunakan **Next.js App Router** memungkinkan pemisahan yang bersih antara halaman publik yang butuh pemuatan cepat dan halaman transaksi/rekomendasi yang membutuhkan keamanan di sisi server:

* **Server Components (RSC):** Digunakan pada halaman *Event Discovery* dan *Event Detail* agar waktu muat halaman memenuhi target NFR ($\le 3$ detik).
* **Client Components:** Digunakan pada komponen interaktif seperti *Filter Event*, *Chatbot UI*, pemindai *QR Code Check-in*, dan modal persetujuan *Safety Warning*.
* **Route Handlers (`app/api/...`) & Server Actions:**
  * Menangani sinkronisasi kebugaran (`/api/fitness/upload`, `/api/fitness/manual`, `/api/fitness/status`, `/api/fitness/reset`).
  * Menjalankan kalkulasi **Rule-Based Scoring Engine** secara tertutup di sisi server.
  * Menjadi jembatan pemanggilan API ke **Groq Cloud** menggunakan `GROQ_API_KEY` yang tersimpan di *server environment*.
* **Middleware (`middleware.ts`):** Mengatur proteksi rute berdasarkan *role* (`runner`, `organizer`, `admin`) bekerja sama dengan sesi dari Supabase.

---

### 2.2 Database, Auth & Storage: Supabase
Supabase dipilih sebagai fondasi *Backend-as-a-Service* berbasis **PostgreSQL** untuk mempercepat pembuatan fitur autentikasi dan manajemen file:

* **Supabase Database (PostgreSQL):** Menyimpan data multi-role, katalog event, kategori tiket, transaksi, ringkasan metrik kebugaran (`user_fitness_sync`, `runner_profiles`, `raw_fitness_activities`), dan riwayat rekomendasi (`event_recommendations`).
* **Supabase Auth:** Menangani registrasi, login, manajemen sesi JWT, dan *password hashing* (memenuhi kebutuhan **FR-AUTH-01** s/d **FR-AUTH-07**).
* **Row Level Security (RLS):** Kebijakan keamanan level baris untuk memastikan:
  * *Runner* hanya bisa melihat tiket dan data kebugaran miliknya sendiri.
  * *Organizer* hanya bisa mengedit dan memvalidasi tiket pada event yang ia buat (**FR-ORG-08**).
  * *Admin* memiliki akses penuh untuk moderasi event dan verifikasi organizer.
* **Supabase Storage:** Menyimpan aset gambar poster/banner event yang diunggah oleh Event Organizer (**US-11**).

---

### 2.3 Integrasi Data Kebugaran: Universal Fitness Sync
Mengingat pendaftaran API pihak ketiga tertentu (seperti Strava API v3) kini menerapkan skema berbayar (*Strava Subscriber*), StrideTix menerapkan arsitektur **Universal Fitness Sync**:

1. **Parser File GPX (GPS Exchange Format):** Mengekstrak data koordinat geospasial `<trkpt>`, menghitung jarak kumulatif via formula *Haversine*, durasi bergerak (*moving time*), elevasi, dan menghitung pace rata-rata secara presisi dari file jam Garmin/Coros/Apple Watch/Strava.
2. **Parser File CSV (Activity Log):** Mengekstrak ringkasan spreadsheet sesi latihan (*date, distance, moving time, pace*).
3. **Formulir Penilaian Mandiri Cepat:** Input 3 parameter praktis (*longest run*, frekuensi latihan mingguan, dan rata-rata pace) bagi pelari yang belum memiliki perangkat jam GPS.
4. **Preset Persona Simulator:** Profil terkalibrasi (*5K Novice, 10K Intermediate, 21K Half Marathon, 42K Marathon*) untuk demonstrasi dan evaluasi sistem.
5. **Koneksi Eksternal OAuth (Strava API v3 - Opsi Legacy):** Tetap didukung jika kredensial pengembang resmi tersedia.

---

### 2.4 AI Layer: Groq Cloud API (LLM Inference)
Sesuai arsitektur hibrida pada PRD (**Bagian 15.1**), **Groq** tidak digunakan untuk menentukan kategori secara acak, melainkan bekerja di atas hasil hitungan *Scoring Engine* Next.js.

* **Alasan Pemilihan Groq:** LPU (*Language Processing Unit*) pada Groq memberikan respons teks yang sangat cepat (jauh di bawah batas KPI 10 detik pada **NFR Performance**), sehingga pengalaman pengguna saat membuka halaman rekomendasi dan berinteraksi dengan *Chatbot* terasa instan.
* **Model yang Direkomendasikan di Groq Console:**
  * `llama-3.3-70b-versatile` atau `llama-3.1-8b-instant` (Cepat, mendukung Bahasa Indonesia dengan baik, dan hemat kuota token).
* **SDK Integrasi:** Menggunakan `groq-sdk` resmi atau *Vercel AI SDK (`ai` + `@ai-sdk/groq`)* di dalam Next.js Route Handlers.
* **Dua Fungsi Utama Groq di StrideTix:**
  1. **LLM Explanation Generator (`/api/recommendation/explain`):** Menerima input berupa objek JSON hasil hitungan *Rule-Based Engine* (misal: `recommended_category: "10K"`, `longest_run: 8.5`, `weekly_freq: 3`, `readiness: "Siap"`), lalu menyusun 2–3 kalimat penjelasan yang ramah dan transparan bagi pengguna.
  2. **AI Running Assistant (`/api/chat`):** Menyediakan layanan *chatbot* interaktif (**FR-CHAT-01**) dengan *System Prompt* yang sudah dikunci (*guardrails*) agar hanya membahas persiapan lomba, hidrasi, perlengkapan, dan menolak memberikan diagnosis medis (**FR-CHAT-07**).

---

## 3. Library Pendukung (NPM Packages)

Berikut adalah daftar *package* pendukung yang akan dipasang pada proyek Next.js:

| Kategori | Nama Package | Kegunaan |
| :--- | :--- | :--- |
| **Supabase Client** | `@supabase/supabase-js`, `@supabase/ssr` | Koneksi database dan manajemen autentikasi berbasis *cookies* di Next.js App Router. |
| **AI / Groq** | `groq-sdk` | Memanggil model LLM dari Groq Console di sisi server. |
| **Form & Validasi** | `react-hook-form`, `zod` | Validasi input form registrasi, pembuatan event, dan pemesanan tiket. |
| **QR Code** | `qrcode.react` | Merender QR Code unik pada halaman E-Ticket peserta. |
| **QR Scanner** | `html5-qrcode` | Membaca QR Code melalui kamera perangkat saat Organizer melakukan *check-in* peserta. |
| **Icons & UI** | `lucide-react`, `tailwindcss` | Ikon antarmuka (seperti badge rekomendasi, peringatan keselamatan, dan status tiket). |
| **Date Utility** | `date-fns` | Mengolah rentang tanggal event dan menghitung periode analisis aktivitas lari (misal 30–60 hari ke belakang). |

---

## 4. Alur Kerja Sistem Antar-Teknologi (Data Flow)

```
[Browser Pengguna (Next.js Client)]
       │
       ├── 1. Upload GPX/CSV, Form Mandiri, atau Preset Persona ─► [Fitness Sync UI]
       │                                                                  │
       ▼                                                                  │
[Next.js Backend (Route Handlers: /api/fitness/*)] ◄──────────────────────┘
       │
       ├── 2. Parse & Validasi Data Lari (Haversine Distance, Moving Time, Pace)
       │
       ├── 3. Hitung Indikator & Jalankan Rule-Based Scoring Engine (5K/10K/HM/FM)
       │
       ├── 4. Kirim Ringkasan Skor ke LLM Explanation Layer ──► [Groq Cloud API]
       │      (Minta narasi penjelasan & catatan keselamatan)
       │
       ├── 5. Simpan Metrik, Hasil Rekomendasi & Transaksi ────► [Supabase PostgreSQL]
       │
       ▼
[Browser Pengguna (Next.js UI)]
       └── 6. Tampilkan Badge "Recommended for You", Confidence Level,
              Penjelasan AI, Chatbot Asisten Lari, dan terbitkan E-Ticket (QR Code).
```

---

## 5. Konfigurasi Environment Variables (`.env.local`)

Untuk memenuhi kebutuhan **NFR Security (Bagian 11.2)** dan **Maintainability (Bagian 11.7)**, seluruh kunci rahasia wajib disimpan di dalam `.env.local`:

```env
# 1. Konfigurasi Supabase (Database, Auth, Storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# 2. Konfigurasi Groq Cloud API (Hanya diakses di Server/Backend)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b

# 3. Konfigurasi Strava API v3 (Opsional / Legacy)
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
NEXT_PUBLIC_STRAVA_REDIRECT_URI=http://localhost:3000/api/strava/callback
```

---

## 6. Keunggulan Kombinasi Tech Stack

1. **Kecepatan Eksekusi AI (Groq):** Memenuhi KPI waktu pembuatan rekomendasi di bawah 10 detik dengan sangat mudah karena inferensi Groq rata-rata selesai dalam 0,5–1,5 detik.
2. **Keamanan Kredensial Terjamin (Next.js Server + Supabase):** Kunci rahasia API Key Groq dan token autentikasi diproses sepenuhnya di *Server Route* Next.js sehingga aman dari kebocoran di sisi klien (*browser*).
3. **Fleksibilitas Universal Fitness Sync:** Pelari dapat menggunakan file GPX dari jam tangan apa pun (Garmin, Coros, Apple Watch, Suunto) atau mengisi penilaian mandiri tanpa ketergantungan pada akun pihak ketiga berbayar.
4. **Kemudahan Deployment:** Seluruh aplikasi Fullstack Next.js dapat di-*deploy* langsung ke **Vercel**, terhubung otomatis dengan *cloud database* **Supabase**, tanpa perlu menyewa dan mengonfigurasi VPS terpisah untuk *backend* dan *frontend*.