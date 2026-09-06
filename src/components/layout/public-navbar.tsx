"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  LogIn,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  GitFork,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Button } from "@/components/ui/button";

export function PublicNavbar() {
  const { currentUser, settings } = useArisan();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm sm:shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0">
            <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 block leading-tight truncate">
              Arisan<span className="text-blue-600"> Keluarga</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[120px] xs:max-w-[170px] sm:max-w-[240px] block leading-none mt-0.5">
              {settings?.arisanName || "Arisan Keluarga"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#fitur" className="hover:text-blue-600 transition">
            Keunggulan
          </a>
          <a href="#pohon" className="hover:text-blue-600 transition">
            Pohon Anggota
          </a>
          <a href="#keluarga" className="hover:text-blue-600 transition">
            Keluarga Bahagia
          </a>
          <a href="#transparansi" className="hover:text-blue-600 transition">
            Transparansi Kas
          </a>
        </nav>

        {/* Action Button & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {currentUser ? (
            <Link href="/dashboard">
              <Button
                size="sm"
                className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm gap-1.5 font-medium shadow-xs"
              >
                <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Masuk ke </span>
                <span>Dashboard</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button
                size="sm"
                className="h-8 sm:h-9 px-2.5 sm:px-3 text-xs sm:text-sm gap-1.5 font-medium shadow-xs"
              >
                <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Masuk</span>
                <span className="hidden sm:inline"> (WhatsApp OTP)</span>
              </Button>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Tutup navigasi" : "Buka navigasi"}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-3 py-2.5 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1 text-xs">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 rounded-lg transition"
            >
              <Sparkles className="h-4 w-4 text-blue-500 shrink-0" />
              <span>Keunggulan Paguyuban</span>
            </a>
            <a
              href="#pohon"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 rounded-lg transition"
            >
              <GitFork className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Pohon Anggota & Silsilah</span>
            </a>
            <a
              href="#keluarga"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 rounded-lg transition"
            >
              <HeartHandshake className="h-4 w-4 text-rose-500 shrink-0" />
              <span>Direktori Keluarga Bahagia</span>
            </a>
            <a
              href="#transparansi"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50/70 rounded-lg transition"
            >
              <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0" />
              <span>Transparansi Kas & Mutasi</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
