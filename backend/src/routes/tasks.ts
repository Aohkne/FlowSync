import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { tasks, columns, boards, boardMembers, activities } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

// HELPER: check column access
async function checkColumnAccess(columnId: string, userId: string) {
  const column = await db.query.columns.findFirst({
    where: eq(columns.id, columnId),
    with: {
      board: {
        with: {
          members: true,
        },
      },
    },
  });

  if (!column) {
    return { hasAccess: false, column: null };
  }

  const isMember = column.board.members.some((m) => m.userId === userId);
  const isOwner = column.board.ownerId === userId;

  return { hasAccess: isMember || isOwner, column };
}

export const taskRoutes = new Elysia({ prefix: "/tasks" })
  .use(authMiddleware)

  // CREATE TASK
  .post(
    "/",
    async ({ user, body, set }) => {
      const { columnId, title, description, priority, assignedTo } = body;

      // Check access
      const { hasAccess, column } = await checkColumnAccess(columnId, user.id);

      if (!column) {
        set.status = 404;
        return { error: "Column not found" };
      }

      if (!hasAccess) {
        set.status = 403;
        return { error: "Access denied" };
      }

      // Verify assigned user is board member
      if (assignedTo) {
        const assignedUser = column.board.members.find(
          (m) => m.userId === assignedTo
        );
        if (!assignedUser) {
          set.status = 400;
          return { error: "Assigned user must be a board member" };
        }
      }

      // Get max position
      const existingTasks = await db.query.tasks.findMany({
        where: eq(tasks.columnId, columnId),
      });

      const maxPosition =
        existingTasks.length > 0
          ? Math.max(...existingTasks.map((t) => t.position))
          : -1;

      const [newTask] = await db
        .insert(tasks)
        .values({
          columnId,
          title,
          description: description || null,
          priority: priority || "medium",
          assignedTo: assignedTo || null,
          createdBy: user.id,
          position: maxPosition + 1,
        })
        .returning();

      if (!newTask) {
        set.status = 500;
        return { error: "Failed to create task" };
      }

      // Get task with relations
      const taskWithRelations = await db.query.tasks.findFirst({
        where: eq(tasks.id, newTask.id),
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
      });

      // Log activity
      await db.insert(activities).values({
        boardId: column.boardId,
        userId: user.id,
        action: "created",
        entityType: "task",
        entityId: newTask.id,
        metadata: { title: newTask.title, columnId },
      });

      set.status = 201;
      return { task: taskWithRelations };
    },
    {
      body: t.Object({
        columnId: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
          description: "Column ID where task will be created",
        }),
        title: t.String({
          minLength: 1,
          maxLength: 255,
          default: "New Task",
          description: "Task title",
        }),
        description: t.Optional(
          t.String({
            default: "Task description here...",
            description: "Task description (optional)",
          })
        ),
        priority: t.Optional(
          t.Union([t.Literal("low"), t.Literal("medium"), t.Literal("high")], {
            default: "medium",
            description: "Task priority level",
          })
        ),
        assignedTo: t.Optional(
          t.String({
            format: "uuid",
            description: "User ID to assign task to (optional)",
          })
        ),
      }),
      detail: {
        tags: ["Tasks"],
        summary: "Create task",
        description: "Create a new task in a column",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // GET TASK BY ID
  .get(
    "/:id",
    async ({ user, params, set }) => {
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, params.id),
        with: {
          column: {
            with: {
              board: {
                with: {
                  members: true,
                },
              },
            },
          },
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
          comments: {
            with: {
              user: {
                columns: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                },
              },
            },
            orderBy: (comments, { desc }) => [desc(comments.createdAt)],
          },
        },
      });

      if (!task) {
        set.status = 404;
        return { error: "Task not found" };
      }

      // Check access
      const isMember = task.column.board.members.some(
        (m) => m.userId === user.id
      );
      const isOwner = task.column.board.ownerId === user.id;

      if (!task.column.board.isPublic && !isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      return { task };
    },
    {
      params: t.Object({
        id: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
        }),
      }),
      detail: {
        tags: ["Tasks"],
        summary: "Get task by ID",
        description: "Get detailed task information including comments",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // UPDATE TASK
  .patch(
    "/:id",
    async ({ user, params, body, set }) => {
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, params.id),
        with: {
          column: {
            with: {
              board: {
                with: {
                  members: true,
                },
              },
            },
          },
        },
      });

      if (!task) {
        set.status = 404;
        return { error: "Task not found" };
      }

      const isMember = task.column.board.members.some(
        (m) => m.userId === user.id
      );
      const isOwner = task.column.board.ownerId === user.id;

      if (!isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      // Verify assigned user if provided
      if (body.assignedTo) {
        const assignedUser = task.column.board.members.find(
          (m) => m.userId === body.assignedTo
        );
        if (!assignedUser) {
          set.status = 400;
          return { error: "Assigned user must be a board member" };
        }
      }

      const [updatedTask] = await db
        .update(tasks)
        .set({
          ...body,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, params.id))
        .returning();

      if (!updatedTask) {
        set.status = 500;
        return { error: "Failed to update task" };
      }

      // Get task with relations
      const taskWithRelations = await db.query.tasks.findFirst({
        where: eq(tasks.id, updatedTask.id),
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
      });

      // Log activity
      await db.insert(activities).values({
        boardId: task.column.boardId,
        userId: user.id,
        action: "updated",
        entityType: "task",
        entityId: updatedTask.id,
        metadata: body,
      });

      return { task: taskWithRelations };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        title: t.Optional(t.String({ minLength: 1, maxLength: 255 })),
        description: t.Optional(t.String()),
        priority: t.Optional(
          t.Union([t.Literal("low"), t.Literal("medium"), t.Literal("high")])
        ),
        assignedTo: t.Optional(t.String({ format: "uuid" })),
      }),
      detail: {
        tags: ["Tasks"],
        summary: "Update task",
        description: "Update task information",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // MOVE TASK: to different column
  .patch(
    "/:id/move",
    async ({ user, params, body, set }) => {
      const { columnId, position } = body;

      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, params.id),
        with: {
          column: {
            with: {
              board: {
                with: {
                  members: true,
                },
              },
            },
          },
        },
      });

      if (!task) {
        set.status = 404;
        return { error: "Task not found" };
      }

      const isMember = task.column.board.members.some(
        (m) => m.userId === user.id
      );
      const isOwner = task.column.board.ownerId === user.id;

      if (!isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      // Verify target column exists and belongs to same board
      const targetColumn = await db.query.columns.findFirst({
        where: eq(columns.id, columnId),
      });

      if (!targetColumn) {
        set.status = 404;
        return { error: "Target column not found" };
      }

      if (targetColumn.boardId !== task.column.boardId) {
        set.status = 400;
        return { error: "Cannot move task to different board" };
      }

      const oldColumnId = task.columnId;
      const oldPosition = task.position;

      // If moving to same column, just reorder
      if (columnId === oldColumnId) {
        // Get all tasks in the column
        const columnTasks = await db.query.tasks.findMany({
          where: eq(tasks.columnId, columnId),
          orderBy: (tasks, { asc }) => [asc(tasks.position)],
        });

        // Reorder logic
        if (position < oldPosition) {
          // Moving up
          for (const t of columnTasks) {
            if (t.position >= position && t.position < oldPosition) {
              await db
                .update(tasks)
                .set({ position: t.position + 1 })
                .where(eq(tasks.id, t.id));
            }
          }
        } else if (position > oldPosition) {
          // Moving down
          for (const t of columnTasks) {
            if (t.position > oldPosition && t.position <= position) {
              await db
                .update(tasks)
                .set({ position: t.position - 1 })
                .where(eq(tasks.id, t.id));
            }
          }
        }
      } else {
        // Moving to different column
        // Remove from old column (shift positions)
        const oldColumnTasks = await db.query.tasks.findMany({
          where: eq(tasks.columnId, oldColumnId),
        });

        for (const t of oldColumnTasks) {
          if (t.position > oldPosition) {
            await db
              .update(tasks)
              .set({ position: t.position - 1 })
              .where(eq(tasks.id, t.id));
          }
        }

        // Add to new column (shift positions)
        const newColumnTasks = await db.query.tasks.findMany({
          where: eq(tasks.columnId, columnId),
        });

        for (const t of newColumnTasks) {
          if (t.position >= position) {
            await db
              .update(tasks)
              .set({ position: t.position + 1 })
              .where(eq(tasks.id, t.id));
          }
        }
      }

      // Update the moved task
      const [updatedTask] = await db
        .update(tasks)
        .set({
          columnId,
          position,
          updatedAt: new Date(),
        })
        .where(eq(tasks.id, params.id))
        .returning();

      if (!updatedTask) {
        set.status = 500;
        return { error: "Failed to update task" };
      }

      // Get task with relations
      const taskWithRelations = await db.query.tasks.findFirst({
        where: eq(tasks.id, updatedTask.id),
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
      });

      // Log activity
      await db.insert(activities).values({
        boardId: task.column.boardId,
        userId: user.id,
        action: "moved",
        entityType: "task",
        entityId: updatedTask.id,
        metadata: {
          oldColumnId,
          newColumnId: columnId,
          oldPosition,
          newPosition: position,
        },
      });

      return { task: taskWithRelations };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        columnId: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
          description: "Target column ID",
        }),
        position: t.Number({
          minimum: 0,
          default: 0,
          description: "New position in target column",
        }),
      }),
      detail: {
        tags: ["Tasks"],
        summary: "Move task",
        description:
          "Move task to different column or reorder within same column",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // DELETER TASK
  .delete(
    "/:id",
    async ({ user, params, set }) => {
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, params.id),
        with: {
          column: {
            with: {
              board: {
                with: {
                  members: true,
                },
              },
            },
          },
        },
      });

      if (!task) {
        set.status = 404;
        return { error: "Task not found" };
      }

      const isMember = task.column.board.members.some(
        (m) => m.userId === user.id
      );
      const isOwner = task.column.board.ownerId === user.id;

      if (!isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      await db.delete(tasks).where(eq(tasks.id, params.id));

      // Log activity
      await db.insert(activities).values({
        boardId: task.column.boardId,
        userId: user.id,
        action: "deleted",
        entityType: "task",
        entityId: task.id,
        metadata: { title: task.title },
      });

      return { message: "Task deleted successfully" };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        tags: ["Tasks"],
        summary: "Delete task",
        description: "Delete task permanently",
        security: [{ bearerAuth: [] }],
      },
    }
  );
