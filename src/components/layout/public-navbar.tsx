"use client";

import React from "react";
import Link from "next/link";
import { Users, HeartHandshake, LogIn, LayoutDashboard } from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  const { currentUser, settings } = useArisan();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 block leading-none">
              Arisan<span className="text-blue-600"> Keluarga</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">{settings?.arisanName || "Arisan Keluarga"}</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#fitur" className="hover:text-blue-600 transition">Keunggulan</a>
          <a href="#pohon" className="hover:text-blue-600 transition">Pohon Anggota</a>
          <a href="#keluarga" className="hover:text-blue-600 transition">Keluarga Bahagia</a>
          <a href="#transparansi" className="hover:text-blue-600 transition">Transparansi Kas</a>
        </nav>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <Link href="/dashboard">
              <Button size="sm" className="gap-2">
                <LayoutDashboard className="h-4 w-4" />
                <span>Masuk ke Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                <span>Masuk (WhatsApp OTP)</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
