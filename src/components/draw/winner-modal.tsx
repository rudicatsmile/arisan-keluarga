"use client";

import React, { useState } from "react";
import { User, ArisanPeriod, PeriodPayment } from "@/data/mock-data";
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  UserCheck,
} from "lucide-react";

interface WinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: User | null;
  period: ArisanPeriod;
  winnerPayment?: PeriodPayment;
  totalActiveMembersCount: number;
  onConfirm: (payload: {
    winnerId: string;
    grossPrize: number;
    deductions: number;
    netPrize: number;
    sendWhatsApp: boolean;
  }) => Promise<void>;
}

export function WinnerModal({
  isOpen,
  onClose,
  winner,
  period,
  winnerPayment,
  totalActiveMembersCount,
  onConfirm,
}: WinnerModalProps) {
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !winner) return null;

  // 1. Perhitungan Uang Tarikan
  const grossPrize = totalActiveMembersCount * period.iuranAmount;
  const isPaid = winnerPayment?.status === "PAID";
  const deductions = isPaid ? 0 : period.iuranAmount;
  const netPrize = grossPrize - deductions;

  const formatRp = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onConfirm({
        winnerId: winner.id,
        grossPrize,
        deductions,
        netPrize,
        sendWhatsApp,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-blue-100 animate-scale-up">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white p-6 text-center overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md mb-3 border border-white/20 shadow-inner">
            <Trophy className="w-8 h-8 text-amber-300 animate-bounce" />
          </div>

          <h3 className="text-xl font-bold tracking-tight">Konfirmasi Pemenang Undian</h3>
          <p className="text-xs text-blue-100 mt-1">
            {period.name} • Siklus Putaran ke-{period.cycleNumber || 1}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Winner Profile Card */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50/80 to-blue-50/80 border border-amber-200/70">
            <div className="relative">
              <img
                src={
                  winner.photoUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                }
                alt={winner.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                ★ 1st
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-gray-900 text-base truncate">{winner.name}</h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  {winner.position}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">No. WA: {winner.phone}</p>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Iuran Periode: Lunas
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-amber-700 font-medium bg-amber-100/70 px-2 py-0.5 rounded-md">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Iuran Periode: Belum Lunas
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Breakdown Kalkulasi Uang Tarikan */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 space-y-2.5">
            <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Rincian Dana Tarikan Pemenang
            </h5>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Total Tarikan Kotor ({totalActiveMembersCount} anggota × {formatRp(period.iuranAmount)}):
              </span>
              <span className="font-semibold text-gray-900">{formatRp(grossPrize)}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <span>Potongan Iuran Periode Berjalan:</span>
                {deductions > 0 && (
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded">
                    Auto-Potong
                  </span>
                )}
              </div>
              <span className={`font-semibold ${deductions > 0 ? "text-red-600" : "text-gray-500"}`}>
                {deductions > 0 ? `- ${formatRp(deductions)}` : "Rp0 (Lunas)"}
              </span>
            </div>

            {deductions > 0 && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                💡 <span className="font-medium">Otomasi Sistem:</span> Tunggakan iuran {winner.name} otomatis dilunaskan sistem dari nominal tarikan ini.
              </p>
            )}

            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-gray-900 block">
                  Total Dana Bersih Diterima:
                </span>
                <span className="text-[11px] text-gray-500">
                  Diberikan tunai / transfer oleh Bendahara
                </span>
              </div>
              <span className="text-lg font-extrabold text-blue-700 tabular-nums">
                {formatRp(netPrize)}
              </span>
            </div>
          </div>

          {/* Opsi Notifikasi WhatsApp */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800">Kirim Ucapan via WhatsApp</p>
                <p className="text-[11px] text-gray-500">Notifikasi resmi gateway ke nomor {winner.phone}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sendWhatsApp}
                onChange={(e) => setSendWhatsApp(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200/70 rounded-xl transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Putar / Kocok Ulang
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>Menyimpan Data Pemenang...</>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Tetapkan & Simpan Pemenang
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
