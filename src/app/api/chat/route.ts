import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerSupabase } from "@/utils/supabase/server";
import { executeGroqChatCompletion } from "@/lib/ai/groqClient";
import { RUNNING_ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai/prompts";
import { AIChatMessage, ChatRequestBody } from "@/types/ai";
import { fetchRunnerFitnessContext, fetchActiveEventsContext } from "@/lib/ai/eventContext";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // 1. Verifikasi Autentikasi Pelari (FR-CHAT-01)
    const cookieStore = cookies();
    const supabase = createServerSupabase(cookieStore);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "Akses ditolak. Fitur AI Running Assistant hanya tersedia untuk pengguna yang telah masuk.",
        },
        { status: 401 }
      );
    }

    // Rate Limiting per user (OWASP LLM10 / DoS Guard)
    const { checkRateLimit } = await import("@/lib/security/rateLimit");
    const rateCheck = checkRateLimit(`chat_${user.id}`, 15, 60 * 1000); // 15 requests/minute
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Batas frekuensi chat terlampaui. Mohon tunggu beberapa detik sebelum mengajukan pertanyaan lagi.",
          reply: "Terlalu banyak pesan terkirim dalam waktu singkat. Mohon istirahat sejenak sebelum bertanya kembali.",
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as ChatRequestBody;
    const { messages, runnerContext } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "Daftar pesan tidak boleh kosong." },
        { status: 400 }
      );
    }

    // 2. Ambil Riwayat Lari dari DB dan Daftar Event Aktif StrideTix (FR-CHAT-03)
    const [fitnessContext, eventsContext] = await Promise.all([
      fetchRunnerFitnessContext(supabase, user.id, runnerContext),
      fetchActiveEventsContext(supabase),
    ]);

    const dynamicSystemPrompt = `${RUNNING_ASSISTANT_SYSTEM_PROMPT}\n\n${fitnessContext}\n\n${eventsContext}`;

    // Ambil maksimal 8 riwayat pesan terakhir untuk efisiensi token
    const recentMessages = messages.slice(-8);

    const fullMessages: AIChatMessage[] = [
      { role: "system", content: dynamicSystemPrompt },
      ...recentMessages,
    ];

    // 3. Eksekusi Inferensi AI Groq
    const { text, modelUsed } = await executeGroqChatCompletion(fullMessages, {
      temperature: 0.35,
      maxTokens: 2500,
    });

    return NextResponse.json({
      success: true,
      reply: text,
      modelUsed,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan pada layanan AI Assistant.";
    console.error("[Chat API Error]:", errorMsg);

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        reply:
          "Maaf, saat ini asisten AI sedang mengalami gangguan koneksi ke server. Silakan coba ajukan pertanyaan Anda kembali beberapa saat lagi.",
      },
      { status: 500 }
    );
  }
}
