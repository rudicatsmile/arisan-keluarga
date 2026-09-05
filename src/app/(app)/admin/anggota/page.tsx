"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Search,
  Edit,
  Trash2,
  Shield,
  Phone,
  Briefcase,
  GitFork,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-context";
import { User, Role, Position } from "@/data/mock-data";
import { formatDate } from "@/lib/utils";

export default function KelolaAnggotaPage() {
  const { currentUser, users, addMember, updateMember } = useArisan();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role>("ANGGOTA");
  const [position, setPosition] = useState<Position>("ANGGOTA");
  const [gender, setGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [parentId, setParentId] = useState<string>("none");
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80"
  );

  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
  const isReviewer = currentUser?.role === "REVIEWER";

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setName("");
    setPhone("0812");
    setRole("ANGGOTA");
    setPosition("ANGGOTA");
    setGender("Laki-laki");
    setBirthDate("1990-01-01");
    setAddress("Bandung, Jawa Barat");
    setOccupation("");
    setParentId("none");
    setPhotoUrl("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setPhone(u.phone);
    setRole(u.role);
    setPosition(u.position);
    setGender(u.gender);
    setBirthDate(u.birthDate);
    setAddress(u.address);
    setOccupation(u.occupation);
    setParentId(u.parentId || "none");
    setPhotoUrl(u.photoUrl);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      error("Gagal", "Nama dan nomor WhatsApp wajib diisi.");
      return;
    }

    if (editingUser) {
      updateMember({
        ...editingUser,
        name,
        phone,
        role,
        position,
        gender,
        birthDate,
        address,
        occupation,
        parentId: parentId === "none" ? null : parentId,
        photoUrl,
      });
      success("Berhasil Disimpan", `Data anggota ${name} telah diperbarui.`);
    } else {
      addMember({
        name,
        phone,
        role,
        position,
        gender,
        birthDate,
        address,
        occupation,
        parentId: parentId === "none" ? null : parentId,
        photoUrl,
        isActive: true,
      });
      success("Anggota Ditambahkan", `${name} berhasil didaftarkan dan akun siap login via OTP.`);
    }

    setIsModalOpen(false);
  };

  const handleToggleActive = (u: User) => {
    if (u.id === currentUser?.id) {
      error("Aksi Ditolak", "Anda tidak dapat menonaktifkan akun sendiri.");
      return;
    }
    updateMember({
      ...u,
      isActive: !u.isActive,
    });
    success("Status Diperbarui", `Akun ${u.name} sekarang ${!u.isActive ? "Aktif" : "Nonaktif"}.`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery) ||
      u.occupation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Anggota & Hak Akses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tambah anggota baru, atur role aplikasi, tetapkan jabatan kepengurusan, dan susun pohon arisan.
          </p>
        </div>

        {!isReviewer && (
          <Button
            onClick={handleOpenAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 h-10 shadow-xs shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah Anggota Baru</span>
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama, no. WhatsApp, atau profesi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Filter Role:</span>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs h-9 w-44"
          >
            <option value="ALL">Semua Role</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMINISTRATOR">Administrator</option>
            <option value="REVIEWER">Reviewer</option>
            <option value="ANGGOTA">Anggota</option>
          </Select>
        </div>
      </div>

      {/* Table CRUD */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Anggota</TableHead>
                <TableHead>No. WhatsApp</TableHead>
                <TableHead>Jabatan Organisasi</TableHead>
                <TableHead>Hak Akses (Role)</TableHead>
                <TableHead>Pohon Atasan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => {
                const parent = users.find((p) => p.id === u.parentId);
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={u.photoUrl}
                          alt={u.name}
                          className="h-9 w-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-bold">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.occupation || u.address}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-700">
                      {u.phone}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-semibold">
                        {u.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {u.role === "SUPER_ADMIN" && <Badge variant="admin">SUPER ADMIN</Badge>}
                      {u.role === "ADMINISTRATOR" && <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px]">ADMIN</Badge>}
                      {u.role === "REVIEWER" && <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-[10px]">REVIEWER</Badge>}
                      {u.role === "ANGGOTA" && <Badge variant="secondary" className="text-[10px]">ANGGOTA</Badge>}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {parent ? parent.name : <span className="text-slate-400">Pucuk Utama</span>}
                    </TableCell>
                    <TableCell>
                      {u.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Aktif</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                          <XCircle className="h-3 w-3" />
                          <span>Nonaktif</span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {!isReviewer && (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenEditModal(u)}
                            className="h-7 w-7 p-0 text-slate-500 hover:text-blue-600"
                            title="Edit Anggota"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleActive(u)}
                            className={`h-7 px-2 text-[11px] ${
                              u.isActive ? "text-rose-600 hover:bg-rose-50" : "text-emerald-600 hover:bg-emerald-50"
                            }`}
                            title="Ubah Status Aktif"
                          >
                            {u.isActive ? "Nonaktifkan" : "Aktifkan"}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tambah / Edit Anggota */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? `Ubah Data Anggota: ${editingUser.name}` : "Tambah Anggota Arisan Baru"}
            </DialogTitle>
            <DialogDescription>
              Anggota yang ditambahkan akan otomatis dapat login via WhatsApp OTP menggunakan nomor yang didaftarkan.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Lengkap Anggota
                </label>
                <Input
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nomor WhatsApp (Aktif)
                </label>
                <Input
                  placeholder="Contoh: 081234000018"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Jabatan Organisasi Arisan
                </label>
                <Select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as Position)}
                >
                  <option value="ANGGOTA">Anggota</option>
                  <option value="KETUA">Ketua</option>
                  <option value="BENDAHARA">Bendahara</option>
                  <option value="SEKRETARIS">Sekretaris</option>
                  <option value="PEMBINA">Pembina / Sesepuh</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Hak Akses Aplikasi (Role)
                </label>
                <Select
                  value={role}
                  disabled={!isSuperAdmin && editingUser?.role === "SUPER_ADMIN"}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="ANGGOTA">Anggota</option>
                  <option value="ADMINISTRATOR">Administrator</option>
                  <option value="REVIEWER">Reviewer (Auditor)</option>
                  {isSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tanggal Lahir
                </label>
                <Input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Atasan Pohon Silsilah
                </label>
                <Select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                >
                  <option value="none">— Pucuk Utama (Tanpa Atasan) —</option>
                  {users
                    .filter((u) => !editingUser || u.id !== editingUser.id)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.position})
                      </option>
                    ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pekerjaan / Profesi
                </label>
                <Input
                  placeholder="Contoh: Guru / Wiraswasta"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  URL Foto Profil
                </label>
                <Input
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Alamat Lengkap
              </label>
              <Input
                placeholder="Contoh: Jl. Melati No. 12, Bandung"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
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
              <Button type="submit" className="text-xs bg-blue-600 hover:bg-blue-700 font-semibold">
                Simpan Data Anggota
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
