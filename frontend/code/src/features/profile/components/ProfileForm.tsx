import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/apiClient';

interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Estados locais para formulário
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiClient('http://localhost:3001/user/me');
      
      if (!response.ok) {
        throw new Error('Falha ao carregar o perfil');
      }

      const data = await response.json();
      setProfile(data);
      setName(data.name || '');
      setBio(data.bio || '');
      setPhone(data.phone || '');
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const token = localStorage.getItem('access_token');
    try {
      const payload: any = { name, bio, phone };

      const response = await apiClient('http://localhost:3001/user/me', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (data && data.message) {
          throw new Error(Array.isArray(data.message) ? data.message[0] : data.message);
        }
        throw new Error('Falha ao atualizar o perfil');
      }
      setProfile(data);
      setMessage('Perfil atualizado com sucesso!');
      // Notifica outros componentes (ex: Navbar) que o perfil mudou
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { name: data.name } }));
      
      // Limpa mensagem de sucesso após 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar dados');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Carregando dados do perfil...</div>;
  }

  return (
    <div className="profile-form-container">
      <div className="profile-header">
        <div>
          <h2>Meu Perfil</h2>
          <p className="text-muted">Gerencie suas informações e conectividade.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="profile-form">
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            value={profile?.email || ''} 
            disabled 
            className="input-disabled"
            title="O email não pode ser alterado por aqui"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Nome Completo</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            maxLength={80}
            placeholder="Seu nome completo"
          />
        </div>

        {/* URL Input removed - replaced by clickable avatar */}

        <div className="form-group">
          <label htmlFor="phone">Telefone</label>
          <input 
            type="tel" 
            id="phone" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            placeholder="+55 11 99999-9999"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Biografia</label>
          <textarea 
            id="bio" 
            value={bio} 
            onChange={e => setBio(e.target.value)} 
            placeholder="Conte um pouco sobre você..."
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
