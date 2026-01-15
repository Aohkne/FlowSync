import { Elysia, t } from 'elysia';
import { authMiddleware } from '../middleware/auth';
import { db } from '../db';
import { notifications } from '../db/schema';
import { eq, and, sql } from 'drizzle-orm';

export const notificationRoutes = new Elysia({ prefix: '/notifications' })
  .use(authMiddleware)

  // GET USER NOTIFICATIONS
  .get(
    '/',
    async ({ user, query }) => {
      const { limit = 20, offset = 0, unreadOnly = false } = query;

      const conditions = [eq(notifications.userId, user.id)];
      if (unreadOnly) {
        conditions.push(eq(notifications.isRead, false));
      }

      const userNotifications = await db.query.notifications.findMany({
        where: and(...conditions),
        orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
        limit: Number(limit),
        offset: Number(offset),
      });

      const unreadCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(
          and(
            eq(notifications.userId, user.id),
            eq(notifications.isRead, false)
          )
        );

      return {
        notifications: userNotifications,
        unreadCount: Number(unreadCount[0]?.count || 0),
      };
    },
    {
      query: t.Object({
        limit: t.Optional(t.Number({ minimum: 1, maximum: 50, default: 20 })),
        offset: t.Optional(t.Number({ minimum: 0, default: 0 })),
        unreadOnly: t.Optional(t.Boolean({ default: false })),
      }),
      detail: {
        tags: ['Notifications'],
        summary: 'Get user notifications',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // MARK AS READ
  .patch(
    '/:id/read',
    async ({ user, params, set }) => {
      const notification = await db.query.notifications.findFirst({
        where: eq(notifications.id, params.id),
      });

      if (!notification) {
        set.status = 404;
        return { error: 'Notification not found' };
      }

      if (notification.userId !== user.id) {
        set.status = 403;
        return { error: 'Access denied' };
      }

      const [updated] = await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, params.id))
        .returning();

      return { notification: updated };
    },
    {
      params: t.Object({
        id: t.String({ format: 'uuid' }),
      }),
      detail: {
        tags: ['Notifications'],
        summary: 'Mark notification as read',
        security: [{ bearerAuth: [] }],
      },
    }
  )

  // MARK ALL AS READ
  .patch(
    '/read-all',
    async ({ user }) => {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.userId, user.id),
            eq(notifications.isRead, false)
          )
        );

      return { message: 'All notifications marked as read' };
    },
    {
      detail: {
        tags: ['Notifications'],
        summary: 'Mark all notifications as read',
        security: [{ bearerAuth: [] }],
      },
    }
  );
