import type { Character } from '../../../lib/character.service';

interface CharacterCardProps {
  character: Character;
  onDelete: (id: string) => void;
}

export default function CharacterCard({ character, onDelete }: CharacterCardProps) {
  return (
    <div className="character-card" style={{
      border: '1px solid #333', 
      borderRadius: '8px', 
      padding: '16px', 
      backgroundColor: '#1e1e1e',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {character.imageUrl ? (
        <img 
          src={character.imageUrl} 
          alt={character.name} 
          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
        />
      ) : (
        <div style={{ width: '100%', height: '150px', backgroundColor: '#333', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span>Sem Imagem</span>
        </div>
      )}
      
      <h3 style={{ margin: 0 }}>{character.name}</h3>
      <p style={{ margin: 0, fontSize: '0.9em', color: '#aaa' }}>Sistema: {character.system}</p>
      
      {character.backstory && (
        <p style={{ margin: 0, fontSize: '0.8em', color: '#ccc', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          "{character.backstory}"
        </p>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button 
          className="btn-primary" 
          style={{ padding: '4px 8px', fontSize: '0.8em' }}
          onClick={() => alert('Visualizar ficha detalhada em breve!')}
        >
          Abrir Ficha
        </button>
        <button 
          className="btn-primary" 
          style={{ padding: '4px 8px', fontSize: '0.8em', backgroundColor: '#8a2be2' }}
          onClick={() => {
            if(window.confirm('Tem certeza que deseja deletar este personagem?')) {
              onDelete(character.id);
            }
          }}
        >
          Deletar
        </button>
      </div>
    </div>
  );
}
