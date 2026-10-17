/**
 * Daftar topik pemantik pertanyaan cepat (Quick Prompt Starters) untuk AI Running Assistant.
 * Seluruh jawaban sekarang dihasilkan secara live oleh Groq Cloud LLM (bukan dummy/hardcoded).
 */
export interface QuickPromptStarter {
  id: string;
  label: string;
  question: string;
}

export const QUICK_PROMPT_STARTERS: QuickPromptStarter[] = [
  {
    id: "recommend-event",
    label: "🎯 Rekomendasi Event Saya",
    question: "Rekomendasikan event lari di platform StrideTix yang paling cocok untuk kondisi latihan saya saat ini!",
  },
  {
    id: "checklist",
    label: "📋 Checklist Hari-H Lomba",
    question: "Apa saja perlengkapan wajib yang harus saya bawa saat race day?",
  },
  {
    id: "hydration",
    label: "💧 Panduan Hidrasi",
    question: "Berapa banyak air atau isotonik yang harus saya minum saat lari 10K atau Half Marathon?",
  },
  {
    id: "pace",
    label: "⏱️ Strategi Pacing",
    question: "Bagaimana cara menjaga pace yang stabil agar tidak kehabisan nafas di awal lari?",
  },
  {
    id: "recovery",
    label: "🏃 Pemulihan Pasca Lomba",
    question: "Bagaimana cara active recovery yang efektif setelah menyelesaikan perlombaan?",
  },
];

// Alias untuk kompatibilitas impor yang sudah ada
export const PREDEFINED_PROMPTS = QUICK_PROMPT_STARTERS;

export const AI_ASSISTANT_DISCLAIMER =
  "Asisten Lari StrideTix berbasis AI memberikan panduan seputar persiapan lomba dan hidrasi umum. Layanan ini bukan pengganti diagnosis atau konsultasi medis profesional.";
