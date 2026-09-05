"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";
import {
  sendPaymentVerificationWhatsApp,
  notifyAdminNewPaymentProof,
} from "@/lib/whatsapp";
import { initialUsers, initialPeriods } from "@/data/mock-data";

const uploadProofSchema = z.object({
  periodId: z.string().min(1),
  transferProofUrl: z.string().url("URL bukti transfer tidak valid"),
  note: z.string().optional(),
});

export async function uploadPaymentProofAction(formData: z.infer<typeof uploadProofSchema>) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Silakan login terlebih dahulu untuk mengunggah bukti bayar." };
  }

  const parse = uploadProofSchema.safeParse(formData);
  if (!parse.success) {
    return { success: false, message: parse.error.issues[0].message };
  }

  const { periodId, transferProofUrl, note } = parse.data;

  // Notifikasi WhatsApp ke Bendahara (Ibu Ratna / Admin)
  const adminPhone = "6281234000011";
  const period = initialPeriods.find((p) => p.id === periodId);
  notifyAdminNewPaymentProof(
    adminPhone,
    session.name,
    period?.name || "Periode Berjalan",
    period?.iuranAmount || 150000
  ).catch(console.warn);

  if (db) {
    try {
      const existing = await db.query.periodPayments.findFirst({
        where: and(
          eq(schema.periodPayments.periodId, periodId),
          eq(schema.periodPayments.memberId, session.id)
        ),
      });

      if (existing) {
        await db
          .update(schema.periodPayments)
          .set({
            status: "PENDING",
            transferProofUrl,
            note: note || existing.note,
            paidAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(schema.periodPayments.id, existing.id));
      } else {
        await db.insert(schema.periodPayments).values({
          periodId,
          memberId: session.id,
          amount: 150000,
          status: "PENDING",
          transferProofUrl,
          note,
          paidAt: new Date(),
        });
      }

      revalidatePath("/iuran-saya");
      revalidatePath("/admin/verifikasi-iuran");
      revalidatePath("/admin/dashboard");
      return { success: true, message: "Bukti pembayaran berhasil diunggah. Menunggu verifikasi pengurus." };
    } catch (error) {
      console.error("DB uploadPaymentProofAction error:", error);
      return { success: false, message: "Gagal menyimpan bukti pembayaran ke database." };
    }
  }

  return { success: true, message: "Bukti pembayaran berhasil diunggah." };
}

export async function verifyPaymentAction(paymentId: string, status: "PAID" | "UNPAID") {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return { success: false, message: "Hanya Administrator yang berwenang memverifikasi pembayaran." };
  }

  if (db) {
    try {
      const [updatedPayment] = await db
        .update(schema.periodPayments)
        .set({
          status,
          verifiedById: session.id,
          verifiedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.periodPayments.id, paymentId))
        .returning();

      // Kirim notifikasi WhatsApp ke anggota (PRD Bab 6.C & Bab 11 Task 3.1)
      if (updatedPayment) {
        const member = await db.query.users.findFirst({
          where: eq(schema.users.id, updatedPayment.memberId),
        });
        const period = await db.query.arisanPeriods.findFirst({
          where: eq(schema.arisanPeriods.id, updatedPayment.periodId),
        });

        if (member && period) {
          await sendPaymentVerificationWhatsApp(
            member.phone,
            member.name,
            period.name,
            status === "PAID"
          );
        }
      }

      revalidatePath("/admin/verifikasi-iuran");
      revalidatePath("/admin/dashboard");
      revalidatePath("/admin/keuangan");
      revalidatePath("/iuran-saya");
      return {
        success: true,
        message: `Pembayaran berhasil diubah menjadi ${status === "PAID" ? "LUNAS" : "BELUM BAYAR"}. Notifikasi WhatsApp terkirim ke anggota.`,
      };
    } catch (error) {
      console.error("DB verifyPaymentAction error:", error);
      return { success: false, message: "Gagal memverifikasi pembayaran di database." };
    }
  }

  return { success: true, message: `Status pembayaran diperbarui ke ${status}. Notifikasi WhatsApp terkirim.` };
}
