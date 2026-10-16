"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TransactionsAuditTable } from "@/components/admin/TransactionsAuditTable";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Container } from "@/components/layout/Container";
import { getAllUserTickets } from "@/services/ticketService";
import { getStoredAuditLogs } from "@/services/adminService";
import { ETicket, AuditLogEntry } from "@/types";

export default function AdminTransactionsPage() {
  const [tickets, setTickets] = useState<ETicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const allTickets = await getAllUserTickets();
      const logs = getStoredAuditLogs();
      setTickets(allTickets);
      setAuditLogs(logs);
      setIsLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-sand-warm text-espresso font-sans">
      <Navbar />

      <Container as="main" className="flex-1 pt-6 pb-28 sm:pt-8 sm:pb-12 space-y-6">
        <AuthGuard allowedRole="admin">
          <AdminHeader
            title="Pengawasan Transaksi & Log Audit Sistem"
            subtitle="Telusuri seluruh riwayat pesanan tiket peserta, status pembayaran terverifikasi, dan rekam jejak administratif platform."
          />

          {isLoading ? (
            <div className="py-12 text-center text-xs text-espresso-muted">
              Memuat data transaksi dan audit log...
            </div>
          ) : (
            <TransactionsAuditTable tickets={tickets} auditLogs={auditLogs} />
          )}
        </AuthGuard>
      </Container>

      <Footer />
    </div>
  );
}
