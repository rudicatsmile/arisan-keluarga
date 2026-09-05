"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCheck,
  HandCoins,
  CalendarDays,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Plus,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-context";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { currentUser, users, periods, payments, socialExpenses, activePeriod, createPeriod } = useArisan();
  const { success } = useToast();

  const [isNewPeriodModalOpen, setIsNewPeriodModalOpen] = useState(false);
  const [newPeriodName, setNewPeriodName] = useState("");
  const [newPeriodAmount, setNewPeriodAmount] = useState(150000);
  const [newDueDate, setNewDueDate] = useState("");

  const isReviewer = currentUser?.role === "REVIEWER";

  // Calculations
  const totalDanaMasuk = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalDanaKeluar = socialExpenses.reduce((sum, e) => sum + e.amount, 0);
  const saldoKas = totalDanaMasuk - totalDanaKeluar + 5000000;

  const currentPeriodPayments = payments.filter((p) => p.periodId === activePeriod?.id);
  const pendingPayments = currentPeriodPayments.filter((p) => p.status === "PENDING");
  const unpaidPayments = currentPeriodPayments.filter((p) => p.status === "UNPAID");
  const paidPayments = currentPeriodPayments.filter((p) => p.status === "PAID");

  const compliancePercent =
    currentPeriodPayments.length > 0
      ? Math.round((paidPayments.length / currentPeriodPayments.length) * 100)
      : 0;

  const handleCreatePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriodName) return;

    createPeriod({
      name: newPeriodName,
      iuranAmount: Number(newPeriodAmount),
      startDate: new Date().toISOString().split("T")[0],
      dueDate: newDueDate || new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "OPEN",
      description: `Periode arisan baru dibuka oleh ${currentUser?.name}`,
    });

    success("Periode Baru Dibuka", `Tagihan otomatis dibuat untuk seluruh anggota aktif.`);
    setIsNewPeriodModalOpen(false);
    setNewPeriodName("");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white text-xs">Back Office Pengurus</Badge>
            {isReviewer && (
              <Badge className="bg-purple-600 text-white text-xs">Mode Pemeriksaan (Reviewer)</Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pusat Kendali Kas & Kepengurusan
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Ringkasan akuntabilitas kas arisan, monitoring iuran anggota, dan persetujuan pengeluaran dana sosial.
          </p>
        </div>

        {!isReviewer && (
          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => setIsNewPeriodModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 h-10 shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Buka Periode Iuran Baru</span>
            </Button>
          </div>
        )}
      </div>

      {/* Reviewer Alert Banner if applicable */}
      {isReviewer && (
        <div className="p-4 rounded-xl border border-purple-200 bg-purple-50 text-purple-900 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-purple-600 shrink-0" />
            <span>
              Anda login sebagai <strong>{currentUser?.name} (Reviewer / Pengawas)</strong>. Anda memiliki akses baca penuh untuk mengaudit transaksi dan menandai &quot;Sudah Diperiksa&quot;.
            </span>
          </div>
          <Badge className="bg-purple-200 text-purple-900 shrink-0 text-[10px]">Hak Akses Auditor</Badge>
        </div>
      )}

      {/* 4 Big Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Saldo */}
        <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Saldo Akhir Kas Arisan</span>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {formatRupiah(saldoKas)}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Kas bersih setelah pengeluaran sosial
            </p>
          </CardContent>
        </Card>

        {/* Total Masuk */}
        <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Iuran Terkumpul</span>
              <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {formatRupiah(totalDanaMasuk)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Akumulasi dari seluruh periode lunas
            </p>
          </CardContent>
        </Card>

        {/* Dana Sosial Keluar */}
        <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Dana Sosial Disalurkan</span>
              <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                <TrendingDown className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {formatRupiah(totalDanaKeluar)}
              </span>
            </div>
            <p className="text-[11px] text-rose-700 font-medium mt-1">
              {socialExpenses.length} kali pencairan bantuan & tali asih
            </p>
          </CardContent>
        </Card>

        {/* Kepatuhan Periode Aktif */}
        <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Kepatuhan Periode Ini</span>
              <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {compliancePercent}%
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {paidPayments.length} / {currentPeriodPayments.length} Lunas
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${compliancePercent}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Center Grid: Verifikasi Pending & Ringkasan Cepat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Verifications Alert */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>Bukti Bayar Menunggu Verifikasi ({pendingPayments.length})</span>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Setoran iuran dari anggota yang telah mengunggah slip transfer dan membutuhkan persetujuan.
                </CardDescription>
              </div>
              <Link href="/admin/verifikasi-iuran">
                <Button size="sm" variant="outline" className="text-xs gap-1 h-8">
                  <span>Lihat Semua</span>
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="p-6">
              {pendingPayments.length > 0 ? (
                <div className="space-y-3">
                  {pendingPayments.map((pay) => {
                    const member = users.find((u) => u.id === pay.memberId);
                    return (
                      <div
                        key={pay.id}
                        className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={member?.photoUrl}
                            alt={member?.name}
                            className="h-10 w-10 rounded-full object-cover border border-white shadow-xs"
                          />
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{member?.name}</h4>
                            <p className="text-xs text-slate-600">
                              Nominal: <strong>{formatRupiah(pay.amount)}</strong> • Catatan: {pay.note || "Transfer via Bank"}
                            </p>
                          </div>
                        </div>

                        <Link href="/admin/verifikasi-iuran">
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8">
                            Tinjau Bukti & Verifikasi
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">Semua Bukti Transfer Sudah Diverifikasi</p>
                  <p className="mt-0.5">Tidak ada antrean pembayaran yang tertunda saat ini.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Anggota Belum Bayar */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span>Daftar Anggota Belum Bayar Periode Ini ({unpaidPayments.length})</span>
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Daftar anggota yang belum mengunggah bukti transfer untuk {activePeriod?.name}.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {unpaidPayments.map((pay) => {
                  const member = users.find((u) => u.id === pay.memberId);
                  if (!member) return null;
                  return (
                    <div
                      key={pay.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{member.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{member.phone}</p>
                        </div>
                      </div>
                      <a
                        href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}?text=Halo%20${encodeURIComponent(
                          member.name
                        )},%20mengingatkan%20iuran%20arisan%20periode%20ini%20sebesar%20Rp150.000%20belum%20diterima.%20Terima%20kasih.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-semibold text-blue-600 hover:underline shrink-0"
                      >
                        Ingatkan WA
                      </a>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Quick Links to Back Office Features */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900">
                Akses Cepat Pengelolaan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Link href="/admin/keuangan" className="block p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Rekap Kas & Keuangan</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Grafik dan tabel iuran per anggota</p>
              </Link>

              <Link href="/admin/anggota" className="block p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Kelola Anggota ({users.length})</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Tambah anggota, atur role & jabatan</p>
              </Link>

              <Link href="/admin/biaya-sosial" className="block p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Biaya Sosial & Tali Asih</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Pencatatan santunan sakit & bantuan</p>
              </Link>

              <Link href="/admin/lokasi" className="block p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Atur Jadwal Pertemuan</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Tuan rumah & koordinat peta lokasi</p>
              </Link>

              <Link href="/admin/pengaturan" className="block p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">Pengaturan Rekening & Sistem</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Bank, no rekening, dan nama paguyuban</p>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Buka Periode Baru */}
      <Dialog open={isNewPeriodModalOpen} onOpenChange={setIsNewPeriodModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buka Periode Iuran Baru</DialogTitle>
            <DialogDescription>
              Membuka periode arisan baru akan secara otomatis membuat tagihan status BELUM BAYAR untuk semua anggota aktif.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePeriod} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Periode
              </label>
              <Input
                placeholder="Contoh: Periode 13 – Juli 2026"
                value={newPeriodName}
                onChange={(e) => setNewPeriodName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Besaran Iuran Per Anggota (Rp)
              </label>
              <Input
                type="number"
                value={newPeriodAmount}
                onChange={(e) => setNewPeriodAmount(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Batas Waktu Pembayaran (Jatuh Tempo)
              </label>
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewPeriodModalOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button type="submit" className="text-xs bg-blue-600 hover:bg-blue-700 font-semibold">
                Buka Periode & Terbitkan Tagihan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
