import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";
import { extractSafeUser } from "../utils/helpers";
import type { AuthResponse, SafeUser } from "../types";

interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const { email, password, fullName } = data;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        fullName: fullName || null,
      })
      .returning();

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    // Generate token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    const safeUser: SafeUser = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      avatarUrl: newUser.avatarUrl,
      createdAt: newUser.createdAt,
    };

    return {
      message: "User registered successfully",
      user: safeUser,
      token,
    };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    if (!safeUser) {
      throw new Error("Failed to create user session");
    }

    return {
      message: "Login successful",
      user: safeUser,
      token,
    };
  }

  async getProfile(userId: string): Promise<SafeUser> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateProfile(
    userId: string,
    data: { fullName?: string; avatarUrl?: string }
  ): Promise<SafeUser> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      });

    // Thêm null check này
    if (!updatedUser) {
      throw new Error("Failed to update user profile");
    }

    return updatedUser;
  }
}
