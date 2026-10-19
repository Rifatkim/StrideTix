import React from "react";
import QRCode from "qrcode";
import { pdf } from "@react-pdf/renderer";
import { ETicket } from "@/types";
import { ETicketDocument } from "@/components/tickets/ETicketDocument";

/**
 * Generates and downloads a clean, native vector PDF e-ticket using @react-pdf/renderer.
 * Resolves clipping, font misalignment, and resolution artifacts by rendering real PDF primitives.
 */
export async function downloadTicketPDF(
  ticket: ETicket,
  fileName: string = `StrideTix-Pass-${ticket.ticketCode}.pdf`
): Promise<void> {
  // 1. Generate crisp Base64 Data URL for the QR Code
  const qrDataUrl = await QRCode.toDataURL(ticket.qrPayload, {
    width: 300,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "H",
  });

  // 2. Render native React-PDF Document to blob
  const doc = <ETicketDocument ticket={ticket} qrDataUrl={qrDataUrl} />;
  const asPdf = pdf(doc);
  const blob = await asPdf.toBlob();

  // 3. Trigger native browser download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
