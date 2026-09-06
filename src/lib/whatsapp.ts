/**
 * Layanan Lengkap Integrasi WhatsApp Gateway Wablas
 * Mendukung pengiriman OTP, notifikasi pembayaran, dan broadcast kegiatan
 * Sesuai PRD Bab 6.A, Bab 6.C, Bab 8, & Bab 11 Task 3.1
 */

import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

interface SendMessageResponse {
  status: boolean;
  message: string;
  data?: any;
}

export async function getArisanNameFromDb(): Promise<string> {
  try {
    if (db) {
      const row = await db.query.appSettings.findFirst({
        where: eq(appSettings.key, "arisanName"),
      });
      if (row?.value) {
        try {
          return JSON.parse(row.value);
        } catch {
          return row.value;
        }
      }
    }
  } catch (err) {
    // fallback
  }
  return "Arisan Keluarga";
}

export async function sendWhatsAppMessage(
  phone: string,
  message: string
): Promise<SendMessageResponse> {
  const rawUrl = process.env.WABLAS_API_URL || "https://jkt.wablas.com";
  const apiUrl = rawUrl.replace(/\/+$/, "");
  const token = process.env.WABLAS_TOKEN;

  let formattedPhone = phone.replace(/[^0-9]/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }

  // Jika token Wablas masih default dev, gunakan mode simulasi aman
  if (!token || token === "isi-token-wablas-anda" || token === "dummy_wablas_token_dev") {
    console.log(
      `[Wablas WhatsApp SIMULATION] To: ${formattedPhone} | Message: ${message.slice(0, 80).replace(/\n/g, " ")}...`
    );
    return {
      status: true,
      message: "Pesan WhatsApp disimulasikan terkirim (Mode Dev).",
    };
  }

  try {
    const response = await fetch(`${apiUrl}/api/send-message`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: formattedPhone,
        message,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.warn(`[Wablas API Rejected HTTP ${response.status}]`, result);
      return {
        status: false,
        message: result?.message || `Wablas menolak pengiriman (HTTP ${response.status})`,
        data: result,
      };
    }

    return {
      status: true,
      message: result?.message || "Pesan WhatsApp berhasil terkirim.",
      data: result,
    };
  } catch (error: any) {
    console.error("[Wablas Connection Error]", error);
    return {
      status: false,
      message: error?.message || "Gagal terhubung ke gateway WhatsApp Wablas.",
    };
  }
}

/**
 * 1. Mengirim kode OTP 6 Digit melalui WhatsApp (PRD 6.A)
 */
export async function sendOtpWhatsApp(
  phone: string,
  otpCode: string,
  memberName: string
): Promise<SendMessageResponse> {
  const arisanName = await getArisanNameFromDb();
  const message = `Halo ${memberName},

Berikut adalah kode OTP verifikasi masuk aplikasi *ArisanKeluarga* Anda:

*${otpCode}*

Kode ini berlaku selama 5 menit. Jangan pernah membagikan kode rahasia ini kepada siapa pun, termasuk pengurus arisan.

Terima kasih,
_Pengurus ${arisanName}_`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * 2. Mengirim notifikasi ke Administrator saat anggota upload bukti bayar (PRD 6.C)
 */
export async function notifyAdminNewPaymentProof(
  adminPhone: string,
  memberName: string,
  periodName: string,
  amount: number
): Promise<SendMessageResponse> {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

  const message = `Halo Pengurus Arisan,

Terdapat bukti transfer pembayaran baru yang memerlukan verifikasi:
• Anggota: *${memberName}*
• Periode: *${periodName}*
• Nominal: *${formattedAmount}*

Silakan buka menu Verifikasi Iuran di aplikasi untuk memeriksa slip bukti:
${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/verifikasi-iuran

Terima kasih,
_Sistem Notifikasi Otomatis ArisanKeluarga_`;

  return sendWhatsAppMessage(adminPhone, message);
}

/**
 * 3. Mengirim notifikasi ke anggota setelah iuran diverifikasi (PRD 6.C)
 */
export async function sendPaymentVerificationWhatsApp(
  phone: string,
  memberName: string,
  periodName: string,
  isApproved: boolean
): Promise<SendMessageResponse> {
  const arisanName = await getArisanNameFromDb();
  const statusText = isApproved
    ? "telah *DIVERIFIKASI LUNAS* oleh Bendahara. Terima kasih atas partisipasi tepat waktu Anda!"
    : "memerlukan pengecekan ulang karena bukti transfer kurang jelas atau nominal tidak cocok. Mohon periksa dan unggah kembali bukti valid.";

  const message = `Halo ${memberName},

Pembayaran iuran arisan Anda untuk *${periodName}* ${statusText}

Rincian dapat Anda pantau di:
${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/iuran-saya

Salam hangat,
_Bendahara ${arisanName}_`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * 4. Broadcast notifikasi pembukaan periode baru ke seluruh anggota
 */
export async function broadcastNewPeriodNotification(
  phone: string,
  memberName: string,
  periodName: string,
  amount: number,
  dueDate: string
): Promise<SendMessageResponse> {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

  const message = `Halo ${memberName},

Periode arisan baru telah dibuka:
• Nama: *${periodName}*
• Besaran Iuran: *${formattedAmount}*
• Batas Pembayaran: *${dueDate}*

Silakan melakukan transfer ke rekening resmi bendahara (BCA: 8830-1928-4411 a.n Ratna Kusuma) dan unggah bukti transfer di:
${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/iuran-saya

Terima kasih,
_Pengurus ArisanKeluarga_`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * 5. Broadcast jadwal pertemuan arisan baru
 */
export async function broadcastMeetingNotification(
  phone: string,
  memberName: string,
  title: string,
  hostName: string,
  dateTime: string,
  address: string
): Promise<SendMessageResponse> {
  const arisanName = await getArisanNameFromDb();
  const message = `Halo ${memberName},

Jadwal pertemuan arisan keluarga telah ditetapkan:
• Acara: *${title}*
• Tuan Rumah: *${hostName}*
• Waktu: *${dateTime} WIB*
• Alamat: *${address}*

Petunjuk arah peta dan koordinat lokasi dapat dibuka di:
${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/lokasi-arisan

Sampai jumpa dalam kehangatan silaturahmi!
_Keluarga Besar ${arisanName}_`;

  return sendWhatsAppMessage(phone, message);
}

/**
 * 6. Broadcast pengumuman pemenang undian arisan resmi (Modul Kocokan Arisan)
 */
export async function sendWinnerAnnouncementWhatsApp(
  phone: string,
  winnerName: string,
  periodName: string,
  grossPrize: number,
  deductions: number,
  netPrize: number,
  cycleNumber: number = 1
): Promise<SendMessageResponse> {
  const arisanName = await getArisanNameFromDb();
  const formatRp = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  let deductionText = "";
  if (deductions > 0) {
    deductionText = `
• Potongan Iuran Tertunggak: -${formatRp(deductions)} (Otomatis dilunaskan)`;
  }

  const message = `🎉 *SELAMAT KEPADA PEMENANG ARISAN!* 🎉

Alhamdulillah, hasil kocokan undian resmi *${arisanName}* telah selesai dilaksanakan:

• Putaran / Siklus: *Putaran Ke-${cycleNumber}*
• Periode: *${periodName}*
• Pemenang Tarikan: *${winnerName}*
• Total Tarikan Kotor: *${formatRp(grossPrize)}*${deductionText}
• *Total Dana Bersih Diterima: ${formatRp(netPrize)}*

Pencairan dana tarikan akan diproses langsung oleh Bendahara (Ibu Ratna Kusuma).

Rincian hasil kocokan dan riwayat pemenang dapat dilihat di:
${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/kocokan

Selamat kepada *${winnerName}* dan barakallah untuk seluruh keluarga besar! 🎊✨

_Pengurus ${arisanName}_`;

  return sendWhatsAppMessage(phone, message);
}
