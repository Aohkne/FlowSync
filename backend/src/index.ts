import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { testDatabaseConnection } from "./config/database";

// ROUTES
import { authRoutes } from "./routes/auth";
import { boardRoutes } from "./routes/boards";
import { columnRoutes } from "./routes/columns";
import { taskRoutes } from "./routes/tasks";
import { commentRoutes } from "./routes/comments";
import { memberRoutes } from "./routes/members";
import { activityRoutes } from "./routes/activities";

// Test database connection on startup
await testDatabaseConnection();

const app = new Elysia()
  // CORS
  .use(
    cors({
      origin: true,
      credentials: true,
    })
  )

  // Swagger
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "FlowSync API",
          description:
            "Real-time collaborative task board API built with Elysia, Bun, and PostgreSQL",
          version: "1.0.0",
          contact: {
            name: "API Support",
            url: "https://flowsync.example.com",
            email: "support@flowsync.example.com",
          },
        },
        tags: [
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Boards", description: "Board management" },
          { name: "Columns", description: "Column operations" },
          { name: "Tasks", description: "Task CRUD and drag & drop" },
          { name: "Comments", description: "Task comments" },
          { name: "Members", description: "Board member management" },
          { name: "Activities", description: "Activity logs" },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Enter your JWT token",
            },
          },
        },
      },
      exclude: ["/docs", "/docs/json"],
    })
  )

  // Health check
  .get("/", () => ({
    message: "FlowSync API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  }))

  .get("/health", () => ({
    status: "healthy",
    database: "connected",
    timestamp: new Date().toISOString(),
  }))

  // API
  .group("/api", (app) =>
    app
      .use(authRoutes)
      .use(boardRoutes)
      .use(columnRoutes)
      .use(taskRoutes)
      .use(commentRoutes)
      .use(memberRoutes)
      .use(activityRoutes)
  )

  // Global error handling
  .onError(({ code, error, set }) => {
    console.error(`[${code}]`, error);

    // Safely get error message
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (code === "VALIDATION") {
      set.status = 400;
      return {
        error: "Validation failed",
        message: errorMessage,
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: "Not found",
        message: errorMessage,
      };
    }

    set.status = 500;
    return {
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? errorMessage
          : "Something went wrong",
    };
  })

  .listen(process.env.PORT || 3000);

console.log(`
Server: http://${app.server?.hostname}:${app.server?.port}
Docs:   http://${app.server?.hostname}:${app.server?.port}/docs
`);
