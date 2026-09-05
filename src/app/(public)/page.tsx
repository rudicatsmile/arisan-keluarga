"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Heart,
  ChevronRight,
  PhoneCall,
  CalendarCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import { useArisan } from "@/context/arisan-context";

export default function LandingPage() {
  const { users, payments, socialExpenses, meetings, settings } = useArisan();

  // Calculated stats from mock data
  const totalDanaMasuk = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalDanaKeluar = socialExpenses.reduce((sum, e) => sum + e.amount, 0);
  const saldoKas = totalDanaMasuk - totalDanaKeluar + 5000000; // ditambah modal kas awal
  const activeMembersCount = users.filter((u) => u.isActive).length;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/60 px-3.5 py-1 text-xs font-semibold text-blue-800">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Tata Kelola Resmi Arisan Bani Sutrisno</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Hangatkan Silaturahmi, <br className="hidden sm:inline" />
                <span className="text-blue-600">Transparan</span> Kelola Kas Keluarga.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Platform digital resmi untuk pencatatan iuran bulanan, penyaluran santunan sosial, silsilah pohon keluarga, hingga rencana titik temu arisan lengkap dengan navigasi peta.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link href="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-6 shadow-md shadow-blue-500/25">
                    <span>Masuk dengan WhatsApp OTP</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base">
                    <span>Lihat Simulasi Sistem</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-600 font-bold text-lg sm:text-xl">
                    <ShieldCheck className="h-5 w-5" />
                    <span>100%</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Tercatat Transparan</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-lg sm:text-xl">
                    <TrendingUp className="h-5 w-5" />
                    <span>{formatRupiah(saldoKas)}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Total Saldo Kas</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-purple-600 font-bold text-lg sm:text-xl">
                    <Users className="h-5 w-5" />
                    <span>{activeMembersCount} Anggota</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Keluarga Terdaftar</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-200/50 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl -z-10" />

                <Card className="border-slate-200 shadow-xl overflow-hidden bg-white/95 backdrop-blur-xs">
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80"
                      alt="Suasana Hangat Silaturahmi Keluarga"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-4">
                      <div className="text-white">
                        <Badge className="bg-emerald-500/90 text-white text-[10px] mb-1">Pertemuan Terjadwal</Badge>
                        <p className="font-semibold text-sm line-clamp-1">{meetings[0]?.title}</p>
                        <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 text-rose-400" />
                          <span>{meetings[0]?.address}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-xs text-slate-500 block">Iuran Periode Berjalan</span>
                        <span className="text-base font-bold text-slate-900">Periode 12 – Juni 2026</span>
                      </div>
                      <Badge variant="lunas">Status Kas Aktif</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Nominal Wajib per Anggota</span>
                        <span className="font-semibold text-slate-900">{formatRupiah(settings.monthlyAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Rekening Resmi Arisan</span>
                        <span className="font-semibold text-blue-600">{settings.bankName} - {settings.accountNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">Penanggung Jawab</span>
                        <span className="font-medium text-slate-700">{settings.accountHolder}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href="/login" className="block">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs h-9">
                          Buka Rekap & Unggah Bukti Bayar
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section id="fitur" className="py-16 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="secondary" className="px-3 py-1 text-xs text-blue-700 bg-blue-50 border-blue-200">
              Solusi Digital Terpadu
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Tidak Ada Lagi Catatan Buku yang Hilang
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              ArisanKeluarga dirancang khusus memenuhi kebutuhan paguyuban arisan dengan tata kelola profesional tanpa menghilangkan kehangatan kekeluargaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fitur 1 */}
            <Card className="hover:shadow-md hover:-translate-y-1 transition duration-200 border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Pencatatan Iuran Digital</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Anggota cukup mentransfer ke rekening bendahara, mengunggah bukti bayar, dan status langsung diverifikasi lunas secara transparan.
                </p>
                <div className="pt-2 text-xs font-semibold text-blue-600 flex items-center gap-1">
                  <span>Lihat alur pembayaran</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>

            {/* Fitur 2 */}
            <Card className="hover:shadow-md hover:-translate-y-1 transition duration-200 border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Pohon Anggota & Silsilah</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Visualisasi susunan pengurus (Ketua, Bendahara, Sekretaris) dan pohon hubungan anggota keluarga agar generasi muda saling mengenal.
                </p>
                <div className="pt-2 text-xs font-semibold text-purple-600 flex items-center gap-1">
                  <span>Jelajahi silsilah</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>

            {/* Fitur 3 */}
            <Card className="hover:shadow-md hover:-translate-y-1 transition duration-200 border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Santunan Biaya Sosial</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pencatatan pengeluaran kas untuk tali kasih sakit, bantuan kelahiran, tali duka, dan hadiah prestasi secara akuntabel dan diaudit.
                </p>
                <div className="pt-2 text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <span>Transparansi sosial</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>

            {/* Fitur 4 */}
            <Card className="hover:shadow-md hover:-translate-y-1 transition duration-200 border-slate-200">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Peta & Rencana Lokasi</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Jadwal dan alamat rumah tuan rumah arisan berikutnya lengkap dengan titik peta interaktif dan tombol langsung ke Google Maps.
                </p>
                <div className="pt-2 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span>Cek lokasi terdekat</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Keluarga Bahagia Preview Section */}
      <section id="keluarga" className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
                <Heart className="h-3.5 w-3.5 fill-rose-500" />
                <span>Fitur Spesial: Keluarga Bahagia</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Mengenal Setiap Anak, Pasangan, & Cucu dalam Satu Wadah
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Di arisan keluarga, bukan hanya anggota yang hadir, namun seluruh keluarga besar. Menu Keluarga Bahagia mendokumentasikan pasangan dan anak-anak dari tiap anggota sehingga silaturahmi antar generasi terus terjaga erat.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Profil Keluarga Mandiri</h4>
                    <p className="text-xs text-slate-500">Setiap anggota dapat memperbarui nama pasangan dan anak-anaknya secara langsung.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Pemberitahuan Hari Bahagia</h4>
                    <p className="text-xs text-slate-500">Mengetahui hari lahir dan momen istimewa keluarga untuk saling mendoakan.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/keluarga-bahagia">
                  <Button className="gap-2">
                    <span>Buka Direktori Keluarga Bahagia</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {users.slice(0, 4).map((user) => (
                <Card key={user.id} className="p-4 bg-white border-slate-200 shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.photoUrl}
                      alt={user.name}
                      className="h-12 w-12 rounded-xl object-cover border border-slate-100"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-blue-600 font-medium">{user.position}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{user.occupation}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials from Family Members */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Suara Pengurus & Keluarga</h2>
            <p className="text-slate-600 text-sm mt-2">
              Apa yang dirasakan keluarga sejak pengelolaan arisan beralih ke format digital transparan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200 bg-slate-50/50">
              <CardContent className="p-6 space-y-3">
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  “Alhamdulillah, sebagai ketua saya tidak perlu lagi mengecek buku kas manual tiap bulan. Semua anggota bisa melihat saldo kas secara terbuka dan anak-cucu jadi makin kenal lewat silsilah pohon keluarga.”
                </p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    HB
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">H. Bambang Sutrisno</h4>
                    <p className="text-[11px] text-slate-500">Ketua Paguyuban Arisan</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-slate-50/50">
              <CardContent className="p-6 space-y-3">
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  “Dulu repot mencocokkan mutasi rekening BCA satu-satu. Sekarang anggota tinggal unggah bukti transfer di ArisanKeluarga, saya tinggal klik verifikasi lunas. Waktu rekapitulasi hemat 90%.”
                </p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                    RK
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Ibu Ratna Kusuma</h4>
                    <p className="text-[11px] text-slate-500">Bendahara Arisan</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-slate-50/50">
              <CardContent className="p-6 space-y-3">
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  “Fitur lokasinya sangat membantu anak-anak muda seperti saya yang sering lupa alamat rumah paman atau bibi. Begitu buka aplikasi, langsung ada tombol rute ke Google Maps.”
                </p>
                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs">
                    EP
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Mas Eko Prasetyo</h4>
                    <p className="text-[11px] text-slate-500">Anggota Keluarga Generasi ke-2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Sudah Terdaftar Sebagai Anggota Arisan?
          </h2>
          <p className="text-blue-100 text-base max-w-xl mx-auto leading-relaxed">
            Masuk dengan mudah tanpa perlu mengingat kata sandi. Cukup masukkan nomor WhatsApp Anda dan masukkan kode verifikasi 6 digit.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 shadow-lg text-base font-semibold px-8">
                Masuk ke Aplikasi Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
