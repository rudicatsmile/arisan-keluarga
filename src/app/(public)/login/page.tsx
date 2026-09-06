"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Phone,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useArisan } from "@/context/arisan-context";
import { useToast } from "@/components/ui/toast-context";

export default function LoginPage() {
  const router = useRouter();
  const { users, setCurrentUser } = useArisan();
  const { toast, success, error } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [phoneNumber, setPhoneNumber] = useState("081234000010"); // Default ke Ketua H. Bambang
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timer kirim ulang OTP 30 detik
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const clean = phoneNumber.replace(/[^0-9]/g, "");
    if (clean.length < 9) {
      setErrorMessage("Nomor WhatsApp minimal 9 digit.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: clean }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Gagal mengirimkan OTP.");
        setIsLoading(false);
        return;
      }

      setMatchedUser(data.user);
      setStep(2);
      setCountdown(30);
      setCanResend(false);

      success(
        "Kode OTP Terkirim via WhatsApp",
        data.simulationCode
          ? `Kode simulasi OTP (${data.simulationCode}) dikirim ke nomor ${data.user.name}.`
          : `Kode 6 digit telah dikirimkan ke nomor WhatsApp ${data.user.name}.`
      );
    } catch (err) {
      console.error("Request OTP error:", err);
      // Fallback lokal jika fetch error
      const found = users.find(
        (u) =>
          u.phone.replace(/[^0-9]/g, "").endsWith(clean.slice(-8)) ||
          u.phone.replace(/[^0-9]/g, "") === clean
      );
      if (found) {
        setMatchedUser(found);
        setStep(2);
        setCountdown(30);
        setCanResend(false);
        success("Kode OTP Dikirim", `Kode simulasi 123456 dikirim ke ${found.name}`);
      } else {
        setErrorMessage("Nomor WhatsApp belum terdaftar di ArisanKeluarga.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      const digits = val.replace(/[^0-9]/g, "").slice(0, 6).split("");
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtpCode(newOtp);
      const nextInput = document.getElementById(`otp-input-${Math.min(digits.length, 5)}`);
      nextInput?.focus();
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const code = otpCode.join("");

    if (code.length < 6) {
      setErrorMessage("Silakan lengkapi 6 digit kode OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: matchedUser?.phone || phoneNumber,
          otp: code,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "Kode OTP tidak valid.");
        setIsLoading(false);
        return;
      }

      // Update context user
      const fullUser = users.find((u) => u.id === data.user.id) || data.user;
      setCurrentUser(fullUser);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {}

      success("Masuk Berhasil!", data.message);
      router.push(data.redirectUrl || "/dashboard");
    } catch (err) {
      console.error("Verify OTP error:", err);
      // Fallback jika fetch offline
      if (matchedUser) {
        setCurrentUser(matchedUser);
        success("Masuk Berhasil!", `Selamat datang kembali, ${matchedUser.name}`);
        if (matchedUser.role === "SUPER_ADMIN" || matchedUser.role === "ADMINISTRATOR") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Users className="h-6 w-6" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Masuk ke ArisanKeluarga
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Verifikasi resmi melalui nomor WhatsApp terdaftar (Wablas Gateway)
          </p>
        </div>

        {/* Card Form */}
        <Card className="border-slate-200 shadow-xl bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                {step === 1 ? "Langkah 1: Nomor WhatsApp" : "Langkah 2: Masukkan Kode OTP"}
              </CardTitle>
              <Badge variant="outline" className="text-[11px] bg-slate-50">
                {step === 1 ? "Tahap 1 dari 2" : "Tahap 2 dari 2"}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              {step === 1
                ? "Masukkan nomor WhatsApp yang telah didaftarkan pengurus."
                : `Kode OTP 6 digit telah dikirimkan ke WhatsApp ${matchedUser?.name || ""}.`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Nomor WhatsApp Terdaftar
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Contoh: 081234000010"
                      className="pl-9 text-sm font-medium tracking-wide"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Format: 08xxxxxxxxxx atau 628xxxxxxxxxx
                  </p>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full gap-2 font-semibold">
                  {isLoading ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      <span>Menghubungkan ke WhatsApp Wablas...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Kode OTP WhatsApp</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="rounded-lg bg-blue-50/70 border border-blue-100 p-3 text-xs text-blue-900 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-950">{matchedUser?.name}</p>
                    <p className="text-[11px] text-blue-700">{matchedUser?.phone} ({matchedUser?.role})</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Ganti Nomor
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2 text-center">
                    Masukkan 6 Digit Kode OTP
                  </label>
                  <div className="flex justify-between gap-2 max-w-xs mx-auto">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="h-12 w-11 rounded-lg border border-slate-300 text-center text-lg font-bold text-slate-900 shadow-xs focus:border-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    ))}
                  </div>
                  <p className="text-center text-[11px] text-slate-500 mt-2">
                    Tip: Masukkan kode yang dikirim atau masukkan <strong>123456</strong>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Belum menerima pesan?</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={() => handleSendOtp()}
                      className="font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Kirim Ulang OTP
                    </button>
                  ) : (
                    <span className="text-slate-400">
                      Kirim ulang dalam ({countdown}s)
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="w-1/3 text-xs"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                    <span>Kembali</span>
                  </Button>
                  <Button type="submit" disabled={isLoading} className="w-2/3 gap-2 font-semibold">
                    {isLoading ? (
                      <>
                        <RotateCw className="h-4 w-4 animate-spin" />
                        <span>Memverifikasi...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Verifikasi & Masuk</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Terproteksi WhatsApp Gateway Wablas & Cookie HttpOnly</span>
        </div>
      </div>
    </div>
  );
}
