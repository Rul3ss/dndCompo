import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
interface HeroProps {
  onCreateClick: () => void;
}

export default function Hero({ onCreateClick }: HeroProps) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handleClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      onCreateClick();
    }
  };

  return (
    <div className="hero-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <AnimatedBackground />
      <div className="hero-overlay" style={{ zIndex: 1, position: 'absolute', inset: 0 }}></div>
      <div className="hero-content" style={{ zIndex: 2, position: 'relative' }}>
        <h1 className="hero-title">
          Your Ultimate<br />Tabletop Sanctuary
        </h1>

        <p className="hero-description" style={{ marginTop: '1.5rem' }}>
          Organize your universe in one place. Create interactive character sheets, archive world lore, manage NPCs, and free your table from paper clutter. An RPG ecosystem built by players, for players.
        </p>
        
        <button className="hero-cta-btn" onClick={handleClick}>
          {isAuthenticated ? 'IR PARA O DASHBOARD' : 'CREATE FREE ACCOUNT'} <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
