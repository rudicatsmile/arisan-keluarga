import { NextResponse } from "next/server";
import { z } from "zod";
import { generateOtp, hashOtp } from "@/lib/auth";
import { sendOtpWhatsApp } from "@/lib/whatsapp";
import { checkOtpRateLimit } from "@/lib/rate-limiter";
import { initialUsers } from "@/data/mock-data";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

const requestOtpSchema = z.object({
  phone: z.string().min(9, "Nomor telepon minimal 9 digit").max(20),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = requestOtpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { phone } = validation.data;
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    // 1. Cek Rate-Limit (PRD Bab 8: jeda min 30 detik & max 5x dalam 10 menit)
    const rateLimit = checkOtpRateLimit(cleanPhone);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, message: rateLimit.message },
        { status: 429 }
      );
    }

    // 2. Cari pengguna di Database Neon jika terhubung, jika tidak cari di data awal
    let targetUser: any = null;

    if (db) {
      try {
        const found = await db.query.users.findFirst({
          where: eq(schema.users.phone, cleanPhone),
        });
        targetUser = found;
      } catch (err) {
        console.warn("Neon DB query failed, falling back to initial data:", err);
      }
    }

    if (!targetUser) {
      targetUser = initialUsers.find(
        (u) =>
          u.phone.replace(/[^0-9]/g, "").endsWith(cleanPhone.slice(-8)) ||
          u.phone.replace(/[^0-9]/g, "") === cleanPhone
      );
    }

    if (!targetUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nomor WhatsApp belum terdaftar. Silakan hubungi Administrator ArisanKeluarga.",
        },
        { status: 404 }
      );
    }

    if (targetUser.isActive === false) {
      return NextResponse.json(
        {
          success: false,
          message: "Akun Anda berstatus nonaktif. Silakan hubungi pengurus.",
        },
        { status: 403 }
      );
    }

    // 3. Generate 6 digit OTP & simpan hash
    const otpCode = generateOtp(6);
    const codeHash = await hashOtp(otpCode);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

    if (db) {
      try {
        await db.insert(schema.otpCodes).values({
          phone: cleanPhone,
          codeHash,
          expiresAt,
          attempts: 0,
        });
      } catch (err) {
        console.warn("Failed saving OTP to db:", err);
      }
    }

    // 4. Kirim OTP via WhatsApp Wablas
    const waResult = await sendOtpWhatsApp(targetUser.phone, otpCode, targetUser.name);

    let infoMessage = `Kode verifikasi OTP 6 digit berhasil dikirimkan ke nomor WhatsApp ${targetUser.name}.`;
    if (!waResult.status) {
      console.warn("[Wablas Gateway Notice]:", waResult.message);
      infoMessage = `Kode OTP digenerate (${otpCode}). Catatan Wablas: ${waResult.message}.`;
    }

    return NextResponse.json({
      success: true,
      message: infoMessage,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        phone: targetUser.phone,
        role: targetUser.role,
        position: targetUser.position,
      },
      waStatus: waResult.status,
      waMessage: waResult.message,
      simulationCode: otpCode,
    });
  } catch (error: any) {
    console.error("Request OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
