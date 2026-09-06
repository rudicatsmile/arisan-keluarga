"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  GitFork,
  LayoutGrid,
  Phone,
  MapPin,
  Briefcase,
  ChevronRight,
  Shield,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { User } from "@/data/mock-data";

export default function AnggotaPage() {
  const { users, settings } = useArisan();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"tree" | "grid">("tree");

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.occupation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Grouping for Tree structure
  const rootUsers = users.filter((u) => !u.parentId || u.position === "KETUA" || u.position === "PEMBINA");
  const getChildren = (parentId: string) => users.filter((u) => u.parentId === parentId);

  const getPositionBadge = (pos: string) => {
    switch (pos) {
      case "KETUA":
        return <Badge className="bg-blue-600 text-white border-transparent">Ketua Paguyuban</Badge>;
      case "BENDAHARA":
        return <Badge className="bg-emerald-600 text-white border-transparent">Bendahara</Badge>;
      case "SEKRETARIS":
        return <Badge className="bg-purple-600 text-white border-transparent">Sekretaris</Badge>;
      case "PEMBINA":
        return <Badge className="bg-amber-600 text-white border-transparent">Pembina / Sesepuh</Badge>;
      default:
        return <Badge variant="secondary">Anggota</Badge>;
    }
  };

  const renderMemberCard = (user: User, isChild = false) => (
    <Card
      key={user.id}
      className={`border-slate-200 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition duration-200 bg-white ${
        isChild ? "border-l-4 border-l-blue-500" : ""
      }`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <Avatar src={user.photoUrl} fallback={user.name} size="lg" className="border-2 border-white shadow-xs" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-slate-900 truncate">{user.name}</h3>
              {getPositionBadge(user.position)}
            </div>

            <div className="space-y-1 text-xs text-slate-600 mt-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{user.occupation}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{user.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <Link href={`/anggota/${user.id}/pembayaran`}>
                <span className="text-[11px] font-semibold text-blue-600 hover:underline">
                  Hasil Iuran
                </span>
              </Link>
              <Link href={`/anggota/${user.id}`}>
                <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <span>Lihat Profil</span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Pohon Anggota & Silsilah Paguyuban
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Susunan keanggotaan, struktur kepengurusan, dan relasi keluarga besar {settings?.arisanName || "Keluarga"}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "tree" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("tree")}
            className="gap-1.5 text-xs"
          >
            <GitFork className="h-3.5 w-3.5" />
            <span>Pohon Organisasi</span>
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="gap-1.5 text-xs"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Semua Anggota ({users.length})</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari anggota, jabatan, atau profesi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-xs sm:text-sm"
        />
      </div>

      {/* Tree Mode View */}
      {viewMode === "tree" && !searchQuery && (
        <div className="space-y-8">
          {/* Level 1: Dewan Pembina & Ketua */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">
                Pimpinan & Pengurus Inti
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rootUsers.map((u) => renderMemberCard(u))}
            </div>
          </div>

          {/* Level 2: Pengurus Cabang / Anggota di bawah Ketua */}
          {rootUsers.map((root) => {
            const children = getChildren(root.id);
            if (children.length === 0) return null;

            return (
              <div key={root.id} className="pl-0 sm:pl-6 border-l-2 border-slate-200 space-y-4">
                <div className="flex items-center gap-2">
                  <GitFork className="h-4 w-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Keluarga & Binaan di Bawah: {root.name} ({root.position})
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map((child) => renderMemberCard(child, true))}
                </div>

                {/* Level 3: Cucu / Sub-children */}
                {children.map((child) => {
                  const subChildren = getChildren(child.id);
                  if (subChildren.length === 0) return null;
                  return (
                    <div key={child.id} className="pl-4 sm:pl-6 border-l-2 border-blue-200 space-y-3 mt-2">
                      <p className="text-[11px] font-semibold text-slate-400">
                        Keluarga {child.name}:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {subChildren.map((sub) => renderMemberCard(sub, true))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Grid Mode View or Search Results */}
      {(viewMode === "grid" || searchQuery) && (
        <div className="space-y-4">
          {searchQuery && (
            <p className="text-xs text-slate-500">
              Menampilkan {filteredUsers.length} hasil untuk &quot;{searchQuery}&quot;
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => renderMemberCard(user))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
              <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Anggota tidak ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
