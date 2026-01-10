import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { boards, columns, boardMembers, activities } from "../db/schema";
import { eq, or, and } from "drizzle-orm";

export const boardRoutes = new Elysia({ prefix: "/boards" })
  .use(authMiddleware)

  // GET ALL: boards for current user
  .get(
    "/",
    async ({ user }) => {
      // Get boards where user is owner or member
      const userBoards = await db.query.boards.findMany({
        where: or(eq(boards.ownerId, user.id), eq(boards.isPublic, true)),
        with: {
          owner: {
            columns: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
          members: {
            with: {
              user: {
                columns: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: (boards, { desc }) => [desc(boards.updatedAt)],
      });

      // Also get boards where user is a member
      const memberBoards = await db.query.boardMembers.findMany({
        where: eq(boardMembers.userId, user.id),
        with: {
          board: {
            with: {
              owner: {
                columns: {
                  id: true,
                  fullName: true,
                  email: true,
                  avatarUrl: true,
                },
              },
              members: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      fullName: true,
                      avatarUrl: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Combine and deduplicate
      const allBoards = [...userBoards, ...memberBoards.map((m) => m.board)];

      const uniqueBoards = Array.from(
        new Map(allBoards.map((b) => [b.id, b])).values()
      );

      return { boards: uniqueBoards };
    },
    {
      detail: {
        tags: ["Boards"],
        summary: "Get all boards",
        description:
          "Get all boards owned by or accessible to the current user",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // CREATE BOARD
  .post(
    "/",
    async ({ user, body, set }) => {
      const { title, description, isPublic } = body;

      // Create board
      const [newBoard] = await db
        .insert(boards)
        .values({
          title,
          description: description || null,
          ownerId: user.id,
          isPublic: isPublic || false,
        })
        .returning();

      // Create default columns
      const defaultColumns = [
        { title: "To Do", position: 0 },
        { title: "In Progress", position: 1 },
        { title: "Done", position: 2 },
      ];

      await db.insert(columns).values(
        defaultColumns.map((col) => ({
          boardId: newBoard.id,
          title: col.title,
          position: col.position,
        }))
      );

      // Add owner as member
      await db.insert(boardMembers).values({
        boardId: newBoard.id,
        userId: user.id,
        role: "owner",
      });

      // Log activity
      await db.insert(activities).values({
        boardId: newBoard.id,
        userId: user.id,
        action: "created",
        entityType: "board",
        entityId: newBoard.id,
        metadata: { title: newBoard.title },
      });

      set.status = 201;
      return { board: newBoard };
    },
    {
      body: t.Object({
        title: t.String({
          minLength: 1,
          maxLength: 100,
          default: "My New Board",
          description: "Board title",
        }),
        description: t.Optional(
          t.String({
            maxLength: 500,
            default: "Board description",
            description: "Board description (optional)",
          })
        ),
        isPublic: t.Optional(
          t.Boolean({
            default: false,
            description: "Make board public",
          })
        ),
      }),
      detail: {
        tags: ["Boards"],
        summary: "Create new board",
        description:
          "Create a new board with default columns (To Do, In Progress, Done)",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // GET BOARD BY ID
  .get(
    "/:id",
    async ({ user, params, set }) => {
      const board = await db.query.boards.findFirst({
        where: eq(boards.id, params.id),
        with: {
          owner: {
            columns: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
          members: {
            with: {
              user: {
                columns: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          columns: {
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
          },
        },
      });

      if (!board) {
        set.status = 404;
        return { error: "Board not found" };
      }

      // Check access
      const isMember = board.members.some((m) => m.userId === user.id);
      const isOwner = board.ownerId === user.id;

      if (!board.isPublic && !isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      return { board };
    },
    {
      params: t.Object({
        id: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
        }),
      }),
      detail: {
        tags: ["Boards"],
        summary: "Get board by ID",
        description:
          "Get detailed board information including columns and tasks",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // UPDATE BOARD
  .patch(
    "/:id",
    async ({ user, params, body, set }) => {
      const board = await db.query.boards.findFirst({
        where: eq(boards.id, params.id),
      });

      if (!board) {
        set.status = 404;
        return { error: "Board not found" };
      }

      if (board.ownerId !== user.id) {
        set.status = 403;
        return { error: "Only board owner can update board" };
      }

      const [updatedBoard] = await db
        .update(boards)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(boards.id, params.id))
        .returning();

      // Log activity
      await db.insert(activities).values({
        boardId: updatedBoard.id,
        userId: user.id,
        action: "updated",
        entityType: "board",
        entityId: updatedBoard.id,
        metadata: body,
      });

      return { board: updatedBoard };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        description: t.Optional(t.String({ maxLength: 500 })),
        isPublic: t.Optional(t.Boolean()),
      }),
      detail: {
        tags: ["Boards"],
        summary: "Update board",
        description: "Update board information (owner only)",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // DELETER BOARD
  .delete(
    "/:id",
    async ({ user, params, set }) => {
      const board = await db.query.boards.findFirst({
        where: eq(boards.id, params.id),
      });

      if (!board) {
        set.status = 404;
        return { error: "Board not found" };
      }

      if (board.ownerId !== user.id) {
        set.status = 403;
        return { error: "Only board owner can delete board" };
      }

      await db.delete(boards).where(eq(boards.id, params.id));

      return { message: "Board deleted successfully" };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        tags: ["Boards"],
        summary: "Delete board",
        description:
          "Delete board permanently (owner only). All columns, tasks, and comments will be deleted.",
        security: [{ bearerAuth: [] }],
      },
    }
  );
