import "server-only";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Use your Supabase Postgres URI " +
        "(Project → Connect → Connection string → URI). " +
        "It must start with postgresql:// not https://"
    );
  }

  if (
    connectionString.startsWith("file:") ||
    connectionString.includes("sqlite")
  ) {
    throw new Error(
      "SQLite is not supported. Set DATABASE_URL to your Supabase postgresql:// connection string."
    );
  }

  if (connectionString.startsWith("http://") || connectionString.startsWith("https://")) {
    throw new Error(
      "DATABASE_URL looks like the Supabase API URL (https://….supabase.co). " +
        "Prisma needs the Database URI from Connect → Connection string → URI " +
        "(postgresql://postgres.…@….pooler.supabase.com:6543/postgres)."
    );
  }

  const isSupabase =
    connectionString.includes("supabase.co") ||
    connectionString.includes("pooler.supabase.com");

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      // Serverless / Supabase pooler: keep pool small
      max: 1,
      ssl:
        process.env.NODE_ENV === "production" ||
        connectionString.includes("sslmode=require") ||
        isSupabase
          ? { rejectUnauthorized: false }
          : undefined,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

/**
 * Prisma → Supabase PostgreSQL (via `pg` + connection pooler).
 * App data (leads, programs, etc.) uses this client.
 */
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;
