import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Baca cookie sesi arisankeluarga
  const token = request.cookies.get("arisankeluarga_session")?.value;
  const sessionUser = token ? await verifyToken(token) : null;

  const isPublicRoute = pathname === "/" || pathname === "/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/anggota") ||
    pathname.startsWith("/keluarga-bahagia") ||
    pathname.startsWith("/lokasi-arisan") ||
    pathname.startsWith("/iuran-saya");

  // 1. Jika pengguna sudah login dan membuka halaman /login, arahkan ke dashboard
  if (sessionUser && pathname === "/login") {
    if (sessionUser.role === "SUPER_ADMIN" || sessionUser.role === "ADMINISTRATOR" || sessionUser.role === "REVIEWER") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Proteksi rute back office /admin/*
  if (isAdminRoute) {
    if (!sessionUser) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role Anggota dilarang mengakses back office
    if (sessionUser.role === "ANGGOTA") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. Proteksi rute aplikasi internal anggota
  if (isAppRoute && !sessionUser) {
    // Note: Selama pengetesan prototipe jika belum set cookie, diizinkan jika context client punya mock data
    // Namun jika di mode server auth murni, redirect ke login
    const isMockClient = request.headers.get("x-mock-client") === "true";
    if (!isMockClient && process.env.NODE_ENV === "production") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/anggota/:path*",
    "/keluarga-bahagia/:path*",
    "/lokasi-arisan/:path*",
    "/iuran-saya/:path*",
    "/admin/:path*",
    "/login",
  ],
};
