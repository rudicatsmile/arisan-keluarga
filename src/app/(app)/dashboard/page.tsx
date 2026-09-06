"use client";

import React from "react";
import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  GitFork,
  HeartHandshake,
  ShieldCheck,
  Building2,
  Users,
  Trophy,
  Gift,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { currentUser, activePeriod, payments, socialExpenses, meetings, users } = useArisan();

  if (!currentUser) return null;

  // Iuran user pada periode aktif
  const myPayment = payments.find(
    (p) => p.periodId === activePeriod?.id && p.memberId === currentUser.id
  );

  // Total kas terkumpul
  const totalDanaMasuk = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalDanaKeluar = socialExpenses.reduce((sum, e) => sum + e.amount, 0);
  const saldoKas = totalDanaMasuk - totalDanaKeluar + 5000000;

  // Pertemuan mendatang
  const upcomingMeeting = meetings.find((m) => m.status === "PLANNED") || meetings[0];

  const getMyStatusBadge = () => {
    if (!myPayment || myPayment.status === "UNPAID") {
      return (
        <Badge variant="belum" className="text-xs px-2.5 py-1">
          BELUM BAYAR
        </Badge>
      );
    }
    if (myPayment.status === "PENDING") {
      return (
        <Badge variant="menunggu" className="text-xs px-2.5 py-1">
          MENUNGGU VERIFIKASI
        </Badge>
      );
    }
    return (
      <Badge variant="lunas" className="text-xs px-2.5 py-1">
        LUNAS TERVERIFIKASI
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white/5 rounded-full blur-3xl -mr-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
            <span>Selamat Datang di ArisanKeluarga</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Halo, {currentUser.name}!
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Anda terdaftar sebagai <strong>{currentUser.position}</strong> ({currentUser.role}). Pantau tagihan iuran bulanan Anda, jelajahi silsilah keluarga, dan lihat jadwal pertemuan terdekat.
          </p>
        </div>
      </div>

      {/* Quick Summary Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Status Iuran Saya */}
        <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Status Iuran Periode Ini</span>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {formatRupiah(activePeriod?.iuranAmount || 150000)}
              </span>
              {getMyStatusBadge()}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 truncate">
              {activePeriod?.name} (Batas: {formatDate(activePeriod?.dueDate || "2026-06-15")})
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Saldo Kas Global */}
        <Card className="border-slate-200 shadow-xs hover:border-emerald-300 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Saldo Kas Paguyuban</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-3">
              <span className="text-xl font-bold text-emerald-700 tabular-nums">
                {formatRupiah(saldoKas)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Dari {users.length} anggota keluarga aktif
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Dana Sosial Tersalurkan */}
        <Card className="border-slate-200 shadow-xs hover:border-rose-300 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Santunan Sosial Tersalurkan</span>
              <HeartHandshake className="h-4 w-4 text-rose-600" />
            </div>
            <div className="mt-3">
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {formatRupiah(totalDanaKeluar)}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {socialExpenses.length} kali penyaluran tali asih
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Jadwal Berikutnya */}
        <Card className="border-slate-200 shadow-xs hover:border-purple-300 transition">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Pertemuan Berikutnya</span>
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <div className="mt-3">
              <span className="text-base font-bold text-slate-900 line-clamp-1">
                {formatDate(upcomingMeeting?.scheduledAt || "2026-06-20")}
              </span>
            </div>
            <p className="text-[11px] text-purple-700 font-medium mt-2 truncate">
              Tuan Rumah: {upcomingMeeting?.hostMemberName}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Kocokan Arisan Live Card Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 sm:p-6 text-white border border-indigo-500/20 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300 shrink-0">
            <Trophy className="w-8 h-8 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Kocokan Arisan Digital Periode Ini
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Siklus Ke-{activePeriod?.cycleNumber || 1}
              </span>
            </div>
            <p className="text-xs text-blue-200 mt-1 max-w-xl">
              Tabung logam kocokan siap diguncang untuk {activePeriod?.name}. Potensi tarikan kotor{" "}
              <strong className="text-amber-300 tabular-nums">
                {formatRupiah(users.filter((u) => u.isActive).length * (activePeriod?.iuranAmount || 150000))}
              </strong>{" "}
              lengkap dengan efek suara, animasi gulungan nama, dan otomasi potongan tunggakan.
            </p>
          </div>
        </div>

        <Link
          href="/kocokan"
          className="shrink-0 w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
        >
          <Gift className="w-4 h-4" />
          Buka Tabung Kocokan
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Grid: Status Iuran Action & Meeting Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Iuran Saya Detail & Pengumuman */}
        <div className="lg:col-span-8 space-y-6">
          {/* Iuran Banner Card */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">
                    Kewajiban Iuran: {activePeriod?.name}
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Pastikan pembayaran dilakukan sebelum batas waktu tanggal {formatDate(activePeriod?.dueDate || "2026-06-15")}.
                  </CardDescription>
                </div>
                {getMyStatusBadge()}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {(!myPayment || myPayment.status === "UNPAID") && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-rose-900">Iuran Belum Dibayar</h4>
                      <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                        Silakan transfer sebesar <strong>{formatRupiah(activePeriod?.iuranAmount || 150000)}</strong> ke rekening bendahara, lalu unggah bukti transfer di halaman Iuran Saya.
                      </p>
                    </div>
                  </div>
                  <Link href="/iuran-saya" className="shrink-0 w-full sm:w-auto">
                    <Button className="w-full bg-rose-600 hover:bg-rose-700 text-xs">
                      Bayar & Unggah Bukti
                    </Button>
                  </Link>
                </div>
              )}

              {myPayment?.status === "PENDING" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">Bukti Transfer Sedang Diverifikasi</h4>
                      <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                        Bukti pembayaran Anda sudah kami terima dan sedang menunggu persetujuan dari Ibu Bendahara (Ibu Ratna Kusuma).
                      </p>
                    </div>
                  </div>
                  <Link href="/iuran-saya" className="shrink-0 w-full sm:w-auto">
                    <Button variant="outline" className="w-full text-xs">
                      Lihat Bukti Terkirim
                    </Button>
                  </Link>
                </div>
              )}

              {myPayment?.status === "PAID" && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900">Terima Kasih, Iuran Anda Sudah LUNAS!</h4>
                      <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                        Pembayaran iuran bulan ini telah terverifikasi lunas. Anda dapat melihat riwayat seluruh setoran arisan Anda pada menu Hasil Pembayaran.
                      </p>
                    </div>
                  </div>
                  <Link href={`/anggota/${currentUser.id}/pembayaran`} className="shrink-0 w-full sm:w-auto">
                    <Button variant="outline" className="w-full text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-100">
                      Rincian Pembayaran Saya
                    </Button>
                  </Link>
                </div>
              )}

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link href="/anggota" className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <GitFork className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">Pohon Anggota Arisan</h4>
                    <p className="text-[11px] text-slate-500">Lihat struktur silsilah & susunan pengurus</p>
                  </div>
                </Link>

                <Link href="/keluarga-bahagia" className="group p-4 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                    <HeartHandshake className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition">Keluarga Bahagia</h4>
                    <p className="text-[11px] text-slate-500">Kelola anak, pasangan, & keluarga Anda</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Social Expense Activity Stream */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">
                  Penyaluran Dana Kas Sosial Terkini
                </CardTitle>
                <Badge variant="outline" className="text-[11px]">Akuntabel & Diaudit</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 divide-y divide-slate-100">
              {socialExpenses.slice(0, 3).map((exp) => (
                <div key={exp.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-[10px] ${exp.category === "SAKIT"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : exp.category === "HADIAH"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                      >
                        {exp.category}
                      </Badge>
                      <span className="text-xs font-bold text-slate-900">{exp.recipientName}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                    <p className="text-[10px] text-slate-400">
                      {formatDate(exp.expenseDate)} • Dicatat oleh: {exp.recordedByName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatRupiah(exp.amount)}
                    </span>
                    {exp.isReviewed && (
                      <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 mt-1">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Audit OK</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Pertemuan Terdekat & Lokasi Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-5 text-white">
              <Badge className="bg-blue-500/80 text-white text-[10px] mb-2">Pertemuan Terdekat</Badge>
              <h3 className="font-bold text-base leading-snug">{upcomingMeeting?.title}</h3>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-blue-400" />
                <span>{formatDate(upcomingMeeting?.scheduledAt || "2026-06-20")}</span>
              </p>
            </div>

            <CardContent className="p-5 space-y-4">
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Tuan Rumah</span>
                  <span className="font-bold text-slate-800 text-sm">{upcomingMeeting?.hostMemberName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Alamat Lengkap</span>
                  <p className="text-slate-700 leading-relaxed">{upcomingMeeting?.address}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Catatan Acara</span>
                  <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                    {upcomingMeeting?.notes}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/lokasi-arisan" className="block">
                  <Button variant="outline" className="w-full gap-2 text-xs h-9">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                    <span>Lihat Titik Peta & Navigasi</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pengurus Kontak Card */}
          <Card className="border-slate-200 shadow-xs bg-gradient-to-b from-blue-50/40 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pusat Bantuan & Bendahara
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-xs">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                  IR
                </div>
                <div>
                  <p className="font-bold text-slate-900">Ibu Rini</p>
                  <p className="text-slate-500 text-[11px]">Bendahara Arisan: 087840812463</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
