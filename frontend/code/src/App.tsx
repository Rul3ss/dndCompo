import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthContainer from './features/auth/components/AuthContainer'
import Dashboard from './features/dashboard/components/Dashboard'
import Navbar from './components/layout/Navbar'
import Hero from './features/landing/components/Hero'
import AuthLayout from './features/auth/components/AuthLayout'
import FeaturesSection from './features/landing/components/FeaturesSection'
import FooterCTA from './features/landing/components/FooterCTA'
import ProfileLayout from './features/profile/components/ProfileLayout'
import { API_BASE_URL } from './lib/config';
import './index.css'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('access_token');
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
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.error('Failed to logout on server', e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/');
    }
  };

  return (
    <div className="app-layout">
      {/* O Navbar será renderizado em rotas específicas dentro de suas views, 
          ou podemos fixá-lo aqui fora e esconder na rota de Auth */}
      
      <Routes>
        {/* Rota Raiz (Landing Page) */}
        <Route path="/" element={
          <div className="landing-page">
            <Navbar 
              onSignInSelect={() => navigate('/login')}
              onCreateAccountSelect={() => navigate('/register')}
            />
            <Hero onCreateClick={() => navigate('/register')} />
          </div>
        } />

        {/* Rota de Features */}
        <Route path="/features" element={
          <div className="features-page">
            <Navbar 
              onSignInSelect={() => navigate('/login')}
              onCreateAccountSelect={() => navigate('/register')}
            />
            <FeaturesSection />
            <FooterCTA />
          </div>
        } />

        {/* Rotas de Autenticação */}
        <Route path="/login" element={
          <AuthLayout>
            <AuthContainer 
              onLoginSuccess={() => navigate('/dashboard')}
              initialMode="login"
              onBackToHome={() => navigate('/')}
            />
          </AuthLayout>
        } />
        
        <Route path="/register" element={
          <AuthLayout>
            <AuthContainer 
              onLoginSuccess={() => navigate('/dashboard')}
              initialMode="register"
              onBackToHome={() => navigate('/')}
            />
          </AuthLayout>
        } />

        {/* Rota Protegida (Dashboard) */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard onLogout={handleLogout} />
          </ProtectedRoute>
        } />

        {/* Rota Protegida (Perfil) */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfileLayout />
          </ProtectedRoute>
        } />

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
  )
}

export default App
