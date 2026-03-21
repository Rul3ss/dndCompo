import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AuthContainer from "./features/auth/components/AuthContainer";
import Dashboard from "./features/dashboard/components/Dashboard";
import CharacterSheet from "./features/dashboard/character";
import AuthLayout from "./features/auth/components/AuthLayout";
import ProfileLayout from "./features/profile/components/ProfileLayout";
import { API_BASE_URL } from "./lib/config";
import "./index.css";
import LandingPage from "./features/landing/pages/LandingPage";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Main Router wrapper for the app content
function AppContent() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (e) {
      console.error("Failed to logout on server", e);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/");
    }
  };

  return (
    <div className="app-layout">
      <Routes>
        {/* Rota Raiz (Landing Page Centralizada) */}
        <Route path="/" element={<LandingPage />} />

        {/* Rota de Features (Agora parte da Landing Page unificada) */}
        <Route path="/features" element={<LandingPage />} />

        {/* Rotas de Autenticação */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <AuthContainer
                onLoginSuccess={() => navigate("/dashboard")}
                initialMode="login"
                onBackToHome={() => navigate("/")}
              />
            </AuthLayout>
          }
        />

        <Route
          path="/register"
          element={
            <AuthLayout>
              <AuthContainer
                onLoginSuccess={() => navigate("/dashboard")}
                initialMode="register"
                onBackToHome={() => navigate("/")}
              />
            </AuthLayout>
          }
        />

        {/* Rota Protegida (Dashboard) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Rotas Protegidas (Character Sheet) */}
        <Route
          path="/dashboard/character/new"
          element={
            <ProtectedRoute>
              <CharacterSheet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/character/:id/edit"
          element={
            <ProtectedRoute>
              <CharacterSheet />
            </ProtectedRoute>
          }
        />

        {/* Rota Protegida (Perfil) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfileLayout />
            </ProtectedRoute>
          }
        />

        {/* Fallback (404 Not Found) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

// Raiz do App que engloba o contexto do Router
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
