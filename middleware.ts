import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight middleware stub.
 * Milestone 4: replace with auth() from NextAuth for /admin protection.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page through; full auth gate comes later
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Placeholder: no redirect until credentials auth is live
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
