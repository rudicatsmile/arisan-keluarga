import { NextResponse } from "next/server";
import { uploadToBunny } from "@/lib/upload";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as any) || "proofs";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Tidak ada berkas yang diunggah." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await uploadToBunny(arrayBuffer, file.name, file.type, folder);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      message: result.message,
    });
  } catch (error) {
    console.error("API Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server saat mengunggah berkas." },
      { status: 500 }
    );
  }
}
