import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import { db } from '../db';
import { tasks, columns, boards } from '../db/schema';
import { eq, and, or, like, inArray, isNull } from 'drizzle-orm';

export const searchRoutes = new Elysia({ prefix: '/search' })
  .use(authMiddleware)

  // SEARCH TASKS
  .get(
    '/tasks',
    async ({ user, query, set }) => {
      const {
        boardId,
        q,
        priority,
        assignedTo,
        columnId,
        createdBy,
        limit = 50,
        offset = 0,
      } = query;

      // Check board access
      const board = await db.query.boards.findFirst({
        where: eq(boards.id, boardId),
        with: { members: true },
      });

      if (!board) {
        set.status = 404;
        return { error: 'Board not found' };
      }

      const isMember = board.members.some((m) => m.userId === user.id);
      const isOwner = board.ownerId === user.id;

      if (!board.isPublic && !isMember && !isOwner) {
        set.status = 403;
        return { error: 'Access denied' };
      }

      // Build query conditions
      const conditions: any[] = [];

      // Filter by board columns
      const boardColumns = await db.query.columns.findMany({
        where: eq(columns.boardId, boardId),
      });
      const columnIds = boardColumns.map((c) => c.id);
      conditions.push(inArray(tasks.columnId, columnIds));

      // Search by title/description
      if (q) {
        conditions.push(
          or(like(tasks.title, `%${q}%`), like(tasks.description, `%${q}%`))
        );
      }

      // Filter by priority
      if (priority) {
        conditions.push(eq(tasks.priority, priority));
      }

      // Filter by assigned user
      if (assignedTo) {
        if (assignedTo === 'unassigned') {
          conditions.push(isNull(tasks.assignedTo));
        } else {
          conditions.push(eq(tasks.assignedTo, assignedTo));
        }
      }

      // Filter by column
      if (columnId) {
        conditions.push(eq(tasks.columnId, columnId));
      }

      // Filter by creator
      if (createdBy) {
        conditions.push(eq(tasks.createdBy, createdBy));
      }

      // Execute query
      const results = await db.query.tasks.findMany({
        where: and(...conditions),
        with: {
          column: true,
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
        orderBy: (tasks, { desc }) => [desc(tasks.updatedAt)],
        limit: Number(limit),
        offset: Number(offset),
      });

      return {
        tasks: results,
        total: results.length,
        query: { q, priority, assignedTo, columnId, createdBy },
      };
    },
    {
      query: t.Object({
        boardId: t.String({
          format: 'uuid',
          description: 'Board ID to search in',
        }),
        q: t.Optional(
          t.String({
            description: 'Search query (searches title and description)',
          })
        ),
        priority: t.Optional(
          t.Union([t.Literal('low'), t.Literal('medium'), t.Literal('high')], {
            description: 'Filter by priority',
          })
        ),
        assignedTo: t.Optional(
          t.String({
            description: 'User ID or "unassigned"',
          })
        ),
        columnId: t.Optional(
          t.String({
            format: 'uuid',
            description: 'Filter by column',
          })
        ),
        createdBy: t.Optional(
          t.String({
            format: 'uuid',
            description: 'Filter by task creator',
          })
        ),
        limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 50 })),
        offset: t.Optional(t.Number({ minimum: 0, default: 0 })),
      }),
      detail: {
        tags: ['Search'],
        summary: 'Search and filter tasks',
        description: 'Search tasks by keyword and apply multiple filters',
        security: [{ bearerAuth: [] }],
      },
    }
  );
