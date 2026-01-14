import type { users } from "../db/schema";

// Extracted user info (without password)
export interface SafeUser {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: Date;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
}

// Auth responses
export interface AuthResponse {
  message: string;
  user: SafeUser;
  token: string;
}

// Request context with authenticated user
export interface AuthContext {
  user: SafeUser;
}

// Error response
export interface ErrorResponse {
  error: string;
  message?: string;
}
