import { createClient } from "@/utils/supabase/client";

export interface RunnerProfileData {
  fullName: string;
  email: string;
  phoneNumber: string;
  city: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  bloodType: string;
  jerseySize: string;
  medicalNotes: string;
}

export const EMPTY_PROFILE: RunnerProfileData = {
  fullName: "",
  email: "",
  phoneNumber: "",
  city: "",
  emergencyName: "",
  emergencyRelation: "Teman/Rekan Kerja",
  emergencyPhone: "",
  bloodType: "O",
  jerseySize: "M",
  medicalNotes: "",
};

const STORAGE_KEY = "stridetix_runner_profile";

/**
 * Fetch runner personal profile from Supabase (Auth user_metadata or runner_profiles table),
 * falling back to localStorage if offline.
 */
export async function getRunnerProfile(
  userId?: string,
  userEmail?: string,
  userName?: string
): Promise<RunnerProfileData> {
  const fallback: RunnerProfileData = {
    ...EMPTY_PROFILE,
    fullName: userName || "",
    email: userEmail || "",
  };

  // 1. Try to fetch from Supabase
  try {
    const supabase = createClient();

    // Check Supabase Auth user metadata
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user?.user_metadata?.runner_profile) {
      const metaProfile = user.user_metadata.runner_profile as Partial<RunnerProfileData>;
      const merged: RunnerProfileData = {
        ...fallback,
        ...metaProfile,
        fullName: metaProfile.fullName || user.user_metadata.full_name || userName || "",
        email: metaProfile.email || user.email || userEmail || "",
      };

      // Keep local storage updated
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // Ignore storage errors
        }
      }
      return merged;
    }

    // Try fetching from runner_profiles table if present
    if (userId || user?.id) {
      const targetId = userId || user?.id;
      const { data: dbProfile } = await supabase
        .from("runner_profiles")
        .select("phone_number, city, emergency_name, emergency_relation, emergency_phone, blood_type, jersey_size, medical_notes")
        .eq("user_id", targetId)
        .maybeSingle();

      if (dbProfile && (dbProfile.phone_number || dbProfile.emergency_name || dbProfile.city)) {
        const merged: RunnerProfileData = {
          ...fallback,
          phoneNumber: dbProfile.phone_number || "",
          city: dbProfile.city || "",
          emergencyName: dbProfile.emergency_name || "",
          emergencyRelation: dbProfile.emergency_relation || "Teman/Rekan Kerja",
          emergencyPhone: dbProfile.emergency_phone || "",
          bloodType: dbProfile.blood_type || "O",
          jerseySize: dbProfile.jersey_size || "M",
          medicalNotes: dbProfile.medical_notes || "",
        };

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // Ignore
          }
        }
        return merged;
      }
    }
  } catch (err) {
    console.warn("Supabase profile fetch fallback to localStorage:", err);
  }

  // 2. Fallback to localStorage if Supabase has not recorded it yet
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...fallback,
          ...parsed,
          fullName: parsed.fullName || userName || "",
          email: parsed.email || userEmail || "",
        };
      }
    } catch {
      // Ignore
    }
  }

  return fallback;
}

/**
 * Persist runner personal profile to Supabase across all devices
 * (Auth user_metadata + runner_profiles table + localStorage).
 */
export async function saveRunnerProfile(
  userId: string | undefined,
  profileData: RunnerProfileData
): Promise<boolean> {
  // 1. Save to localStorage immediately for instant UI responsiveness
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    } catch {
      // Ignore
    }
  }

  // 2. Persist to Supabase
  try {
    const supabase = createClient();

    // A. Update Supabase Auth user_metadata (works cross-device immediately)
    await supabase.auth.updateUser({
      data: {
        full_name: profileData.fullName,
        runner_profile: profileData,
      },
    });

    // B. Update public.users table full_name if user is authenticated
    if (userId && profileData.fullName) {
      await supabase
        .from("users")
        .update({ full_name: profileData.fullName })
        .eq("id", userId);
    }

    // C. Upsert into runner_profiles table
    if (userId) {
      await supabase
        .from("runner_profiles")
        .upsert(
          {
            user_id: userId,
            phone_number: profileData.phoneNumber,
            city: profileData.city,
            emergency_name: profileData.emergencyName,
            emergency_relation: profileData.emergencyRelation,
            emergency_phone: profileData.emergencyPhone,
            blood_type: profileData.bloodType,
            jersey_size: profileData.jerseySize,
            medical_notes: profileData.medicalNotes,
            last_calculated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
    }

    return true;
  } catch (err) {
    console.error("Gagal sinkronisasi data profil ke Supabase:", err);
    return false;
  }
}
