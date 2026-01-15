import { Elysia } from 'elysia';
import { authMiddleware } from './middleware/auth';

interface WSMessage {
  type:
    | 'board_update'
    | 'task_created'
    | 'task_moved'
    | 'comment_added'
    | 'user_joined'
    | 'user_left'
    | 'notification';
  boardId: string;
  data: any;
  userId: string;
  timestamp: string;
}

interface ConnectedUser {
  userId: string;
  boardId: string;
  ws: any;
  fullName: string | null;
  avatarUrl: string | null;
}

// Store active connections by boardId
const boardConnections = new Map<string, Set<ConnectedUser>>();

export const websocketPlugin = new Elysia()
  .use(authMiddleware)
  .ws('/ws/:boardId', {
    open(ws) {
      const { boardId } = ws.data.params;
      const user = ws.data.user;

      // Add user to board connections
      if (!boardConnections.has(boardId)) {
        boardConnections.set(boardId, new Set());
      }

      const userConnection: ConnectedUser = {
        userId: user.id,
        boardId,
        ws,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      };

      boardConnections.get(boardId)!.add(userConnection);

      // Broadcast user joined
      broadcastToBoard(boardId, {
        type: 'user_joined',
        boardId,
        data: {
          userId: user.id,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
        },
        userId: user.id,
        timestamp: new Date().toISOString(),
      });

      // Send current online users
      const onlineUsers = Array.from(boardConnections.get(boardId) || []).map(
        (u) => ({
          userId: u.userId,
          fullName: u.fullName,
          avatarUrl: u.avatarUrl,
        })
      );

      ws.send({
        type: 'online_users',
        data: onlineUsers,
      });

      console.log(`[WS] User ${user.id} joined board ${boardId}`);
    },

    message(ws, message) {
      const { boardId } = ws.data.params;
      const user = ws.data.user;

      // Parse and validate message
      let parsedMessage: WSMessage;
      try {
        parsedMessage =
          typeof message === 'string' ? JSON.parse(message) : message;
      } catch {
        ws.send({ error: 'Invalid message format' });
        return;
      }

      // Add metadata
      parsedMessage.userId = user.id;
      parsedMessage.boardId = boardId;
      parsedMessage.timestamp = new Date().toISOString();

      // Broadcast to all users in board (except sender)
      broadcastToBoard(boardId, parsedMessage, user.id);

      console.log(`[WS] Message in board ${boardId}:`, parsedMessage.type);
    },

    close(ws) {
      const { boardId } = ws.data.params;
      const user = ws.data.user;

      // Remove user from connections
      const connections = boardConnections.get(boardId);
      if (connections) {
        connections.forEach((conn) => {
          if (conn.userId === user.id) {
            connections.delete(conn);
          }
        });

        // Clean up empty board
        if (connections.size === 0) {
          boardConnections.delete(boardId);
        }
      }

      // Broadcast user left
      broadcastToBoard(boardId, {
        type: 'user_left',
        boardId,
        data: { userId: user.id },
        userId: user.id,
        timestamp: new Date().toISOString(),
      });

      console.log(`[WS] User ${user.id} left board ${boardId}`);
    },
  });

// Helper: Broadcast message to all users in a board
export function broadcastToBoard(
  boardId: string,
  message: WSMessage,
  excludeUserId?: string
) {
  const connections = boardConnections.get(boardId);
  if (!connections) return;

  connections.forEach((conn) => {
    if (excludeUserId && conn.userId === excludeUserId) return;

    try {
      conn.ws.send(message);
    } catch (error) {
      console.error(`[WS] Failed to send to user ${conn.userId}:`, error);
    }
  });
}

// Helper: Get online users count
export function getOnlineUsers(boardId: string): number {
  return boardConnections.get(boardId)?.size || 0;
}

// Helper: Check if user is online
export function isUserOnline(boardId: string, userId: string): boolean {
  const connections = boardConnections.get(boardId);
  if (!connections) return false;

  return Array.from(connections).some((conn) => conn.userId === userId);
}
