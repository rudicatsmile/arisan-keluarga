"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  LayoutDashboard,
  GitFork,
  HeartHandshake,
  MapPin,
  CreditCard,
  Building2,
  PieChart,
  UserCog,
  CheckCheck,
  HandCoins,
  CalendarDays,
  Settings,
  X,
  LogOut,
  ExternalLink,
  Trophy,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const { currentUser, logout } = useArisan();

  if (!currentUser) return null;

  const isBackOfficeUser =
    currentUser.role === "SUPER_ADMIN" ||
    currentUser.role === "ADMINISTRATOR" ||
    currentUser.role === "REVIEWER";

  const memberNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Kocokan Arisan", href: "/kocokan", icon: Trophy },
    { label: "Pohon Anggota", href: "/anggota", icon: GitFork },
    { label: "Keluarga Bahagia", href: "/keluarga-bahagia", icon: HeartHandshake },
    { label: "Lokasi & Jadwal", href: "/lokasi-arisan", icon: MapPin },
    { label: "Iuran Saya", href: "/iuran-saya", icon: CreditCard },
  ];

  const adminNav = [
    { label: "Ringkasan Admin", href: "/admin/dashboard", icon: Building2 },
    { label: "Rekap Keuangan", href: "/admin/keuangan", icon: PieChart },
    { label: "Kelola Anggota", href: "/admin/anggota", icon: UserCog },
    { label: "Verifikasi Iuran", href: "/admin/verifikasi-iuran", icon: CheckCheck },
    { label: "Biaya Sosial", href: "/admin/biaya-sosial", icon: HandCoins },
    { label: "Kelola Lokasi", href: "/admin/lokasi", icon: CalendarDays },
    { label: "Pengaturan Sistem", href: "/admin/pengaturan", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-none">
                Arisan<span className="text-blue-600">Keluarga</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Bani Sutrisno</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Member Area */}
          <div>
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Area Anggota
            </p>
            <nav className="space-y-1">
              {memberNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-xs font-semibold"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Back Office Area */}
          {isBackOfficeUser && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between px-3 mb-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Kelola Back Office
                </p>
                {currentUser.role === "REVIEWER" && (
                  <Badge className="text-[9px] px-1.5 py-0 bg-purple-50 text-purple-700 border-purple-200">
                    Mode Audit
                  </Badge>
                )}
              </div>
              <nav className="space-y-1">
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? "bg-slate-900 text-white shadow-xs font-semibold"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* User Footer Card */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between mb-3">
            <Link
              href={`/anggota/${currentUser.id}`}
              onClick={onClose}
              className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentUser.photoUrl}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover border border-white shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.position} • {currentUser.role}</p>
              </div>
            </Link>
            <Link
              href={`/anggota/${currentUser.id}`}
              className="p-1 text-slate-400 hover:text-blue-600"
              title="Profil Saya"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
