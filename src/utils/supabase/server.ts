import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Suppress noisy internal GoTrue stale refresh token warnings on the server
if (typeof globalThis !== "undefined" && !(globalThis as any).__supabase_warn_patched) {
  (globalThis as any).__supabase_warn_patched = true;
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    const firstArg = args[0];
    if (
      firstArg &&
      (firstArg.code === "refresh_token_not_found" ||
        firstArg.code === "refresh_token_already_used" ||
        firstArg.code === "session_expired" ||
        (typeof firstArg.message === "string" &&
          firstArg.message.includes("Invalid Refresh Token")))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
};
