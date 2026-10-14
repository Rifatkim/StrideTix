export interface PredefinedPrompt {
  id: string;
  label: string;
  question: string;
  answer: string;
}

export const PREDEFINED_PROMPTS: PredefinedPrompt[] = [
  {
    id: "checklist",
    label: "📋 Checklist Hari H Lomba",
    question: "Apa saja perlengkapan yang wajib dibawa saat race day?",
    answer: `Berikut checklist penting sebelum menuju garis start:
1. **Nomor Dada (BIB) & Peniti:** Pasang di bagian depan jersey Anda, jangan sampai tertinggal.
2. **Sepatu & Kaos Kaki Lari:** Gunakan sepatu yang sudah terbiasa dipakai saat latihan, hindari memakai sepatu baru di hari lomba.
3. **Pakaian Nyaman:** Jersey lari berpori cepat kering (quick-dry) dan celana lari.
4. **Hidrasi & Nutrisi:** Bawa 1-2 energy gel atau tablet garam jika mengikuti kategori 10K/Half Marathon.
5. **Anti-Chafing:** Oleskan petroleum jelly atau anti-chafing balm di area rawan gesekan.
6. **Istirahat Cukup:** Tidur minimal 7 jam pada malam sebelum perlombaan.`,
  },
  {
    id: "hydration",
    label: "💧 Tips Hidrasi Lari",
    question: "Berapa banyak air yang harus diminum saat lari 10K atau Half Marathon?",
    answer: `Panduan hidrasi dasar:
- **Sebelum Lomba:** Minum sekitar 400–500 ml air putih 2 jam sebelum flag-off agar tubuh terhidrasi optimal.
- **Selama Lomba:** Minum 2–3 teguk (sekitar 100–150 ml) di setiap Water Station (biasanya setiap 2.5 KM). Jangan menunggu sampai merasa sangat haus.
- **Minuman Isotonik:** Untuk lari di atas 60 menit, kombinasikan air mineral dengan cairan isotonik untuk mengganti elektrolit natrium yang hilang lewat keringat.`,
  },
  {
    id: "recovery",
    label: "🏃 Pemulihan Pasca Lomba",
    question: "Bagaimana cara meredakan kaki pegal setelah menyelesaikan race?",
    answer: `Langkah pemulihan cepat (*active recovery*):
1. **Jangan Langsung Duduk:** Lakukan jalan santai selama 5–10 menit setelah melewati garis finis untuk menstabilkan detak jantung.
2. **Rehidrasi & Nutrisi:** Konsumsi cairan elektrolit dan camilan berprotein-karbohidrat dalam 30 menit pertama.
3. **Stretching Ringan:** Lakukan peregangan statis lembut pada otot betis, paha depan (quadriceps), dan hamstring.
4. **Mandi Air Dingin / Es:** Bermanfaat meredakan peradangan otot (*DOMS*).
*Catatan: Jika mengalami nyeri tajam atau pembengkakan tidak wajar, segera konsultasikan dengan fisioterapis atau dokter.*`,
  },
  {
    id: "pace",
    label: "⏱️ Strategi Pace Lomba",
    question: "Bagaimana cara menjaga pace agar tidak kehabisan nafas di awal lari?",
    answer: `Gunakan strategi **Negative Split** atau **Even Pace**:
- **KM 0–3:** Mulai 15–20 detik lebih lambat dari target pace Anda. Tahan euforia kerumunan pelari lain.
- **KM 4–8:** Masuk ke ritme target pace yang nyaman di mana Anda masih bisa bernapas teratur.
- **2 KM Terakhir:** Jika energi masih tersisa, naikkan kecepatan bertahap menuju garis finis!`,
  },
];

export function getSmartAssistantReply(userQuery: string): string {
  const q = userQuery.toLowerCase();

  for (const prompt of PREDEFINED_PROMPTS) {
    if (q.includes(prompt.id) || q.includes(prompt.question.toLowerCase())) {
      return prompt.answer;
    }
  }

  if (q.includes("cedera") || q.includes("sakit") || q.includes("nyeri")) {
    return "Jika Anda merasakan nyeri tajam, bengkak, atau sesak nafas saat berlari, segera hentikan aktivitas dan istirahatkan kaki Anda (metode R.I.C.E). Untuk keluhan berkelanjutan, silakan periksakan ke dokter spesialis kedokteran olahraga atau fisioterapis profesional.";
  }

  if (q.includes("sepatu") || q.includes("gear")) {
    return "Pilihlah sepatu lari jalan raya (road running shoes) dengan bantalan yang sesuai dengan tipe telapak kaki Anda (neutral atau stability). Pastikan ada ruang sekitar 1 cm di ujung jempol kaki untuk mencegah kuku membiru saat lari jarak jauh.";
  }

  return "Halo! Saya Asisten Lari StrideTix. Anda bisa menanyakan checklist perlengkapan hari lomba, tips hidrasi, strategi pace, maupun cara pemulihan setelah berlari. Silakan pilih salah satu topik di bawah atau ketik pertanyaan Anda.";
}
