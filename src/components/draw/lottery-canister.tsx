"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { User, ArisanPeriod } from "@/data/mock-data";
import {
  playCanisterShakeSound,
  playPopSound,
  playFanfareSound,
} from "@/lib/sound-effects";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Play,
  RotateCcw,
  Trophy,
  Users,
  ShieldCheck,
  Eye,
  Gift,
} from "lucide-react";

interface LotteryCanisterProps {
  eligibleMembers: User[];
  allActiveMembers: User[];
  activePeriod: ArisanPeriod;
  currentUserRole?: string;
  onWinnerSelected: (winner: User) => void;
}

export function LotteryCanister({
  eligibleMembers,
  allActiveMembers,
  activePeriod,
  currentUserRole,
  onWinnerSelected,
}: LotteryCanisterProps) {
  const [stage, setStage] = useState<"idle" | "shaking" | "popping" | "unrolling" | "revealed">("idle");
  const [selectedWinner, setSelectedWinner] = useState<User | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const canDraw = currentUserRole === "SUPER_ADMIN" || currentUserRole === "ADMINISTRATOR";
  const hasEligible = eligibleMembers.length > 0;

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Trigger Kocokan Process
  const startDraw = () => {
    if (!canDraw || !hasEligible || stage === "shaking") return;

    // Pick random winner from eligible pool
    const randomIndex = Math.floor(Math.random() * eligibleMembers.length);
    const chosen = eligibleMembers[randomIndex];
    setSelectedWinner(chosen);

    // 1. Shaking Stage (3 seconds)
    setStage("shaking");
    if (soundEnabled) {
      playCanisterShakeSound(3200);
    }

    // 2. Popping Stage
    setTimeout(() => {
      setStage("popping");
      if (soundEnabled) playPopSound();

      // 3. Unrolling Stage
      setTimeout(() => {
        setStage("unrolling");
        if (soundEnabled) playFanfareSound();

        // Trigger Confetti Celebration
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#2563EB", "#F59E0B", "#10B981", "#EC4899", "#8B5CF6"],
        });

        // 4. Revealed Stage
        setTimeout(() => {
          setStage("revealed");
        }, 1200);
      }, 900);
    }, 3200);
  };

  const handleReset = () => {
    setStage("idle");
    setSelectedWinner(null);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-3xl overflow-hidden transition-all duration-500 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white flex flex-col justify-center items-center p-8"
          : "bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-indigo-500/20 p-6 md:p-10"
      }`}
    >
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Action Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8 w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <Gift className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                Tabung Kocokan Arisan
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Siklus Ke-{activePeriod.cycleNumber || 1}
              </span>
            </div>
            <p className="text-xs text-blue-200/80">
              {activePeriod.name} • {eligibleMembers.length} Peserta Berpeluang Terpilih
            </p>
          </div>
        </div>

        {/* Controls: Audio & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              soundEnabled
                ? "bg-white/15 border-white/20 text-white hover:bg-white/20"
                : "bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
            }`}
            title={soundEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            <span className="hidden sm:inline">{soundEnabled ? "Audio Aktif" : "Bisu"}</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/15 border border-white/20 text-white hover:bg-white/20 transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh (Smart TV / Proyektor)"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-300" /> : <Maximize2 className="w-4 h-4 text-blue-300" />}
            <span className="hidden sm:inline">{isFullscreen ? "Perkecil" : "Proyektor TV"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 flex flex-col items-center justify-center my-6 min-h-[380px] w-full max-w-2xl mx-auto">
        {/* CANISTER & PAPER ANIMATION AREA */}
        <div className="relative flex flex-col items-center justify-center">
          
          {/* 1. PAPER ROLL POPPING OUT */}
          {(stage === "popping" || stage === "unrolling") && (
            <div className="absolute -top-16 z-20 animate-pop-out flex flex-col items-center">
              <div className="w-10 h-24 rounded-full bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 border-2 border-amber-500 shadow-xl flex items-center justify-center rotate-12">
                <span className="text-[9px] font-black text-amber-900 tracking-widest -rotate-90">
                  ARISAN
                </span>
              </div>
            </div>
          )}

          {/* 2. REVEALED UNROLLED SCROLL / WINNER CARD */}
          {(stage === "unrolling" || stage === "revealed") && selectedWinner && (
            <div className="absolute -top-6 z-30 w-full max-w-md px-4 animate-unroll">
              <div className="relative bg-gradient-to-b from-amber-50 via-white to-amber-50 rounded-3xl p-6 md:p-8 text-gray-900 shadow-2xl border-4 border-amber-400 flex flex-col items-center text-center">
                {/* Vintage Scroll Top and Bottom Handles */}
                <div className="absolute -top-3 left-6 right-6 h-3 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full shadow-md" />
                <div className="absolute -bottom-3 left-6 right-6 h-3 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-full shadow-md" />

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-3">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  Alhamdulillah! Pemenang Tarikan
                </div>

                <div className="relative mb-3">
                  <img
                    src={
                      selectedWinner.photoUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
                    }
                    alt={selectedWinner.name}
                    className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-amber-400 shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 p-2 bg-amber-500 text-white rounded-full shadow-lg">
                    <Trophy className="w-5 h-5 text-yellow-200" />
                  </div>
                </div>

                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  {selectedWinner.name}
                </h3>
                <p className="text-xs font-semibold text-blue-700 mt-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                  {selectedWinner.position} • Anggota Keluarga
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  Nomor HP: {selectedWinner.phone}
                </p>

                {/* Actions when revealed */}
                {stage === "revealed" && (
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
                    {canDraw ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onWinnerSelected(selectedWinner)}
                          className="flex-1 min-w-[160px] py-3 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs md:text-sm font-black rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Lihat Rincian & Konfirmasi
                        </button>
                        <button
                          type="button"
                          onClick={handleReset}
                          className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs md:text-sm font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Kocok Ulang
                        </button>
                      </>
                    ) : (
                      <div className="w-full p-3 rounded-xl bg-blue-50 text-blue-800 text-xs font-semibold flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" />
                        Selamat kepada pemenang! Menunggu konfirmasi resmi oleh Administrator.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. TRADITIONAL INDONESIAN METAL CANISTER (Kaleng Arisan Logam) */}
          <div
            className={`relative w-48 h-64 md:w-56 md:h-72 select-none transition-all ${
              stage === "shaking" ? "canister-shake" : ""
            } ${stage === "unrolling" || stage === "revealed" ? "opacity-30 filter blur-xs" : ""}`}
          >
            {/* Top Lid Metallic Bezel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 md:w-52 h-10 rounded-[50%] bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 border-2 border-slate-300 shadow-md flex items-center justify-center z-10">
              {/* Canister Slot (Lubang Keluarnya Kertas) */}
              <div className="w-14 h-3 bg-slate-900 rounded-full shadow-inner border border-slate-600/80 flex items-center justify-center">
                <div className="w-10 h-0.5 bg-amber-400/40 rounded" />
              </div>
            </div>

            {/* Canister Metallic Cylindrical Body */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-44 md:w-52 h-56 md:h-64 rounded-b-3xl bg-gradient-to-r from-slate-500 via-slate-200 via-slate-100 to-slate-400 shadow-2xl border-x-2 border-b-4 border-slate-400 overflow-hidden flex flex-col items-center justify-between py-4">
              
              {/* Top Embossed Rim */}
              <div className="w-full h-2 bg-gradient-to-r from-slate-400 via-white to-slate-400 opacity-80" />

              {/* Central Vintage Badge Motif */}
              <div className="w-36 md:w-44 py-3 px-2 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-800 border-2 border-amber-300 shadow-lg text-center transform rotate-0">
                <div className="border border-amber-300/60 p-1.5 rounded-lg">
                  <span className="block text-[9px] uppercase tracking-widest font-black text-amber-200">
                    TABUNG LOGAM RESMI
                  </span>
                  <span className="block text-xs md:text-sm font-black text-white tracking-wide mt-0.5 leading-tight">
                    ARISAN BANI SUTRISNO
                  </span>
                  <span className="block text-[8px] text-amber-100 mt-1 font-semibold">
                    1 KELUARGA 1 HAK KEMENANGAN
                  </span>
                </div>
              </div>

              {/* Traditional Gold / Metallic Stripes */}
              <div className="w-full space-y-1">
                <div className="w-full h-1 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 opacity-90" />
                <div className="w-full h-2 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 opacity-70" />
                <div className="w-full h-1 bg-gradient-to-r from-amber-600 via-amber-300 to-amber-600 opacity-90" />
              </div>

              {/* Bottom Rim */}
              <div className="w-36 h-2 rounded-full bg-slate-600/40 blur-xs" />
            </div>

            {/* Canister Drop Shadow */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-black/60 rounded-full blur-md" />
          </div>
        </div>

        {/* Shake Status / Instructions */}
        <div className="mt-8 text-center min-h-[40px]">
          {stage === "idle" && (
            <p className="text-xs md:text-sm text-blue-200 font-medium">
              {hasEligible
                ? "Tekan tombol di bawah untuk mengguncang tabung kocokan dan mengeluarkan gulungan nama."
                : "🎉 Seluruh anggota telah memenangkan putaran ini! Putaran siap diperbarui."}
            </p>
          )}

          {stage === "shaking" && (
            <div className="flex items-center justify-center gap-2 text-amber-300 text-sm font-black animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Mengguncang Tabung Kocokan Arisan... Cling! Cling!</span>
            </div>
          )}

          {stage === "popping" && (
            <div className="text-emerald-300 text-sm font-black animate-bounce">
              🌟 Gulungan nama pemenang keluar dari tabung!
            </div>
          )}
        </div>
      </div>

      {/* Bottom Main Button Controls */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto pt-2">
        {canDraw ? (
          stage === "idle" ? (
            <button
              type="button"
              onClick={startDraw}
              disabled={!hasEligible}
              className="w-full py-4 px-8 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm md:text-base rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              KOCOK TABUNG SEKARANG!
            </button>
          ) : stage === "shaking" ? (
            <div className="w-full py-4 px-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center text-sm font-bold text-amber-300 flex items-center justify-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              Sedang Mengocok Tabung...
            </div>
          ) : null
        ) : (
          <div className="w-full p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Mode Siaran Langsung (Spectator Live)
            </div>
            <p className="text-[11px] text-blue-300/70 mt-1">
              Hanya Pengurus (Ketua & Bendahara) yang berwenang menekan tombol kocokan.
            </p>
          </div>
        )}
      </div>

      {/* Custom Styles for Canister Shake & Unroll Animation */}
      <style jsx>{`
        @keyframes canisterShake {
          0% { transform: translate(0, 0) rotate(0deg); }
          15% { transform: translate(-8px, -4px) rotate(-6deg); }
          30% { transform: translate(8px, 4px) rotate(6deg); }
          45% { transform: translate(-10px, 2px) rotate(-8deg); }
          60% { transform: translate(10px, -2px) rotate(8deg); }
          75% { transform: translate(-6px, 4px) rotate(-4deg); }
          90% { transform: translate(6px, -4px) rotate(4deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes popOut {
          0% { transform: translateY(40px) scale(0.3); opacity: 0; }
          60% { transform: translateY(-30px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }

        @keyframes unroll {
          0% { transform: scale(0.6) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .canister-shake {
          animation: canisterShake 0.12s infinite;
        }

        .animate-pop-out {
          animation: popOut 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .animate-unroll {
          animation: unroll 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
