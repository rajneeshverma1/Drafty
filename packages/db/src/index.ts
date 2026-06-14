
import "dotenv/config";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { Pool as PoolPg } from "pg";
import { Pool as PoolNeon } from "@neondatabase/serverless";
import * as schema from "./schema.js";

export * from "./schema.js";

let db: ReturnType<typeof drizzleNeon> | ReturnType<typeof drizzlePg>;

const useNeon = process.env.USE_NEON === "true";

if (useNeon) {
  // Neon serverless driver (for Neon/Vercel deployments)
  const sql = new PoolNeon({ connectionString: process.env.DATABASE_URL! });
  db = drizzleNeon(sql, { schema });
} else {
  // Standard PostgreSQL driver (for local dev, Render, Railway, etc.)
  const pool = new PoolPg({
    connectionString: process.env.DATABASE_URL!,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  });
  db = drizzlePg(pool, { schema });
}

export { db };
