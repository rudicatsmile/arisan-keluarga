import { NextResponse } from "next/server";
import { z } from "zod";
import { createSession } from "@/lib/session";
import { initialUsers } from "@/data/mock-data";
import { db, schema } from "@/db";
import { eq, desc } from "drizzle-orm";
import { verifyOtpHash, isOtpExpired } from "@/lib/auth";

const verifyOtpSchema = z.object({
  phone: z.string().min(9),
  otp: z.string().length(6, "Kode OTP harus tepat 6 digit"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = verifyOtpSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { phone, otp } = validation.data;
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    // 1. Temukan data pengguna
    let targetUser: any = null;
    if (db) {
      try {
        targetUser = await db.query.users.findFirst({
          where: eq(schema.users.phone, cleanPhone),
        });
      } catch (err) {
        console.warn("DB find user failed:", err);
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
        { success: false, message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    // Master developer/demo OTP bypass
    const isMasterOtp = otp === "123456";

    // 2. Verifikasi OTP dari database jika ada catatan
    let isValid = isMasterOtp;
    if (!isValid && db) {
      try {
        const latestOtp = await db.query.otpCodes.findFirst({
          where: eq(schema.otpCodes.phone, cleanPhone),
          orderBy: [desc(schema.otpCodes.createdAt)],
        });

        if (latestOtp) {
          if (isOtpExpired(latestOtp.expiresAt)) {
            return NextResponse.json(
              { success: false, message: "Kode OTP telah kadaluarsa. Silakan minta kode baru." },
              { status: 400 }
            );
          }

          if (latestOtp.attempts >= 3) {
            return NextResponse.json(
              {
                success: false,
                message: "Batas 3x percobaan telah habis. Silakan kirim ulang OTP baru.",
              },
              { status: 400 }
            );
          }

          isValid = await verifyOtpHash(otp, latestOtp.codeHash);

          if (!isValid) {
            await db
              .update(schema.otpCodes)
              .set({ attempts: latestOtp.attempts + 1 })
              .where(eq(schema.otpCodes.id, latestOtp.id));

            return NextResponse.json(
              {
                success: false,
                message: `Kode OTP salah. Sisa percobaan: ${2 - latestOtp.attempts} kali.`,
              },
              { status: 400 }
            );
          } else {
            // Tandai sudah dipakai
            await db
              .update(schema.otpCodes)
              .set({ usedAt: new Date() })
              .where(eq(schema.otpCodes.id, latestOtp.id));
          }
        }
      } catch (err) {
        console.warn("DB OTP verify fallback:", err);
      }
    }

    // Fallback prototype bila db belum terhubung
    if (!isValid && !db) {
      isValid = true;
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Kode OTP tidak valid atau salah." },
        { status: 400 }
      );
    }

    // 3. Buat sesi JWT aman dalam cookie HttpOnly
    await createSession({
      id: targetUser.id,
      phone: targetUser.phone,
      name: targetUser.name,
      role: targetUser.role,
      position: targetUser.position,
      photoUrl: targetUser.photoUrl,
    });

    const isBackOffice =
      targetUser.role === "SUPER_ADMIN" ||
      targetUser.role === "ADMINISTRATOR" ||
      targetUser.role === "REVIEWER";

    return NextResponse.json({
      success: true,
      message: `Selamat datang kembali, ${targetUser.name}!`,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        phone: targetUser.phone,
        role: targetUser.role,
        position: targetUser.position,
      },
      redirectUrl: isBackOffice ? "/admin/dashboard" : "/dashboard",
    });
  } catch (error: any) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memverifikasi OTP." },
      { status: 500 }
    );
  }
}
