import { Routes, Route, Navigate } from "react-router-dom";
import { useIsAuthenticated } from "./store/authStore";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BoardsPage } from "./pages/BoardsPage";
import { BoardDetailPage } from "./pages/BoardDetailPage";

function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/boards" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/boards" /> : <RegisterPage />}
      />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/boards/:id" element={<BoardDetailPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/boards" />} />
      <Route path="*" element={<Navigate to="/boards" />} />
    </Routes>
  );
}

export default App;
