import { useNavigate } from 'react-router-dom';

export default function FooterCTA() {
  const navigate = useNavigate();

  return (
    <section className="footer-cta-section">
      <div className="footer-cta-container">
        <h2>Ready to roll the dice?</h2>
        <p>Join fellow adventurers and bring your campaign to the digital world.</p>
        <button 
          className="btn-primary cta-large-btn" 
          onClick={() => navigate('/register')}
        >
          Start Your Adventure
        </button>
      </div>
    </section>
  );
}
