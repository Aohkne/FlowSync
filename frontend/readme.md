# 🎨 FlowSync Frontend

> Real-time collaborative task board web application built with React, TypeScript, and modern state management

## 🛠️ Technology Stack

### Core

| Technology | Description |
|-----------|-------------|
| ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white) | Ultra-fast JavaScript runtime & package manager |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) | JavaScript library for building UI |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | Lightning-fast build tool with HMR |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | Type-safe JavaScript |

### State Management

| Technology | Description |
|-----------|-------------|
| ![Zustand](https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge&logo=react&logoColor=white) | Lightweight state management for global state |
| ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white) | Powerful data synchronization for server state |

### UI & Styling

| Technology | Description |
|-----------|-------------|
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Utility-first CSS framework |
| ![DnD Kit](https://img.shields.io/badge/DnD_Kit-000000?style=for-the-badge&logo=react&logoColor=white) | Modern drag & drop toolkit |
| ![Iconify](https://img.shields.io/badge/Iconify-1769AA?style=for-the-badge&logo=iconify&logoColor=white) | Universal icon framework |

### Forms & Validation

| Technology | Description |
|-----------|-------------|
| ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white) | Performant form validation |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white) | TypeScript-first schema validation |

### Routing & Utilities

| Technology | Description |
|-----------|-------------|
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | Declarative routing for React |
| ![date-fns](https://img.shields.io/badge/date--fns-770C56?style=for-the-badge&logo=date-fns&logoColor=white) | Modern JavaScript date utility library |

---

## 📂 Project Structure

```
📁 frontend/
│
├── 📁 public/                    # Static assets
│   ├── 📄 banner.png             # Project banner
│
├── 📁 src/                       # Source code
│   ├── 📁 api/                   # API service layer (Axios/Fetch)
│   │   ├── 📄 client.ts          # API client configuration
│   │   ├── 📄 auth.ts            # Authentication endpoints
│   │   ├── 📄 boards.ts          # Board management endpoints
│   │   ├── 📄 columns.ts         # Column operations
│   │   ├── 📄 tasks.ts           # Task CRUD endpoints
│   │   ├── 📄 comments.ts        # Comment endpoints
│   │   ├── 📄 members.ts         # Member management
│   │   ├── 📄 activities.ts      # Activity log endpoints
│   │   ├── 📄 notifications.ts   # Notification endpoints
│   │   └── 📄 upload.ts          # File upload endpoint
│   │
│   ├── 📁 components/            # Reusable UI components
│   │   ├── 📁 auth/              # Authentication components
│   │   │   ├── 📄 LoginForm.tsx
│   │   │   ├── 📄 RegisterForm.tsx
│   │   │   └── 📄 ProtectedRoute.tsx
│   │   │
│   │   ├── 📁 kanban/            # Kanban board components
│   │   │   ├── 📄 KanbanBoard.tsx
│   │   │   ├── 📄 KanbanColumn.tsx
│   │   │   ├── 📄 TaskCard.tsx
│   │   │   ├── 📄 AddTaskButton.tsx
│   │   │   └── 📄 ColumnHeader.tsx
│   │   │
│   │   ├── 📁 layout/            # Layout components
│   │   │   ├── 📄 Navbar.tsx
│   │   │   ├── 📄 Sidebar.tsx
│   │   │   └── 📄 Footer.tsx
│   │   │
│   │   ├── 📁 modals/            # Modal components
│   │   │   ├── 📄 Modal.tsx
│   │   │   ├── 📄 CreateBoardModal.tsx
│   │   │   ├── 📄 CreateTaskModal.tsx
│   │   │   ├── 📄 TaskDetailModal.tsx
│   │   │   ├── 📄 InviteMemberModal.tsx
│   │   │   └── 📄 ConfirmDialog.tsx
│   │   │
│   │   ├── 📁 ui/                # Reusable UI elements
│   │   │   ├── 📄 Button.tsx
│   │   │   ├── 📄 Input.tsx
│   │   │   ├── 📄 Select.tsx
│   │   │   ├── 📄 Avatar.tsx
│   │   │   ├── 📄 Badge.tsx
│   │   │   ├── 📄 Toast.tsx
│   │   │   └── 📄 Spinner.tsx
│   │   │
│   │   └── 📁 shared/            # Shared components
│   │       ├── 📄 EmptyState.tsx
│   │       ├── 📄 ErrorBoundary.tsx
│   │       └── 📄 LoadingSpinner.tsx
│   │
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── 📄 useAuth.ts         # Authentication hook
│   │   ├── 📄 useBoards.ts       # Board query hooks
│   │   ├── 📄 useTasks.ts        # Task mutation hooks
│   │   ├── 📄 useComments.ts     # Comment hooks
│   │   ├── 📄 useMembers.ts      # Member management hooks
│   │   ├── 📄 useNotifications.ts # Notification hooks
│   │   ├── 📄 useWebSocket.ts    # WebSocket connection hook
│   │   └── 📄 useDebounce.ts     # Debounce hook
│   │
│   ├── 📁 layouts/               # Page layout wrappers
│   │   ├── 📄 MainLayout.tsx     # Main app layout
│   │   ├── 📄 AuthLayout.tsx     # Auth pages layout
│   │   └── 📄 BoardLayout.tsx    # Board detail layout
│   │
│   ├── 📁 lib/                   # Core utilities & configs
│   │   ├── 📄 api.ts             # API client with interceptors
│   │   ├── 📄 queryClient.ts     # TanStack Query config
│   │   ├── 📄 websocket.ts       # WebSocket client
│   │   └── 📄 constants.ts       # App constants
│   │
│   ├── 📁 pages/                 # Page components
│   │   ├── 📄 HomePage.tsx       # Landing page
│   │   ├── 📄 LoginPage.tsx      # Login page
│   │   ├── 📄 RegisterPage.tsx   # Registration page
│   │   ├── 📄 BoardsPage.tsx     # Boards list page
│   │   ├── 📄 BoardDetailPage.tsx # Board detail with kanban
│   │   ├── 📄 ProfilePage.tsx    # User profile page
│   │   └── 📄 NotFoundPage.tsx   # 404 page
│   │
│   ├── 📁 store/                 # Zustand stores
│   │   ├── 📄 authStore.ts       # Auth state (user, token)
│   │   ├── 📄 uiStore.ts         # UI state (modals, sidebar)
│   │   ├── 📄 boardStore.ts      # Board state (active board)
│   │   └── 📄 notificationStore.ts # Notification state
│   │
│   ├── 📁 styles/                # Style files
│   │   └── 📄 globals.css        # Global styles
│   │
│   ├── 📁 types/                 # TypeScript type definitions
│   │   ├── 📄 index.ts           # All type definitions
│   │   ├── 📄 api.ts             # API types
│   │   ├── 📄 board.ts           # Board types
│   │   ├── 📄 task.ts            # Task types
│   │   └── 📄 user.ts            # User types
│   │
│   ├── 📁 utils/                 # Utility functions
│   │   ├── 📄 format.ts          # Date/string formatting
│   │   ├── 📄 validation.ts      # Validation helpers
│   │   └── 📄 helpers.ts         # General helpers
│   │
│   ├── 📄 App.tsx                # Root component with routes
│   ├── 📄 main.tsx               # Application entry point
│   ├── 📄 App.css                # App-specific styles
│   ├── 📄 index.css              # Global styles with Tailwind
│   └── 📄 vite-env.d.ts          # Vite type declarations
│
├── 📄 Dockerfile                 # Frontend Docker configuration
├── 📄 .dockerignore              # Docker ignore patterns
├── 📄 .env                       # Environment variables (not in Git)
├── 📄 .env.example               # Environment template
├── 📄 .gitignore                 # Git ignore rules
├── 📄 .eslintrc.cjs              # ESLint configuration
├── 📄 .prettierrc                # Prettier configuration
├── 📄 index.html                 # HTML entry point
├── 📄 package.json               # Project dependencies & scripts
├── 📄 bun.lockb                  # Bun lock file
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 tsconfig.app.json          # TypeScript config for app
├── 📄 tsconfig.json              # TypeScript base config
├── 📄 tsconfig.node.json         # TypeScript config for Node
├── 📄 vite.config.ts             # Vite configuration
└── 📄 README.md                  # This file
```

---

## ⚙️ Environment Variables

Create a `.env` file in the frontend root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# WebSocket URL
VITE_WS_URL=ws://localhost:3000
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.1.0
- Backend API running on `http://localhost:3000`

### Installation

#### 1. Navigate to frontend directory

```bash
cd frontend
```

#### 2. Install dependencies

```bash
bun install
```

#### 3. Setup environment variables

```bash
cp .env.example .env
# Edit .env if backend runs on different port
```

#### 4. Start development server

```bash
bun run dev
```

The app will be available at **http://localhost:5173**

### Features Available:

- Hot Module Replacement (HMR)
- Fast refresh for React components
- TypeScript type checking
- Tailwind CSS with JIT compilation
- ESLint & Prettier formatting

---

## 📜 Available Scripts

```bash
# Development
bun run dev          # Start development server with HMR
bun run dev --host   # Expose dev server to network

# Production
bun run build        # Build for production
bun run preview      # Preview production build locally

# Code Quality
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint errors
bun run format       # Format code with Prettier
bun run type-check   # Run TypeScript type checking

# Testing (if configured)
bun test             # Run tests
bun test:watch       # Run tests in watch mode
bun test:coverage    # Run tests with coverage
```

---

## 🎨 Features

### Authentication

- Login / Register with email & password
- JWT token management
- Protected routes with redirect
- Auto-logout on token expiration
- Remember me functionality

### Board Management

- Create, read, update, delete boards
- Public / Private board visibility
- Board member management
- Role-based permissions (Owner/Editor/Viewer)
- Board search and filtering

### Kanban Features

- Drag & drop tasks between columns
- Drag & drop column reordering
- Smooth animations with DnD Kit
- Optimistic UI updates
- Visual feedback during dragging

### Task Management

- Create, edit, delete tasks
- Task details modal
- Priority badges (Low/Medium/High)
- Task assignment to members
- Due date tracking (future feature)
- Task descriptions with rich text

### Real-time Collaboration

- Live task updates via WebSocket
- Online users indicator
- Real-time comments
- Instant notifications
- Automatic reconnection

### Comments & Mentions

- Add comments to tasks
- @mentions with autocomplete
- Edit/delete own comments
- Real-time comment updates
- Comment timestamps

### Search & Filters

- Full-text search across tasks
- Filter by priority
- Filter by assigned user
- Filter by column
- Combined filters
- Clear filters option

### Notifications

- Task assignment notifications
- Mention notifications
- Real-time notification badge
- Mark as read/unread
- Notification center

### UI/UX

- Responsive design (mobile, tablet, desktop)
- Dark mode support (future)
- Toast notifications
- Loading states
- Error boundaries
- Empty states
- Keyboard shortcuts
- Smooth transitions

---

## 🏗️ Architecture & Best Practices

### State Management Decision Tree

```
Is Data Fetched from an API?
│
├─ YES → Use TanStack Query
│        (Server State)
│        - Caching
│        - Auto-refetch
│        - Optimistic updates
│
└─ NO → Is State Shared Between Components?
        │
        ├─ YES → Use Zustand
        │        (Global Client State)
        │        - Auth state
        │        - UI state
        │
        └─ NO → Use useState
                 (Local Component State)
                 - Form inputs
                 - Modal state
```

> **Rule of Thumb**: Use local state (`useState`) until you **need** global state. Avoid over-engineering!

---

### Zustand Guidelines

#### DO: Export Custom Hooks

```typescript
// authStore.ts
const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    })),
    { name: 'auth-storage' }
  )
);

// Export selectors as hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
```

#### DO: Use Atomic Selectors

```typescript
// Good - Only re-renders when user changes
const user = useUser();
const logout = useLogout();

// Bad - Re-renders on any auth state change
const { user, token, logout } = useAuthStore();
```

#### DO: Separate State from Actions

```typescript
const useAuthStore = create<AuthStore>()(
  immer((set) => ({
    // State
    user: null,
    token: null,
    
    // Actions
    login: (user, token) =>
      set((state) => {
        state.user = user;
        state.token = token;
      }),
    
    logout: () =>
      set((state) => {
        state.user = null;
        state.token = null;
      }),
  }))
);
```

#### DO: Model Actions as Events

```typescript
// Bad - Verb-based
setIsLoggedIn(true);
updateUserProfile(data);

// Good - Event-based
login(user, token);
profileUpdated(data);
logout();
```

#### DO: Use Immer Middleware

```typescript
import { immer } from 'zustand/middleware/immer';

const useStore = create<Store>()(
  immer((set) => ({
    todos: [],
    
    // With immer - mutate syntax
    addTodo: (todo) =>
      set((state) => {
        state.todos.push(todo);
      }),
    
    // Without immer - immutable syntax
    // addTodo: (todo) =>
    //   set((state) => ({
    //     todos: [...state.todos, todo],
    //   })),
  }))
);
```

**Benefits:**
- Simpler syntax (mutate-like)
- Internally immutable (safe)
- Perfect for nested state

#### DO: Use Persist Middleware

```typescript
import { persist } from 'zustand/middleware';

const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({
      // ... your state
    })),
    { 
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({ token: state.token }), // Only persist token
    }
  )
);
```

**Benefits:**
- Auto-save to localStorage
- Persist user session across reloads

---

### TanStack Query Best Practices

#### Default Configuration

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
      retry: 1, // Retry once on failure
      refetchOnWindowFocus: false, // Disabled for better UX
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});
```

#### Query Keys Pattern

```typescript
// constants.ts
export const QUERY_KEYS = {
  boards: {
    all: ['boards'] as const,
    detail: (id: string) => ['boards', id] as const,
    tasks: (boardId: string) => ['boards', boardId, 'tasks'] as const,
  },
  tasks: {
    all: ['tasks'] as const,
    detail: (id: string) => ['tasks', id] as const,
    comments: (taskId: string) => ['tasks', taskId, 'comments'] as const,
  },
} as const;
```

#### Custom Hooks Pattern

```typescript
// hooks/useBoards.ts
export function useBoards() {
  return useQuery({
    queryKey: QUERY_KEYS.boards.all,
    queryFn: () => boardsApi.getAll(),
  });
}

export function useBoard(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.boards.detail(id),
    queryFn: () => boardsApi.getById(id),
    enabled: !!id, // Only fetch if ID exists
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBoardInput) => boardsApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.boards.all });
    },
  });
}
```

#### Optimistic Updates

```typescript
export function useMoveTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: MoveTaskInput) => tasksApi.move(data),
    
    // Optimistic update
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tasks.all });
      
      const previousTasks = queryClient.getQueryData(QUERY_KEYS.tasks.all);
      
      queryClient.setQueryData(QUERY_KEYS.tasks.all, (old: Task[]) => {
        return old.map((task) =>
          task.id === data.taskId
            ? { ...task, columnId: data.columnId, position: data.position }
            : task
        );
      });
      
      return { previousTasks };
    },
    
    // Rollback on error
    onError: (err, data, context) => {
      queryClient.setQueryData(QUERY_KEYS.tasks.all, context?.previousTasks);
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.all });
    },
  });
}
```

---

## 🎯 Component Examples

### Protected Route

```typescript
// components/auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useUser } from '@/store/authStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

### Task Card with Drag & Drop

```typescript
// components/kanban/TaskCard.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <h3 className="font-medium">{task.title}</h3>
      {task.description && (
        <p className="text-sm text-gray-600 mt-2">{task.description}</p>
      )}
      <div className="flex items-center gap-2 mt-3">
        {task.priority && (
          <Badge priority={task.priority} />
        )}
        {task.assignedTo && (
          <Avatar user={task.assignedTo} size="sm" />
        )}
      </div>
    </div>
  );
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow code style guidelines
4. Write meaningful commit messages
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint & Prettier rules
- Use functional components with hooks
- Prefer named exports over default exports
- Write self-documenting code

---

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [Vite](https://vitejs.dev/) - Build tool
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [TanStack Query](https://tanstack.com/query) - Server state
- [DnD Kit](https://dndkit.com/) - Drag and drop
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Schema validation

---

## 📞 Support

- **Documentation**: [../SUPPORT.md](../SUPPORT.md)
- **Issues**: [GitHub Issues](https://github.com/Aohkne/FlowSync/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Aohkne/FlowSync/discussions)

---

**Happy coding! 🎨**