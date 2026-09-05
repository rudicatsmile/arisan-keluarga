"use server";

import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { sendWinnerAnnouncementWhatsApp } from "@/lib/whatsapp";

interface ConfirmWinnerInput {
  periodId: string;
  winnerMemberId: string;
  grossPrizeAmount: number;
  deductionsAmount: number;
  netPrizeAmount: number;
  sendWhatsApp?: boolean;
}

export async function confirmWinnerAction(input: ConfirmWinnerInput) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return {
      success: false,
      message: "Hanya Pengurus / Administrator yang memiliki wewenang menetapkan pemenang arisan.",
    };
  }

  const {
    periodId,
    winnerMemberId,
    grossPrizeAmount,
    deductionsAmount,
    netPrizeAmount,
    sendWhatsApp = true,
  } = input;

  if (db) {
    try {
      // 1. Ambil data periode
      const period = await db.query.arisanPeriods.findFirst({
        where: eq(schema.arisanPeriods.id, periodId),
      });

      if (!period) {
        return { success: false, message: "Periode arisan tidak ditemukan." };
      }

      // 2. Ambil data pemenang
      const winner = await db.query.users.findFirst({
        where: eq(schema.users.id, winnerMemberId),
      });

      if (!winner) {
        return { success: false, message: "Data anggota pemenang tidak ditemukan." };
      }

      const wonAt = new Date();

      // 3. Update data pemenang di periode arisan
      await db
        .update(schema.arisanPeriods)
        .set({
          winnerMemberId: winner.id,
          wonAt: wonAt,
          grossPrizeAmount: grossPrizeAmount,
          deductionsAmount: deductionsAmount,
          netPrizeAmount: netPrizeAmount,
        })
        .where(eq(schema.arisanPeriods.id, periodId));

      // 4. Jika ada potongan iuran tertunggak, otomatis lunas di period_payments
      if (deductionsAmount > 0) {
        const existingPayment = await db.query.periodPayments.findFirst({
          where: and(
            eq(schema.periodPayments.periodId, periodId),
            eq(schema.periodPayments.memberId, winner.id)
          ),
        });

        if (existingPayment && existingPayment.status !== "PAID") {
          await db
            .update(schema.periodPayments)
            .set({
              status: "PAID",
              paidAt: wonAt,
              verifiedById: session.id,
              verifiedAt: wonAt,
              note: (existingPayment.note ? existingPayment.note + " | " : "") +
                "Otomatis dilunaskan dari pemotongan uang tarikan pemenang arisan.",
              updatedAt: wonAt,
            })
            .where(eq(schema.periodPayments.id, existingPayment.id));
        }
      }

      // 5. Kirim broadcast WhatsApp resmi ke pemenang jika opsi aktif
      let waStatus = false;
      if (sendWhatsApp && winner.phone) {
        const waResult = await sendWinnerAnnouncementWhatsApp(
          winner.phone,
          winner.name,
          period.name,
          grossPrizeAmount,
          deductionsAmount,
          netPrizeAmount,
          period.cycleNumber || 1
        );
        waStatus = waResult.status;
      }

      revalidatePath("/kocokan");
      revalidatePath("/dashboard");
      revalidatePath("/admin/periode");
      revalidatePath("/iuran-saya");
      revalidatePath("/admin/verifikasi-iuran");

      return {
        success: true,
        message: `Pemenang arisan berhasil ditetapkan atas nama ${winner.name}!`,
        data: {
          periodId,
          winnerId: winner.id,
          winnerName: winner.name,
          grossPrizeAmount,
          deductionsAmount,
          netPrizeAmount,
          waSent: waStatus,
        },
      };
    } catch (error: any) {
      console.error("[confirmWinnerAction Error]", error);
      return { success: false, message: error?.message || "Gagal menyimpan data pemenang ke database." };
    }
  }

  // Fallback jika mode mock / client
  revalidatePath("/kocokan");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Pemenang arisan berhasil ditetapkan dan diproses (Mode Mock).",
    data: {
      periodId,
      winnerMemberId,
      grossPrizeAmount,
      deductionsAmount,
      netPrizeAmount,
      waSent: true,
    },
  };
}

export async function resetCycleAction(nextCycleNumber: number) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return {
      success: false,
      message: "Hanya Pengurus / Administrator yang dapat memperbarui putaran arisan.",
    };
  }

  revalidatePath("/kocokan");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: `Siklus putaran arisan berhasil diperbarui ke Putaran ke-${nextCycleNumber}!`,
  };
}
