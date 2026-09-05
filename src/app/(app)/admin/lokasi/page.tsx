"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Plus,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Navigation,
  Edit,
  Trash2,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast-context";
import { formatDate, formatDateTime } from "@/lib/utils";
import { ArisanMeeting, MeetingStatus } from "@/data/mock-data";

export default function KelolaLokasiPage() {
  const { currentUser, users, meetings, addMeeting, updateMeetingStatus } = useArisan();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [hostMemberId, setHostMemberId] = useState(users[0]?.id || "usr-01");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(-6.9175);
  const [longitude, setLongitude] = useState(107.6191);
  const [scheduledAt, setScheduledAt] = useState("2026-07-18T10:00");
  const [notes, setNotes] = useState("");

  const isReviewer = currentUser?.role === "REVIEWER";

  const handleOpenAddModal = () => {
    setTitle("Pertemuan Rutin & Kocokan Periode 13");
    setHostMemberId(users[0]?.id || "usr-01");
    setAddress("Jl. Melati Raya No. 12, Kel. Cipadung, Bandung");
    setLatitude(-6.9175);
    setLongitude(107.6191);
    setScheduledAt("2026-07-18T10:00");
    setNotes("Makan siang bersama dan pengundian arisan periode 13.");
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim()) {
      error("Gagal", "Judul pertemuan dan alamat lengkap wajib diisi.");
      return;
    }

    const host = users.find((u) => u.id === hostMemberId);

    addMeeting({
      title,
      hostMemberId,
      hostMemberName: host ? host.name : "Anggota Keluarga",
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
      scheduledAt: new Date(scheduledAt).toISOString(),
      status: "PLANNED",
      notes,
    });

    success("Jadwal Pertemuan Dibuat", "Lokasi dan jadwal baru telah dipublikasikan ke anggota.");
    setIsModalOpen(false);
  };

  const handleStatusChange = (meetingId: string, status: MeetingStatus) => {
    updateMeetingStatus(meetingId, status);
    success("Status Diperbarui", `Jadwal pertemuan kini berstatus ${status}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Lokasi & Jadwal Pertemuan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Atur tuan rumah pertemuan berkala, alamat tempat berkumpul, titik koordinat peta, dan status pelaksanaan.
          </p>
        </div>

        {!isReviewer && (
          <Button
            onClick={handleOpenAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold gap-1.5 h-10 shadow-xs shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Jadwal Pertemuan</span>
          </Button>
        )}
      </div>

      {/* Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Pertemuan</TableHead>
                <TableHead>Tuan Rumah</TableHead>
                <TableHead>Waktu Pelaksanaan</TableHead>
                <TableHead>Alamat & Koordinat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meet) => (
                <TableRow key={meet.id}>
                  <TableCell className="font-bold text-slate-900">
                    <div>
                      <p className="text-sm">{meet.title}</p>
                      <p className="text-xs text-slate-500 font-normal mt-0.5 max-w-xs truncate">
                        {meet.notes}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-blue-700">
                    {meet.hostMemberName}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 font-medium whitespace-nowrap">
                    {formatDateTime(meet.scheduledAt)} WIB
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 max-w-xs">
                    <p className="line-clamp-1 font-medium">{meet.address}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {meet.latitude}, {meet.longitude}
                    </p>
                  </TableCell>
                  <TableCell>
                    {meet.status === "PLANNED" && <Badge variant="jadwal">DIJADWALKAN</Badge>}
                    {meet.status === "DONE" && <Badge variant="selesai">SELESAI</Badge>}
                    {meet.status === "CANCELLED" && <Badge variant="destructive">DIBATALKAN</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    {!isReviewer && (
                      <div className="flex items-center justify-end gap-1.5">
                        {meet.status === "PLANNED" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(meet.id, "DONE")}
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                          >
                            Tandai Selesai
                          </Button>
                        )}
                        {meet.status !== "CANCELLED" && meet.status !== "DONE" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(meet.id, "CANCELLED")}
                            className="h-7 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                          >
                            Batalkan
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tambah Pertemuan */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Jadwal Lokasi Arisan</DialogTitle>
            <DialogDescription>
              Tentukan tuan rumah dan titik peta pertemuan keluarga berikutnya.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Judul / Acara Pertemuan
              </label>
              <Input
                placeholder="Contoh: Pertemuan Rutin & Arisan Periode 13"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tuan Rumah (Anggota Penyelenggara)
              </label>
              <Select
                value={hostMemberId}
                onChange={(e) => setHostMemberId(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.position})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Waktu & Tanggal Acara
              </label>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Alamat Lengkap Rumah
              </label>
              <Textarea
                placeholder="Contoh: Jl. Melati Raya No. 12, Kel. Cipadung, Cibiru, Bandung"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Latitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Longitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Catatan Tambahan untuk Anggota
              </label>
              <Input
                placeholder="Contoh: Diharapkan hadir tepat waktu, parkir mobil tersedia di halaman."
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
              <Button type="submit" className="text-xs bg-blue-600 hover:bg-blue-700 font-semibold">
                Simpan & Terbitkan Jadwal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
