import { useEffect, useState } from 'react';
import Navbar from '../../../components/layout/Navbar';
import CharacterCard from './CharacterCard';
import CreateCharacterModal from './CreateCharacterModal';
import { characterService, type Character } from '../../../lib/character.service';

interface DashboardProps {
  onLogout?: () => Promise<void>;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'characters' | 'campaigns'>('characters');

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const data = await characterService.getAllCharacters();
      setCharacters(data);
    } catch (e) {
      console.error('Error fetching characters:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await characterService.deleteCharacter(id);
      setCharacters(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      alert('Erro ao deletar personagem');
    }
  };

  return (
    <div className="dashboard-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
      <Navbar onLogout={onLogout} />
      
      <div className="dashboard-content" style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 className="dashboard-title" style={{ margin: 0, fontSize: '2.5rem', color: 'var(--brand-primary)', fontFamily: 'var(--font-serif)' }}>D&D LORE</h1>
        </header>

        <div className="dashboard-subheader">
          <div className="dashboard-tabs">
            <button 
              className={`tab-item ${activeTab === 'characters' ? 'active' : ''}`}
              onClick={() => setActiveTab('characters')}
            >
              Personagens
            </button>
            <button 
              className={`tab-item ${activeTab === 'campaigns' ? 'active' : ''}`}
              onClick={() => setActiveTab('campaigns')}
            >
              Campanhas
            </button>
          </div>

          {activeTab === 'characters' && (
            <button 
              className="btn-primary"
              style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#4caf50', cursor: 'pointer', border: 'none', color: '#fff', fontWeight: 'bold' }}
              onClick={() => setModalOpen(true)}
            >
              + Nova Ficha
            </button>
          )}
        </div>

        {activeTab === 'characters' ? (
          <>
            {loading ? (
              <p>Carregando as lendas...</p>
            ) : characters.length === 0 ? (
              <div className="empty-state" style={{ textAlign: 'center', padding: '64px', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #444' }}>
                <h2>Nenhuma ficha encontrada</h2>
                <p style={{ color: '#aaa', marginBottom: '24px' }}>Parece que você ainda não iniciou sua jornada. Crie um personagem para começar!</p>
                <button 
                  className="btn-primary"
                  style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#4caf50' }}
                  onClick={() => setModalOpen(true)}
                >
                  Forjar Novo Personagem
                </button>
              </div>
            ) : (
              <div className="characters-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '24px'
              }}>
                {characters.map(char => (
                  <CharacterCard key={char.id} character={char} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-state" style={{ textAlign: 'center', padding: '64px', backgroundColor: '#1e1e1e', borderRadius: '8px', border: '1px dashed #444' }}>
            <h2>Minhas Campanhas</h2>
            <p style={{ color: '#aaa', marginBottom: '24px' }}>Funcionalidade em desenvolvimento. Em breve você poderá gerenciar suas aventuras épicas!</p>
            <button 
              className="btn-primary"
              style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: '#666', cursor: 'not-allowed' }}
              disabled
            >
              Em breve
            </button>
          </div>
        )}
      </div>

      <CreateCharacterModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={fetchCharacters} 
      />
    </div>
  );
}
