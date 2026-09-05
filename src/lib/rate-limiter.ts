/**
 * Rate Limiter untuk Pengiriman OTP
 * Aturan PRD Bab 8:
 * - Minimal jeda 30 detik antar pengiriman
 * - Maksimal 5 kali pengiriman dalam rentang 10 menit per nomor telepon
 */

interface RateLimitRecord {
  lastSentAt: number;
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkOtpRateLimit(phone: string): {
  allowed: boolean;
  message?: string;
  waitSeconds?: number;
} {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const now = Date.now();
  const record = rateLimitMap.get(cleanPhone);

  if (!record) {
    rateLimitMap.set(cleanPhone, {
      lastSentAt: now,
      count: 1,
      resetAt: now + 10 * 60 * 1000, // 10 menit
    });
    return { allowed: true };
  }

  // 1. Reset counter jika sudah lewat 10 menit
  if (now > record.resetAt) {
    rateLimitMap.set(cleanPhone, {
      lastSentAt: now,
      count: 1,
      resetAt: now + 10 * 60 * 1000,
    });
    return { allowed: true };
  }

  // 2. Cek jeda minimal 30 detik
  const diffSeconds = Math.floor((now - record.lastSentAt) / 1000);
  if (diffSeconds < 30) {
    return {
      allowed: false,
      message: `Harap tunggu ${30 - diffSeconds} detik sebelum meminta OTP baru.`,
      waitSeconds: 30 - diffSeconds,
    };
  }

  // 3. Cek batas maksimal 5 kali dalam 10 menit
  if (record.count >= 5) {
    const minutesLeft = Math.ceil((record.resetAt - now) / 60000);
    return {
      allowed: false,
      message: `Batas pengiriman OTP harian tercapai (maksimal 5x). Harap tunggu ${minutesLeft} menit lagi.`,
    };
  }

  // Update record
  record.lastSentAt = now;
  record.count += 1;
  rateLimitMap.set(cleanPhone, record);

  return { allowed: true };
}
