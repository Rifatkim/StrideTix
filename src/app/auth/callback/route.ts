import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/login?reset=success";

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Handle PKCE code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[Auth Callback] Exchange code error:", error);
  }

  // 2. Handle token_hash verification (OTP / recovery link)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[Auth Callback] Verify OTP error:", error);
  }

  // 3. Fallback: If code/token_hash wasn't matched or had issues, redirect to login with error notice
  return NextResponse.redirect(`${origin}/login?reset=success&error=auth_callback_failed`);
}

