"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Eye,
  FileCheck,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function AnggotaPembayaranPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { users, payments, periods } = useArisan();
  const [previewProofUrl, setPreviewProofUrl] = useState<string | null>(null);

  const member = users.find((u) => u.id === resolvedParams.id);
  if (!member) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-base font-bold text-slate-800">Anggota Tidak Ditemukan</p>
        <Link href="/anggota" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Kembali</Button>
        </Link>
      </div>
    );
  }

  // Get payments for this member
  const memberPayments = payments.filter((p) => p.memberId === member.id);

  const totalPaid = memberPayments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalUnpaid = memberPayments
    .filter((p) => p.status === "UNPAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = memberPayments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <Link href={`/anggota/${member.id}`}>
          <Button variant="ghost" size="sm" className="gap-2 text-xs text-slate-600">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Profil {member.name}</span>
          </Button>
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4">
          <Avatar src={member.photoUrl} fallback={member.name} size="lg" className="border shadow-xs" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{member.name}</h1>
              <Badge variant="outline" className="text-xs">{member.position}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Hasil & Rekapitulasi Pembayaran Iuran Arisan Periode Berjalan
            </p>
          </div>
        </div>

        <Link href="/iuran-saya">
          <Button size="sm" className="gap-2 text-xs bg-blue-600 hover:bg-blue-700">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Setor Iuran Sekarang</span>
          </Button>
        </Link>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/50 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">Total Iuran Lunas</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-extrabold text-emerald-700 tabular-nums">
                {formatRupiah(totalPaid)}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">Telah diverifikasi Bendahara</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800">Menunggu Verifikasi</span>
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-extrabold text-amber-700 tabular-nums">
                {formatRupiah(totalPending)}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">Bukti bayar telah diunggah</p>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/50 shadow-xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800">Belum Dibayar / Tunggakan</span>
              <AlertCircle className="h-4 w-4 text-rose-600" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-extrabold text-rose-700 tabular-nums">
                {formatRupiah(totalUnpaid)}
              </span>
            </div>
            <p className="text-[11px] text-rose-700 mt-1 font-medium">Kekurangan periode aktif</p>
          </CardContent>
        </Card>
      </div>

      {/* Table Records */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-base font-bold text-slate-900">
            Riwayat Pembayaran Seluruh Periode
          </CardTitle>
          <CardDescription className="text-xs">
            Catatan setoran iuran berkala yang tercatat di sistem ArisanKeluarga.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Periode Arisan</TableHead>
                <TableHead>Nominal Iuran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Bayar</TableHead>
                <TableHead>Bukti Transfer</TableHead>
                <TableHead>Verifikator</TableHead>
                <TableHead>Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberPayments.map((p) => {
                const period = periods.find((prd) => prd.id === p.periodId);
                const verifier = users.find((u) => u.id === p.verifiedById);

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
                          onClick={() => setPreviewProofUrl(p.transferProofUrl || null)}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Lihat Bukti</span>
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Belum ada</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {verifier ? verifier.name : p.status === "PAID" ? "Administrator" : "-"}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                      {p.note || "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Preview Bukti Transfer */}
      <Dialog open={!!previewProofUrl} onOpenChange={() => setPreviewProofUrl(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bukti Transfer Pembayaran</DialogTitle>
            <DialogDescription>
              Lampiran foto slip transfer bank yang diunggah oleh {member.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
            {previewProofUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewProofUrl}
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
