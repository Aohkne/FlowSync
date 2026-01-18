import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

interface WebSocketMessage {
  type: "board_update" | "task_created" | "task_moved" | "comment_added" | "user_joined" | "user_left" | "notification";
  boardId: string;
  data: unknown;
  userId: string;
  timestamp: string;
}

const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000";

export const useWebSocket = (boardId: string | null) => {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);

  const handleReconnect = useCallback(() => {
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log("[WS] Attempting to reconnect...");
      reconnectAttemptsRef.current += 1;
    }, 3000);
  }, []);

  const connect = useCallback(() => {
    if (!boardId || !token) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Create new WebSocket connection
    const ws = new WebSocket(`${WS_BASE_URL}/ws/${boardId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`[WS] Connected to board ${boardId}`);
      reconnectAttemptsRef.current = 0;
      // Send auth token after connection
      ws.send(JSON.stringify({ type: "auth", token }));
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log("[WS] Message received:", message);

        // Handle different message types
        switch (message.type) {
          case "task_created":
          case "task_moved":
          case "board_update":
            // Invalidate board query to refetch
            queryClient.invalidateQueries({ queryKey: ["boards", boardId] });
            break;
            

          case "comment_added":
            // Invalidate task query if viewing task detail
            if (message.data && typeof message.data === 'object' && 'taskId' in message.data) {
              queryClient.invalidateQueries({ queryKey: ["tasks", (message.data as { taskId: string }).taskId] });
            }
            break;

          case "user_joined":
          case "user_left":
            // Update online users (can be handled in UI state)
            console.log("[WS] User activity:", message.data);
            break;

          case "notification":
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            console.log("[WS] Notification:", message.data);
            break;

          default:
            console.log("[WS] Unknown message type:", message.type);
        }
      } catch (error) {
        console.error("[WS] Failed to parse message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("[WS] Error:", error);
    };

    ws.onclose = () => {
      console.log("[WS] Connection closed");
      handleReconnect();
    };
  }, [boardId, token, queryClient, handleReconnect]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: Partial<WebSocketMessage>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  return { sendMessage };
};