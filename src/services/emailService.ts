/**
 * StrideTix Email Service via Resend REST API
 * Lightweight native fetch implementation without extra SDK dependencies
 */

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  id?: string;
  error?: string;
}

const RESEND_API_URL = "https://api.resend.com/emails";

/**
 * Core function to send email via Resend REST API
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
}: SendEmailParams): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || "StrideTix <onboarding@resend.dev>";

  if (!apiKey) {
    console.warn("[EmailService] RESEND_API_KEY is not configured.");
    return {
      success: false,
      error: "RESEND_API_KEY tidak dikonfigurasi di environment variables.",
    };
  }

  const recipients = Array.isArray(to) ? to : [to];

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: recipients,
        subject,
        html,
        text,
        reply_to: replyTo,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[EmailService] Resend API error:", data);
      return {
        success: false,
        error: data?.message || "Gagal mengirim email melalui Resend.",
      };
    }

    return {
      success: true,
      id: data?.id,
    };
  } catch (err: any) {
    console.error("[EmailService] Network/Fetch error:", err);
    return {
      success: false,
      error: err?.message || "Kesalahan jaringan saat menghubungi Resend API.",
    };
  }
}

/**
 * Template Email E-Ticket Resmi StrideTix
 */
export async function sendTicketConfirmationEmail({
  to,
  ticketCode,
  eventTitle,
  eventDate,
  startTime,
  venue,
  city,
  categoryName,
  bibName,
  participantName,
  qrPayload,
}: {
  to: string;
  ticketCode: string;
  eventTitle: string;
  eventDate: string;
  startTime: string;
  venue: string;
  city: string;
  categoryName: string;
  bibName: string;
  participantName: string;
  qrPayload?: string;
}): Promise<EmailSendResult> {
  const subject = `E-Ticket Resmi: ${eventTitle} [${ticketCode}]`;
  const bibNumber = ticketCode.split("-").pop() || ticketCode.slice(-4);

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #2B1E16; }
        .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EFEAE4; overflow: hidden; box-shadow: 0 4px 12px rgba(43,30,22,0.06); }
        .header { background: #EA580C; padding: 28px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
        .content { padding: 28px 24px; }
        .badge { display: inline-block; padding: 4px 12px; background: #FFF7ED; color: #EA580C; border: 1px solid #FFEDD5; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
        .ticket-box { background: #FAF8F5; border: 1px dashed #D6C7B8; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; }
        .ticket-code { font-family: monospace; font-size: 20px; font-weight: 800; color: #EA580C; letter-spacing: 2px; }
        .info-grid { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .info-grid td { padding: 8px 0; font-size: 13px; border-bottom: 1px solid #F2ECE4; }
        .info-grid td.label { color: #786B62; width: 40%; font-weight: 500; }
        .info-grid td.value { color: #2B1E16; font-weight: 700; text-align: right; }
        .footer { background: #FAF8F5; padding: 20px 24px; text-align: center; font-size: 11px; color: #786B62; border-top: 1px solid #EFEAE4; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>StrideTix E-Ticket</h1>
          <p>Konfirmasi Pendaftaran & Tiket Lomba Resmi</p>
        </div>
        <div class="content">
          <span class="badge">Pendaftaran Terkonfirmasi</span>
          <h2 style="margin: 0 0 8px; font-size: 18px; color: #2B1E16;">Halo, ${participantName}!</h2>
          <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #52443B;">
            Selamat! Pendaftaran lomba lari Anda telah berhasil diverifikasi oleh sistem StrideTix. Berikut adalah rincian E-Ticket Anda:
          </p>

          <div class="ticket-box">
            <div style="font-size: 11px; text-transform: uppercase; color: #786B62; margin-bottom: 8px; font-weight: 700;">QR Code & Kode E-Ticket</div>
            <div style="background: #ffffff; display: inline-block; padding: 12px; border-radius: 12px; border: 1px solid #EFEAE4; margin-bottom: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrPayload || ticketCode)}&margin=10&color=24-28-23" 
                alt="QR Code Tiket ${ticketCode}"
                width="180"
                height="180"
                style="display: block; margin: 0 auto; border-radius: 6px;"
              />
            </div>
            <div class="ticket-code">${ticketCode}</div>
            <div style="font-size: 13px; color: #52443B; margin-top: 8px;">
              No. BIB: <strong style="color: #EA580C; font-size: 16px; font-family: monospace; letter-spacing: 1px;">${bibNumber}</strong> (${bibName}) &bull; Kategori: <strong>${categoryName}</strong>
            </div>
            <div style="font-size: 11px; color: #EA580C; margin-top: 4px; font-weight: 600;">Scan di Gate Check-in Hari-H</div>
          </div>

          <table class="info-grid">
            <tr>
              <td class="label">Nama Event</td>
              <td class="value">${eventTitle}</td>
            </tr>
            <tr>
              <td class="label">Nomor BIB</td>
              <td class="value" style="color: #EA580C; font-size: 15px; font-weight: 800; font-family: monospace;">${bibNumber}</td>
            </tr>
            <tr>
              <td class="label">Nama di BIB</td>
              <td class="value">${bibName}</td>
            </tr>
            <tr>
              <td class="label">Tanggal Lomba</td>
              <td class="value">${eventDate}</td>
            </tr>
            <tr>
              <td class="label">Waktu Start</td>
              <td class="value">${startTime} WIB</td>
            </tr>
            <tr>
              <td class="label">Lokasi / Venue</td>
              <td class="value">${venue}, ${city}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding: 14px; background: #FFF7ED; border-radius: 10px; border-left: 4px solid #EA580C; font-size: 12px; color: #9A3412;">
            <strong>Petunjuk Race Pack:</strong> Tunjukkan email ini atau scan QR Code di aplikasi StrideTix saat pengambilan Race Pack di Race Village.
          </div>
        </div>
        <div class="footer">
          &copy; 2026 StrideTix Indonesia &bull; Smart Race Ticketing Platform<br>
          Email dikirim otomatis melalui Resend API &bull; oscartambunan.my.id
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text: `E-Ticket StrideTix: ${eventTitle} - Kode Tiket: ${ticketCode}. No. BIB: ${bibNumber} (${bibName}), Kategori: ${categoryName}, Tanggal: ${eventDate} di ${venue}, ${city}.`,
  });
}

/**
 * Template Email Kode OTP (2FA Gmail)
 */
export async function sendOtpVerificationEmail({
  to,
  otpCode,
  purpose = "Verifikasi Dua Langkah (2FA)",
}: {
  to: string;
  otpCode: string;
  purpose?: string;
}): Promise<EmailSendResult> {
  const subject = `Kode Verifikasi StrideTix: ${otpCode}`;

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #2B1E16; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EFEAE4; padding: 32px 24px; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; color: #2B1E16; margin-bottom: 20px; }
        .logo span { color: #EA580C; }
        .otp-box { background: #FFF7ED; border: 2px dashed #EA580C; border-radius: 12px; padding: 16px; margin: 24px 0; font-family: monospace; font-size: 32px; font-weight: 800; color: #EA580C; letter-spacing: 6px; }
        .desc { font-size: 13px; color: #52443B; line-height: 1.5; }
        .warning { font-size: 11px; color: #9A3412; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">Stride<span>Tix</span></div>
        <h2 style="font-size: 18px; margin: 0 0 8px; color: #2B1E16;">${purpose}</h2>
        <p class="desc">Gunakan kode OTP berikut untuk melanjutkan autentikasi akun Anda. Kode ini berlaku selama 10 menit.</p>
        <div class="otp-box">${otpCode}</div>
        <p class="desc">Jangan berikan kode ini kepada siapa pun termasuk pihak yang mengatasnamakan StrideTix.</p>
        <p class="warning">Jika Anda tidak meminta kode ini, silakan abaikan email ini.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text: `Kode verifikasi StrideTix Anda adalah ${otpCode}. Kode berlaku 10 menit.`,
  });
}

/**
 * Template Email Permintaan Reset Password StrideTix
 */
export async function sendPasswordResetEmail({
  to,
  resetLink,
}: {
  to: string;
  resetLink: string;
}): Promise<EmailSendResult> {
  const subject = "Reset Password Akun StrideTix";

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #2B1E16; }
        .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EFEAE4; padding: 32px 24px; text-align: center; }
        .logo { font-size: 24px; font-weight: 900; color: #2B1E16; margin-bottom: 20px; }
        .logo span { color: #EA580C; }
        .btn { display: inline-block; background-color: #EA580C; color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 28px; border-radius: 10px; margin: 24px 0; }
        .desc { font-size: 13px; color: #52443B; line-height: 1.6; }
        .warning { font-size: 11px; color: #9A3412; margin-top: 24px; border-top: 1px solid #F0ECE6; pt: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">Stride<span>Tix</span></div>
        <h2 style="font-size: 18px; margin: 0 0 10px; color: #2B1E16;">Permintaan Reset Password</h2>
        <p class="desc">Kami menerima permintaan untuk membuat password baru untuk akun StrideTix Anda. Silakan klik tombol di bawah untuk melanjutkan:</p>
        <a href="${resetLink}" class="btn">Buat Password Baru</a>
        <p class="desc" style="font-size: 11px; color: #8A7B70;">Tautan ini berlaku selama 1 jam. Jika tombol di atas tidak dapat diklik, salin tautan berikut ke browser:<br><span style="word-break: break-all; color: #EA580C;">${resetLink}</span></p>
        <p class="warning">Jika Anda tidak meminta reset password, silakan abaikan email ini. Akun Anda tetap aman.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text: `Permintaan reset password StrideTix. Buka tautan berikut untuk membuat password baru: ${resetLink}`,
  });
}


/**
 * Template Email Instruksi Pembayaran (QRIS / Virtual Account)
 */
export async function sendPaymentInstructionEmail({
  to,
  participantName,
  eventTitle,
  categoryName,
  totalAmount,
  paymentMethod,
  vaNumber,
  bankName = "BCA",
  qrisValue,
}: {
  to: string;
  participantName: string;
  eventTitle: string;
  categoryName: string;
  totalAmount: number;
  paymentMethod: "qris" | "va";
  vaNumber?: string;
  bankName?: string;
  qrisValue?: string;
}): Promise<EmailSendResult> {
  const subject = `Instruksi Pembayaran Tiket: ${eventTitle}`;
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(totalAmount);

  const qrisHtml = qrisValue
    ? `
      <div style="background: #ffffff; display: inline-block; padding: 14px; border-radius: 12px; border: 1px solid #EFEAE4; margin: 12px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.05); text-align: center;">
        <img 
          src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrisValue)}&margin=10&color=24-28-23" 
          alt="QRIS Pembayaran StrideTix"
          width="190"
          height="190"
          style="display: block; margin: 0 auto; border-radius: 6px;"
        />
        <div style="font-size: 12px; font-weight: bold; color: #EA580C; margin-top: 10px;">NMID: ID1020260987654</div>
        <div style="font-size: 11px; color: #786B62; margin-top: 4px;">Scan via GoPay, OVO, Dana, BCA Mobile, Livin, dll.</div>
      </div>
    `
    : "";

  const vaHtml = vaNumber
    ? `
      <div style="background: #FAF8F5; border: 1px solid #EFEAE4; border-radius: 12px; padding: 18px; margin: 16px 0; text-align: center;">
        <div style="font-size: 11px; text-transform: uppercase; color: #786B62; font-weight: 700;">Nomor Virtual Account (${bankName.toUpperCase()})</div>
        <div style="font-family: monospace; font-size: 24px; font-weight: 900; color: #EA580C; letter-spacing: 2px; margin: 8px 0;">${vaNumber}</div>
        <div style="font-size: 11px; color: #786B62;">Salin nomor di atas dan bayar melalui m-Banking / ATM ${bankName.toUpperCase()}</div>
      </div>
    `
    : "";

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FAF8F5; margin: 0; padding: 24px; color: #2B1E16; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #EFEAE4; overflow: hidden; box-shadow: 0 4px 12px rgba(43,30,22,0.06); }
        .header { background: #EA580C; padding: 24px 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
        .content { padding: 24px 20px; text-align: center; }
        .total-box { background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; padding: 16px; margin: 16px 0; }
        .footer { background: #FAF8F5; padding: 16px; text-align: center; font-size: 11px; color: #786B62; border-top: 1px solid #EFEAE4; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>StrideTix Pembayaran</h1>
          <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.9;">Instruksi Pembayaran Tiket Lomba</p>
        </div>
        <div class="content">
          <h2 style="font-size: 16px; margin: 0 0 6px; color: #2B1E16;">Halo, ${participantName}!</h2>
          <p style="font-size: 12px; color: #52443B; margin: 0 0 16px; line-height: 1.5;">
            Berikut adalah detail tagihan pembayaran untuk pendaftaran <strong>${eventTitle}</strong> (${categoryName}):
          </p>

          <div class="total-box">
            <span style="font-size: 11px; text-transform: uppercase; color: #9A3412; font-weight: 700; display: block;">Total Tagihan Pembayaran</span>
            <span style="font-size: 26px; font-weight: 900; color: #EA580C; display: block; margin-top: 4px;">${formattedPrice}</span>
          </div>

          ${paymentMethod === "qris" ? qrisHtml : vaHtml}

          <div style="margin-top: 20px; padding: 12px; background: #FEF3C7; border-radius: 8px; font-size: 11px; color: #92400E; text-align: left;">
            ⏰ <strong>Batas Waktu:</strong> Selesaikan pembayaran dalam 15 menit agar slot kategori tiket lomba Anda tidak dibatalkan otomatis oleh sistem.
          </div>
        </div>
        <div class="footer">
          &copy; 2026 StrideTix Indonesia &bull; Smart Race Ticketing Platform
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    html,
    text: `Instruksi Pembayaran StrideTix: ${eventTitle} (${categoryName}) - Total: ${formattedPrice}. Metode: ${paymentMethod.toUpperCase()}.`,
  });
}
