import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

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

export const createClient = async (request: NextRequest) => {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Fast-path: Check if any Supabase authentication token cookies exist
  const allCookies = request.cookies.getAll();
  const authCookies = allCookies.filter(
    (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
  );

  // If no auth tokens exist at all, skip outbound Supabase Auth call (prevents blocking navigation for guests/public pages)
  if (authCookies.length === 0) {
    return supabaseResponse;
  }

  // Fast-path for prefetch: Next.js prefetch requests do not commit cookie updates
  const isPrefetch =
    request.headers.get("next-router-prefetch") === "1" ||
    request.headers.get("purpose") === "prefetch";

  if (isPrefetch) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    },
  );

  // Refresh session by calling getUser only for active authenticated user navigations
  try {
    const { error } = await supabase.auth.getUser();
    if (error && (error.name === "AuthApiError" || error.message?.includes("Refresh Token"))) {
      // Hapus cookie sesi basi yang sudah tidak valid di database Supabase agar tidak memicu loop error
      authCookies.forEach((c) => {
        request.cookies.delete(c.name);
        supabaseResponse.cookies.delete(c.name);
      });
    }
  } catch {
    authCookies.forEach((c) => {
      request.cookies.delete(c.name);
      supabaseResponse.cookies.delete(c.name);
    });
  }

  return supabaseResponse;
};
