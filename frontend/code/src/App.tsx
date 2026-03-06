import { useState, useEffect } from 'react'
import AuthContainer from './features/auth/components/AuthContainer'
import Dashboard from './features/dashboard/components/Dashboard'
import './index.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user has an access token in localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch('http://localhost:3001/auth/logout', {
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
      setIsAuthenticated(false);
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <AuthContainer onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  )
}

export default App
