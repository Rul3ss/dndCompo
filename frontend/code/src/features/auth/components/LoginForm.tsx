import { useState } from 'react';
import { API_BASE_URL } from '../../../lib/config';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data.message)) {
          setError(data.message[0]);
        } else {
          setError(data.message || 'Erro ao fazer login.');
        }
        return;
      }

      // Login successful: Save Tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      
      onLoginSuccess();
      
    } catch (err) {
      setError('Não foi possível conectar ao servidor. O back-end está rodando?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="alert-message error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input 
          type="email" 
          id="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          placeholder="Enter your password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <a href="#" className="forgot-password">Forgot password?</a>
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Sign In'}
      </button>
    </form>
  );
}
