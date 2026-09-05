"use client";

import React, { useState } from "react";
import {
  HandCoins,
  Plus,
  ShieldCheck,
  HeartHandshake,
  Calendar,
  Eye,
  FileCheck,
  AlertCircle,
  Filter,
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
import { formatDate, formatRupiah } from "@/lib/utils";
import { ExpenseCategory } from "@/data/mock-data";

export default function BiayaSosialPage() {
  const { currentUser, users, socialExpenses, addSocialExpense, reviewSocialExpense } = useArisan();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [previewProofUrl, setPreviewProofUrl] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState<ExpenseCategory>("SAKIT");
  const [recipientId, setRecipientId] = useState(users[0]?.id || "usr-01");
  const [amount, setAmount] = useState<number>(500000);
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [proofUrl, setProofUrl] = useState(
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80"
  );

  const isReviewer = currentUser?.role === "REVIEWER";

  const totalPengeluaran = socialExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleOpenAddModal = () => {
    setDescription("");
    setAmount(500000);
    setCategory("SAKIT");
    setExpenseDate(new Date().toISOString().split("T")[0]);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) {
      error("Gagal", "Deskripsi keperluan dan nominal yang valid wajib diisi.");
      return;
    }

    const recipient = users.find((u) => u.id === recipientId);

    addSocialExpense({
      category,
      recipientId,
      recipientName: recipient ? recipient.name : "Keluarga Anggota",
      amount: Number(amount),
      expenseDate,
      description,
      proofUrl,
    });

    success("Biaya Sosial Dicatat", "Pengeluaran kas tali asih berhasil dibukukan ke sistem.");
    setIsModalOpen(false);
  };

  const handleReview = (id: string) => {
    reviewSocialExpense(id);
    success("Audit Disetujui", "Pengeluaran sosial telah ditandai 'Sudah Diperiksa' oleh Auditor.");
  };

  const filteredExpenses = socialExpenses.filter((e) => {
    if (categoryFilter === "ALL") return true;
    return e.category === categoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Biaya Sosial & Santunan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pencatatan dana kas keluar untuk santunan sakit, bantuan kelahiran, tali duka, dan hadiah prestasi keluarga.
          </p>
        </div>

        {!isReviewer && (
          <Button
            onClick={handleOpenAddModal}
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold gap-1.5 h-10 shadow-xs shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Catat Pengeluaran Sosial</span>
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-rose-200 bg-rose-50/50 shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-rose-800">Total Kas Sosial Disalurkan</span>
            <div className="mt-2">
              <span className="text-2xl font-black text-rose-700 tabular-nums">
                {formatRupiah(totalPengeluaran)}
              </span>
            </div>
            <p className="text-[11px] text-rose-700 mt-1 font-medium">{socialExpenses.length} kali pencatatan</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-slate-500">Santunan Sakit & Rawat Inap</span>
            <div className="mt-2">
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {formatRupiah(
                  socialExpenses
                    .filter((e) => e.category === "SAKIT")
                    .reduce((sum, e) => sum + e.amount, 0)
                )}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Tali asih anggota terbaring sakit</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xs">
          <CardContent className="p-5">
            <span className="text-xs font-semibold text-slate-500">Bantuan & Hadiah Keluarga</span>
            <div className="mt-2">
              <span className="text-xl font-bold text-slate-900 tabular-nums">
                {formatRupiah(
                  socialExpenses
                    .filter((e) => e.category === "BANTUAN" || e.category === "HADIAH")
                    .reduce((sum, e) => sum + e.amount, 0)
                )}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Kelahiran bayi & apresiasi kelulusan</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-semibold text-slate-700">Kategori:</span>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs h-9 w-44"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="SAKIT">Sakit</option>
            <option value="BANTUAN">Bantuan</option>
            <option value="HADIAH">Hadiah</option>
            <option value="LAINNYA">Lainnya</option>
          </Select>
        </div>
      </div>

      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Penerima</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Keterangan Pengeluaran</TableHead>
                <TableHead>Dicatat Oleh</TableHead>
                <TableHead>Bukti Dokumen</TableHead>
                <TableHead>Status Audit</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="text-xs font-medium text-slate-600 whitespace-nowrap">
                    {formatDate(exp.expenseDate)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] ${
                        exp.category === "SAKIT"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : exp.category === "HADIAH"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      {exp.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs text-slate-900">
                    {exp.recipientName}
                  </TableCell>
                  <TableCell className="font-bold tabular-nums text-slate-900">
                    {formatRupiah(exp.amount)}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 max-w-xs leading-relaxed">
                    {exp.description}
                  </TableCell>
                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {exp.recordedByName}
                  </TableCell>
                  <TableCell>
                    {exp.proofUrl ? (
                      <button
                        type="button"
                        onClick={() => setPreviewProofUrl(exp.proofUrl || null)}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Lihat Bukti</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {exp.isReviewed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Diperiksa</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Belum diperiksa</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isReviewer && !exp.isReviewed && (
                      <Button
                        size="sm"
                        onClick={() => handleReview(exp.id)}
                        className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                      >
                        Tandai Diperiksa
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Catat Biaya Sosial Baru */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Catat Pengeluaran Biaya Sosial</DialogTitle>
            <DialogDescription>
              Pencatatan langsung pengeluaran kas arisan untuk santunan dan tali asih keluarga.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Kategori Pengeluaran
                </label>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                >
                  <option value="SAKIT">Sakit</option>
                  <option value="BANTUAN">Bantuan</option>
                  <option value="HADIAH">Hadiah</option>
                  <option value="LAINNYA">Lainnya</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Tanggal Pengeluaran
                </label>
                <Input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Penerima Santunan / Tali Asih
              </label>
              <Select
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
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
                Besaran Nominal (Rp)
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Deskripsi & Keperluan Pengeluaran
              </label>
              <Textarea
                placeholder="Contoh: Santunan rawat inap di RS Al-Islam selama 3 hari karena DBD"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                URL Foto Bukti Pendukung / Kuitansi
              </label>
              <Input
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
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
                Simpan & Keluarkan Kas
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Preview Bukti Foto */}
      <Dialog open={!!previewProofUrl} onOpenChange={() => setPreviewProofUrl(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bukti Pendukung Biaya Sosial</DialogTitle>
            <DialogDescription>
              Kuitansi atau foto pendukung penyaluran dana sosial.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 mt-2">
            {previewProofUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewProofUrl}
                alt="Bukti Pendukung"
                className="w-full max-h-96 object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
