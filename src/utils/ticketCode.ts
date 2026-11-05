/**
 * Utilitas pemrosesan dan normalisasi kode tiket StrideTix.
 * Mendukung ekstraksi kode tiket dari berbagai variasi payload QR:
 * - URL lengkap (e.g. https://.../tickets/STX-123456)
 * - Token verifikasi (STRIDETIX-TOKEN-STX-123456-VERIFIED)
 * - String raw kode tiket (STX-123456)
 */
export function extractTicketCode(rawPayload: string): string {
  const trimmed = rawPayload.trim();
  const matchToken = trimmed.match(/STRIDETIX-TOKEN-([A-Z0-9-]+)-VERIFIED/i);
  if (matchToken && matchToken[1]) return matchToken[1].toUpperCase();

  const matchUrl = trimmed.match(/tickets\/([A-Z0-9-]+)/i);
  if (matchUrl && matchUrl[1]) return matchUrl[1].toUpperCase();

  const matchStx = trimmed.match(/(STX-[A-Z0-9-]+)/i);
  if (matchStx && matchStx[1]) return matchStx[1].toUpperCase();

  return trimmed.toUpperCase();
}
