import { Elysia, t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { db } from "../db";
import { comments, tasks, activities } from "../db/schema";
import { eq, desc } from "drizzle-orm";

export const commentRoutes = new Elysia({ prefix: "/comments" })
  .use(authMiddleware)

  // CREATE COMMENT
  .post(
    "/",
    async ({ user, body, set }) => {
      const { taskId, content } = body;

      // Check if task exists and user has access
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, taskId),
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

      const [newComment] = await db
        .insert(comments)
        .values({
          taskId,
          userId: user.id,
          content,
        })
        .returning();

      // GET COMMENT WITH USER INFO
      const commentWithUser = await db.query.comments.findFirst({
        where: eq(comments.id, newComment.id),
        with: {
          user: {
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
        action: "commented",
        entityType: "task",
        entityId: taskId,
        metadata: { commentId: newComment.id },
      });

      set.status = 201;
      return { comment: commentWithUser };
    },
    {
      body: t.Object({
        taskId: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
          description: "Task ID to comment on",
        }),
        content: t.String({
          minLength: 1,
          maxLength: 2000,
          default: "This is a comment",
          description: "Comment content",
        }),
      }),
      detail: {
        tags: ["Comments"],
        summary: "Create comment",
        description: "Add a comment to a task",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // GET COMMENT BY TASK ID
  .get(
    "/task/:taskId",
    async ({ user, params, set }) => {
      // Check task access
      const task = await db.query.tasks.findFirst({
        where: eq(tasks.id, params.taskId),
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

      if (!task.column.board.isPublic && !isMember && !isOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      const taskComments = await db.query.comments.findMany({
        where: eq(comments.taskId, params.taskId),
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
      });

      return { comments: taskComments };
    },
    {
      params: t.Object({
        taskId: t.String({
          format: "uuid",
          default: "123e4567-e89b-12d3-a456-426614174000",
        }),
      }),
      detail: {
        tags: ["Comments"],
        summary: "Get task comments",
        description: "Get all comments for a specific task",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // UPDATE COMMENT
  .patch(
    "/:id",
    async ({ user, params, body, set }) => {
      const comment = await db.query.comments.findFirst({
        where: eq(comments.id, params.id),
      });

      if (!comment) {
        set.status = 404;
        return { error: "Comment not found" };
      }

      if (comment.userId !== user.id) {
        set.status = 403;
        return { error: "You can only edit your own comments" };
      }

      const [updatedComment] = await db
        .update(comments)
        .set({
          content: body.content,
          updatedAt: new Date(),
        })
        .where(eq(comments.id, params.id))
        .returning();

      // Get comment with user info
      const commentWithUser = await db.query.comments.findFirst({
        where: eq(comments.id, updatedComment.id),
        with: {
          user: {
            columns: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      });

      return { comment: commentWithUser };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      body: t.Object({
        content: t.String({
          minLength: 1,
          maxLength: 2000,
          default: "Updated comment content",
        }),
      }),
      detail: {
        tags: ["Comments"],
        summary: "Update comment",
        description: "Update your own comment",
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // DELETE COMMENT
  .delete(
    "/:id",
    async ({ user, params, set }) => {
      const comment = await db.query.comments.findFirst({
        where: eq(comments.id, params.id),
        with: {
          task: {
            with: {
              column: {
                with: {
                  board: true,
                },
              },
            },
          },
        },
      });

      if (!comment) {
        set.status = 404;
        return { error: "Comment not found" };
      }

      // Only comment owner or board owner can delete
      const isCommentOwner = comment.userId === user.id;
      const isBoardOwner = comment.task.column.board.ownerId === user.id;

      if (!isCommentOwner && !isBoardOwner) {
        set.status = 403;
        return { error: "Access denied" };
      }

      await db.delete(comments).where(eq(comments.id, params.id));

      return { message: "Comment deleted successfully" };
    },
    {
      params: t.Object({
        id: t.String({ format: "uuid" }),
      }),
      detail: {
        tags: ["Comments"],
        summary: "Delete comment",
        description: "Delete your own comment (or board owner can delete any)",
        security: [{ bearerAuth: [] }],
      },
    }
  );
