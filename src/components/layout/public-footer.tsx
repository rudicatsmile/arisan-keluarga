import React from "react";
import Link from "next/link";
import { Users, Heart, Phone, MapPin, ShieldCheck } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <Users className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Arisan<span className="text-blue-600">Keluarga</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Platform tata kelola keuangan arisan kelompok, iuran bulanan, dana sosial, susunan silsilah pohon keluarga, dan jadwal silaturahmi yang transparan, akuntabel, dan penuh kehangatan.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Diaudit oleh Reviewer Keluarga & Dilengkapi WhatsApp Gateway</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Tautan Cepat</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="/" className="hover:text-blue-600 transition">Beranda</Link></li>
              <li><Link href="/login" className="hover:text-blue-600 transition">Login WhatsApp</Link></li>
              <li><Link href="/dashboard" className="hover:text-blue-600 transition">Dashboard Anggota</Link></li>
              <li><Link href="/anggota" className="hover:text-blue-600 transition">Pohon Anggota</Link></li>
              <li><Link href="/lokasi-arisan" className="hover:text-blue-600 transition">Jadwal Pertemuan</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">Sekretariat Arisan</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Jl. Melati Raya No. 12, Cipadung, Kota Bandung, Jawa Barat</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-600 shrink-0" />
                <span>WhatsApp: 0812-3400-0011 (Bu Ratna)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 ArisanKeluarga. Dibangun dengan cinta untuk mempererat silaturahmi keluarga.</p>
          <div className="flex items-center gap-1">
            <span>Dirancang dengan</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Keluarga Bahagia Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
