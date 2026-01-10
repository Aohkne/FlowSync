├── Runtime: Bun 1.1+
├── Framework: React 18 + Vite 5
├── Language: TypeScript
├── State Management:
│ ├── Zustand (global state: user, boards, UI)
│ └── TanStack Query v5 (server state, caching)
├── Styling:
│ ├── Tailwind CSS 3.4
├── DnD: @dnd-kit/core + @dnd-kit/sortable
├── Forms: React Hook Form + Zod
├── Realtime: Supabase Realtime Client
├── HTTP Client: TanStack Query với fetch
└── Icons: Iconnify

# 🙏 Acknowledgments

## zustand

- Only Export Custom Hooks
- Use Atomic Stable Selectors
- Seperate Actions from State - chia action khỏi state
- Model Actions as Events
- Utilise Middleware (immer)
  - Cho phép mutate syntax
  - Bên trong vẫn immutable

```javascript
// Bình thường:
set((state) => ({
  todos: [...state.todos, newTodo],
}));

// Với immer
set((state) => {
  state.todos.push(newTodo);
});
```

**Dùng khi:**

- State phức tạp
- Nested sâu

## persit:

- lưu store vào localStorage

# Server State Management

### Type of state

- table
  Server State:

* What: Data from API
* Example: user list, user detail from API
* Lib: `tanstack-query`

### Client State:

- What: Data from Client side
- Example: active checkbox, theme, language
- Lib: `useState` for local, `zustand` for global

> i(icon) NOTES
> For `client state`, use local state until you need `global` state
> The more global states in ur app, the more complex ur app gets

- Flow chart
  yes -> Use react-query  
  no -> Is Data Fetched from an API| yes -> Use zustand
  no-> is state shared between components
  no -> Use useState

### Important defaults

A summary from https://tanstack.com/query/latest/docs/react/guides/important-defaults

Properties Default Desc

- staleTime 0 (ms) cache data is considered as stale by default
- gcTime 5x60x1000ms (5m) the time when inactive queries are garbage collected
- retry / retryDelay 3 / 1s-2s-4s failed queries will auto retried
- refetchOnMount true refetch if the new instance of query mount
- refetchOnWindowFocus true refetch if the window is refocused
- refetchOnReconnect true refetch if the network is reconnected
- refetchInterval N/A optional, trigger refetch until a condition is met
