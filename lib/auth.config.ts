import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

/**
 * Auth.js / NextAuth config (credentials + roles).
 * Full credentials verify against Prisma is wired in milestone 4.
 * This stub establishes the shape so middleware and types compile.
 */

export const userRoles = ["ADMIN", "COACH", "FRONT_DESK"] as const;
export type UserRole = (typeof userRoles)[number];

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Milestone 4: look up User + bcrypt.compare
        // Returning null keeps login closed until auth is fully wired.
        void parsed.data;
        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLogin = request.nextUrl.pathname === "/admin/login";

      if (isLogin) return true;
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
