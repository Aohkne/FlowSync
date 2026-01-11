// User types
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

// Board types
export interface Board {
  id: string;
  title: string;
  description: string | null;
  ownerId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: User;
  members?: BoardMember[];
  columns?: Column[];
}

export interface BoardMember {
  id: string;
  boardId: string;
  userId: string;
  role: "owner" | "editor" | "viewer";
  joinedAt: string;
  user?: User;
}

// Column types
export interface Column {
  id: string;
  boardId: string;
  title: string;
  position: number;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

// Task types
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  position: number;
  priority: TaskPriority;
  assignedTo: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assignedUser?: User;
  creator?: User;
  comments?: Comment[];
}

// Comment types
export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

// Activity types
export interface Activity {
  id: string;
  boardId: string;
  userId: string;
  action: "created" | "updated" | "deleted" | "moved" | "commented";
  entityType: "board" | "column" | "task" | "comment";
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  user?: User;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
