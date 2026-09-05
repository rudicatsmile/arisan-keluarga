"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CreditCard,
  HeartHandshake,
  ArrowLeft,
  ChevronRight,
  Shield,
  User as UserIcon,
  CheckCircle2,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatDate, formatRupiah } from "@/lib/utils";

export default function AnggotaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { users, payments, familyMembers } = useArisan();

  const member = users.find((u) => u.id === resolvedParams.id);
  if (!member) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
        <p className="text-base font-bold text-slate-800">Anggota Tidak Ditemukan</p>
        <Link href="/anggota" className="mt-4 inline-block">
          <Button variant="outline" size="sm">Kembali ke Pohon Anggota</Button>
        </Link>
      </div>
    );
  }

  // Get member's payments
  const memberPayments = payments.filter((p) => p.memberId === member.id);
  const totalPaid = memberPayments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  // Get member's family
  const myFamily = familyMembers.filter((f) => f.userId === member.id);

  // Find parent/atasan if any
  const parentMember = member.parentId ? users.find((u) => u.id === member.parentId) : null;

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/anggota">
          <Button variant="ghost" size="sm" className="gap-2 text-xs text-slate-600">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Pohon Anggota</span>
          </Button>
        </Link>

        <Link href={`/anggota/${member.id}/pembayaran`}>
          <Button size="sm" className="gap-2 text-xs bg-blue-600 hover:bg-blue-700">
            <CreditCard className="h-4 w-4" />
            <span>Hasil Pembayaran Iuran</span>
          </Button>
        </Link>
      </div>

      {/* Main Profile Header Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative" />
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-12 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <Avatar
                src={member.photoUrl}
                fallback={member.name}
                size="xl"
                className="h-28 w-28 border-4 border-white shadow-md ring-1 ring-slate-200"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{member.name}</h1>
                  <Badge className="bg-blue-600 text-white text-xs">{member.position}</Badge>
                  <Badge variant="outline" className="text-xs">{member.role}</Badge>
                </div>
                <p className="text-xs text-slate-500">{member.occupation} • Bergabung sejak {formatDate(member.joinedAt)}</p>
              </div>
            </div>

            <div className="flex justify-center sm:justify-end gap-2">
              <a
                href={`https://wa.me/${member.phone.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50">
                  <Phone className="h-3.5 w-3.5" />
                  <span>Kirim WhatsApp</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Informasi Kontak</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Nomor Telepon / WhatsApp</span>
                  <span className="font-semibold text-slate-900 text-sm">{member.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Alamat Domisili</span>
                  <p className="text-slate-700 font-medium leading-relaxed">{member.address}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Biodata Pribadi</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Jenis Kelamin</span>
                  <span className="font-semibold text-slate-900">{member.gender}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tanggal Lahir</span>
                  <span className="font-semibold text-slate-900">{formatDate(member.birthDate)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Atasan Pohon Arisan</span>
                  <span className="font-semibold text-blue-600">
                    {parentMember ? `${parentMember.name} (${parentMember.position})` : "Pucuk Pimpinan / Langsung"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ringkasan Kas Iuran</h3>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Iuran Terverifikasi</span>
                  <span className="font-bold text-emerald-700 tabular-nums">{formatRupiah(totalPaid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Transaksi</span>
                  <span className="font-semibold text-slate-800">{memberPayments.length} Periode</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <Link href={`/anggota/${member.id}/pembayaran`} className="text-blue-600 hover:underline font-semibold block text-center">
                    Buka Rincian Pembayaran →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Members of this User */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">
              Keluarga Bahagia {member.name}
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar pasangan dan anak-anak yang terdaftar dalam paguyuban arisan.
            </p>
          </div>
          <Link href="/keluarga-bahagia">
            <Button variant="outline" size="sm" className="text-xs gap-1">
              <span>Kelola Keluarga</span>
              <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-6">
          {myFamily.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myFamily.map((fam) => (
                <div
                  key={fam.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3"
                >
                  <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {fam.relationship === "ISTRI" || fam.relationship === "SUAMI" ? "❤️" : "👶"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{fam.name}</p>
                    <Badge variant="outline" className="text-[10px] mt-0.5 bg-white">
                      {fam.relationship}
                    </Badge>
                    {fam.notes && <p className="text-[11px] text-slate-500 mt-1 italic line-clamp-1">{fam.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              Belum ada data anggota keluarga yang ditambahkan untuk {member.name}.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
