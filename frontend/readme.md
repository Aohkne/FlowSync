# 🎨 FlowSync Frontend

> Real-time collaborative task board web application built with React, TypeScript, and modern state management

## 🛠️ Technology Stack

### Core

| Technology                                                                                                        | Description                                     |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| ![Bun](https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white)                      | Ultra-fast JavaScript runtime & package manager |
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)               | JavaScript library for building UI              |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)                   | Lightning-fast build tool                       |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) | Type-safe JavaScript                            |

### State Management

| Technology                                                                                                                 | Description                                    |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| ![Zustand](https://img.shields.io/badge/Zustand-FF6B6B?style=for-the-badge&logo=react&logoColor=white)                     | Lightweight state management for global state  |
| ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white) | Powerful data synchronization for server state |

### UI & Styling

| Technology                                                                                                              | Description                 |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) | Utility-first CSS framework |
| ![DnD Kit](https://img.shields.io/badge/DnD_Kit-000000?style=for-the-badge&logo=react&logoColor=white)                  | Modern drag & drop toolkit  |
| ![Iconify](https://img.shields.io/badge/Iconify-1769AA?style=for-the-badge&logo=iconify&logoColor=white)                | Universal icon framework    |

### Forms & Validation

| Technology                                                                                                                     | Description                        |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white) | Performant form validation         |
| ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white)                                   | TypeScript-first schema validation |

### Routing & Utilities

| Technology                                                                                                              | Description                            |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) | Declarative routing for React          |
| ![date-fns](https://img.shields.io/badge/date--fns-770C56?style=for-the-badge&logo=date-fns&logoColor=white)            | Modern JavaScript date utility library |

---

## 📂 Project Structure

```
📁 frontend/
│
├── 📁 node_modules/              # Installed packages
│
├── 📁 public/                    # Static assets (not bundled)
│   └── 📄 favicon.ico
│
├── 📁 src/                       # Source code
│   ├── 📁 api/                   # API service layer
│   │   ├── 📄 auth.ts            # Authentication endpoints
│   │   ├── 📄 boards.ts          # Board management endpoints
│   │   ├── 📄 tasks.ts           # Task CRUD endpoints
│   │   ├── 📄 comments.ts        # Comment endpoints
│   │   └── 📄 members.ts         # Member management endpoints
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
│   │   │   └── 📄 TaskCard.tsx
│   │   │
│   │   ├── 📁 layout/            # Layout components
│   │   │   └── 📄 Navbar.tsx
│   │   │
│   │   └── 📁 modals/            # Modal components
│   │       ├── 📄 Modal.tsx
│   │       ├── 📄 CreateBoardModal.tsx
│   │       └── 📄 CreateTaskModal.tsx
│   │
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── 📄 useBoards.ts       # Board query hooks
│   │   └── 📄 useTasks.ts        # Task mutation hooks
│   │
│   ├── 📁 layouts/               # Page layout wrappers
│   │   └── 📄 MainLayout.tsx
│   │
│   ├── 📁 lib/                   # Core utilities & configs
│   │   └── 📄 api.ts             # API client with auth
│   │
│   ├── 📁 pages/                 # Page components
│   │   ├── 📄 LoginPage.tsx
│   │   ├── 📄 RegisterPage.tsx
│   │   ├── 📄 BoardsPage.tsx
│   │   └── 📄 BoardDetailPage.tsx
│   │
│   ├── 📁 store/                 # Zustand stores
│   │   ├── 📄 authStore.ts       # Auth state (user, token)
│   │   └── 📄 uiStore.ts         # UI state (modals, sidebar)
│   │
│   ├── 📁 types/                 # TypeScript type definitions
│   │   └── 📄 index.ts           # All type definitions
│   │
│   ├── 📄 App.tsx                # Root component with routes
│   ├── 📄 main.tsx               # Entry point
│   ├── 📄 App.css                # App-specific styles
│   ├── 📄 index.css              # Global styles with Tailwind
│   └── 📄 vite-env.d.ts          # Vite type declarations
│
├── 📄 .env                       # Environment variables (not in Git)
├── 📄 .env.example               # Environment template
├── 📄 .gitignore                 # Git ignore rules
├── 📄 bun.lockb                  # Bun lock file
├── 📄 eslint.config.js           # ESLint configuration
├── 📄 index.html                 # HTML entry point
├── 📄 package.json               # Project dependencies & scripts
├── 📄 postcss.config.js          # PostCSS configuration
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 tsconfig.app.json          # TypeScript config for app
├── 📄 tsconfig.json              # TypeScript base config
├── 📄 tsconfig.node.json         # TypeScript config for Node
├── 📄 vite.config.ts             # Vite configuration
└── 📄 README.md                  # Project documentation
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.1.0
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:5173`

---

## 📜 Available Scripts

```bash
bun run dev          # Start development server with hot reload
bun run build        # Build for production
bun run preview      # Preview production build
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript type checking
```

---

## 🙏 Best Practices & Patterns

### Zustand Guidelines

#### Only Export Custom Hooks

```typescript
// Bad
export const useAuthStore = create(...)

// Good
const useAuthStore = create(...)
export const useUser = () => useAuthStore(state => state.user)
export const useToken = () => useAuthStore(state => state.token)
```

#### Use Atomic Stable Selectors

```typescript
// Bad - Re-renders on any auth change
const { user, token, logout } = useAuthStore();

// Good - Only re-renders when user changes
const user = useUser();
const logout = useAuthStore((state) => state.logout);
```

#### Separate Actions from State

```typescript
const useAuthStore = create<AuthStore>()(
  immer((set) => ({
    // State
    user: null,
    token: null,

    // Actions
    setAuth: (user, token) =>
      set((state) => {
        state.user = user;
        state.token = token;
      }),
  }))
);
```

#### Model Actions as Events

```typescript
// Bad - Verb-based
setIsLoggedIn(true);

// Good - Event-based
login(user, token);
logout();
```

#### Utilize Middleware (immer)

**Benefits:**

- Allows mutating syntax (easier to read)
- Internally still immutable (safe)
- Perfect for nested state

```javascript
// Without immer:
set((state) => ({
  todos: [...state.todos, newTodo],
}));

// With immer:
set((state) => {
  state.todos.push(newTodo);
});
```

**Use when:**

- State is complex
- Deeply nested objects
- Multiple updates in one action

#### Persist Middleware

```typescript
export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set) => ({...})),
    { name: 'auth-storage' }
  )
)
```

**Benefits:**

- Auto-save to localStorage
- Persist user session across page reloads

---

### TanStack Query Configuration

#### Default Settings

| Property               | Default   | Description                                       |
| ---------------------- | --------- | ------------------------------------------------- |
| `staleTime`            | 0 ms      | Cache data is stale immediately                   |
| `gcTime`               | 5 minutes | Time until inactive queries are garbage collected |
| `retry`                | 3 times   | Failed queries auto-retry (1s → 2s → 4s delay)    |
| `refetchOnMount`       | true      | Refetch when component mounts                     |
| `refetchOnWindowFocus` | true      | Refetch when window regains focus                 |
| `refetchOnReconnect`   | true      | Refetch when network reconnects                   |
| `refetchInterval`      | N/A       | Optional polling interval                         |

#### Our Configuration

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Retry once
      refetchOnWindowFocus: false, // Disabled for better UX
    },
  },
});
```

---

### State Management Decision Tree

```
Is Data Fetched from an API?
│
├─ YES → Use TanStack Query
│        (Server State)
│
└─ NO → Is State Shared Between Components?
        │
        ├─ YES → Use Zustand
        │        (Global Client State)
        │
        └─ NO → Use useState
                 (Local Component State)
```

> **Note:** For client state, use local state (`useState`) until you **need** global state. The more global states in your app, the more complex it becomes.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 🙏 Acknowledgments

- [Zustand](https://github.com/pmndrs/zustand) - Bear necessities for state management
- [TanStack Query](https://tanstack.com/query) - Powerful async state management
- [DnD Kit](https://dndkit.com/) - Modern drag and drop toolkit
- [React Hook Form](https://react-hook-form.com/) - Performant forms
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
