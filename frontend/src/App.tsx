import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/supabase";
import { Icon } from "@iconify/react";
import "./App.css";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 p-8">
        <header className="flex items-center gap-2 mb-6">
          <Icon icon="logos:bun" width="32" />
          <h1 className="text-2xl font-bold">Bun + Elysia + React</h1>
        </header>

        {/* Render Kanban Board hoặc Router ở đây */}
        <main>
          <p className="text-gray-600">Sẵn sàng để build tính năng DnD!</p>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
