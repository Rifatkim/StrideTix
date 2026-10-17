# Implementation Plan: Integrasi Real AI Groq Cloud (LLM Explanation & AI Running Assistant)

## Overview
Mengintegrasikan kecerdasan buatan (*AI Layer*) menggunakan **Groq Cloud API** secara nyata (*production-ready live inference*) ke dalam StrideTix sesuai spesifikasi resmi **`prd.md` §14.3 & §15** serta **`techstack.md` §2.4**. Seluruh data palsu dan simulasi balasan hardcoded pada `chatResponses.ts` akan dihapus dan digantikan oleh dua kapabilitas AI utama:
1. **LLM Explanation Layer (`/api/recommendation/explain`):** Menghasilkan narasi penjelasan rekomendasi kategori jarak (5K/10K/HM/FM) yang transparan dan personal berdasarkan hasil hitungan deterministik Scoring Engine.
2. **AI Running Assistant (`/api/chat`):** Chatbot interaktif cerdas bagi pelari terautentikasi dengan *system prompt guardrails* ketat yang menolak diagnosis medis (FR-CHAT-07) dan memberikan saran persiapan lomba, checklist perlengkapan, hidrasi, nutrisi, dan strategi pace.

---

## Architecture Decisions & Guardrails (PRD §14.3 & §15.1)
1. **Arsitektur Hibrida (Scoring Engine + LLM Layer):**
   - Keputusan kategori jarak **TIDAK PERNAH** diserahkan sepenuhnya ke LLM (menghindari halusinasi).
   - *Rule-Based Scoring Engine* (`engine.ts`) menentukan kategori (5K/10K/HM/FM) secara matematis.
   - Groq LLM hanya menerima ringkasan metrik numerik (*longest run, weekly frequency, avg pace, consistency*) untuk menyusun penjelasan bahasa alami yang ramah pengguna.

2. **Isolasi Kunci Rahasia di Server:**
   - `GROQ_API_KEY` hanya diakses di sisi server (Next.js Route Handlers `/api/...`) dan tidak pernah terekspos ke browser klien.

3. **Medical & Safety Guardrails (FR-CHAT-06 & FR-CHAT-07):**
   - *System prompt* melarang keras mendiagnosis cedera atau meresepkan tindakan medis.
   - Jika pengguna mengeluhkan nyeri tajam, pingsan, atau sesak nafas, asisten wajib mengarahkan untuk menghentikan aktivitas dan berkonsultasi dengan dokter/fisioterapis.

4. **Kontekstualisasi Profil Pelari (FR-CHAT-03):**
   - Chatbot menerima ringkasan profil kebugaran pengguna saat ini (misal: "Pelari sedang mempersiapkan jarak 10K dengan frekuensi 3x/minggu") sehingga saran yang diberikan sangat relevan dan personal.

5. **Ketahanan Model & Error Recovery:**
   - Menggunakan model `llama-3.3-70b-versatile` / `llama-3.1-8b-instant` dengan fallback timeout cepat agar respons tetap memenuhi KPI latency (< 10 detik).

---

## Dependency Graph & Implementation Flow

```
[Phase 1: Groq SDK Installation, Types & Server Client Adapter]
                          │
                          ▼
[Phase 2: LLM Explanation Layer Route Handler (/api/recommendation/explain)]
                          │
                          ▼
[Phase 3: AI Running Assistant Chat Route Handler (/api/chat)]
                          │
                          ▼
[Phase 4: Real UI Integration & Cleanup of Fake Mock Data (ChatbotWidget & RecommendationCard)]
                          │
                          ▼
[Phase 5: Safety Guardrails Audit & End-to-End Verification]
```

---

## Task List

### Phase 1: Groq SDK Installation, Types & Server Client
- [ ] Task 1.1: Instalasi dependency `groq-sdk` dan pembuatan kontrak tipe data TypeScript di `src/types/ai.ts`.
- [ ] Task 1.2: Pembuatan server client adapter di `src/lib/ai/groqClient.ts` dengan penanganan timeout, API key guard, dan model fallback.

### Checkpoint: Foundation
- [ ] Dependency terinstal rapi, client AI terisolasi di sisi server, dan type-safe.

### Phase 2: LLM Explanation Layer
- [ ] Task 2.1: Pembuatan Route Handler `POST /api/recommendation/explain` yang menerima hasil scoring dan menghasilkan 2–3 kalimat narasi alasan & safety notes.
- [ ] Task 2.2: Hubungkan `RecommendationCard.tsx` untuk menampilkan narasi AI dinamis dari API Groq.

### Checkpoint: Explanation Layer
- [ ] Rekomendasi 5K/10K/HM/FM menghasilkan narasi asli dari model LLaMA via Groq.

### Phase 3: AI Running Assistant Backend
- [ ] Task 3.1: Pembuatan Route Handler `POST /api/chat` dengan perlindungan autentikasi session pelari (FR-CHAT-01) dan sistem guardrail medis (FR-CHAT-07).
- [ ] Task 3.2: Penambahan injeksi konteks kebugaran pengguna (`StravaActivitySummary`) ke dalam percakapan (FR-CHAT-03).

### Checkpoint: Chat Backend
- [ ] Endpoint `/api/chat` dapat memproses pesan percakapan dan menolak pertanyaan medis berbahaya secara otomatis.

### Phase 4: UI Integration & Cleanup Data Palsu
- [ ] Task 4.1: Hapus fungsi fake hardcoded `getSmartAssistantReply()` dari `src/lib/mock-data/chatResponses.ts` dan ganti menjadi daftar topik bantuan resmi (*prompt starters*).
- [ ] Task 4.2: Perbarui `src/components/chat/ChatbotWidget.tsx` agar melakukan streaming/request ke `POST /api/chat` dengan loading state, bubble chat real, dan error handling.

### Checkpoint: UI & Mock Cleanup
- [ ] Chatbot widget berfungsi secara live tanpa data palsu.

### Phase 5: Verification & Safety Guardrails Audit
- [ ] Task 5.1: Pengujian skenario normal (persiapan race, checklist, hidrasi, pacing).
- [ ] Task 5.2: Pengujian skenario guardrail (keluhan cedera/nyeri dada diuji untuk memastikan respons menolak diagnosis).
- [ ] Task 5.3: Verifikasi kompilasi `npx tsc --noEmit` 0 error dan cek batas maksimal 500 baris kode per file.
