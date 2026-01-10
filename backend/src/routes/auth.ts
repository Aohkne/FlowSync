import { Elysia, t } from "elysia";
import { db } from "../db";
import { users } from "../db/schema";
import { hashPassword, comparePassword, generateToken } from "../lib/auth";
import { eq } from "drizzle-orm";
import { authMiddleware } from "../middleware/auth";

export const authRoutes = new Elysia({ prefix: "/auth" })
  // REGISTER
  .post(
    "/register",
    async ({ body, set }) => {
      const { email, password, fullName } = body;

      // CHECK USER
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (existingUser) {
        set.status = 400;
        return { error: "Email already registered" };
      }

      // HASH PASSWORD
      const hashedPassword = await hashPassword(password);

      // CREATE USER
      const [newUser] = await db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          fullName: fullName || null,
        })
        .returning({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          createdAt: users.createdAt,
        });

      // GENERATE TOKEN
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
      });

      set.status = 201;
      return {
        message: "Registration successful",
        user: newUser,
        token,
      };
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
          default: "user@example.com",
          description: "User email address",
        }),
        password: t.String({
          minLength: 6,
          default: "password123",
          description: "Password (minimum 6 characters)",
        }),
        fullName: t.Optional(
          t.String({
            default: "John Doe",
            description: "User full name",
          })
        ),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Register new account",
        description: "Create a new user account with email and password",
      },
    }
  )

  // LOGIN
  .post(
    "/login",
    async ({ body, set }) => {
      const { email, password } = body;

      // FIND
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        set.status = 401;
        return { error: "Invalid email or password" };
      }

      // VERIFY
      const isValidPassword = await comparePassword(password, user.password);

      if (!isValidPassword) {
        set.status = 401;
        return { error: "Invalid email or password" };
      }

      // GENERATE TOKEN
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      return {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
        token,
      };
    },
    {
      body: t.Object({
        email: t.String({
          format: "email",
          default: "user@example.com",
        }),
        password: t.String({
          minLength: 6,
          default: "password123",
        }),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Login to account",
        description: "Authenticate user with email and password",
      },
    }
  )

  // GET CURRENT USER (protected)
  .use(authMiddleware)
  .get(
    "/me",
    async ({ user }) => {
      return { user };
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Get current user",
        description: "Get authenticated user information",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // UPDATE PROFILE (protected)
  .patch(
    "/profile",
    async ({ user, body, set }) => {
      const [updatedUser] = await db
        .update(users)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .returning({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          avatarUrl: users.avatarUrl,
          updatedAt: users.updatedAt,
        });

      return {
        message: "Profile updated successfully",
        user: updatedUser,
      };
    },
    {
      body: t.Object({
        fullName: t.Optional(t.String({ maxLength: 255 })),
        avatarUrl: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Auth"],
        summary: "Update profile",
        description: "Update user profile information",
        security: [{ bearerAuth: [] }],
      },
    }
  );
