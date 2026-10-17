import Groq from "groq-sdk";
import { AIChatMessage } from "@/types/ai";

// Model resmi yang aktif dan tersedia pada API Key akun pengguna
const PRIMARY_MODEL = "openai/gpt-oss-120b";
const FAST_MODEL = "openai/gpt-oss-20b";

let groqInstance: Groq | null = null;

/**
 * Mengambil instance resmi Groq SDK di sisi server.
 * Memastikan API Key tidak pernah terekspos ke klien.
 */
export function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "gsk_your_groq_api_key") {
    throw new Error(
      "GROQ_API_KEY belum dikonfigurasi di file environment (.env). Silakan masukkan API key yang valid."
    );
  }

  if (!groqInstance) {
    groqInstance = new Groq({ apiKey });
  }

  return groqInstance;
}

/**
 * Mendapatkan nama model aktif dengan normalisasi penamaan (memperbaiki typo seperti 'lopenai')
 */
export function getActiveGroqModel(): string {
  let envModel = process.env.GROQ_MODEL?.trim();
  if (!envModel) return PRIMARY_MODEL;

  // Normalisasi jika ada salah ketik awalan 'l' pada 'lopenai'
  if (envModel.startsWith("lopenai/")) {
    envModel = envModel.replace("lopenai/", "openai/");
  }

  return envModel;
}

interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

/**
 * Menjalankan inferensi LLM via Groq dengan penanganan fallback otomatis.
 */
export async function executeGroqChatCompletion(
  messages: AIChatMessage[],
  options: CompletionOptions = {}
): Promise<{ text: string; modelUsed: string }> {
  const groq = getGroqClient();
  const primaryModel = getActiveGroqModel();

  const formattedMessages = messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    const response = await groq.chat.completions.create({
      messages: formattedMessages,
      model: primaryModel,
      temperature: options.temperature ?? 0.6,
      max_tokens: options.maxTokens ?? 1024,
      top_p: options.topP ?? 0.9,
    });

    const reply = response.choices[0]?.message?.content || "";
    return { text: reply, modelUsed: primaryModel };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.warn(`[Groq AI] Panggilan dengan model ${primaryModel} gagal (${errorMessage}), mencoba fallback ke ${FAST_MODEL}...`);

    // Coba fallback kedua menggunakan model 20B
    try {
      const fallbackResponse = await groq.chat.completions.create({
        messages: formattedMessages,
        model: FAST_MODEL,
        temperature: options.temperature ?? 0.6,
        max_tokens: options.maxTokens ?? 1024,
      });

      const fallbackReply = fallbackResponse.choices[0]?.message?.content || "";
      return { text: fallbackReply, modelUsed: FAST_MODEL };
    } catch (fallbackErr: unknown) {
      const finalMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
      throw new Error(`Gagal memproses inferensi AI Groq: ${finalMsg}`);
    }
  }
}
