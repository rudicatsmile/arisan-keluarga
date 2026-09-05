import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Role, Position } from "@/data/mock-data";

export interface SessionUser {
  id: string;
  phone: string;
  name: string;
  role: Role;
  position: Position;
  photoUrl?: string;
}

const COOKIE_NAME = "arisankeluarga_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "arisankeluarga_super_secret_jwt_key_2026_bani_sutrisno"
);

/**
 * Membuat token JWT sesi dan menyimpannya di cookie HttpOnly
 */
export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

  const token = await new SignJWT({
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
    position: user.position,
    photoUrl: user.photoUrl,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return token;
}

/**
 * Membaca dan memverifikasi data sesi pengguna aktif dari cookie
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });

    return {
      id: payload.id as string,
      phone: payload.phone as string,
      name: payload.name as string,
      role: payload.role as Role,
      position: payload.position as Position,
      photoUrl: payload.photoUrl as string | undefined,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Menghapus cookie sesi saat logout
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Verifikasi token string langsung (digunakan oleh Edge Middleware)
 */
export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });

    return {
      id: payload.id as string,
      phone: payload.phone as string,
      name: payload.name as string,
      role: payload.role as Role,
      position: payload.position as Position,
      photoUrl: payload.photoUrl as string | undefined,
    };
  } catch {
    return null;
  }
}
