import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({
      success: true,
      message: "Sesi Anda berhasil diakhiri.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus sesi." },
      { status: 500 }
    );
  }
}
