"use client";

import React, { useState } from "react";
import { useArisan } from "@/context/arisan-context";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, UserCheck, Shield, Sparkles } from "lucide-react";

export function PersonaSwitcher() {
  const { currentUser, users, switchPersona } = useArisan();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Badge variant="admin">Super Admin</Badge>;
      case "ADMINISTRATOR":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Admin</Badge>;
      case "REVIEWER":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Reviewer (Auditor)</Badge>;
      default:
        return <Badge variant="secondary">Anggota</Badge>;
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/70 p-1.5 pr-3 transition text-left cursor-pointer"
        title="Ganti Persona Pengujian"
      >
        <Avatar src={currentUser.photoUrl} fallback={currentUser.name} size="sm" />
        <div className="hidden sm:block text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 leading-tight">
            <span>{currentUser.name}</span>
            <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-[11px] text-slate-500">{currentUser.position} • {currentUser.role}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 z-50 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-50 zoom-in-95">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Simulasi Akun (Ganti Role)</p>
              <p className="text-[11px] text-slate-500">Pilih akun untuk menguji fitur & hak akses:</p>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-1">
              {users.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchPersona(u.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition cursor-pointer ${
                      isSelected ? "bg-blue-50 border border-blue-200 text-blue-900" : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <Avatar src={u.photoUrl} fallback={u.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{u.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-500">{u.position}</span>
                        {getRoleBadge(u.role)}
                      </div>
                    </div>
                    {isSelected && <UserCheck className="h-4 w-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
