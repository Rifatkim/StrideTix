import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPace(paceMinPerKm: number): string {
  const minutes = Math.floor(paceMinPerKm);
  const seconds = Math.round((paceMinPerKm - minutes) * 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds} /km`;
}

export function formatDateIndonesian(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Cek apakah tanggal event lomba lari sudah lewat dari hari ini
 */
export function isEventPast(dateString?: string): boolean {
  if (!dateString) return false;
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return false;

    const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    return targetDay < today;
  } catch {
    return false;
  }
}
