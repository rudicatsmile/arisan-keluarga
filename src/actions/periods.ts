"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

const periodSchema = z.object({
  name: z.string().min(3, "Nama periode minimal 3 karakter"),
  iuranAmount: z.number().positive("Nominal harus lebih dari 0"),
  startDate: z.string(),
  dueDate: z.string(),
  endDate: z.string(),
  description: z.string().optional(),
});

export async function createPeriodAction(formData: z.infer<typeof periodSchema>) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return { success: false, message: "Hanya Administrator yang dapat membuka periode arisan baru." };
  }

  const parse = periodSchema.safeParse(formData);
  if (!parse.success) {
    return { success: false, message: parse.error.issues[0].message };
  }

  const data = parse.data;

  if (db) {
    try {
      // 1. Buat periode baru
      const [newPeriod] = await db
        .insert(schema.arisanPeriods)
        .values({
          name: data.name,
          iuranAmount: data.iuranAmount,
          startDate: new Date(data.startDate),
          dueDate: new Date(data.dueDate),
          endDate: new Date(data.endDate),
          status: "OPEN",
          description: data.description || null,
          createdById: session.id,
        })
        .returning();

      // 2. Ambil seluruh user aktif
      const activeMembers = await db.query.users.findMany({
        where: eq(schema.users.isActive, true),
      });

      // 3. Generate tagihan UNPAID untuk seluruh anggota aktif (PRD Bab 6.C)
      if (activeMembers.length > 0) {
        const bills = activeMembers.map((m) => ({
          periodId: newPeriod.id,
          memberId: m.id,
          amount: data.iuranAmount,
          status: "UNPAID" as const,
        }));
        await db.insert(schema.periodPayments).values(bills);
      }

      revalidatePath("/admin/dashboard");
      revalidatePath("/admin/keuangan");
      revalidatePath("/iuran-saya");
      return { success: true, message: `Periode ${data.name} berhasil dibuka dan tagihan diterbitkan.` };
    } catch (error: any) {
      console.error("DB createPeriodAction error:", error);
      return { success: false, message: "Gagal membuat periode arisan di database." };
    }
  }

  return { success: true, message: `Periode ${data.name} berhasil dibuka.` };
}
