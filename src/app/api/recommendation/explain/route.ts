import { NextResponse } from "next/server";
import { executeGroqChatCompletion } from "@/lib/ai/groqClient";
import {
  RECOMMENDATION_EXPLAINER_SYSTEM_PROMPT,
  buildRecommendationUserPrompt,
} from "@/lib/ai/prompts";
import { RecommendationExplanationRequest } from "@/types/ai";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendationExplanationRequest;

    if (!body || typeof body.longestRunKm !== "number") {
      return NextResponse.json(
        { success: false, error: "Payload metrik rekomendasi tidak lengkap." },
        { status: 400 }
      );
    }

    const userPrompt = buildRecommendationUserPrompt(body);

    const { text, modelUsed } = await executeGroqChatCompletion(
      [
        { role: "system", content: RECOMMENDATION_EXPLAINER_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.4, maxTokens: 800 }
    );

    // Ekstrak blok JSON dari respons model
    let parsed: { explanation?: string; safetyNotes?: string } = {};
    try {
      // Bersihkan jika ada format ```json ... ```
      const cleaned = text
        .replace(/```(?:json)?/gi, "")
        .replace(/```/g, "")
        .trim();

      // Cari kurung kurawal pertama dan terakhir
      const startIdx = cleaned.indexOf("{");
      const endIdx = cleaned.lastIndexOf("}");
      if (startIdx >= 0 && endIdx > startIdx) {
        parsed = JSON.parse(cleaned.substring(startIdx, endIdx + 1));
      } else {
        parsed = JSON.parse(cleaned);
      }
    } catch {
      // Jika parsing JSON gagal, gunakan seluruh teks sebagai penjelasan
      parsed = {
        explanation: text.trim(),
        safetyNotes:
          "Pastikan meningkatkan jarak lari secara bertahap dan jaga kecukupan hidrasi sebelum hari perlombaan.",
      };
    }

    return NextResponse.json({
      success: true,
      explanation:
        parsed.explanation ||
        `Berdasarkan data long run ${body.longestRunKm} km dan konsistensi ${body.consistencyScore}%, kategori ${body.recommendedCategory || "5K"} adalah opsi yang paling aman dan terukur.`,
      safetyNotes:
        parsed.safetyNotes ||
        "Disarankan untuk tidak melompat kategori jarak secara drastis guna mencegah kelelahan berlebih atau cedera.",
      modelUsed,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memproses penjelasan AI.";
    console.error("[Explain Route Error]:", errorMsg);

    // Fallback gracefully jika offline / Groq error agar UI tidak blank
    return NextResponse.json({
      success: true,
      explanation:
        "Berdasarkan analisis riwayat latihan Anda, frekuensi dan jarak lari terpanjang menunjukkan kesiapan fisik yang solid untuk kategori ini.",
      safetyNotes:
        "Tetap lakukan pemanasan, latihan bertahap, dan jaga hidrasi optimal menjelang hari perlombaan.",
      modelUsed: "offline-fallback",
    });
  }
}
