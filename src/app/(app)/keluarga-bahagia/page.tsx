"use client";

import React, { useState } from "react";
import {
  Heart,
  Plus,
  Search,
  UserCheck,
  Calendar,
  Sparkles,
  Edit,
  Trash2,
  Users,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-context";
import { FamilyMember, Relationship } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

export default function KeluargaBahagiaPage() {
  const { currentUser, users, familyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember, settings } =
    useArisan();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFam, setEditingFam] = useState<FamilyMember | null>(null);

  // Form State
  const [targetUserId, setTargetUserId] = useState(currentUser?.id || "usr-01");
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("ANAK");
  const [gender, setGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [birthDate, setBirthDate] = useState("");
  const [notes, setNotes] = useState("");

  const isBackOffice =
    currentUser?.role === "SUPER_ADMIN" || currentUser?.role === "ADMINISTRATOR";

  const handleOpenAddModal = (forUserId?: string) => {
    setEditingFam(null);
    setTargetUserId(forUserId || currentUser?.id || "usr-01");
    setName("");
    setRelationship("ANAK");
    setGender("Laki-laki");
    setBirthDate("");
    setNotes("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (fam: FamilyMember) => {
    setEditingFam(fam);
    setTargetUserId(fam.userId);
    setName(fam.name);
    setRelationship(fam.relationship);
    setGender(fam.gender || "Laki-laki");
    setBirthDate(fam.birthDate || "");
    setNotes(fam.notes || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error("Gagal", "Nama anggota keluarga wajib diisi.");
      return;
    }

    if (editingFam) {
      updateFamilyMember({
        ...editingFam,
        userId: targetUserId,
        name,
        relationship,
        gender,
        birthDate: birthDate || undefined,
        notes: notes || undefined,
      });
      success("Berhasil Disimpan", `Data keluarga ${name} telah diperbarui.`);
    } else {
      addFamilyMember({
        userId: targetUserId,
        name,
        relationship,
        gender,
        birthDate: birthDate || undefined,
        notes: notes || undefined,
      });
      success("Berhasil Ditambahkan", `${name} telah didaftarkan ke Keluarga Bahagia.`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (fam: FamilyMember) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data ${fam.name}?`)) {
      deleteFamilyMember(fam.id);
      success("Berhasil Dihapus", `Data ${fam.name} telah dihapus.`);
    }
  };

  // Group family members by Member / User
  const filteredUsers = users.filter((u) => {
    const fams = familyMembers.filter((f) => f.userId === u.id);
    const matchesUserName = u.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFamName = fams.some((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesUserName || matchesFamName;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <Heart className="h-3.5 w-3.5 fill-white text-white" />
            <span>Direktori Keluarga Bahagia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mengenal Seluruh Pasangan & Buah Hati
          </h1>
          <p className="text-rose-100 text-xs sm:text-sm leading-relaxed">
            Menghubungkan generasi sepuh dan generasi muda {settings?.arisanName || "Keluarga"} agar silaturahmi tetap akrab dan saling mendoakan setiap saat.
          </p>
        </div>

        <Button
          onClick={() => handleOpenAddModal()}
          className="bg-white text-rose-700 hover:bg-rose-50 shadow-md font-semibold text-xs h-10 gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Anggota Keluarga</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama keluarga, anak, atau anggota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs sm:text-sm"
          />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Total Terdata: {familyMembers.length} Pasangan & Anak
        </p>
      </div>

      {/* Member Family Cards Grid */}
      <div className="space-y-6">
        {filteredUsers.map((user) => {
          const userFams = familyMembers.filter((f) => f.userId === user.id);
          const isMyOwnCard = currentUser?.id === user.id;

          return (
            <Card key={user.id} className="border-slate-200 shadow-xs overflow-hidden">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 py-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="h-10 w-10 rounded-full object-cover border border-white shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{user.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{user.position}</Badge>
                      {isMyOwnCard && (
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px]">
                          Keluarga Anda
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{user.address}</p>
                  </div>
                </div>

                {(isMyOwnCard || isBackOffice) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenAddModal(user.id)}
                    className="text-xs gap-1.5 h-8 border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah ke Keluarga Ini</span>
                  </Button>
                )}
              </CardHeader>

              <CardContent className="p-6">
                {userFams.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {userFams.map((fam) => {
                      const canEdit = isMyOwnCard || isBackOffice;
                      return (
                        <div
                          key={fam.id}
                          className="rounded-xl border border-slate-200 p-4 bg-white hover:border-rose-300 hover:shadow-xs transition duration-200 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xl">
                                {fam.relationship === "ISTRI"
                                  ? "👰"
                                  : fam.relationship === "SUAMI"
                                  ? "🤵"
                                  : "👶"}
                              </span>
                              <Badge
                                variant={fam.relationship === "ANAK" ? "secondary" : "outline"}
                                className="text-[10px] font-semibold"
                              >
                                {fam.relationship}
                              </Badge>
                            </div>

                            <h4 className="font-bold text-slate-900 text-sm truncate">{fam.name}</h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">{fam.gender || "-"}</p>

                            {fam.birthDate && (
                              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-2">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span>{formatDate(fam.birthDate)}</span>
                              </div>
                            )}

                            {fam.notes && (
                              <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-md italic border border-slate-100">
                                &quot;{fam.notes}&quot;
                              </p>
                            )}
                          </div>

                          {canEdit && (
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(fam)}
                                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                                title="Ubah Data"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(fam)}
                                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-2 text-center">
                    Belum ada data keluarga tercatat untuk {user.name}.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Modal Form Tambah / Edit Anggota Keluarga */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingFam ? "Ubah Data Keluarga" : "Tambah Anggota Keluarga"}
            </DialogTitle>
            <DialogDescription>
              Lengkapi informasi pasangan atau anak untuk direktori Keluarga Bahagia.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            {isBackOffice && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Kepala Keluarga (Anggota Utama)
                </label>
                <Select
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.position})
                    </option>
                  ))}
                </Select>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Nama Lengkap Keluarga
              </label>
              <Input
                placeholder="Contoh: Aurel Putri"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Hubungan Keluarga
                </label>
                <Select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as Relationship)}
                >
                  <option value="SUAMI">Suami</option>
                  <option value="ISTRI">Istri</option>
                  <option value="ANAK">Anak</option>
                  <option value="BAPAK">Bapak</option>
                  <option value="IBU">Ibu</option>
                  <option value="SAUDARA">Saudara</option>
                  <option value="LAINNYA">Lainnya</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Jenis Kelamin
                </label>
                <Select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as "Laki-laki" | "Perempuan")}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tanggal Lahir (Opsional)
              </label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Catatan / Keterangan Tambahan
              </label>
              <Input
                placeholder="Contoh: Anak sulung, mahasiswa arsitektur semester 5"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button type="submit" className="text-xs bg-rose-600 hover:bg-rose-700 font-semibold">
                Simpan Data Keluarga
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
