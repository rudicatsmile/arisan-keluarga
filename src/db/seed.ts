import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "./schema";
import {
  initialUsers,
  initialPeriods,
  initialPayments,
  initialSocialExpenses,
  initialMeetings,
  initialFamilyMembers,
  initialSettings,
} from "../data/mock-data";

async function runSeed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes("dummy") || dbUrl.trim() === "") {
    console.error("❌ DATABASE_URL belum diatur di .env.local!");
    console.error("Silakan isi DATABASE_URL dengan connection string Neon PostgreSQL Anda terlebih dahulu.");
    process.exit(1);
  }

  console.log("🌱 Memulai proses seeding data ArisanKeluarga ke Neon PostgreSQL...");
  const sql = neon(dbUrl);
  const db = drizzle(sql, { schema });

  try {
    // ==========================================
    // 1. Seed App Settings
    // ==========================================
    console.log("1. Menyimpan pengaturan aplikasi (app_settings)...");
    for (const [key, value] of Object.entries(initialSettings)) {
      await db
        .insert(schema.appSettings)
        .values({
          key,
          value: typeof value === "object" ? JSON.stringify(value) : String(value),
        })
        .onConflictDoUpdate({
          target: schema.appSettings.key,
          set: { value: String(value), updatedAt: new Date() },
        });
    }

    // ==========================================
    // 2. Seed Users (Anggota Arisan)
    // ==========================================
    console.log("2. Menyimpan anggota keluarga (users)...");
    const userMap = new Map<string, string>(); // mockId -> realDbId

    for (const user of initialUsers) {
      // Periksa apakah user sudah ada berdasarkan nomor telepon
      const existing = await db.query.users.findFirst({
        where: eq(schema.users.phone, user.phone),
      });

      if (existing) {
        userMap.set(user.id, existing.id);
        console.log(`   - User [${user.name}] sudah ada, ID: ${existing.id}`);
      } else {
        const [inserted] = await db
          .insert(schema.users)
          .values({
            phone: user.phone,
            name: user.name,
            role: user.role,
            position: user.position,
            photoUrl: user.photoUrl,
            gender: user.gender,
            birthDate: user.birthDate ? new Date(user.birthDate) : null,
            address: user.address,
            occupation: user.occupation,
            isActive: user.isActive,
            joinedAt: new Date(user.joinedAt),
          })
          .returning();

        userMap.set(user.id, inserted.id);
        console.log(`   + User baru ditambahkan: [${user.name}], ID: ${inserted.id}`);
      }
    }

    // Update parent_id relasi pohon keluarga (pass 2)
    for (const user of initialUsers) {
      if (user.parentId && userMap.has(user.parentId)) {
        const currentDbId = userMap.get(user.id);
        const parentDbId = userMap.get(user.parentId);
        if (currentDbId && parentDbId) {
          await db
            .update(schema.users)
            .set({ parentId: parentDbId })
            .where(eq(schema.users.id, currentDbId));
        }
      }
    }

    // ==========================================
    // 3. Seed Periode Arisan (arisan_periods)
    // ==========================================
    console.log("3. Menyimpan periode arisan (arisan_periods)...");
    const periodMap = new Map<string, string>(); // mockPeriodId -> realDbPeriodId
    const ketuaId = userMap.get("usr-01") || Array.from(userMap.values())[0];

    for (const p of initialPeriods) {
      const existing = await db.query.arisanPeriods.findFirst({
        where: eq(schema.arisanPeriods.name, p.name),
      });

      const winnerDbId = p.winnerMemberId ? userMap.get(p.winnerMemberId) || null : null;

      if (existing) {
        periodMap.set(p.id, existing.id);
        console.log(`   - Periode [${p.name}] sudah ada, ID: ${existing.id}`);
      } else {
        const [inserted] = await db
          .insert(schema.arisanPeriods)
          .values({
            name: p.name,
            iuranAmount: p.iuranAmount,
            startDate: new Date(p.startDate),
            dueDate: new Date(p.dueDate),
            endDate: new Date(p.endDate),
            status: p.status,
            description: p.description,
            winnerMemberId: winnerDbId,
            wonAt: p.wonAt ? new Date(p.wonAt) : null,
            grossPrizeAmount: p.grossPrizeAmount || null,
            deductionsAmount: p.deductionsAmount || 0,
            netPrizeAmount: p.netPrizeAmount || null,
            cycleNumber: p.cycleNumber || 1,
            createdById: ketuaId,
          })
          .returning();

        periodMap.set(p.id, inserted.id);
        console.log(`   + Periode baru dibuat: [${p.name}], ID: ${inserted.id}`);
      }
    }

    // ==========================================
    // 4. Seed Pembayaran Iuran (period_payments)
    // ==========================================
    console.log("4. Menyimpan tagihan & pembayaran iuran (period_payments)...");
    const bendaharaId = userMap.get("usr-02") || ketuaId;

    for (const pay of initialPayments) {
      const periodDbId = periodMap.get(pay.periodId);
      const memberDbId = userMap.get(pay.memberId);

      if (periodDbId && memberDbId) {
        const existing = await db.query.periodPayments.findFirst({
          where: eq(schema.periodPayments.periodId, periodDbId),
        });

        // Insert jika belum ada
        await db
          .insert(schema.periodPayments)
          .values({
            periodId: periodDbId,
            memberId: memberDbId,
            amount: pay.amount,
            status: pay.status,
            transferProofUrl: pay.transferProofUrl || null,
            note: pay.note || null,
            paidAt: pay.paidAt ? new Date(pay.paidAt) : null,
            verifiedById: pay.verifiedById ? userMap.get(pay.verifiedById) || bendaharaId : null,
            verifiedAt: pay.verifiedAt ? new Date(pay.verifiedAt) : null,
          })
          .onConflictDoNothing();
      }
    }

    // ==========================================
    // 5. Seed Biaya Sosial (social_expenses)
    // ==========================================
    console.log("5. Menyimpan penyaluran dana sosial (social_expenses)...");
    const pembinaId = userMap.get("usr-04") || null;

    for (const exp of initialSocialExpenses) {
      const recipientDbId = exp.recipientId ? userMap.get(exp.recipientId) || null : null;
      const recordedDbId = bendaharaId;
      const reviewedDbId = exp.isReviewed ? pembinaId : null;

      await db
        .insert(schema.socialExpenses)
        .values({
          category: exp.category,
          recipientId: recipientDbId,
          amount: exp.amount,
          expenseDate: new Date(exp.expenseDate),
          description: exp.description,
          proofUrl: exp.proofUrl || null,
          recordedById: recordedDbId,
          reviewedById: reviewedDbId,
          reviewedAt: exp.reviewedAt ? new Date(exp.reviewedAt) : null,
        })
        .onConflictDoNothing();
    }

    // ==========================================
    // 6. Seed Jadwal Pertemuan (arisan_meetings)
    // ==========================================
    console.log("6. Menyimpan jadwal & lokasi pertemuan (arisan_meetings)...");
    for (const meet of initialMeetings) {
      const hostDbId = userMap.get(meet.hostMemberId) || ketuaId;

      await db
        .insert(schema.arisanMeetings)
        .values({
          title: meet.title,
          hostMemberId: hostDbId,
          address: meet.address,
          latitude: meet.latitude,
          longitude: meet.longitude,
          scheduledAt: new Date(meet.scheduledAt),
          status: meet.status,
          notes: meet.notes || null,
          createdById: ketuaId,
        })
        .onConflictDoNothing();
    }

    // ==========================================
    // 7. Seed Anggota Keluarga Bahagia (family_members)
    // ==========================================
    console.log("7. Menyimpan keluarga bahagia (family_members)...");
    for (const fam of initialFamilyMembers) {
      const userDbId = userMap.get(fam.userId);

      if (userDbId) {
        await db
          .insert(schema.familyMembers)
          .values({
            userId: userDbId,
            name: fam.name,
            relationship: fam.relationship,
            photoUrl: fam.photoUrl || null,
            birthDate: fam.birthDate ? new Date(fam.birthDate) : null,
            gender: fam.gender || null,
            notes: fam.notes || null,
          })
          .onConflictDoNothing();
      }
    }

    console.log("✨ SEMUA DATA ARISAN KELUARGA BERHASIL DI-SEED KE NEON POSTGRESQL! ✨");
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat seeding database:", error);
    process.exit(1);
  }
}

runSeed();
