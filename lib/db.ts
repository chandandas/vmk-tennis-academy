import "server-only";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

/** Normalize Supabase URLs for the `pg` driver on Vercel (avoid sslmode=verify-full failures). */
function buildPool(connectionString: string) {
  let cleaned = connectionString.trim();

  // Prefer explicit SSL via Pool options; URL sslmode can break on Vercel
  cleaned = cleaned
    .replace(/[?&]sslmode=[^&]*/gi, "")
    .replace(/[?&]uselibpqcompat=[^&]*/gi, "")
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");

  const isPooler =
    cleaned.includes("pooler.supabase.com") ||
    cleaned.includes("pgbouncer=true");

  // Transaction pooler (6543) needs pgbouncer flag for Prisma-style queries
  if (
    isPooler &&
    cleaned.includes(":6543") &&
    !cleaned.includes("pgbouncer=true")
  ) {
    cleaned += cleaned.includes("?") ? "&pgbouncer=true" : "?pgbouncer=true";
  }

  return new Pool({
    connectionString: cleaned,
    max: 1,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    ssl: { rejectUnauthorized: false },
  });
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set on this environment. " +
        "In Vercel → Settings → Environment Variables, add your Supabase " +
        "postgresql:// URI (Connect → Connection string → URI)."
    );
  }

  if (
    connectionString.startsWith("file:") ||
    connectionString.includes("sqlite")
  ) {
    throw new Error(
      "SQLite is not supported on Vercel. Use a Supabase postgresql:// DATABASE_URL."
    );
  }

  if (
    connectionString.startsWith("http://") ||
    connectionString.startsWith("https://")
  ) {
    throw new Error(
      "DATABASE_URL must be postgresql://… not https://….supabase.co " +
        "(that is the API URL, not the database)."
    );
  }

  const pool = globalForPrisma.pgPool ?? buildPool(connectionString);

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  return new PrismaClient({ adapter: new PrismaPg(pool) });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Prisma → Supabase PostgreSQL (lazy init so a bad env does not crash module import).
 */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export default db;
