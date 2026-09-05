"use client";

import React, { useState } from "react";
import {
  CheckCheck,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-context";
import { formatDate, formatRupiah } from "@/lib/utils";
import { PeriodPayment } from "@/data/mock-data";

export default function VerifikasiIuranPage() {
  const { currentUser, users, periods, payments, verifyPayment } = useArisan();
  const { success, error, info } = useToast();

  const [activeFilter, setActiveFilter] = useState<"PENDING" | "PAID" | "ALL">("PENDING");
  const [selectedPayment, setSelectedPayment] = useState<PeriodPayment | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isReviewer = currentUser?.role === "REVIEWER";

  const filteredPayments = payments.filter((p) => {
    if (activeFilter === "ALL") return true;
    return p.status === activeFilter;
  });

  const handleOpenPreview = (payment: PeriodPayment) => {
    setSelectedPayment(payment);
    setIsPreviewOpen(true);
  };

  const handleApprove = (paymentId: string) => {
    verifyPayment(paymentId, "PAID");
    success("Pembayaran Terverifikasi LUNAS", "Status anggota telah diperbarui dan notifikasi disiapkan.");
    setIsPreviewOpen(false);
  };

  const handleReject = (paymentId: string) => {
    verifyPayment(paymentId, "UNPAID");
    error("Pembayaran Ditolak", "Status dikembalikan ke Belum Bayar agar anggota mengunggah ulang bukti valid.");
    setIsPreviewOpen(false);
  };

  const handleReviewerAudit = () => {
    info("Audit Reviewer Selesai", "Seluruh bukti transfer telah ditandai diperiksa oleh Auditor Pengawas.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Verifikasi Bukti Transfer Iuran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tinjau slip transfer bank dari anggota dan ubah status menjadi LUNAS atau TOLAK jika tidak valid.
          </p>
        </div>

        {isReviewer && (
          <Button
            size="sm"
            onClick={handleReviewerAudit}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1.5 h-9 shrink-0 shadow-xs"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Tandai Sudah Diperiksa (Audit)</span>
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg w-fit border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveFilter("PENDING")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
            activeFilter === "PENDING"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Menunggu Verifikasi ({payments.filter((p) => p.status === "PENDING").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("PAID")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
            activeFilter === "PAID"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sudah Terverifikasi Lunas ({payments.filter((p) => p.status === "PAID").length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter("ALL")}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer ${
            activeFilter === "ALL"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Semua Riwayat ({payments.length})
        </button>
      </div>

      {/* Verifications Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anggota Penyetor</TableHead>
                <TableHead>Periode Arisan</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Tanggal Kirim</TableHead>
                <TableHead>Bukti Transfer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi Verifikasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((pay) => {
                const member = users.find((u) => u.id === pay.memberId);
                const period = periods.find((prd) => prd.id === pay.periodId);

                return (
                  <TableRow key={pay.id}>
                    <TableCell className="font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member?.photoUrl}
                          alt={member?.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold">{member?.name}</p>
                          <p className="text-[10px] text-slate-400">{member?.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 font-medium">
                      {period?.name || pay.periodId}
                    </TableCell>
                    <TableCell className="font-bold tabular-nums text-slate-900">
                      {formatRupiah(pay.amount)}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500">
                      {pay.paidAt ? formatDate(pay.paidAt) : "-"}
                    </TableCell>
                    <TableCell>
                      {pay.transferProofUrl ? (
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(pay)}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Periksa Bukti</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada lampiran</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {pay.status === "PAID" && <Badge variant="lunas">LUNAS</Badge>}
                      {pay.status === "PENDING" && <Badge variant="menunggu">PENDING</Badge>}
                      {pay.status === "UNPAID" && <Badge variant="belum">BELUM</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenPreview(pay)}
                          className="h-7 text-xs"
                        >
                          Tinjau
                        </Button>

                        {!isReviewer && pay.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(pay.id)}
                              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            >
                              Lunas
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(pay.id)}
                              className="h-7 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                            >
                              Tolak
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filteredPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-xs text-slate-400">
                    Tidak ada transaksi dengan filter status ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Preview Bukti Transfer & Action */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Verifikasi Bukti Transfer</DialogTitle>
            <DialogDescription>
              Pastikan nama pengirim dan nominal sesuai dengan mutasi rekening bank kas arisan.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="space-y-4 mt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Penyetor:</span>
                  <span className="font-bold text-slate-900">
                    {users.find((u) => u.id === selectedPayment.memberId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Nominal Transfer:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {formatRupiah(selectedPayment.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Catatan Anggota:</span>
                  <span className="text-slate-700 italic">{selectedPayment.note || "Transfer Bank"}</span>
                </div>
              </div>

              {/* Photo */}
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-80 flex items-center justify-center">
                {selectedPayment.transferProofUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPayment.transferProofUrl}
                    alt="Slip Pembayaran"
                    className="max-h-80 object-contain w-full"
                  />
                ) : (
                  <p className="text-xs text-slate-400 py-12">Tidak ada berkas bukti foto terlampir.</p>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-xs"
                >
                  Tutup
                </Button>

                {!isReviewer && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleReject(selectedPayment.id)}
                      className="text-xs text-rose-600 border-rose-300 hover:bg-rose-50"
                    >
                      Tolak Slip
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleApprove(selectedPayment.id)}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      Verifikasi Lunas
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
