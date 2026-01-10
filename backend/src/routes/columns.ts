import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { columns, boards, boardMembers, activities } from "../db/schema";
import { eq, and } from "drizzle-orm";

// HELPER: check board access
async function checkBoardAccess(boardId: string, userId: string) {
  const board = await db.query.boards.findFirst({
    where: eq(boards.id, boardId),
    with: {
      members: true,
    },
  });

  if (!board) {
    return { hasAccess: false, board: null };
  }

  const isMember = board.members.some((m) => m.userId === userId);
  const isOwner = board.ownerId === userId;

  return { hasAccess: isMember || isOwner, board };
}

export const columnRoutes = new Elysia({ prefix: "/columns" })
  .use(authMiddleware)

  // CREATE COLUMN
  .post(
    "/",
    async ({ user, body, set }) => {
      const { boardId, title } = body;

      // Check access
      const { hasAccess, board } = await checkBoardAccess(boardId, user.id);

      if (!board) {
        set.status = 404;
        return { error: "Board not found" };
      }

      if (!hasAccess) {
        set.status = 403;
        return { error: "Access denied" };
      }

      // Get max position
      const existingColumns = await db.query.columns.findMany({
        where: eq(columns.boardId, boardId),
      });
      const maxPosition =
        existingColumns.length > 0
          ? Math.max(...existingColumns.map((c) => c.position))
          : -1;

      const [newColumn] = await db
        .insert(columns)
        .values({
          boardId,
          title,
          position: maxPosition + 1,
        })
        .returning();

      // Log activity
      await db.insert(activities).values({
        boardId,
        userId: user.id,
        action: "created",
        entityType: "column",
        entityId: newColumn.id,
        metadata: { title: newColumn.title },
      });

      set.status = 201;
      return { column: newColumn };
    },
    {
      body: t.Object({
        boardId: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
          description: "Board ID",
        }),
        title: t.String({
          minLength: 1,
          maxLength: 100,
          default: "New Column",
          description: "Column title",
        }),
      }),
      detail: {
        tags: ["Columns"],
        summary: "Create column",
        description: "Create a new column in a board",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // GET COLUMNS BOARD ID
  .get(
    "/board/:boardId",
    async ({ user, params, set }) => {
      const { boardId } = params;
      // Check access
      const { hasAccess } = await checkBoardAccess(boardId, user.id);

      if (!hasAccess) {
        set.status = 403;
        return { error: "Access denied" };
      }

      const boardColumns = await db.query.columns.findMany({
        where: eq(columns.boardId, boardId),
        orderBy: (columns, { asc }) => [asc(columns.position)],
        with: {
          tasks: {
            orderBy: (tasks, { asc }) => [asc(tasks.position)],
            with: {
              assignedUser: {
                columns: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                },
              },
              creator: {
                columns: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      });

      return { columns: boardColumns };
    },
    {
      params: t.Object({
        boardId: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
        }),
      }),
      detail: {
        tags: ["Columns"],
        summary: "Get columns by board",
        description: "Get all columns for a specific board",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // UPDATE COLUMN
  .patch(
    "/:id",
    async ({ user, params, body, set }) => {
      const column = await db.query.columns.findFirst({
        where: eq(columns.id, params.id),
        with: {
          board: {
            with: {
              members: true,
            },
          },
        },
      });
      if (!column) {
        set.status = 404;
        return { error: "Column not found" };
      }

      const isMember = column.board.members.some((m) => m.userId === user.id);
      const isOwner = column.board.ownerId === user.id;

      if (!isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      const [updatedColumn] = await db
        .update(columns)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(columns.id, params.id))
        .returning();

      // Log activity
      await db.insert(activities).values({
        boardId: column.boardId,
        userId: user.id,
        action: "updated",
        entityType: "column",
        entityId: updatedColumn.id,
        metadata: body,
      });

      return { column: updatedColumn };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        position: t.Optional(t.Number({ minimum: 0 })),
      }),
      detail: {
        tags: ["Columns"],
        summary: "Update column",
        description: "Update column title or position",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // REORDER COLUMNS
  .patch(
    "/:id/reorder",
    async ({ user, params, body, set }) => {
      const { newPosition } = body;
      const column = await db.query.columns.findFirst({
        where: eq(columns.id, params.id),
        with: {
          board: {
            with: {
              members: true,
            },
          },
        },
      });

      if (!column) {
        set.status = 404;
        return { error: "Column not found" };
      }

      const isMember = column.board.members.some((m) => m.userId === user.id);
      const isOwner = column.board.ownerId === user.id;

      if (!isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      // Get all columns in the board
      const allColumns = await db.query.columns.findMany({
        where: eq(columns.boardId, column.boardId),
        orderBy: (columns, { asc }) => [asc(columns.position)],
      });

      const oldPosition = column.position;

      // Reorder logic
      if (newPosition < oldPosition) {
        // Moving left
        for (const col of allColumns) {
          if (col.position >= newPosition && col.position < oldPosition) {
            await db
              .update(columns)
              .set({ position: col.position + 1 })
              .where(eq(columns.id, col.id));
          }
        }
      } else if (newPosition > oldPosition) {
        // Moving right
        for (const col of allColumns) {
          if (col.position > oldPosition && col.position <= newPosition) {
            await db
              .update(columns)
              .set({ position: col.position - 1 })
              .where(eq(columns.id, col.id));
          }
        }
      }

      // Update the moved column
      const [updatedColumn] = await db
        .update(columns)
        .set({ position: newPosition, updatedAt: new Date() })
        .where(eq(columns.id, params.id))
        .returning();

      // Log activity
      await db.insert(activities).values({
        boardId: column.boardId,
        userId: user.id,
        action: "moved",
        entityType: "column",
        entityId: updatedColumn.id,
        metadata: { oldPosition, newPosition },
      });

      return { column: updatedColumn };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        newPosition: t.Number({
          minimum: 0,
          default: 0,
          description: "New position index for the column",
        }),
      }),
      detail: {
        tags: ["Columns"],
        summary: "Reorder column",
        description: "Change column position in board",
        security: [{ bearerAuth: [] }],
      },
    }
  )
  // DELETE COLUMN
  .delete(
    "/:id",
    async ({ user, params, set }) => {
      const column = await db.query.columns.findFirst({
        where: eq(columns.id, params.id),
        with: {
          board: {
            with: {
              members: true,
            },
          },
        },
      });
      if (!column) {
        set.status = 404;
        return { error: "Column not found" };
      }

      const isMember = column.board.members.some((m) => m.userId === user.id);
      const isOwner = column.board.ownerId === user.id;

      if (!isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      await db.delete(columns).where(eq(columns.id, params.id));

      // Log activity
      await db.insert(activities).values({
        boardId: column.boardId,
        userId: user.id,
        action: "deleted",
        entityType: "column",
        entityId: column.id,
        metadata: { title: column.title },
      });

      return { message: "Column deleted successfully" };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        tags: ["Columns"],
        summary: "Delete column",
        description: "Delete column and all its tasks permanently",
        security: [{ bearerAuth: [] }],
      },
    }
  );
