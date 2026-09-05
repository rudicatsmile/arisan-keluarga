import bcrypt from "bcryptjs";

/**
 * Membuat kode OTP 6 digit acak
 */
export function generateOtp(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

/**
 * Hash kode OTP sebelum disimpan di database (PRD Bab 8: no plaintext OTP)
 */
export async function hashOtp(code: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(code, salt);
}

/**
 * Verifikasi kecocokan kode OTP dengan hash tersimpan
 */
export async function verifyOtpHash(code: string, hash: string): Promise<boolean> {
  return bcrypt.compare(code, hash);
}

/**
 * Cek apakah OTP sudah kadaluarsa (maksimal 5 menit sesuai PRD Bab 6.A)
 */
export function isOtpExpired(expiresAt: Date | string): boolean {
  const expiry = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return new Date() > expiry;
}
