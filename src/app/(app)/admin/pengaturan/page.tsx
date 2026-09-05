"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  Building2,
  Phone,
  CreditCard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast-context";

export default function PengaturanPage() {
  const { currentUser, settings, updateSettings } = useArisan();
  const { success, error } = useToast();

  const [arisanName, setArisanName] = useState(settings.arisanName);
  const [bankName, setBankName] = useState(settings.bankName);
  const [accountNumber, setAccountNumber] = useState(settings.accountNumber);
  const [accountHolder, setAccountHolder] = useState(settings.accountHolder);
  const [whatsappContact, setWhatsappContact] = useState(settings.whatsappContact);
  const [monthlyAmount, setMonthlyAmount] = useState(settings.monthlyAmount);
  const [arisanDescription, setArisanDescription] = useState(settings.arisanDescription);

  const isReviewer = currentUser?.role === "REVIEWER";

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReviewer) {
      error("Aksi Ditolak", "Reviewer hanya memiliki hak baca pada pengaturan sistem.");
      return;
    }

    updateSettings({
      arisanName,
      bankName,
      accountNumber,
      accountHolder,
      whatsappContact,
      monthlyAmount: Number(monthlyAmount),
      arisanDescription,
    });

    success("Pengaturan Disimpan", "Informasi rekening dan paguyuban berhasil diperbarui.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Pengaturan Sistem & Rekening Kas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Konfigurasi rekening tujuan transfer iuran, kontak pengurus, dan profil paguyuban arisan keluarga.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Profil Paguyuban */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">
              Identitas Paguyuban Arisan
            </CardTitle>
            <CardDescription className="text-xs">
              Nama dan deskripsi resmi yang tampil pada aplikasi dan tanda terima.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Resmi Paguyuban / Arisan
              </label>
              <Input
                value={arisanName}
                onChange={(e) => setArisanName(e.target.value)}
                disabled={isReviewer}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Deskripsi & Visi Silaturahmi Keluarga
              </label>
              <Textarea
                value={arisanDescription}
                onChange={(e) => setArisanDescription(e.target.value)}
                disabled={isReviewer}
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nomor WhatsApp Kontak Pengurus / Sekretariat
              </label>
              <Input
                value={whatsappContact}
                onChange={(e) => setWhatsappContact(e.target.value)}
                disabled={isReviewer}
                placeholder="Contoh: 0812-3400-0011"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Rekening Transfer Kas */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">
              Rekening Resmi Tujuan Transfer Iuran
            </CardTitle>
            <CardDescription className="text-xs">
              Informasi rekening ini akan ditampilkan kepada anggota di halaman pembayaran &quot;Iuran Saya&quot;.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Bank
                </label>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  disabled={isReviewer}
                  placeholder="Contoh: Bank Central Asia (BCA)"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nomor Rekening
                </label>
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  disabled={isReviewer}
                  placeholder="Contoh: 8830-1928-4411"
                  className="font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Pemilik Rekening (Atas Nama)
                </label>
                <Input
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  disabled={isReviewer}
                  placeholder="Contoh: Ibu Ratna Kusuma (Bendahara)"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Besaran Iuran Bulanan Default (Rp)
                </label>
                <Input
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  disabled={isReviewer}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        {!isReviewer && (
          <div className="flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2">
              <Save className="h-4 w-4" />
              <span>Simpan Perubahan Pengaturan</span>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
