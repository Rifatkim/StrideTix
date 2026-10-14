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
| **Styling & UI Components** | **Tailwind CSS + shadcn/ui** | Membangun antarmuka responsif untuk katalog event, *badge* rekomendasi, modal *safety warning*, dan dashboard. |
| **Database & Backend-as-a-Service** | **Supabase (PostgreSQL)** | Menyimpan data relasional, autentikasi pengguna (*Supabase Auth*), proteksi akses (*Row Level Security*), dan penyimpanan gambar banner event (*Supabase Storage*). |
| **External Fitness API** | **Strava API v3 (OAuth 2.0)** | Mengambil riwayat aktivitas lari pengguna (*distance, moving time, pace, frequency*) secara aman. |
| **AI & LLM Inference Engine** | **Groq Cloud API** | Menghasilkan penjelasan naratif dari hasil *Rule-Based Scoring Engine* serta menjalankan fitur *AI Running Assistant (Chatbot)* dengan kecepatan tinggi (*ultra-low latency*). |
| **QR Code Utility** | **`qrcode.react` & `html5-qrcode`** | Membuat kode QR unik pada E-Ticket peserta dan memindai QR melalui kamera/input pada dashboard Event Organizer. |

---

## 2. Detail Arsitektur per Layer

### 2.1 Frontend & Backend Layer: Fullstack Next.js
Menggunakan **Next.js App Router** memungkinkan pemisahan yang bersih antara halaman publik yang butuh pemuatan cepat dan halaman transaksi/rekomendasi yang membutuhkan keamanan di sisi server:

* **Server Components (RSC):** Digunakan pada halaman *Event Discovery* dan *Event Detail* agar waktu muat halaman memenuhi target NFR ($\le 3$ detik).
* **Client Components:** Digunakan pada komponen interaktif seperti *Filter Event*, *Chatbot UI*, pemindai *QR Code Check-in*, dan modal persetujuan *Safety Warning*.
* **Route Handlers (`app/api/...`) & Server Actions:**
  * Menangani *callback* OAuth 2.0 dari Strava (`/api/strava/callback`) agar `client_secret` dan `access_token` tidak pernah terekspos ke *browser* pengguna.
  * Menjalankan kalkulasi **Scoring Engine** secara tertutup di sisi server.
  * Menjadi jembatan pemanggilan API ke **Groq Console** menggunakan `GROQ_API_KEY` yang tersimpan di *server environment*.
* **Middleware (`middleware.ts`):** Mengatur proteksi rute berdasarkan *role* (`runner`, `organizer`, `admin`) bekerja sama dengan sesi dari Supabase.

---

### 2.2 Database, Auth & Storage: Supabase
Supabase dipilih sebagai fondasi *Backend-as-a-Service* berbasis **PostgreSQL** untuk mempercepat pembuatan fitur autentikasi dan manajemen file:

* **Supabase Database (PostgreSQL):** Menyimpan data multi-role, katalog event, kategori tiket, transaksi, ringkasan metrik Strava, dan riwayat rekomendasi.
* **Supabase Auth:** Menangani registrasi, login, manajemen sesi JWT, dan *password hashing* (memenuhi kebutuhan **FR-AUTH-01** s/d **FR-AUTH-07**).
* **Row Level Security (RLS):** Kebijakan keamanan level baris untuk memastikan:
  * *Runner* hanya bisa melihat tiket dan data Strava miliknya sendiri.
  * *Organizer* hanya bisa mengedit dan memvalidasi tiket pada event yang ia buat (**FR-ORG-08**).
  * *Admin* memiliki akses penuh untuk moderasi event dan verifikasi organizer.
* **Supabase Storage:** Menyimpan aset gambar poster/banner event yang diunggah oleh Event Organizer (**US-11**).

---

### 2.3 Integrasi Data Kebugaran: Strava API v3
Integrasi dilakukan menggunakan alur standar **OAuth 2.0 Authorization Code Flow**:

1. **Otorisasi Scope:** Meminta izin akses `read` dan `activity:read_all` (atau `activity:read`) kepada pengguna.
2. **Manajemen Token:** Menyimpan `access_token`, `refresh_token`, dan `expires_at` di tabel khusus pada Supabase yang hanya dapat diakses oleh *Next.js Server*. Sistem otomatis melakukan *refresh token* jika masa aktif habis (**FR-STR-08**).
3. **Endpoint yang Digunakan:**
   * `GET /api/v3/athlete` — Mengambil identitas dasar profil atlet Strava.
   * `GET /api/v3/athlete/activities` — Mengambil daftar aktivitas dalam periode analisis (misal: 4–8 minggu terakhir), lalu difilter di *backend* Next.js khusus untuk tipe `type === "Run"` (**FR-STR-04**).

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
| **Date Utility** | `date-fns` | Mengolah rentang tanggal event dan menghitung periode analisis aktivitas Strava (misal 30–60 hari ke belakang). |

---

## 4. Alur Kerja Sistem Antar-Teknologi (Data Flow)

```
[Browser Pengguna (Next.js Client)]
       │
       ├── 1. Klik "Connect Strava" ────────────────────────► [Strava OAuth Page]
       │                                                             │
       ◄── 2. Redirect dengan Authorization Code ────────────────────┘
       │
       ▼
[Next.js Backend (Server Actions / API Routes)]
       │
       ├── 3. Tukar Code jadi Access Token & Ambil Data "Run" ► [Strava API v3]
       │
       ├── 4. Hitung Metrik (Avg Distance, Long Run, Pace, Konsistensi)
       │      & Jalankan Rule-Based Scoring Engine (Tentukan 5K/10K/HM/FM)
       │
       ├── 5. Kirim Ringkasan Skor ke LLM ────────────────────► [Groq Cloud API]
       │      (Minta penjelasan alasan & safety note)
       │
       ├── 6. Simpan Metrik, Hasil Rekomendasi & Transaksi ───► [Supabase PostgreSQL]
       │
       ▼
[Browser Pengguna (Next.js UI)]
       └── 7. Tampilkan Badge "Recommended for You", Confidence Level,
              Penjelasan AI, dan terbitkan E-Ticket (QR Code) saat lunas.
```

---

## 5. Konfigurasi Environment Variables (`.env.local`)

Untuk memenuhi kebutuhan **NFR Security (Bagian 11.2)** dan **Maintainability (Bagian 11.7)**, seluruh kunci rahasia wajib disimpan di dalam `.env.local`:

```env
# 1. Konfigurasi Aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 2. Konfigurasi Supabase (Database, Auth, Storage)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# 3. Konfigurasi Strava API v3 (Hanya diakses di Server/Backend)
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
NEXT_PUBLIC_STRAVA_REDIRECT_URI=http://localhost:3000/api/strava/callback

# 4. Konfigurasi Groq Console API (Hanya diakses di Server/Backend)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL_NAME=llama-3.3-70b-versatile
```

---

## 6. Keunggulan Kombinasi Tech Stack Ini untuk Sidang Tugas Akhir

1. **Kecepatan Eksekusi AI (Groq):** Memenuhi KPI waktu pembuatan rekomendasi di bawah 10 detik dengan sangat mudah karena inferensi Groq rata-rata selesai dalam 0,5–1,5 detik.
2. **Keamanan Token Terjamin (Next.js Server + Supabase):** Token Strava dan API Key Groq diproses sepenuhnya di *Server Route* Next.js sehingga aman dari kebocoran di sisi klien (*browser*).
3. **Kemudahan Deployment:** Seluruh aplikasi Fullstack Next.js dapat di-*deploy* langsung ke **Vercel**, terhubung otomatis dengan *cloud database* **Supabase**, tanpa perlu menyewa dan mengonfigurasi VPS terpisah untuk *backend* dan *frontend*.