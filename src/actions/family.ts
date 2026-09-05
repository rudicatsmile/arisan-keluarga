"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

const familySchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2, "Nama anggota keluarga minimal 2 karakter"),
  relationship: z.enum(["SUAMI", "ISTRI", "ANAK", "BAPAK", "IBU", "SAUDARA", "LAINNYA"]),
  photoUrl: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  notes: z.string().optional(),
});

export async function createFamilyMemberAction(formData: z.infer<typeof familySchema>) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Silakan login terlebih dahulu." };
  }

  // Aturan PRD Bab 6.F: Anggota hanya dapat menambah data miliknya sendiri.
  // Super Admin & Admin dapat mengelola seluruh keluarga.
  const isPrivileged = session.role === "SUPER_ADMIN" || session.role === "ADMINISTRATOR";
  if (!isPrivileged && session.id !== formData.userId) {
    return { success: false, message: "Anda hanya dapat mengelola data keluarga Anda sendiri." };
  }

  const parse = familySchema.safeParse(formData);
  if (!parse.success) {
    return { success: false, message: parse.error.issues[0].message };
  }

  const data = parse.data;

  if (db) {
    try {
      await db.insert(schema.familyMembers).values({
        userId: data.userId,
        name: data.name,
        relationship: data.relationship,
        photoUrl: data.photoUrl || null,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        gender: data.gender || null,
        notes: data.notes || null,
      });

      revalidatePath("/keluarga-bahagia");
      revalidatePath(`/anggota/${data.userId}`);
      return { success: true, message: `Data keluarga ${data.name} berhasil ditambahkan.` };
    } catch (error) {
      console.error("DB createFamilyMemberAction error:", error);
      return { success: false, message: "Gagal menyimpan data keluarga ke database." };
    }
  }

  return { success: true, message: `Data keluarga ${data.name} berhasil ditambahkan.` };
}

export async function updateFamilyMemberAction(
  famId: string,
  formData: Partial<z.infer<typeof familySchema>>
) {
  const session = await getSession();
  if (!session) return { success: false, message: "Silakan login." };

  if (db) {
    try {
      await db
        .update(schema.familyMembers)
        .set({
          name: formData.name,
          relationship: formData.relationship,
          gender: formData.gender,
          notes: formData.notes,
        })
        .where(eq(schema.familyMembers.id, famId));

      revalidatePath("/keluarga-bahagia");
      return { success: true, message: "Data keluarga berhasil diperbarui." };
    } catch (error) {
      return { success: false, message: "Gagal memperbarui data keluarga." };
    }
  }

  return { success: true, message: "Data keluarga berhasil diperbarui." };
}

export async function deleteFamilyMemberAction(famId: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "Silakan login." };

  if (db) {
    try {
      await db.delete(schema.familyMembers).where(eq(schema.familyMembers.id, famId));
      revalidatePath("/keluarga-bahagia");
      return { success: true, message: "Data keluarga berhasil dihapus." };
    } catch (error) {
      return { success: false, message: "Gagal menghapus data keluarga." };
    }
  }

  return { success: true, message: "Data keluarga berhasil dihapus." };
}
