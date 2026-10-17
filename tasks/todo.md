# Task List: Real Groq AI Integration (LLM Explanation & AI Running Assistant)

## Phase 1: Groq SDK Installation, Types & Server Client Adapter

### Task 1.1: Instalasi Package & Tipe Data AI (`src/types/ai.ts`)
**Description:** Memasang `groq-sdk` di `package.json` dan mendefinisikan tipe data TypeScript untuk pertukaran pesan percakapan chat, permintaan penjelasan rekomendasi, serta metadata guardrail.

**Acceptance criteria:**
- [x] `groq-sdk` terpasang di `dependencies`.
- [x] `src/types/ai.ts` mendefinisikan interface `ChatMessage`, `ChatRequest`, `ChatResponse`, `RecommendationExplanationRequest`, dan `RecommendationExplanationResponse`.
- [x] Kontrak tipe data diekspor melalui `src/types/index.ts`.

**Verification:**
- [x] `npm list groq-sdk` terverifikasi.
- [x] `npx tsc --noEmit` lolos.

**Dependencies:** None  
**Files likely touched:**
- `package.json`
- `src/types/ai.ts`
- `src/types/index.ts`

**Estimated scope:** S (3 files)

---

### Task 1.2: Server Groq Client Adapter (`src/lib/ai/groqClient.ts`)
**Description:** Membangun adapter klien Groq di sisi server yang membaca `GROQ_API_KEY` dan `GROQ_MODEL` dari environment variable, dengan fallback model aman (`llama-3.3-70b-versatile` / `llama-3.1-8b-instant`), batas timeout, dan penanganan error gracefully jika kuota atau koneksi bermasalah.

**Acceptance criteria:**
- [x] Menginisialisasi `new Groq({ apiKey })` hanya di runtime server.
- [x] Jika `GROQ_API_KEY` belum terisi, memberikan error terstruktur tanpa membocorkan credential.
- [x] Mendukung sanitasi prompt dan pemangkasan konteks untuk mencegah token bloat.

**Verification:**
- [x] Uji inisialisasi modul di sisi server.
- [x] `npx tsc --noEmit` lolos.

**Dependencies:** Task 1.1  
**Files likely touched:**
- `src/lib/ai/groqClient.ts`

**Estimated scope:** S (1 file)

---

## Checkpoint: Foundation
- [x] Groq SDK siap dan client adapter terisolasi aman di server.

---

## Phase 2: LLM Explanation Layer (`/api/recommendation/explain`)

### Task 2.1: Route Handler Penjelasan Rekomendasi
**Description:** Membuat Route Handler `POST /api/recommendation/explain` yang menerima data hasil *Rule-Based Scoring Engine* (`recommendedCategory`, `longestRunKm`, `weeklyFrequency`, `averagePaceMinPerKm`, `consistencyScore`, `readiness`) dan memanggil Groq LLM untuk merangkum alasan pemilihan jarak serta catatan keselamatan dalam 2–3 kalimat Bahasa Indonesia yang ramah dan memotivasi.

**Acceptance criteria:**
- [x] Menggunakan prompt sistem terpandu (tidak mengizinkan LLM mengubah kategori yang sudah diputuskan engine).
- [x] Menghasilkan penjelasan naratif ringkas (< 100 kata) sesuai KPI latensi rendah (< 2 detik).
- [x] Menangani kondisi data tidak cukup (*insufficient data*) dengan saran latihan bertahap.

**Verification:**
- [x] Request POST `/api/recommendation/explain` mengembalikan JSON `{ explanation: string, safetyNotes: string }`.

**Dependencies:** Task 1.2  
**Files likely touched:**
- `src/app/api/recommendation/explain/route.ts`

**Estimated scope:** S (1 file)

---

### Task 2.2: Hubungkan Narasi AI ke `RecommendationCard.tsx`
**Description:** Memperbarui `src/components/recommendation/RecommendationCard.tsx` agar menampilkan narasi penjelasan asli dari Groq LLM di bawah metrik numerik lari.

**Acceptance criteria:**
- [x] Menampilkan badge "AI Explanation by Groq (LLaMA 3.3 / GPT-OSS)" dengan ikon kilau (*Sparkles*).
- [x] Memuat narasi AI secara asinkron dengan skeleton/loading state yang rapi.
- [x] Fallback ke alasan bawaan engine jika jaringan internet offline.

**Verification:**
- [x] Tampilan kartu rekomendasi di dashboard dan detail event menampilkan penjelasan AI yang mengalir alami.

**Dependencies:** Task 2.1  
**Files likely touched:**
- `src/components/recommendation/RecommendationCard.tsx`

**Estimated scope:** S (1 file)

---

## Checkpoint: Explanation Layer
- [x] Rekomendasi lari memiliki penjelasan naratif personal langsung dari Groq AI.

---

## Phase 3: AI Running Assistant Backend (`/api/chat`)

### Task 3.1: Route Handler Chatbot dengan Medical Guardrails
**Description:** Membuat Route Handler `POST /api/chat` yang memproses percakapan interaktif pelari dengan menerapkan *System Prompt Guardrails* ketat (FR-CHAT-06, FR-CHAT-07): ahli strategi lari yang menolak mendiagnosis cedera dan mengarahkan pelari ke profesional medis saat terjadi keluhan fisik berat.

**Acceptance criteria:**
- [x] Hanya dapat diakses oleh user dengan role `runner` yang terautentikasi (FR-CHAT-01).
- [x] System prompt menginstruksikan LLM berbahasa Indonesia, ramah, dan fokus pada: persiapan race, checklist, hidrasi, nutrisi, dan strategi pace.
- [x] Jika prompt menyangkut nyeri tajam, sesak nafas, atau cedera sendi, AI wajib menjawab: "Hentikan lari dan segera konsultasikan dengan dokter atau fisioterapis" tanpa mendiagnosis penyakit.

**Verification:**
- [x] Uji request pertanyaan biasa menghasilkan jawaban komprehensif.
- [x] Uji request keluhan nyeri/cedera menghasilkan penolakan medis sesuai FR-CHAT-07.

**Dependencies:** Task 1.2  
**Files likely touched:**
- `src/app/api/chat/route.ts`

**Estimated scope:** S (1 file)

---

### Task 3.2: Injeksi Konteks Profil Kebugaran Pelari
**Description:** Mengintegrasikan konteks latihan pelari saat ini (target jarak dari Scoring Engine, jarak lari terjauh, dan frekuensi mingguan) ke dalam system prompt `/api/chat` sehingga saran yang diberikan AI disesuaikan dengan kapasitas fisik pengguna (FR-CHAT-03).

**Acceptance criteria:**
- [x] Backend menyisipkan ringkasan latihan pengguna jika tersedia di database `runner_profiles` atau payload request.
- [x] Asisten dapat menjawab pertanyaan kontekstual seperti "Berapa lama saya harus tapering untuk target 10K saya?".

**Verification:**
- [x] Asisten merespons pertanyaan dengan menyebutkan target jarak yang relevan dengan profil pelari.

**Dependencies:** Task 3.1  
**Files likely touched:**
- `src/app/api/chat/route.ts`

**Estimated scope:** S (1 file)

---

## Checkpoint: Chat Backend
- [x] Backend chatbot live dengan guardrail keselamatan dan konteks personal.

---

## Phase 4: UI Integration & Pembersihan Data Palsu

### Task 4.1: Pembersihan Jawaban Dummy di `chatResponses.ts`
**Description:** Menghapus fungsi balasan palsu hardcoded `getSmartAssistantReply()` dari `src/lib/mock-data/chatResponses.ts`. Mengubah berkas ini menjadi repositori resmi daftar tombol bantuan cepat (*Quick Prompt Starters: Checklist Hari H, Tips Hidrasi, Strategi Pace, Pemulihan*).

**Acceptance criteria:**
- [x] Tidak ada lagi string jawaban palsu hardcoded di `chatResponses.ts`.
- [x] Menyediakan daftar prompt starter yang ketika diklik akan dikirim ke API Groq real.

**Verification:**
- [x] `npx tsc --noEmit` lolos.

**Dependencies:** Task 3.1  
**Files likely touched:**
- `src/lib/mock-data/chatResponses.ts`

**Estimated scope:** S (1 file)

---

### Task 4.2: Integrasi Komponen `ChatbotWidget.tsx` ke Real API
**Description:** Memperbarui `src/components/chat/ChatbotWidget.tsx` agar mengirim pesan ke `POST /api/chat`, menampilkan animasi mengetik (*typing indicator*), menangani error jaringan, dan menampilkan disclaimer resmi layanan AI (FR-CHAT-06).

**Acceptance criteria:**
- [x] Mengirimkan riwayat pesan percakapan ke endpoint `/api/chat`.
- [x] Menampilkan indikator loading/mengetik saat model Groq sedang memproses.
- [x] Tombol prompt starter otomatis mengirimkan pertanyaan ke Groq AI.
- [x] Menampilkan teks *disclaimer*: "AI Running Assistant bersifat edukatif dan bukan pengganti saran medis profesional."

**Verification:**
- [x] Interaksi chat berjalan mulus di browser dengan jawaban cerdas real-time dari Groq.

**Dependencies:** Tasks 4.1, 3.2  
**Files likely touched:**
- `src/components/chat/ChatbotWidget.tsx`

**Estimated scope:** M (1 file)

---

## Checkpoint: UI & Mock Cleanup
- [x] Chatbot widget dan kartu rekomendasi 100% menggunakan Groq API tanpa data palsu.

---

## Phase 5: Verification & Safety Guardrails Audit

### Task 5.1: Verifikasi End-to-End & Audit Guardrails
**Description:** Menguji kedua fitur AI (Explanation & Chat) pada berbagai skenario:
1. Skenario rekomendasi jarak 5K/10K/Half Marathon/Insufficient Data.
2. Skenario percakapan strategi lari dan checklist hari H.
3. Skenario keselamatan medis (menolak diagnosis).
4. Verifikasi kompilasi `npx tsc --noEmit` dan pengecekan batas maksimal 500 baris kode per file (RULE 2).

**Acceptance criteria:**
- [x] `npx tsc --noEmit` keluar dengan kode 0 (bebas error).
- [x] Seluruh file kode berada di bawah 500 baris.
- [x] Kunci rahasia `GROQ_API_KEY` tidak bocor ke sisi klien.

**Verification:**
- [x] Laporan pengujian komprehensif.

**Dependencies:** All Tasks  
**Files likely touched:**
- `tasks/plan.md`
- `tasks/todo.md`

**Estimated scope:** S (2 files)
