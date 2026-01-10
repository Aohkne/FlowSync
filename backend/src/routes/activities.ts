import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { activities, boards } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const activityRoutes = new Elysia({ prefix: "/activities" })
  .use(authMiddleware)

  // GET BOARD ACTIVITIES
  .get(
    "/board/:boardId",
    async ({ user, params, query, set }) => {
      const { limit = 50, offset = 0 } = query;

      // Check board access
      const board = await db.query.boards.findFirst({
        where: eq(boards.id, params.boardId),
        with: {
          members: true,
        },
      });

      if (!board) {
        set.status = 404;
        return { error: "Board not found" };
      }

      const isMember = board.members.some((m) => m.userId === user.id);
      const isOwner = board.ownerId === user.id;

      if (!board.isPublic && !isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      const boardActivities = await db.query.activities.findMany({
        where: eq(activities.boardId, params.boardId),
        with: {
          user: {
            columns: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: (activities, { desc }) => [desc(activities.createdAt)],
        limit: Number(limit),
        offset: Number(offset),
      });

      return { activities: boardActivities };
    },
    {
      params: t.Object({
        boardId: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
        }),
      }),
      query: t.Object({
        limit: t.Optional(
          t.Number({
            minimum: 1,
            maximum: 100,
            default: 50,
            description: "Number of activities to return",
          })
        ),
        offset: t.Optional(
          t.Number({
            minimum: 0,
            default: 0,
            description: "Offset for pagination",
          })
        ),
      }),
      detail: {
        tags: ["Activities"],
        summary: "Get board activities",
        description: "Get activity log for a board with pagination",
        security: [{ bearerAuth: [] }],
      },
    }
  );
