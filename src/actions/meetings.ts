"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

const meetingSchema = z.object({
  title: z.string().min(3, "Judul pertemuan minimal 3 karakter"),
  hostMemberId: z.string().min(1, "Tuan rumah wajib dipilih"),
  address: z.string().min(5, "Alamat lengkap wajib diisi"),
  latitude: z.number(),
  longitude: z.number(),
  scheduledAt: z.string(),
  notes: z.string().optional(),
});

export async function createMeetingAction(formData: z.infer<typeof meetingSchema>) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return { success: false, message: "Hanya Administrator yang berwenang menjadwalkan lokasi arisan." };
  }

  const parse = meetingSchema.safeParse(formData);
  if (!parse.success) {
    return { success: false, message: parse.error.issues[0].message };
  }

  const data = parse.data;

  if (db) {
    try {
      await db.insert(schema.arisanMeetings).values({
        title: data.title,
        hostMemberId: data.hostMemberId,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        scheduledAt: new Date(data.scheduledAt),
        status: "PLANNED",
        notes: data.notes || null,
        createdById: session.id,
      });

      revalidatePath("/lokasi-arisan");
      revalidatePath("/admin/lokasi");
      revalidatePath("/dashboard");
      return { success: true, message: "Jadwal dan lokasi pertemuan arisan berhasil diterbitkan." };
    } catch (error) {
      console.error("DB createMeetingAction error:", error);
      return { success: false, message: "Gagal menyimpan lokasi ke database." };
    }
  }

  return { success: true, message: "Jadwal dan lokasi pertemuan arisan berhasil dibuat." };
}

export async function updateMeetingStatusAction(
  meetingId: string,
  status: "PLANNED" | "DONE" | "CANCELLED"
) {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "ADMINISTRATOR")) {
    return { success: false, message: "Akses ditolak." };
  }

  if (db) {
    try {
      await db
        .update(schema.arisanMeetings)
        .set({ status })
        .where(eq(schema.arisanMeetings.id, meetingId));

      revalidatePath("/lokasi-arisan");
      revalidatePath("/admin/lokasi");
      return { success: true, message: `Status pertemuan diubah menjadi ${status}.` };
    } catch (error) {
      return { success: false, message: "Gagal memperbarui status lokasi." };
    }
  }

  return { success: true, message: `Status pertemuan diperbarui menjadi ${status}.` };
}
