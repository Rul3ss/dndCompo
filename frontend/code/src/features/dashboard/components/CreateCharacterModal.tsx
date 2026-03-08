import { useState } from 'react';
import { characterService } from '../../../lib/character.service';

interface CreateCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCharacterModal({ isOpen, onClose, onSuccess }: CreateCharacterModalProps) {
  const [name, setName] = useState('');
  const [system, setSystem] = useState('DND_5E');
  const [backstory, setBackstory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('O nome do personagem é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      await characterService.createCharacter({
        name,
        system,
        backstory,
      });
      onSuccess(); // Restaura o Dashboard e fecha
      onClose();   // Fecha o modal
    } catch (err: any) {
      setError(err.message || 'Erro ao criar a ficha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: '#1e1e1e', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '400px'
      }}>
        <h2>Nova Ficha de Personagem</h2>
        
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label>Nome do Personagem</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Ex: Gandalf"
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff' }}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label>Sistema de RPG</label>
            <select 
              value={system} 
              onChange={e => setSystem(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff' }}
            >
              <option value="DND_5E">D&D 5e</option>
            </select>
          </div>

          <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label>Histórico (Backstory)</label>
            <textarea 
              value={backstory} 
              onChange={e => setBackstory(e.target.value)} 
              placeholder="Um pouco sobre seu passado..."
              rows={4}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#2a2a2a', color: '#fff' }}
            />
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#333', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{ padding: '8px 16px', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Criando...' : 'Criar Ficha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
