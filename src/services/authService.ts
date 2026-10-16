import { createClient } from "@/utils/supabase/client";
import { AuthUser, LoginCredentials, RegisterPayload, UserRole } from "@/types";

/**
 * AuthService integrates Supabase Authentication with the StrideTix User Profile table.
 * All dummy demo roles have been removed to prepare for real user/eo/admin credentials.
 */

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient();
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return null;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user.id)
      .single();

    const role = (profile?.role || session.user.user_metadata?.role || "runner") as UserRole;
    const name = profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "User";

    return {
      id: session.user.id,
      email: session.user.email || "",
      name,
      role,
      organizerName: role === "organizer" ? session.user.user_metadata?.organizer_name || name : undefined,
      organizerStatus: role === "organizer" ? "verified" : undefined,
      createdAt: profile?.created_at || session.user.created_at,
    };
  } catch (err) {
    console.error("Error fetching current user session:", err);
    return null;
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const supabase = createClient();

  if (!credentials.email || !credentials.password) {
    throw new Error("Email dan password wajib diisi.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email.trim(),
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message || "Gagal masuk. Periksa kembali email dan password Anda.");
  }

  if (!data.user) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  // Fetch full profile from public.users
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  const role = (profile?.role || data.user.user_metadata?.role || "runner") as UserRole;
  const name = profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split("@")[0] || "User";

  return {
    id: data.user.id,
    email: data.user.email || credentials.email,
    name,
    role,
    organizerName: role === "organizer" ? data.user.user_metadata?.organizer_name || name : undefined,
    organizerStatus: role === "organizer" ? "verified" : undefined,
    createdAt: profile?.created_at || data.user.created_at,
  };
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const supabase = createClient();

  if (!payload.email || !payload.password) {
    throw new Error("Email dan password wajib diisi.");
  }

  const { data, error } = await supabase.auth.signUp({
    email: payload.email.trim(),
    password: payload.password,
    options: {
      data: {
        full_name: payload.name.trim(),
        role: payload.role,
        organizer_name: payload.role === "organizer" ? payload.organizerName || payload.name : undefined,
      },
    },
  });

  if (error) {
    throw new Error(error.message || "Gagal mendaftarkan akun. Silakan coba lagi.");
  }

  if (!data.user) {
    throw new Error("Pendaftaran gagal dibuat.");
  }

  // Ensure public.users entry exists (as redundancy in case trigger has delay)
  try {
    await supabase.from("users").upsert({
      id: data.user.id,
      email: data.user.email || payload.email,
      full_name: payload.name.trim(),
      role: payload.role,
    });
  } catch (upsertErr) {
    console.warn("Could not direct-upsert public.users (trigger handles this):", upsertErr);
  }

  return {
    id: data.user.id,
    email: data.user.email || payload.email,
    name: payload.name.trim(),
    role: payload.role,
    organizerName: payload.role === "organizer" ? payload.organizerName || payload.name : undefined,
    organizerStatus: payload.role === "organizer" ? "pending" : undefined,
    createdAt: data.user.created_at,
  };
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
}
