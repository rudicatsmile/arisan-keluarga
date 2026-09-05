"use client";

import React from "react";
import { Menu, Bell, ShieldCheck, Heart } from "lucide-react";
import { PersonaSwitcher } from "@/components/layout/persona-switcher";
import { useArisan } from "@/context/arisan-context";

interface AppHeaderProps {
  onOpenSidebar: () => void;
}

export function AppHeader({ onOpenSidebar }: AppHeaderProps) {
  const { currentUser, payments } = useArisan();

  if (!currentUser) return null;

  // Pending payments count
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition"
          aria-label="Buka Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1 font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
            <Heart className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
            <span>Keluarga Bani Sutrisno</span>
          </div>
          <span className="text-slate-300">•</span>
          <span>Tahun Buku 2026</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification indicator for Admin / Reviewer */}
        {(currentUser.role === "SUPER_ADMIN" || currentUser.role === "ADMINISTRATOR") && pendingCount > 0 && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
            <Bell className="h-3.5 w-3.5 text-amber-600" />
            <span>{pendingCount} bukti bayar menunggu verifikasi</span>
          </div>
        )}

        {/* Persona Switcher for easy testing of any role */}
        <PersonaSwitcher />
      </div>
    </header>
  );
}
