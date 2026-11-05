/**
 * In-memory OTP Store for Two-Factor Authentication (2FA)
 * Persisted on globalThis to survive Next.js dev reloads
 * Hardened with maximum attempts (lockout after 5 failed tries)
 */

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

const globalForOtp = globalThis as unknown as {
  strideTixOtpStore?: Map<string, OtpEntry>;
};

export const otpStore =
  globalForOtp.strideTixOtpStore || new Map<string, OtpEntry>();

if (process.env.NODE_ENV !== "production") {
  globalForOtp.strideTixOtpStore = otpStore;
}

/**
 * Generate 6-digit OTP and store it with 10-minute validity and attempt tracking
 */
export function generateOtp(email: string): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set(email.toLowerCase().trim(), { code, expiresAt, attempts: 0 });
  return code;
}

/**
 * Verify OTP against stored entry with brute-force protection (CWE-307)
 */
export function verifyOtp(email: string, inputCode: string): { valid: boolean; error?: string } {
  const normalizedEmail = email.toLowerCase().trim();
  const entry = otpStore.get(normalizedEmail);

  if (!entry) {
    return { valid: false, error: "Kode OTP tidak ditemukan atau belum diminta." };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { valid: false, error: "Kode OTP telah kadaluarsa. Silakan minta kode baru." };
  }

  if (entry.code !== inputCode.trim()) {
    entry.attempts += 1;
    if (entry.attempts >= 5) {
      otpStore.delete(normalizedEmail);
      return {
        valid: false,
        error: "Batas percobaan terlampaui (5x salah). Kode OTP telah dinonaktifkan demi keamanan. Silakan minta kode baru.",
      };
    }
    const remaining = 5 - entry.attempts;
    return {
      valid: false,
      error: `Kode OTP yang Anda masukkan salah. Sisa kesempatan: ${remaining}x.`,
    };
  }

  // Consume OTP immediately after successful verification (Single-use token)
  otpStore.delete(normalizedEmail);
  return { valid: true };
}
