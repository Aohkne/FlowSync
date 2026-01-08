import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { authRoutes } from "./routes/auth";

const app = new Elysia()
  // CORS
  .use(cors())

  // Swagger
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "FlowSync - Backend API",
          description: "API for project using Elysia + Bun + Supabase",
          version: "1.0.0",
          contact: {
            name: "Developer",
            url: "https://your-website.com",
          },
        },
        tags: [
          {
            name: "Auth",
            description: "Các API liên quan đến xác thực người dùng",
          },
          { name: "Realtime", description: "Các endpoint WebSocket" },
        ],
      },
    })
  )
  .group("/api", (app) => app.use(authRoutes))
  .listen(3000);

console.log(`
Elysia is running at http://${app.server?.hostname}:${app.server?.port}
Swagger UI is available at http://${app.server?.hostname}:${app.server?.port}/docs
`);
