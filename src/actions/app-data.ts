"use server";

import { db, schema } from "@/db";
import { desc } from "drizzle-orm";
import {
  User,
  ArisanPeriod,
  PeriodPayment,
  SocialExpense,
  ArisanMeeting,
  FamilyMember,
  AppSettings,
  initialSettings,
} from "@/data/mock-data";

export interface AppDataResponse {
  success: boolean;
  isDbConnected: boolean;
  data: {
    users: User[];
    periods: ArisanPeriod[];
    payments: PeriodPayment[];
    socialExpenses: SocialExpense[];
    meetings: ArisanMeeting[];
    familyMembers: FamilyMember[];
    settings: AppSettings;
  } | null;
  message?: string;
}

export async function fetchLiveAppDataAction(): Promise<AppDataResponse> {
  if (!db) {
    return {
      success: false,
      isDbConnected: false,
      data: null,
      message: "Database Neon PostgreSQL belum terhubung.",
    };
  }

  try {
    // 1. Ambil seluruh Users langsung dari Neon DB
    const dbUsers = await db.query.users.findMany({
      orderBy: [desc(schema.users.createdAt)],
    });

    if (dbUsers.length === 0) {
      return {
        success: false,
        isDbConnected: true,
        data: null,
        message: "Database Neon terhubung namun belum memiliki data.",
      };
    }

    const users: User[] = dbUsers.map((u) => ({
      id: u.id,
      phone: u.phone,
      name: u.name,
      role: u.role,
      position: u.position,
      photoUrl:
        u.photoUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      gender: (u.gender === "Perempuan" ? "Perempuan" : "Laki-laki") as "Laki-laki" | "Perempuan",
      birthDate: u.birthDate ? u.birthDate.toISOString().split("T")[0] : "1985-01-01",
      address: u.address || "",
      occupation: u.occupation || "",
      parentId: u.parentId,
      isActive: u.isActive,
      joinedAt: u.joinedAt ? u.joinedAt.toISOString() : new Date().toISOString(),
    }));

    const userMap = new Map(users.map((u) => [u.id, u.name]));

    // 2. Ambil seluruh Periode Arisan
    const dbPeriods = await db.query.arisanPeriods.findMany({
      orderBy: [desc(schema.arisanPeriods.startDate)],
    });

    const periods: ArisanPeriod[] = dbPeriods.map((p) => ({
      id: p.id,
      name: p.name,
      iuranAmount: p.iuranAmount,
      startDate: p.startDate ? p.startDate.toISOString().split("T")[0] : "",
      dueDate: p.dueDate ? p.dueDate.toISOString().split("T")[0] : "",
      endDate: p.endDate ? p.endDate.toISOString().split("T")[0] : "",
      status: p.status,
      description: p.description || "",
      winnerMemberId: p.winnerMemberId || undefined,
      wonAt: p.wonAt ? p.wonAt.toISOString() : undefined,
      grossPrizeAmount: p.grossPrizeAmount || undefined,
      deductionsAmount: p.deductionsAmount || 0,
      netPrizeAmount: p.netPrizeAmount || undefined,
      cycleNumber: p.cycleNumber || 1,
    }));

    // 3. Ambil seluruh Pembayaran Iuran
    const dbPayments = await db.query.periodPayments.findMany({
      orderBy: [desc(schema.periodPayments.createdAt)],
    });

    const payments: PeriodPayment[] = dbPayments.map((p) => ({
      id: p.id,
      periodId: p.periodId,
      memberId: p.memberId,
      amount: p.amount,
      status: p.status,
      transferProofUrl: p.transferProofUrl || undefined,
      note: p.note || undefined,
      paidAt: p.paidAt ? p.paidAt.toISOString() : undefined,
      verifiedById: p.verifiedById || undefined,
      verifiedAt: p.verifiedAt ? p.verifiedAt.toISOString() : undefined,
      createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
    }));

    // 4. Ambil seluruh Biaya Sosial
    const dbExpenses = await db.query.socialExpenses.findMany({
      orderBy: [desc(schema.socialExpenses.expenseDate)],
    });

    const socialExpenses: SocialExpense[] = dbExpenses.map((e) => ({
      id: e.id,
      category: e.category,
      recipientId: e.recipientId || "",
      recipientName: e.recipientId ? userMap.get(e.recipientId) || "Anggota Keluarga" : "Anggota Keluarga",
      amount: e.amount,
      expenseDate: e.expenseDate ? e.expenseDate.toISOString().split("T")[0] : "",
      description: e.description,
      proofUrl: e.proofUrl || undefined,
      recordedByName: e.recordedById ? userMap.get(e.recordedById) || "Bendahara" : "Bendahara",
      isReviewed: !!e.reviewedById,
      reviewedByName: e.reviewedById ? userMap.get(e.reviewedById) || "Pembina" : undefined,
      reviewedAt: e.reviewedAt ? e.reviewedAt.toISOString() : undefined,
    }));

    // 5. Ambil seluruh Pertemuan & Lokasi
    const dbMeetings = await db.query.arisanMeetings.findMany({
      orderBy: [desc(schema.arisanMeetings.scheduledAt)],
    });

    const meetings: ArisanMeeting[] = dbMeetings.map((m) => ({
      id: m.id,
      title: m.title,
      hostMemberId: m.hostMemberId,
      hostMemberName: userMap.get(m.hostMemberId) || "Tuan Rumah",
      address: m.address,
      latitude: m.latitude,
      longitude: m.longitude,
      scheduledAt: m.scheduledAt ? m.scheduledAt.toISOString() : new Date().toISOString(),
      status: m.status,
      notes: m.notes || "",
    }));

    // 6. Ambil seluruh Keluarga Bahagia
    const dbFamily = await db.query.familyMembers.findMany({
      orderBy: [desc(schema.familyMembers.createdAt)],
    });

    const familyMembers: FamilyMember[] = dbFamily.map((f) => ({
      id: f.id,
      userId: f.userId,
      name: f.name,
      relationship: f.relationship,
      photoUrl: f.photoUrl || undefined,
      birthDate: f.birthDate ? f.birthDate.toISOString().split("T")[0] : undefined,
      gender:
        f.gender === "Perempuan"
          ? "Perempuan"
          : f.gender === "Laki-laki"
          ? "Laki-laki"
          : undefined,
      notes: f.notes || undefined,
    }));

    // 7. Ambil Pengaturan Aplikasi
    const dbSettings = await db.query.appSettings.findMany();
    const settingsObj: any = { ...initialSettings };
    for (const s of dbSettings) {
      try {
        settingsObj[s.key] = JSON.parse(s.value);
      } catch {
        settingsObj[s.key] = s.value;
      }
    }

    return {
      success: true,
      isDbConnected: true,
      data: {
        users,
        periods,
        payments,
        socialExpenses,
        meetings,
        familyMembers,
        settings: settingsObj as AppSettings,
      },
      message: "Data berhasil disinkronkan langsung dari Neon PostgreSQL.",
    };
  } catch (error: any) {
    console.error("[fetchLiveAppDataAction Error]", error);
    return {
      success: false,
      isDbConnected: true,
      data: null,
      message: error?.message || "Gagal mengambil data dari database Neon.",
    };
  }
}
