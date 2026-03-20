// lib/prisma.ts   (or src/lib/prisma.ts)
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

function getDatabaseUrl() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return undefined;
  }

  try {
    const url = new URL(connectionString);
    const sslMode = url.searchParams.get("sslmode");

    if (!sslMode) {
      return connectionString;
    }

    if (process.env.DATABASE_CA_CERT) {
      url.searchParams.set("sslmode", "verify-full");
      return url.toString();
    }

    if (sslMode === "require") {
      url.searchParams.set("sslmode", "no-verify");
      return url.toString();
    }

    return url.toString();
  } catch {
    return connectionString;
  }
}

const databaseUrl = getDatabaseUrl();

function getPoolSslConfig(connectionString?: string) {
  if (!connectionString) {
    return undefined;
  }

  let sslMode: string | null = null;

  try {
    sslMode = new URL(connectionString).searchParams.get("sslmode");
  } catch {
    sslMode = null;
  }

  if (!sslMode) {
    return undefined;
  }

  if (process.env.DATABASE_CA_CERT) {
    return {
      ca: process.env.DATABASE_CA_CERT.replace(/\\n/g, "\n"),
      rejectUnauthorized: true,
    };
  }

  return {
    // Keep this aligned with the normalized connection string.
    rejectUnauthorized: false,
  };
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: getPoolSslConfig(databaseUrl),
  // Optional: tune these if you have many requests or serverless environment
  // max: 10,           // max connections in pool
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
});

const adapter = new PrismaPg(pool);

// Use a different global key to avoid conflicts with non-adapter setups
const globalForPrisma = globalThis as unknown as {
  prismaWithPgAdapter: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prismaWithPgAdapter || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaWithPgAdapter = prisma;
}
