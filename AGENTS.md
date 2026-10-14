# AI Agent Rules & Coding Guidelines (agents.md)
## Proyek: StrideTix

Dokumen ini adalah instruksi wajib (*system rules*) bagi AI Agent dalam menulis, mengubah, atau me-review kode pada proyek **StrideTix**. Setiap respons dan implementasi kode **WAJIB** mematuhi 4 aturan inti berikut tanpa terkecuali:

---

### 1. Gunakan Skill Agentic yang Relevan
- Selalu aktifkan dan terapkan *skill agentic* yang paling relevan dengan konteks tugas yang sedang dikerjakan (misalnya: *Fullstack Next.js App Router Architecture*, *Supabase RLS & Auth*, *OAuth 2.0 Integration*, *Deterministic Scoring Logic*, atau *UI/UX Component Composition*).
- Lakukan perencanaan langkah kerja secara terstruktur sebelum mulai mengeksekusi penulisan atau perubahan kode.

---

### 2. Modularitas & Batas Maksimal 500 Baris per File
- **DILARANG KERAS** menumpuk kode di dalam satu file (*no monolithic files*).
- **Batas Maksimal:** Setiap file kode hanya boleh memiliki maksimal **500 baris (lines of code)**.
- Jika sebuah file mendekati atau berpotensi melewati 500 baris, **wajib** langsung memecahnya (*refactor/split*) menjadi modul yang lebih kecil sesuai tanggung jawabnya (*Single Responsibility Principle*), seperti:
  - Memisahkan sub-komponen UI ke dalam folder `components/`.
  - Memisahkan logika *state* ke dalam *custom hooks* (`hooks/`).
  - Memisahkan logika bisnis, *Scoring Engine*, atau pemanggilan API (Strava/Groq/Supabase) ke dalam `services/`, `lib/`, atau `utils/`.
  - Memisahkan definisi tipe data TypeScript ke dalam `types/`.

---

### 3. Selalu Kritisi Terlebih Dahulu (Think & Critique First)
- Jangan langsung mengiyakan atau menulis kode secara membabi buta dari setiap instruksi *prompt*.
- **Kritisi terlebih dahulu** setiap permintaan fitur, perubahan logika, atau arsitektur sebelum menulis kode:
  - Evaluasi apakah ada potensi *bug*, celah keamanan (misalnya kebocoran token Strava/Groq di sisi *client*), atau masalah performa.
  - Periksa apakah permintaan tersebut melanggar batasan *scope* MVP atau berisiko merusak alur yang sudah ada.
  - Sampaikan analisis singkat, peringatan risiko, atau saran alternatif yang lebih bersih dan efisien sebelum memberikan solusi kode.

---

### 4. Kepatuhan Mutlak pada Dokumen Acuan (`prd.md`, `techstack.md`, `design.md`)
Seluruh kode, arsitektur, dan tampilan yang dihasilkan **WAJIB** tunduk dan sinkron dengan tiga dokumen sumber kebenaran (*Single Source of Truth*) proyek ini:
- **`prd.md`:** Patuhi seluruh aturan bisnis, *user stories*, *acceptance criteria*, pemisahan *Rule-Based Scoring Engine* dengan *LLM Explanation Layer*, serta batasan *scope* MVP.
- **`techstack.md`:** Hanya gunakan teknologi, *library*, dan pola arsitektur yang telah ditetapkan (Fullstack Next.js App Router, TypeScript, Tailwind CSS + shadcn/ui, Supabase, Strava API v3, dan Groq Cloud API). Jangan menambah *library* di luar dokumen tanpa alasan mendesak dan persetujuan.
- **`design.md`:** Ikuti seluruh panduan sistem desain, *wireframe*, struktur komponen UI/UX, tata letak, dan *style guide* yang ditetapkan di dalam `design.md`.