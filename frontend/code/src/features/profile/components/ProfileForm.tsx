import { useState, useEffect } from 'react';
import { apiClient } from '../../../lib/apiClient';
import { API_BASE_URL } from '../../../lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Phone, BookOpen, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

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
      const response = await apiClient(`${API_BASE_URL}/user/me`);
      
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

      const response = await apiClient(`${API_BASE_URL}/user/me`, {
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
      setMessage('Sua lenda foi atualizada com sucesso!');
      
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { name: data.name } }));
      
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar suas alterações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-[#c9a84c] animate-spin" />
        <p className="font-cinzel text-sm text-[#a89070] tracking-widest uppercase">Invocando dados do reino...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 pb-6 border-b border-[#c9a84c]/10">
        <h2 className="font-cinzel text-2xl font-bold text-[#e8d5b0] mb-1">Identidade do Aventureiro</h2>
        <p className="text-[#8a8d98] text-sm">Estas informações definem como você é visto pelos outros portadores de crônicas.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </motion.div>
          )}
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email (Disabled) */}
          <div className="space-y-2">
            <label className="text-[#a89070] text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 opacity-70" /> Email do Reino
            </label>
            <div className="relative group">
              <input 
                type="email" 
                value={profile?.email || ''} 
                disabled 
                className="w-full bg-[#0c0a08]/60 border border-[#c9a84c]/10 rounded-xl px-4 py-3 text-[#6b5a3e] text-sm cursor-not-allowed italic"
                title="O email é o seu selo eterno e não pode ser alterado."
              />
              <div className="absolute inset-0 bg-transparent" title="O email é o seu selo eterno e não pode ser alterado." />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-[#a89070] text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 opacity-70" /> Nome de Aventureiro
            </label>
            <input 
              type="text" 
              id="name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              maxLength={80}
              placeholder="Ex: Lucian de Arathia"
              className="w-full bg-[#1a1510] border border-[#3d2e1a] focus:border-[#c9a84c] rounded-xl px-4 py-3 text-[#e8d5b0] text-sm outline-none transition-all placeholder:text-[#4a3820] focus:shadow-[0_0_15px_rgba(201,168,76,0.1)]"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-[#a89070] text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 opacity-70" /> Mensageiro Arcano (Telefone)
            </label>
            <input 
              type="tel" 
              id="phone" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="+55 11 99999-9999"
              className="w-full bg-[#1a1510] border border-[#3d2e1a] focus:border-[#c9a84c] rounded-xl px-4 py-3 text-[#e8d5b0] text-sm outline-none transition-all placeholder:text-[#4a3820] focus:shadow-[0_0_15px_rgba(201,168,76,0.1)]"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label htmlFor="bio" className="text-[#a89070] text-sm font-medium flex items-center gap-2">
            <BookOpen className="w-4 h-4 opacity-70" /> Sua Crônica (Biografia)
          </label>
          <textarea 
            id="bio" 
            value={bio} 
            onChange={e => setBio(e.target.value)} 
            placeholder="Conte-nos sua história, suas conquistas e por que as canções falarão de você..."
            rows={5}
            className="w-full bg-[#1a1510] border border-[#3d2e1a] focus:border-[#c9a84c] rounded-xl px-4 py-3 text-[#e8d5b0] text-sm outline-none transition-all placeholder:text-[#4a3820] focus:shadow-[0_0_15px_rgba(201,168,76,0.1)] resize-none"
          />
        </div>

        <div className="flex justify-end pt-4">
          <motion.button 
            type="submit" 
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-8 py-4 rounded-xl font-cinzel font-bold text-sm tracking-widest transition-all shadow-[0_5px_15px_rgba(0,0,0,0.3)] ${
              saving 
                ? 'bg-[#3d2e1a] text-[#6b5a3e] cursor-wait' 
                : 'bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] hover:shadow-[0_0_25px_rgba(201,168,76,0.35)]'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Selando Alterações...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                GRAVAR EM SUA HISTÓRIA
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
