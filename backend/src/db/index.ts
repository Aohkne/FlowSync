import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres123@localhost:5432/flowsync";

// Disable prefetch for better compatibility
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });

// Test
client`SELECT 1`
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });
