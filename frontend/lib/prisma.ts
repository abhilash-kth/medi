// lib/prisma.ts   (or src/lib/prisma.ts)
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
