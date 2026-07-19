import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config (used by middleware).
 * Credentials + Prisma live in `lib/auth.ts`.
 */

export const userRoles = ["ADMIN", "COACH", "FRONT_DESK"] as const;
export type UserRole = (typeof userRoles)[number];

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isLogin = request.nextUrl.pathname === "/admin/login";
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

      if (isLogin) {
        if (isLoggedIn) return Response.redirect(new URL("/admin", request.nextUrl));
        return true;
      }
      if (isAdminRoute) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: UserRole }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
