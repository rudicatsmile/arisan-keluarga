/**
 * Layanan Upload Berkas ke Bunny Storage & Bunny CDN
 * Sesuai PRD Bab 8, Bab 10, & Bab 11 Task 3.2
 */

export interface UploadResult {
  success: boolean;
  url?: string;
  message?: string;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Megabytes

export async function uploadToBunny(
  fileBuffer: Buffer | ArrayBuffer,
  fileName: string,
  mimeType: string,
  folder: "proofs" | "avatars" | "expenses" = "proofs"
): Promise<UploadResult> {
  // 1. Validasi Tipe Berkas
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return {
      success: false,
      message: "Format berkas tidak didukung. Harap gunakan gambar .jpg, .png, atau .webp.",
    };
  }

  // 2. Validasi Ukuran Berkas
  const size = fileBuffer.byteLength;
  if (size > MAX_FILE_SIZE) {
    return {
      success: false,
      message: "Ukuran berkas melebihi batas maksimal 2MB.",
    };
  }

  const storageHost = process.env.BUNNY_STORAGE_HOSTNAME;
  const storagePassword = process.env.BUNNY_STORAGE_PASSWORD;
  const storageZone = process.env.BUNNY_STORAGE_ZONE_NAME;
  const cdnHost = process.env.BUNNY_CDN_HOSTNAME || "https://arisan-keluarga.b-cdn.net";

  // Generate nama file unik dengan timestamp
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueFileName = `${folder}/${Date.now()}-${sanitizedName}`;

  // Mode Simulasi jika credential Bunny belum diset
  if (
    !storagePassword ||
    storagePassword === "isi-password-storage" ||
    !storageHost ||
    !storageZone
  ) {
    console.log(`[Bunny CDN Simulation] Uploaded: ${uniqueFileName} (${size} bytes)`);
    return {
      success: true,
      url: `https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80#${uniqueFileName}`,
      message: "Berkas berhasil diunggah (Mode Simulasi CDN).",
    };
  }

  try {
    const uploadUrl = `https://${storageHost}/${storageZone}/${uniqueFileName}`;
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: storagePassword,
        "Content-Type": "application/octet-stream",
      },
      body: new Uint8Array(fileBuffer),
    });

    if (response.ok) {
      const publicUrl = `${cdnHost.replace(/\/$/, "")}/${uniqueFileName}`;
      return {
        success: true,
        url: publicUrl,
        message: "Berkas berhasil diunggah ke Bunny CDN.",
      };
    } else {
      const errText = await response.text();
      console.error("[Bunny Upload Error]", errText);
      return {
        success: false,
        message: "Gagal mengunggah berkas ke server storage Bunny CDN.",
      };
    }
  } catch (error) {
    console.error("[Bunny Connection Error]", error);
    return {
      success: false,
      message: "Koneksi ke Bunny CDN gagal.",
    };
  }
}
