import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { ETicket } from "@/types";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFCF8",
    padding: 30,
    fontFamily: "Helvetica",
  },
  topHeaderBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E8DDD0",
  },
  topBrandText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#241C17",
    letterSpacing: 0.5,
  },
  topBrandSub: {
    fontSize: 8,
    color: "#8C8178",
  },
  ticketContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8DDD0",
    overflow: "hidden",
  },
  ticketHeader: {
    backgroundColor: "#241C17",
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ticketBrandTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  ticketBrandSubtitle: {
    color: "#F97316",
  },
  statusBadge: {
    backgroundColor: "#18864B",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  eventSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3EDE5",
  },
  eventSeriesLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#F97316",
    letterSpacing: 1,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  eventTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  eventTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#241C17",
    maxWidth: 380,
    lineHeight: 1.25,
  },
  categoryBadge: {
    backgroundColor: "#F97316",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryBadgeLabel: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  categoryBadgeValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
  },
  metaGrid: {
    flexDirection: "row",
    backgroundColor: "#FFF8EE",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8DDD0",
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#8C8178",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#241C17",
  },
  stubSection: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantCol: {
    flex: 1,
    paddingRight: 15,
  },
  bibLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#8C8178",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  bibValue: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#F97316",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  participantLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#8C8178",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  participantName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#241C17",
    marginBottom: 2,
  },
  participantEmail: {
    fontSize: 8,
    color: "#665C54",
    marginBottom: 10,
  },
  ticketCodeBox: {
    backgroundColor: "#241C17",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  ticketCodeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  qrCol: {
    width: 140,
    alignItems: "center",
    backgroundColor: "#FFF8EE",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E8DDD0",
  },
  qrImage: {
    width: 110,
    height: 110,
    backgroundColor: "#FFFFFF",
    padding: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  qrInstruction: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#241C17",
    textTransform: "uppercase",
  },
  qrSub: {
    fontSize: 6,
    color: "#8C8178",
  },
  ticketFooter: {
    backgroundColor: "#FFF8EE",
    paddingVertical: 8,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E8DDD0",
  },
  footerNote: {
    fontSize: 7,
    color: "#665C54",
  },
  footerOrder: {
    fontSize: 7,
    color: "#8C8178",
  },
  instructionsCard: {
    marginTop: 18,
    padding: 12,
    backgroundColor: "#FFF8EE",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8DDD0",
  },
  instructionsTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#241C17",
    marginBottom: 4,
  },
  instructionsItem: {
    fontSize: 7,
    color: "#665C54",
    marginBottom: 2,
    lineHeight: 1.3,
  },
  docStamp: {
    marginTop: 14,
    fontSize: 6.5,
    color: "#A0968C",
    textAlign: "center",
  },
});

interface ETicketDocumentProps {
  ticket: ETicket;
  qrDataUrl: string;
}

export function ETicketDocument({ ticket, qrDataUrl }: ETicketDocumentProps) {
  const formattedDate = new Date(ticket.eventDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document title={`StrideTix-Pass-${ticket.ticketCode}`}>
      <Page size="A4" style={styles.page}>
        {/* Top Header Bar */}
        <View style={styles.topHeaderBar}>
          <Text style={styles.topBrandText}>
            STRIDETIX — OFFICIAL RACE PASS & E-TICKET
          </Text>
          <Text style={styles.topBrandSub}>
            BUKTI RESMI REGISTRASI PESERTA LOMBA
          </Text>
        </View>

        {/* Ticket Container */}
        <View style={styles.ticketContainer}>
          {/* Ticket Header */}
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketBrandTitle}>
              Stride<Text style={styles.ticketBrandSubtitle}>Tix</Text> Pass
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>
                {ticket.status === "checked_in" ? "SUDAH CHECK-IN" : "TIKET RESMI • ISSUED"}
              </Text>
            </View>
          </View>

          {/* Event Section */}
          <View style={styles.eventSection}>
            <Text style={styles.eventSeriesLabel}>Race Series 2026</Text>
            <View style={styles.eventTitleRow}>
              <Text style={styles.eventTitle}>{ticket.eventTitle}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeLabel}>KATEGORI</Text>
                <Text style={styles.categoryBadgeValue}>{ticket.categoryName}</Text>
              </View>
            </View>

            {/* Meta Grid */}
            <View style={styles.metaGrid}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>TANGGAL LOMBA</Text>
                <Text style={styles.metaValue}>{formattedDate}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>WAKTU FLAG-OFF</Text>
                <Text style={styles.metaValue}>{ticket.startTime}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>LOKASI & KOTA</Text>
                <Text style={styles.metaValue}>{ticket.venue}, {ticket.city}</Text>
              </View>
            </View>
          </View>

          {/* Stub Section */}
          <View style={styles.stubSection}>
            {/* Participant info */}
            <View style={styles.participantCol}>
              <Text style={styles.bibLabel}>NOMOR DADA (BIB NAME)</Text>
              <Text style={styles.bibValue}>{ticket.bibName}</Text>

              <Text style={styles.participantLabel}>NAMA PESERTA</Text>
              <Text style={styles.participantName}>{ticket.participantName}</Text>
              <Text style={styles.participantEmail}>{ticket.participantEmail}</Text>

              <Text style={styles.participantLabel}>KODE VALIDASI E-TICKET</Text>
              <View style={styles.ticketCodeBox}>
                <Text style={styles.ticketCodeText}>{ticket.ticketCode}</Text>
              </View>
            </View>

            {/* QR Code */}
            <View style={styles.qrCol}>
              {qrDataUrl ? (
                /* eslint-disable-next-line jsx-a11y/alt-text */
                <Image src={qrDataUrl} style={styles.qrImage} />
              ) : null}
              <Text style={styles.qrInstruction}>PINDAI DI GATE CHECK-IN</Text>
              <Text style={styles.qrSub}>Tunjukkan ke Panitia Lomba</Text>
            </View>
          </View>

          {/* Ticket Footer */}
          <View style={styles.ticketFooter}>
            <Text style={styles.footerNote}>
              Tunjukkan QR Code ini pada saat pengambilan Race Pack (RPC) atau di Gate masuk.
            </Text>
            <Text style={styles.footerOrder}>Order: {ticket.orderId}</Text>
          </View>
        </View>

        {/* Instructions Card */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>PANDUAN & PETUNJUK HARI-H:</Text>
          <Text style={styles.instructionsItem}>
            1. Simpan dokumen PDF ini di smartphone Anda atau cetak fisik untuk ditunjukkan saat pengambilan Race Pack (RPC).
          </Text>
          <Text style={styles.instructionsItem}>
            2. Pastikan QR Code tidak terlipat, rusak, atau terhalang saat dipindai oleh Panitia Validator di Gate Check-in.
          </Text>
          <Text style={styles.instructionsItem}>
            3. Tiket ini bersifat unik dan hanya berlaku untuk 1 kali check-in resmi atas nama peserta terdaftar.
          </Text>
        </View>

        {/* Timestamp */}
        <Text style={styles.docStamp}>
          Dokumen diterbitkan secara otomatis oleh sistem StrideTix pada {new Date().toLocaleString("id-ID")} WIB • ID Autentikasi Terverifikasi
        </Text>
      </Page>
    </Document>
  );
}
