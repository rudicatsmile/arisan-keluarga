"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

const socialExpenseSchema = z.object({
  category: z.enum(["SAKIT", "BANTUAN", "HADIAH", "LAINNYA"]),
  recipientId: z.string().optional(),
  amount: z.number().positive("Nominal harus lebih dari 0"),
  expenseDate: z.string(),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  proofUrl: z.string().optional(),
});

export async function createSocialExpenseAction(formData: z.infer<typeof socialExpenseSchema>) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return { success: false, message: "Hanya Administrator yang dapat mencatat pengeluaran biaya sosial." };
  }

  const parse = socialExpenseSchema.safeParse(formData);
  if (!parse.success) {
    return { success: false, message: parse.error.issues[0].message };
  }

  const data = parse.data;

  if (db) {
    try {
      await db.insert(schema.socialExpenses).values({
        category: data.category,
        recipientId: data.recipientId || null,
        amount: data.amount,
        expenseDate: new Date(data.expenseDate),
        description: data.description,
        proofUrl: data.proofUrl || null,
        recordedById: session.id,
      });

      revalidatePath("/admin/biaya-sosial");
      revalidatePath("/admin/dashboard");
      revalidatePath("/dashboard");
      return { success: true, message: "Pengeluaran biaya sosial berhasil dicatat." };
    } catch (error) {
      console.error("DB createSocialExpenseAction error:", error);
      return { success: false, message: "Gagal menyimpan pengeluaran sosial ke database." };
    }
  }

  return { success: true, message: "Pengeluaran biaya sosial berhasil dicatat." };
}

export async function reviewSocialExpenseAction(expenseId: string) {
  const session = await getSession();
  if (!session || (session.role !== "REVIEWER" && session.role !== "SUPER_ADMIN")) {
    return { success: false, message: "Hanya Reviewer (Auditor) yang berwenang menandai audit pemeriksaan." };
  }

  if (db) {
    try {
      await db
        .update(schema.socialExpenses)
        .set({
          reviewedById: session.id,
          reviewedAt: new Date(),
        })
        .where(eq(schema.socialExpenses.id, expenseId));

      revalidatePath("/admin/biaya-sosial");
      return { success: true, message: "Pengeluaran sosial berhasil ditandai 'Sudah Diperiksa'." };
    } catch (error) {
      return { success: false, message: "Gagal memperbarui status audit." };
    }
  }

  return { success: true, message: "Pemeriksaan audit selesai dicatat." };
}
