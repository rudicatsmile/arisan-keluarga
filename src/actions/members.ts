"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

const memberSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().min(9, "Nomor telepon minimal 9 digit"),
  role: z.enum(["SUPER_ADMIN", "ADMINISTRATOR", "REVIEWER", "ANGGOTA"]),
  position: z.enum(["PEMBINA", "KETUA", "SEKRETARIS", "BENDAHARA", "ANGGOTA"]),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  occupation: z.string().optional(),
  parentId: z.string().nullable().optional(),
  photoUrl: z.string().optional(),
});

export async function addMemberAction(formData: z.infer<typeof memberSchema>) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return { success: false, message: "Akses ditolak. Anda tidak memiliki izin mengelola anggota." };
  }

  const parse = memberSchema.safeParse(formData);
  if (!parse.success) {
    return { success: false, message: parse.error.issues[0].message };
  }

  const data = parse.data;
  const cleanPhone = data.phone.replace(/[^0-9]/g, "");

  if (db) {
    try {
      const [newMember] = await db
        .insert(schema.users)
        .values({
          name: data.name,
          phone: cleanPhone,
          role: data.role,
          position: data.position,
          gender: data.gender,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          address: data.address,
          occupation: data.occupation,
          parentId: data.parentId || null,
          photoUrl: data.photoUrl,
          isActive: true,
        })
        .returning();

      revalidatePath("/admin/anggota");
      revalidatePath("/anggota");
      return { success: true, message: `Anggota ${data.name} berhasil didaftarkan.`, data: newMember };
    } catch (error: any) {
      console.error("DB addMemberAction error:", error);
      return { success: false, message: "Gagal menyimpan ke database." };
    }
  }

  return { success: true, message: `Anggota ${data.name} berhasil ditambahkan.` };
}

export async function updateMemberAction(id: string, formData: Partial<z.infer<typeof memberSchema>>) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return { success: false, message: "Akses ditolak." };
  }

  if (db) {
    try {
      // Validasi nomor WhatsApp unik jika diubah
      if (formData.phone) {
        const existingPhone = await db.query.users.findFirst({
          where: eq(schema.users.phone, formData.phone),
        });
        if (existingPhone && existingPhone.id !== id) {
          return {
            success: false,
            message: `Nomor WhatsApp ${formData.phone} sudah digunakan oleh anggota lain (${existingPhone.name}).`,
          };
        }
      }

      await db
        .update(schema.users)
        .set({
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          position: formData.position,
          gender: formData.gender,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
          address: formData.address,
          occupation: formData.occupation,
          parentId: formData.parentId || null,
          photoUrl: formData.photoUrl,
        })
        .where(eq(schema.users.id, id));

      revalidatePath("/admin/anggota");
      revalidatePath("/anggota");
      return { success: true, message: "Data anggota berhasil diperbarui." };
    } catch (error: any) {
      console.error("DB updateMemberAction error:", error);
      if (error?.code === "23505") {
        return { success: false, message: "Nomor WhatsApp ini sudah digunakan oleh anggota lain." };
      }
      return { success: false, message: error?.message || "Gagal memperbarui data." };
    }
  }

  return { success: true, message: "Data anggota berhasil diperbarui." };
}

export async function toggleMemberActiveAction(id: string, currentStatus: boolean) {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    return { success: false, message: "Hanya Super Admin yang dapat menonaktifkan akun anggota." };
  }

  if (session.id === id) {
    return { success: false, message: "Tidak dapat menonaktifkan akun Anda sendiri." };
  }

  if (db) {
    try {
      await db
        .update(schema.users)
        .set({ isActive: !currentStatus })
        .where(eq(schema.users.id, id));

      revalidatePath("/admin/anggota");
      return { success: true, message: `Akun berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}.` };
    } catch (error) {
      return { success: false, message: "Gagal mengubah status aktif." };
    }
  }

  return { success: true, message: "Status akun diperbarui." };
}
