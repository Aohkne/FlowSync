import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { AuthController } from "../controllers";

const authController = new AuthController();

export const authRoutes = new Elysia({ prefix: "/auth" })
  // REGISTER
  .post(
    "/register",
    async ({ body, set }) => {
      try {
        const result = await authController.register(body);
        set.status = 201;
        return result;
      } catch (error) {
        set.status = 400;
        return {
          error: error instanceof Error ? error.message : "Registration failed",
        };
      }
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
      try {
        return await authController.login(body);
      } catch (error) {
        set.status = 401;
        return {
          error: error instanceof Error ? error.message : "Login failed",
        };
      }
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

  // Protected routes
  .use(authMiddleware)

  // GET CURRENT USER
  .get(
    "/me",
    async ({ user }) => {
      return await authController.getMe(user.id);
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

  // UPDATE PROFILE
  .patch(
    "/profile",
    async ({ user, body }) => {
      return await authController.updateProfile(user.id, body);
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
