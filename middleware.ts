import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { Role } from "@prisma/client";

const AUTH_COOKIE = "rr_token";

const protectedRoutes: { pattern: RegExp; roles?: Role[] }[] = [
  { pattern: /^\/dashboard\/candidate/, roles: [Role.CANDIDATE] },
  { pattern: /^\/dashboard\/employer/, roles: [Role.EMPLOYER] },
  { pattern: /^\/dashboard\/admin/, roles: [Role.ADMIN] },
  { pattern: /^\/jobs\/.+\/apply/, roles: [Role.CANDIDATE] },
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const payload = token ? verifyToken(token) : null;

  if (isAuthRoute && payload) {
    const dashboard =
      payload.role === Role.EMPLOYER
        ? "/dashboard/employer"
        : payload.role === Role.ADMIN
        ? "/dashboard/admin"
        : "/dashboard/candidate";

    return NextResponse.redirect(new URL(dashboard, req.url));
  }

  for (const route of protectedRoutes) {
    if (route.pattern.test(pathname)) {
      if (!payload) {
        const url = new URL("/login", req.url);
        url.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(url);
      }

      if (route.roles && !route.roles.includes(payload.role)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/jobs/:path*"],
};

