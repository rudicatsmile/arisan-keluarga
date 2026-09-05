"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { useArisan } from "@/context/arisan-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, isLoaded } = useArisan();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-500">Memuat data ArisanKeluarga...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Akses Terbatas</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Halaman ini khusus untuk anggota dan pengurus ArisanKeluarga. Silakan masuk terlebih dahulu dengan nomor WhatsApp Anda.
          </p>
          <Link href="/login" className="w-full block">
            <Button className="w-full">Menuju Halaman Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        <AppHeader onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
