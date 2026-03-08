import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { apiClient } from '../../lib/apiClient';

interface NavbarProps {
  onSignInSelect?: () => void;
  onCreateAccountSelect?: () => void;
}

export default function Navbar({ onSignInSelect, onCreateAccountSelect }: NavbarProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; avatarUrl?: string } | null>(null);

  const isAuthenticated = !!localStorage.getItem('access_token');

  useEffect(() => {
    if (isAuthenticated) {
      loadUserProfile();
    }
  }, [isAuthenticated]);

  // Escuta o evento global de avatar atualizado (disparado pelo SidebarAvatar)
  useEffect(() => {
    const handleAvatarUpdated = (e: Event) => {
      const { avatarUrl } = (e as CustomEvent).detail;
      setUserProfile(prev => prev ? { ...prev, avatarUrl } : null);
    };
    window.addEventListener('avatarUpdated', handleAvatarUpdated);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdated);
  }, []);

  // Escuta o evento global de perfil atualizado (disparado pelo ProfileForm)
  useEffect(() => {
    const handleProfileUpdated = (e: Event) => {
      const { name } = (e as CustomEvent).detail;
      setUserProfile(prev => prev ? { ...prev, name } : null);
    };
    window.addEventListener('profileUpdated', handleProfileUpdated);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdated);
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await apiClient('http://localhost:3001/user/me');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (e) {
      console.error('Failed to load user profile in Navbar', e);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient('http://localhost:3001/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout failed', e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="dnd-navbar">
        <div className="navbar-left">
          <div className="navbar-logo" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
            <img src={logoImg} alt="RP Hub Logo" className="navbar-logo-img" />
          </div>
          
          <ul className="nav-links hide-mobile">
            <li><Link to="/features">FEATURES</Link></li>
            <li><a href="#" className="disabled-link" onClick={(e) => e.preventDefault()}>LIBRARY <span className="soon-badge">em breve</span></a></li>
            <li><a href="#" className="disabled-link" onClick={(e) => e.preventDefault()}>COMMUNITY <span className="soon-badge">em breve</span></a></li>
            <li><a href="#" className="disabled-link" onClick={(e) => e.preventDefault()}>MARKETPLACE <span className="soon-badge">em breve</span></a></li>
          </ul>
        </div>

        <div className="navbar-right">
          <button className="icon-btn search-btn" aria-label="Search">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button 
                className="user-profile-trigger"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {userProfile?.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt="User Avatar" className="navbar-avatar" />
                ) : (
                  <div className="navbar-avatar-placeholder">
                    {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>
              
              {isDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <strong>{userProfile?.name || 'User'}</strong>
                  </div>
                  <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)}>Dashboard</Link>
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>Meu Perfil</Link>
                  <hr />
                  <button onClick={handleLogout} className="logout-btn">Sair</button>
                </div>
              )}
            </div>
          ) : (
            <>
              {onSignInSelect && (
                <button className="nav-signin-btn" onClick={onSignInSelect} aria-label="Sign In">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span className="hide-mobile">Sign in</span>
                </button>
              )}

              {onCreateAccountSelect && (
                <button className="nav-create-btn hide-mobile" onClick={onCreateAccountSelect}>
                  CREATE ACCOUNT
                </button>
              )}
            </>
          )}

          <button className="icon-btn mobile-menu-btn hide-desktop" aria-label="Menu" onClick={toggleMobileMenu}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div className={`mobile-sidebar-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}></div>
      <div className={`mobile-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <div className="navbar-logo" onClick={() => { toggleMobileMenu(); navigate(isAuthenticated ? '/dashboard' : '/'); }}>
            <img src={logoImg} alt="RP Hub Logo" className="navbar-logo-img" />
          </div>
          <button className="icon-btn close-sidebar-btn" onClick={toggleMobileMenu}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <ul className="mobile-nav-links">
          {isAuthenticated && (
            <>
              <li><Link to="/dashboard" onClick={toggleMobileMenu}>DASHBOARD</Link></li>
              <li><Link to="/profile" onClick={toggleMobileMenu}>MEU PERFIL</Link></li>
            </>
          )}
          <li><Link to="/features" onClick={toggleMobileMenu}>FEATURES <span className="mobile-chevron"></span></Link></li>
          <li><a href="#" className="disabled-link" onClick={(e) => e.preventDefault()}>LIBRARY <span className="soon-badge">em breve</span></a></li>
          <li><a href="#" className="disabled-link" onClick={(e) => e.preventDefault()}>COMMUNITY <span className="soon-badge">em breve</span></a></li>
          <li><a href="#" className="disabled-link" onClick={(e) => e.preventDefault()}>MARKETPLACE <span className="soon-badge">em breve</span></a></li>
        </ul>

        {!isAuthenticated && (
          <div className="mobile-sidebar-footer">
            {onCreateAccountSelect && (
              <button className="btn-secondary cta-mobile-btn" onClick={() => { toggleMobileMenu(); onCreateAccountSelect(); }}>
                CREATE AN ACCOUNT <span className="arrow">→</span>
              </button>
            )}
            {onSignInSelect && (
              <button className="btn-primary signin-mobile-btn" onClick={() => { toggleMobileMenu(); onSignInSelect(); }}>
                SIGN IN
              </button>
            )}
          </div>
        )}
        {isAuthenticated && (
          <div className="mobile-sidebar-footer">
            <button className="btn-secondary cta-mobile-btn" onClick={() => { toggleMobileMenu(); handleLogout(); }}>
              SAIR
            </button>
          </div>
        )}
      </div>
    </>
  );
}
