import { Elysia } from "elysia";
import { eq } from "drizzle-orm";

import type { SafeUser } from "../types";
import { verifyToken } from "../lib/auth";

import { db } from "../db";
import { users } from "../db/schema";

export const authMiddleware = new Elysia()
  .derive(async ({ headers, set }) => {
    const authHeader = headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      set.status = 401;
      throw new Error("Missing or invalid authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const payload = verifyToken(token);

    if (!payload) {
      set.status = 401;
      throw new Error("Invalid or expired token");
    }

    // Get user from database
    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.userId),
      columns: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      set.status = 401;
      throw new Error("User not found");
    }

    return { user: user as SafeUser };
  })
  .as("global");
