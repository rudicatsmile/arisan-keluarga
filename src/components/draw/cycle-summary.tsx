"use client";

import React, { useState } from "react";
import { User, ArisanPeriod, PeriodPayment } from "@/data/mock-data";
import {
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Award,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface CycleSummaryProps {
  currentCycle: number;
  allActiveMembers: User[];
  eligibleMembers: User[];
  pastWinnersInCycle: {
    period: ArisanPeriod;
    winner: User;
  }[];
  payments: PeriodPayment[];
  activePeriod: ArisanPeriod;
  canManage: boolean;
  onResetCycle: (nextCycle: number) => Promise<void>;
}

export function CycleSummary({
  currentCycle,
  allActiveMembers,
  eligibleMembers,
  pastWinnersInCycle,
  payments,
  activePeriod,
  canManage,
  onResetCycle,
}: CycleSummaryProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const totalMembers = allActiveMembers.length;
  const wonCount = pastWinnersInCycle.length;
  const progressPercent = totalMembers > 0 ? Math.round((wonCount / totalMembers) * 100) : 0;
  const isCycleCompleted = eligibleMembers.length === 0 && totalMembers > 0;

  const formatRp = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const handleResetSubmit = async () => {
    try {
      setIsResetting(true);
      await onResetCycle(currentCycle + 1);
      setShowConfirmReset(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Cycle Header & Progress Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Trophy className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Kemajuan Putaran Arisan (Siklus Ke-{currentCycle})
                </h3>
                <p className="text-xs text-gray-500">
                  Prinsip Keadilan: Setiap anggota keluarga berhak menang tepat 1 kali per siklus
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Status Putaran</span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full inline-block mt-0.5 ${
                  isCycleCompleted
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {isCycleCompleted ? "Siklus Lengkap (100%)" : `${wonCount} dari ${totalMembers} Telah Menang`}
              </span>
            </div>

            {canManage && (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className={`px-3 py-2 text-xs font-bold rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                  isCycleCompleted
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Buka Siklus Ke-{currentCycle + 1}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs font-semibold text-gray-600 mb-1.5">
            <span>Progress Putaran ({wonCount}/{totalMembers} Anggota)</span>
            <span className="text-blue-600 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {isCycleCompleted && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold">Siklus Putaran Ke-{currentCycle} Selesai Penuh!</span> Seluruh {totalMembers} anggota keluarga telah merasakan giliran tarikan arisan. Silakan buka putaran baru untuk memulai siklus berikutnya.
            </div>
          </div>
        )}
      </div>

      {/* 2. Grid: Sisa Anggota (Eligible) vs Riwayat Pemenang */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kolom Kiri: Peserta yang Belum Pernah Menang (Masih Dalam Tabung) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-gray-900">
                Dalam Tabung Kocokan ({eligibleMembers.length})
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-gray-500">
              Berpeluang Terpilih
            </span>
          </div>

          <div className="divide-y divide-gray-100 mt-2 flex-1 max-h-[380px] overflow-y-auto">
            {eligibleMembers.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                Semua anggota telah terpilih sebagai pemenang di putaran ini.
              </div>
            ) : (
              eligibleMembers.map((member) => {
                const memberPayment = payments.find(
                  (p) => p.periodId === activePeriod.id && p.memberId === member.id
                );
                const isPaid = memberPayment?.status === "PAID";

                return (
                  <div
                    key={member.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/80 px-2 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={
                          member.photoUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                        }
                        alt={member.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {member.position} • {member.phone}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {isPaid ? "Iuran Lunas" : "Belum Bayar"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Kolom Kanan: Riwayat Pemenang Putaran Ini */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-gray-900">
                Pemenang Putaran Ini ({pastWinnersInCycle.length})
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-gray-500">
              Sudah Pernah Menang
            </span>
          </div>

          <div className="divide-y divide-gray-100 mt-2 flex-1 max-h-[380px] overflow-y-auto">
            {pastWinnersInCycle.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                Belum ada pemenang yang tercatat pada putaran ini.
              </div>
            ) : (
              pastWinnersInCycle.map(({ period, winner }) => (
                <div
                  key={period.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-gray-50/80 px-2 rounded-lg transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img
                        src={
                          winner.photoUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                        }
                        alt={winner.name}
                        className="w-9 h-9 rounded-full object-cover border-2 border-amber-400"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[8px] font-bold p-0.5 rounded-full">
                        ✓
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {winner.name}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate">
                        {period.name}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-bold text-emerald-700 tabular-nums">
                      {formatRp(period.netPrizeAmount || period.grossPrizeAmount || 1200000)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {period.wonAt
                        ? new Date(period.wonAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Selesai"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal Reset Putaran Baru */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-scale-up">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-bold text-gray-900">
                Buka Putaran Arisan Baru?
              </h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Membuka <strong>Siklus Putaran Ke-{currentCycle + 1}</strong> akan mengizinkan seluruh anggota keluarga untuk berpeluang menang kembali dari awal. Pastikan seluruh anggota pada siklus sebelumnya telah menerima hak tarikan mereka.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                disabled={isResetting}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleResetSubmit}
                disabled={isResetting}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow transition cursor-pointer disabled:opacity-50"
              >
                {isResetting ? "Memproses..." : `Ya, Buka Putaran Ke-${currentCycle + 1}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
