interface DashboardProps {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  return (
    <div className="dashboard-overlay">
      <div className="dashboard-content">
        <h1 className="dashboard-title">D&D LORE</h1>
        <div className="construction-banner">
          <h2>🚧 EM CONSTRUÇÃO 🚧</h2>
          <p>O salão principal ainda está sendo forjado pelos anões.</p>
          <p>Volte em breve para iniciar sua aventura!</p>
        </div>
        <button className="btn-primary logout-btn" onClick={onLogout}>
          Sair da Taverna (Logout)
        </button>
      </div>
    </div>
  );
}
