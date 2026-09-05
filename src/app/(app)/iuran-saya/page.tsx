"use client";

import React, { useState } from "react";
import {
  CreditCard,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  FileImage,
  Eye,
  Building2,
  Receipt,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-context";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function IuranSayaPage() {
  const { currentUser, activePeriod, periods, payments, settings, uploadPaymentProof } = useArisan();
  const { success, error, info } = useToast();

  const [copied, setCopied] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState(activePeriod?.id || "prd-12");

  // Upload Form State
  const [proofUrl, setProofUrl] = useState(
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80"
  );
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!currentUser) return null;

  // Filter payments for current logged in user
  const myPayments = payments.filter((p) => p.memberId === currentUser.id);
  const currentBill = myPayments.find((p) => p.periodId === activePeriod?.id);

  const handleCopyRekening = () => {
    navigator.clipboard.writeText(settings.accountNumber.replace(/[^0-9]/g, ""));
    setCopied(true);
    info("Nomor Rekening Disalin", `${settings.accountNumber} (${settings.bankName})`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenUpload = (periodId?: string) => {
    setSelectedPeriodId(periodId || activePeriod?.id || "prd-12");
    setNote("");
    setIsUploadModalOpen(true);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl) {
      error("Gagal", "Bukti transfer pembayaran wajib dilampirkan.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      uploadPaymentProof(selectedPeriodId, proofUrl, note);
      setIsSubmitting(false);
      setIsUploadModalOpen(false);

      try {
        confetti({
          particleCount: 70,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch (err) {}

      success(
        "Bukti Transfer Berhasil Diunggah!",
        "Status pembayaran kini MENUNGGU VERIFIKASI oleh Ibu Bendahara."
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <Receipt className="h-3.5 w-3.5 text-blue-200" />
            <span>Kewajiban Iuran Bulanan Pribadi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Iuran Arisan: {currentUser.name}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Lakukan setoran iuran melalui transfer manual ke rekening bendahara, lalu unggah bukti transfer di bawah ini.
          </p>
        </div>

        <Button
          onClick={() => handleOpenUpload()}
          className="bg-white text-blue-700 hover:bg-blue-50 shadow-md font-semibold text-xs h-10 gap-2 shrink-0"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Unggah Bukti Bayar</span>
        </Button>
      </div>

      {/* Grid: Bank Account Info & Current Period Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (6 cols): Official Bank Details */}
        <div className="lg:col-span-6">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50/60 to-white shadow-xs h-full flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-blue-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-blue-950 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                  <span>Rekening Resmi Tujuan Transfer</span>
                </CardTitle>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px]">
                  Manual Transfer
                </Badge>
              </div>
              <CardDescription className="text-xs text-blue-900/70">
                Gunakan rekening resmi bendahara arisan berikut untuk seluruh setoran iuran.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-white border border-blue-200/80 shadow-xs flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    {settings.bankName}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider font-mono">
                    {settings.accountNumber}
                  </span>
                  <span className="text-xs text-slate-600 block mt-0.5">
                    a.n. <strong>{settings.accountHolder}</strong>
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyRekening}
                  className="shrink-0 gap-1.5 text-xs h-9 border-blue-300 text-blue-700 hover:bg-blue-50 cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Tersalin" : "Salin No. Rekening"}</span>
                </Button>
              </div>

              <div className="space-y-1 text-xs text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <p>💡 <strong>Panduan Transfer:</strong></p>
                <p>1. Transfer sesuai nominal tagihan (<strong>{formatRupiah(activePeriod?.iuranAmount || 150000)}</strong>).</p>
                <p>2. Simpan resi/bukti transfer berupa foto atau screenshot mobile banking.</p>
                <p>3. Tekan tombol &quot;Unggah Bukti Bayar&quot; dan lampirkan bukti tersebut.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (6 cols): Status Iuran Aktif */}
        <div className="lg:col-span-6">
          <Card className="border-slate-200 shadow-xs h-full flex flex-col justify-between bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold text-slate-900">
                    Tagihan Berjalan: {activePeriod?.name}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Batas pembayaran: <strong>{formatDate(activePeriod?.dueDate || "2026-06-15")}</strong>
                  </CardDescription>
                </div>
                {currentBill?.status === "PAID" && <Badge variant="lunas">LUNAS</Badge>}
                {currentBill?.status === "PENDING" && <Badge variant="menunggu">MENUNGGU</Badge>}
                {(!currentBill || currentBill?.status === "UNPAID") && <Badge variant="belum">BELUM BAYAR</Badge>}
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="flex items-baseline justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Besaran Iuran Bulanan</span>
                  <span className="text-2xl font-black text-slate-900 tabular-nums">
                    {formatRupiah(activePeriod?.iuranAmount || 150000)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Status Setoran</span>
                  <span className="text-sm font-bold text-slate-800">
                    {currentBill?.status === "PAID"
                      ? "Sudah Diverifikasi"
                      : currentBill?.status === "PENDING"
                      ? "Sedang Ditinjau"
                      : "Menunggu Transfer"}
                  </span>
                </div>
              </div>

              {currentBill?.status === "PAID" ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span>Alhamdulillah, iuran periode ini telah diverifikasi lunas oleh Bendahara.</span>
                </div>
              ) : currentBill?.status === "PENDING" ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Bukti bayar sudah dikirim. Menunggu verifikasi admin.</span>
                  </div>
                  {currentBill.transferProofUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(currentBill.transferProofUrl || null)}
                      className="text-amber-800 font-bold underline cursor-pointer text-xs"
                    >
                      Lihat Bukti
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={() => handleOpenUpload(activePeriod?.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-xs font-semibold gap-2 h-10 shadow-xs"
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>Unggah Bukti Transfer Sekarang</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Payment History Table for Current User */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Riwayat Setoran Iuran Saya
          </CardTitle>
          <CardDescription className="text-xs">
            Daftar seluruh kewajiban dan rekaman pembayaran arisan Anda dari setiap periode.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periode</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Setor</TableHead>
                <TableHead>Bukti Bayar</TableHead>
                <TableHead>Catatan Anda</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myPayments.map((p) => {
                const period = periods.find((prd) => prd.id === p.periodId);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-semibold text-slate-900">
                      {period?.name || p.periodId}
                    </TableCell>
                    <TableCell className="font-bold tabular-nums text-slate-800">
                      {formatRupiah(p.amount)}
                    </TableCell>
                    <TableCell>
                      {p.status === "PAID" && <Badge variant="lunas">LUNAS</Badge>}
                      {p.status === "PENDING" && <Badge variant="menunggu">MENUNGGU</Badge>}
                      {p.status === "UNPAID" && <Badge variant="belum">BELUM BAYAR</Badge>}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {p.paidAt ? formatDate(p.paidAt) : "-"}
                    </TableCell>
                    <TableCell>
                      {p.transferProofUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewUrl(p.transferProofUrl || null)}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Lihat Bukti</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                      {p.note || "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {p.status !== "PAID" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenUpload(p.periodId)}
                          className="h-7 text-xs"
                        >
                          {p.status === "PENDING" ? "Unggah Ulang" : "Unggah Bukti"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Upload Bukti Transfer */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Unggah Bukti Transfer Iuran</DialogTitle>
            <DialogDescription>
              Kirimkan foto atau screenshot bukti transfer Anda untuk diverifikasi pengurus.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitProof} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Pilih Periode Iuran
              </label>
              <select
                value={selectedPeriodId}
                onChange={(e) => setSelectedPeriodId(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-300 text-xs px-3 bg-white"
              >
                {periods.map((prd) => (
                  <option key={prd.id} value={prd.id}>
                    {prd.name} — {formatRupiah(prd.iuranAmount)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Foto Bukti Slip / Screenshot Transfer
              </label>
              <div className="rounded-xl border-2 border-dashed border-slate-300 p-4 text-center hover:border-blue-500 transition bg-slate-50">
                <FileImage className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-700">Lampiran Bukti Siap</p>
                <p className="text-[11px] text-slate-400">Format: JPG, PNG, WEBP (Maksimal 2MB)</p>
                {proofUrl && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 inline-block max-h-32">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proofUrl} alt="Preview Bukti" className="h-28 object-contain mx-auto" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Catatan Pengirim (Opsional)
              </label>
              <Input
                placeholder="Contoh: Sudah ditransfer via BCA Mobile jam 09:30 WIB"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-xs bg-blue-600 hover:bg-blue-700 font-semibold"
              >
                {isSubmitting ? "Mengunggah..." : "Kirim Bukti Pembayaran"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Preview Bukti Transfer */}
      <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bukti Transfer Iuran</DialogTitle>
            <DialogDescription>
              Slip bukti bayar yang tersimpan di sistem ArisanKeluarga.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
            {previewUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Bukti Transfer Pembayaran"
                className="w-full max-h-96 object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
