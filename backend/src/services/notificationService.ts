import { db } from '../db';
import { notifications } from '../db/schema';
import { broadcastToBoard } from '../websocket';

interface CreateNotificationData {
  userId: string;
  type: 'task_assigned' | 'mentioned' | 'comment_added' | 'task_moved';
  title: string;
  message: string;
  entityType?: 'task' | 'comment' | 'board';
  entityId?: string;
  boardId?: string;
}

export class NotificationService {
  async create(data: CreateNotificationData) {
    const [notification] = await db
      .insert(notifications)
      .values({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        entityType: data.entityType || null,
        entityId: data.entityId || null,
      })
      .returning();

    // SEND realtime notification via WebSocket if boardId provided
    if (data.boardId) {
      broadcastToBoard(data.boardId, {
        type: 'notification',
        boardId: data.boardId,
        data: notification,
        userId: data.userId,
        timestamp: new Date().toISOString(),
      });
    }

    return notification;
  }

  async notifyTaskAssignment(
    assignedUserId: string,
    taskTitle: string,
    assignedByName: string,
    taskId: string,
    boardId: string
  ) {
    return this.create({
      userId: assignedUserId,
      type: 'task_assigned',
      title: 'New task assigned',
      message: `${assignedByName} assigned you to "${taskTitle}"`,
      entityType: 'task',
      entityId: taskId,
      boardId,
    });
  }

  async notifyMention(
    mentionedUserId: string,
    mentionedByName: string,
    taskTitle: string,
    taskId: string,
    boardId: string
  ) {
    return this.create({
      userId: mentionedUserId,
      type: 'mentioned',
      title: 'You were mentioned',
      message: `${mentionedByName} mentioned you in "${taskTitle}"`,
      entityType: 'task',
      entityId: taskId,
      boardId,
    });
  }

  async notifyNewComment(
    taskOwnerId: string,
    commenterName: string,
    taskTitle: string,
    commentId: string,
    boardId: string
  ) {
    return this.create({
      userId: taskOwnerId,
      type: 'comment_added',
      title: 'New comment',
      message: `${commenterName} commented on "${taskTitle}"`,
      entityType: 'comment',
      entityId: commentId,
      boardId,
    });
  }
}
