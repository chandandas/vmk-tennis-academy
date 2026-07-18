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
      "DATABASE_URL is not set. Use a PostgreSQL URL (e.g. Neon) for local and Vercel."
    );
  }

  if (
    connectionString.startsWith("file:") ||
    connectionString.includes("sqlite")
  ) {
    throw new Error(
      "SQLite is not supported on Vercel. Set DATABASE_URL to a PostgreSQL connection string."
    );
  }

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      // Neon / serverless-friendly
      max: 1,
      ssl:
        process.env.NODE_ENV === "production" ||
        connectionString.includes("sslmode=require") ||
        connectionString.includes("neon.tech")
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
 * Prisma client via PostgreSQL (`pg` driver).
 * Required for Vercel — SQLite cannot run in serverless.
 */
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export default db;
