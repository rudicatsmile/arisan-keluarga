"use client";

import React, { useState } from "react";
import { useArisan } from "@/context/arisan-context";
import { User } from "@/data/mock-data";
import { LotteryCanister } from "@/components/draw/lottery-canister";
import { WinnerModal } from "@/components/draw/winner-modal";
import { CycleSummary } from "@/components/draw/cycle-summary";
import {
  Sparkles,
  Trophy,
  Coins,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function KocokanPage() {
  const {
    currentUser,
    users,
    periods,
    payments,
    activePeriod,
    drawWinner,
    resetCycle,
  } = useArisan();

  const [candidateWinner, setCandidateWinner] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertNotice, setAlertNotice] = useState<{
    type: "success" | "info";
    text: string;
  } | null>(null);

  const currentCycle = activePeriod.cycleNumber || 1;
  const allActiveMembers = users.filter((u) => u.isActive);

  // Past winners in current cycle
  const pastWinnersInCycle = periods
    .filter((p) => p.cycleNumber === currentCycle && p.winnerMemberId)
    .map((p) => {
      const winnerUser = users.find((u) => u.id === p.winnerMemberId)!;
      return {
        period: p,
        winner: winnerUser,
      };
    })
    .filter((item) => item.winner);

  const pastWinnerIds = new Set(pastWinnersInCycle.map((w) => w.winner.id));

  // Eligible pool: active members who have NOT won yet in this cycle
  const eligibleMembers = allActiveMembers.filter((m) => !pastWinnerIds.has(m.id));

  // Current winner payment status for deductions
  const candidatePayment = candidateWinner
    ? payments.find(
        (p) => p.periodId === activePeriod.id && p.memberId === candidateWinner.id
      )
    : undefined;

  const handleWinnerPicked = (winner: User) => {
    setCandidateWinner(winner);
    setIsModalOpen(true);
  };

  const handleConfirmWinner = async (payload: {
    winnerId: string;
    grossPrize: number;
    deductions: number;
    netPrize: number;
    sendWhatsApp: boolean;
  }) => {
    const res = await drawWinner(
      activePeriod.id,
      payload.winnerId,
      payload.grossPrize,
      payload.deductions,
      payload.netPrize,
      payload.sendWhatsApp
    );

    if (res.success) {
      setAlertNotice({
        type: "success",
        text: res.message || "Pemenang berhasil dikonfirmasi dan dicatat ke sistem!",
      });
      setTimeout(() => setAlertNotice(null), 8000);
    }
  };

  const handleResetCycle = async (nextCycle: number) => {
    const res = await resetCycle(nextCycle);
    if (res.success) {
      setAlertNotice({
        type: "info",
        text: `Siklus berhasil diperbarui ke Putaran ke-${nextCycle}! Seluruh anggota kini dapat diundi kembali.`,
      });
      setTimeout(() => setAlertNotice(null), 8000);
    }
  };

  const formatRp = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const totalPot = allActiveMembers.length * activePeriod.iuranAmount;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Top Banner Alert Notice */}
      {alertNotice && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 border shadow-sm ${
            alertNotice.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-blue-50 border-blue-200 text-blue-900"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs md:text-sm font-semibold">
            {alertNotice.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <Sparkles className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <span>{alertNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertNotice(null)}
            className="text-xs font-bold text-gray-400 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
            <span>Siklus Putaran #{currentCycle}</span>
            <span>•</span>
            <span>Tradisi Tabung Logam Digital</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            Kocokan Arisan Digital
            <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Pengundian transparan, efek suara kaleng gemerincing, pelunasan otomatis, dan notifikasi WhatsApp resmi.
          </p>
        </div>

        {/* User Role Badge */}
        <div className="self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Akses: {currentUser?.role} ({currentUser?.position})
          </span>
        </div>
      </div>

      {/* Quick Stat Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Total Uang Tarikan</span>
            <span className="text-base font-extrabold text-gray-900 tabular-nums">
              {formatRp(totalPot)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Periode Undian</span>
            <span className="text-base font-extrabold text-gray-900 truncate block max-w-[140px]">
              {activePeriod.name}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Kandidat Dalam Tabung</span>
            <span className="text-base font-extrabold text-purple-700 tabular-nums">
              {eligibleMembers.length} Orang
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-500 block">Telah Menang</span>
            <span className="text-base font-extrabold text-emerald-700 tabular-nums">
              {pastWinnersInCycle.length} / {allActiveMembers.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Traditional Metal Canister */}
      <LotteryCanister
        eligibleMembers={eligibleMembers}
        allActiveMembers={allActiveMembers}
        activePeriod={activePeriod}
        currentUserRole={currentUser?.role}
        onWinnerSelected={handleWinnerPicked}
      />

      {/* Cycle Progress & Pool Lists */}
      <CycleSummary
        currentCycle={currentCycle}
        allActiveMembers={allActiveMembers}
        eligibleMembers={eligibleMembers}
        pastWinnersInCycle={pastWinnersInCycle}
        payments={payments}
        activePeriod={activePeriod}
        canManage={currentUser?.role === "SUPER_ADMIN" || currentUser?.role === "ADMINISTRATOR"}
        onResetCycle={handleResetCycle}
      />

      {/* Winner Confirmation & Breakdown Modal */}
      <WinnerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        winner={candidateWinner}
        period={activePeriod}
        winnerPayment={candidatePayment}
        totalActiveMembersCount={allActiveMembers.length}
        onConfirm={handleConfirmWinner}
      />
    </div>
  );
}
