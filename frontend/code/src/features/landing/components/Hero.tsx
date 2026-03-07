import bgImage from '../../../assets/hero-cyberpunk.png';

interface HeroProps {
  onCreateClick: () => void;
}

export default function Hero({ onCreateClick }: HeroProps) {
  return (
    <div className="hero-section">
      <div 
        className="hero-bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          Your Ultimate<br />Tabletop Sanctuary
        </h1>

        <p className="hero-description" style={{ marginTop: '1.5rem' }}>
          Organize your universe in one place. Create interactive character sheets, archive world lore, manage NPCs, and free your table from paper clutter. An RPG ecosystem built by players, for players.
        </p>
        
        <button className="hero-cta-btn" onClick={onCreateClick}>
          CREATE FREE ACCOUNT <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}
