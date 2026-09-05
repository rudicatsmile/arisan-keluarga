"use client";

import React, { useState } from "react";
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  CreditCard,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-context";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function RekapKeuanganPage() {
  const { users, periods, payments, socialExpenses } = useArisan();
  const { info } = useToast();

  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("ALL");

  // Calculations
  const filteredPayments =
    selectedPeriodId === "ALL"
      ? payments
      : payments.filter((p) => p.periodId === selectedPeriodId);

  const totalDanaMasuk = filteredPayments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = filteredPayments
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTunggakan = filteredPayments
    .filter((p) => p.status === "UNPAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPengeluaran = socialExpenses.reduce((sum, e) => sum + e.amount, 0);
  const saldoAkhir = totalDanaMasuk - totalPengeluaran + 5000000;

  const handleExportCsv = () => {
    info("Unduh Laporan", "Fitur unduh berkas spreadsheet XLSX/CSV disimulasikan.");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Rekapitulasi Keuangan & Kas Arisan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Laporan lengkap penerimaan iuran berkala, pengeluaran sosial, dan posisi saldo kas bersih.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="text-xs gap-1.5 h-9"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Ekspor Rekap (Excel/CSV)</span>
          </Button>
        </div>
      </div>

      {/* Filter and Top Summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Filter Berdasarkan Periode:</span>
          <div className="w-64">
            <Select
              value={selectedPeriodId}
              onChange={(e) => setSelectedPeriodId(e.target.value)}
              className="text-xs h-9"
            >
              <option value="ALL">Semua Periode Arisan</option>
              {periods.map((prd) => (
                <option key={prd.id} value={prd.id}>
                  {prd.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Menampilkan transaksi dari <strong>{users.length}</strong> anggota keluarga.
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-emerald-200 bg-emerald-50/40 shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-emerald-800">Total Iuran Terverifikasi (PAID)</span>
            <div className="mt-2">
              <span className="text-2xl font-black text-emerald-700 tabular-nums">
                {formatRupiah(totalDanaMasuk)}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1 font-medium">Dana masuk rekening bendahara</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/40 shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-amber-800">Menunggu Konfirmasi (PENDING)</span>
            <div className="mt-2">
              <span className="text-2xl font-black text-amber-700 tabular-nums">
                {formatRupiah(totalPending)}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">Bukti transfer sudah diunggah</p>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/40 shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-rose-800">Tunggakan Belum Disetor (UNPAID)</span>
            <div className="mt-2">
              <span className="text-2xl font-black text-rose-700 tabular-nums">
                {formatRupiah(totalTunggakan)}
              </span>
            </div>
            <p className="text-[11px] text-rose-700 mt-1 font-medium">Belum melakukan pembayaran</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/40 shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-blue-800">Saldo Kas Bersih Saat Ini</span>
            <div className="mt-2">
              <span className="text-2xl font-black text-blue-700 tabular-nums">
                {formatRupiah(saldoAkhir)}
              </span>
            </div>
            <p className="text-[11px] text-blue-700 mt-1 font-medium">Bersih setelah biaya sosial</p>
          </CardContent>
        </Card>
      </div>

      {/* Matrix Table: Member Payment Status across Periods */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Matriks Kepatuhan Iuran Seluruh Anggota
            </CardTitle>
            <CardDescription className="text-xs">
              Status setoran masing-masing anggota keluarga pada setiap periode arisan.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-medium">
            Tabular Data N-Periods
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Anggota</TableHead>
                <TableHead>Jabatan</TableHead>
                {periods.map((prd) => (
                  <TableHead key={prd.id} className="text-center whitespace-nowrap">
                    {prd.name.split("–")[0]}
                  </TableHead>
                ))}
                <TableHead className="text-right">Total Setor</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const userPayments = payments.filter((p) => p.memberId === user.id);
                const userTotalPaid = userPayments
                  .filter((p) => p.status === "PAID")
                  .reduce((sum, p) => sum + p.amount, 0);

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      <Badge variant="secondary" className="text-[10px]">
                        {user.position}
                      </Badge>
                    </TableCell>

                    {periods.map((prd) => {
                      const pay = userPayments.find((p) => p.periodId === prd.id);
                      return (
                        <TableCell key={prd.id} className="text-center">
                          {pay?.status === "PAID" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              LUNAS
                            </span>
                          )}
                          {pay?.status === "PENDING" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              PENDING
                            </span>
                          )}
                          {(!pay || pay?.status === "UNPAID") && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                              BELUM
                            </span>
                          )}
                        </TableCell>
                      );
                    })}

                    <TableCell className="text-right font-bold tabular-nums text-slate-900">
                      {formatRupiah(userTotalPaid)}
                    </TableCell>
                    <TableCell className="text-center">
                      <a
                        href={`/anggota/${user.id}/pembayaran`}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Detail
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
