"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { getSession } from "@/lib/session";
import { AppSettings } from "@/data/mock-data";

const settingsSchema = z.object({
  arisanName: z.string().min(3),
  bankName: z.string().min(2),
  accountNumber: z.string().min(5),
  accountHolder: z.string().min(3),
  whatsappContact: z.string().min(9),
  monthlyAmount: z.number().positive(),
  arisanDescription: z.string().optional(),
});

export async function updateSettingsAction(formData: Partial<AppSettings>) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return { success: false, message: "Hanya Pengurus Inti yang dapat mengubah pengaturan sistem." };
  }

  if (db) {
    try {
      for (const [key, val] of Object.entries(formData)) {
        if (val !== undefined) {
          await db
            .insert(schema.appSettings)
            .values({
              key,
              value: typeof val === "object" ? JSON.stringify(val) : String(val),
              updatedAt: new Date(),
            })
            .onConflictDoUpdate({
              target: schema.appSettings.key,
              set: {
                value: typeof val === "object" ? JSON.stringify(val) : String(val),
                updatedAt: new Date(),
              },
            });
        }
      }

      revalidatePath("/admin/pengaturan");
      revalidatePath("/iuran-saya");
      revalidatePath("/");
      return { success: true, message: "Pengaturan sistem dan rekening berhasil disimpan." };
    } catch (error) {
      console.error("DB updateSettingsAction error:", error);
      return { success: false, message: "Gagal memperbarui pengaturan ke database." };
    }
  }

  return { success: true, message: "Pengaturan sistem dan rekening berhasil diperbarui." };
}
