import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

/** Temporary diagnostics — remove after login works on Vercel. */
export async function GET() {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "";
  let dbOk = false;
  let userFound = false;
  let passwordOk = false;
  let dbError: string | null = null;

  try {
    const user = await db.user.findUnique({
      where: { email: "admin@vmkta.com" },
    });
    dbOk = true;
    userFound = !!user;
    if (user) {
      passwordOk = await bcrypt.compare(
        "ChangeMeImmediately1!",
        user.passwordHash
      );
    }
  } catch (e) {
    dbError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    hasAuthSecret: secret.length > 0,
    authSecretLen: secret.length,
    authTrustHost: process.env.AUTH_TRUST_HOST ?? null,
    authUrl: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? null,
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    databaseUrlStartsWith: process.env.DATABASE_URL?.slice(0, 15) ?? null,
    dbOk,
    userFound,
    passwordOk,
    dbError,
  });
}
