import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres123@localhost:5432/flowsync";

// Create postgres client
const client = postgres(connectionString, { prepare: false });

// Create drizzle instance
export const db = drizzle(client, { schema });

// Test connection
export const testDatabaseConnection = async (): Promise<void> => {
  try {
    await client`SELECT 1`;
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};
