import { useState } from 'react';

interface RegisterFormProps {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle NestJS Validation Errors array or simple message
        if (Array.isArray(data.message)) {
          setError(data.message[0]);
        } else {
          setError(data.message || 'Erro ao criar conta.');
        }
        return;
      }

      setSuccess('Aventureiro criado com sucesso! Redirecionando para Login...');
      
      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Auto-redirect to Login after 2 seconds to let user read the message
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (err) {
      setError('Não foi possível conectar ao servidor. O back-end está rodando?');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      
      {error && <div className="alert-message error">{error}</div>}
      {success && <div className="alert-message success">{success}</div>}

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input 
          type="text" 
          id="username" 
          placeholder="Choose a username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-email">Email Address</label>
        <input 
          type="email" 
          id="reg-email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="reg-password">Password</label>
        <input 
          type="password" 
          id="reg-password" 
          placeholder="Create a strong password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input 
          type="password" 
          id="confirm-password" 
          placeholder="Repeat your password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required 
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  );
}
