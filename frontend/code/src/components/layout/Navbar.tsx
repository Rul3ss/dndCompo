import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Menu, X, Search, User, LogOut, LayoutDashboard, UserCircle, Globe } from "lucide-react";
import { apiClient } from "../../lib/apiClient";
import { API_BASE_URL } from "../../lib/config";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  onSignInSelect?: () => void;
  onCreateAccountSelect?: () => void;
  onLogout?: () => void;
}

export default function Navbar({
  onSignInSelect,
  onCreateAccountSelect,
  onLogout,
}: NavbarProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    avatarUrl?: string;
  } | null>(null);

  const { i18n } = useTranslation();

  const handleLanguageToggle = () => {
    const newLang = i18n.language.startsWith('pt') ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  const isAuthenticated = !!localStorage.getItem("access_token");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    if (isAuthenticated) {
      loadUserProfile();
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAuthenticated]);

  // Event listeners para atualização de avatar e perfil
  useEffect(() => {
    const handleAvatarUpdated = (e: Event) => {
      const { avatarUrl } = (e as CustomEvent).detail;
      setUserProfile((prev) => (prev ? { ...prev, avatarUrl } : null));
    };
    const handleProfileUpdated = (e: Event) => {
      const { name } = (e as CustomEvent).detail;
      setUserProfile((prev) => (prev ? { ...prev, name } : null));
    };
    
    window.addEventListener("avatarUpdated", handleAvatarUpdated);
    window.addEventListener("profileUpdated", handleProfileUpdated);
    
    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdated);
      window.removeEventListener("profileUpdated", handleProfileUpdated);
    };
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await apiClient(`${API_BASE_URL}/user/me`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (e) {
      console.error("Failed to load user profile in Navbar", e);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient(`${API_BASE_URL}/auth/logout`, { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      if (onLogout) {
        onLogout();
      } else {
        navigate("/");
      }
    }
  };

  const navLinks = [
    { label: "Recursos", href: "/#features", id: "features" },
    { label: "Preview", href: "/#preview", id: "preview" },
    { label: "Planos", href: "/#cta", id: "cta" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0c0a08]/90 backdrop-blur-md border-b border-[#c9a84c]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group select-none">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#8b5e0a] flex items-center justify-center shadow-[0_0_12px_rgba(201,168,76,0.4)] transition-transform group-hover:scale-110">
            <Scroll className="w-5 h-5 text-[#0c0a08]" />
          </div>
          <span
            className="text-[#e8d5b0] group-hover:text-[#c9a84c] transition-colors duration-300 font-cinzel text-xl tracking-wider font-bold"
          >
            RP <span className="text-[#c9a84c]">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="text-[#c9a84c] hover:text-[#e8d5b0] transition-colors duration-300 text-sm font-cinzel font-bold tracking-widest flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              DASHBOARD
            </Link>
          )}
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#a89070] hover:text-[#c9a84c] transition-colors duration-300 text-sm font-inter font-medium"
            >
              {link.label}
            </a>
          ))}
          <span className="text-[#6c707a] text-[10px] font-bold uppercase tracking-tighter opacity-50 font-inter cursor-not-allowed">
            Livraria <span className="text-[8px] border border-[#6c707a]/30 px-1 rounded ml-1">Breve</span>
          </span>
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-5">
          <button 
            onClick={handleLanguageToggle}
            className="flex items-center gap-1.5 text-[#a89070] hover:text-[#c9a84c] transition-all duration-300 font-cinzel text-xs tracking-wider font-bold"
            aria-label="Toggle Language"
          >
            <Globe className="w-4 h-4" />
            {i18n.language.startsWith('pt') ? 'PT' : 'EN'}
          </button>

          <button className="text-[#a89070] hover:text-[#c9a84c] transition-all duration-300" aria-label="Search">
            <Search className="w-5 h-5" />
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 group"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-[#c9a84c]/20 group-hover:border-[#c9a84c]/50 transition-colors">
                  {userProfile?.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#c9a84c] to-[#a07830] flex items-center justify-center text-[#0c0a08] font-bold">
                      {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-[calc(100%+12px)] right-0 w-56 bg-[#0c0a08]/95 backdrop-blur-xl border border-[#c9a84c]/20 rounded-xl py-2 shadow-[0_10px_40px_rgba(0,0,0,0.6)] z-[60]"
                  >
                    <div className="px-4 py-3 border-b border-[#c9a84c]/10 mb-1">
                      <p className="text-[#e8d5b0] text-sm font-cinzel font-bold truncate">
                        {userProfile?.name || "Aventureiro"}
                      </p>
                      <p className="text-[#7a6a55] text-[10px] uppercase tracking-widest font-inter">Herói do Reino</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[#a89070] hover:text-[#e8d5b0] hover:bg-[#c9a84c]/10 transition-all flex items-center gap-3 text-sm font-inter"
                    >
                      <UserCircle className="w-4 h-4" />
                      Meu Perfil
                    </button>
                    <div className="h-px bg-[#c9a84c]/10 my-1 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center gap-3 text-sm font-inter"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair do Reino
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onSignInSelect}
                className="text-[#a89070] hover:text-[#e8d5b0] transition-colors duration-300 text-sm font-inter px-3 py-2 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Entrar
              </button>
              <button
                onClick={onCreateAccountSelect}
                className="px-5 py-2.5 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] rounded-lg text-xs font-cinzel font-bold tracking-widest hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(201,168,76,0.3)]"
              >
                CRIAR CONTA
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle & Language */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={handleLanguageToggle}
            className="flex items-center gap-1 text-[#a89070] hover:text-[#c9a84c] transition-all duration-300 font-cinzel text-xs font-bold"
          >
            <Globe className="w-4 h-4" />
            {i18n.language.startsWith('pt') ? 'PT' : 'EN'}
          </button>

          <button
            className="text-[#a89070] hover:text-[#c9a84c] transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0c0a08]/fa backdrop-blur-xl border-t border-[#c9a84c]/20 px-6 py-6 flex flex-col gap-5"
          >
             {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#c9a84c] font-cinzel font-bold py-3 border-b border-[#c9a84c]/10 flex items-center justify-between"
              >
                DASHBOARD <LayoutDashboard className="w-4 h-4" />
              </Link>
            )}
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#a89070] hover:text-[#c9a84c] transition-colors text-sm font-inter font-medium py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {!isAuthenticated ? (
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSignInSelect?.();
                  }}
                  className="w-full py-3 text-[#a89070] border border-[#c9a84c]/20 rounded-lg font-cinzel text-xs tracking-widest"
                >
                  ENTRAR
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onCreateAccountSelect?.();
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] rounded-lg font-cinzel font-bold text-xs tracking-widest"
                >
                  CRIAR CONTA GRÁTIS
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full py-3 text-[#a89070] border border-[#c9a84c]/20 rounded-lg font-cinzel text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <UserCircle className="w-4 h-4" /> MEU PERFIL
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-3 bg-red-400/10 text-red-400 border border-red-400/20 rounded-lg font-cinzel font-bold text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> SAIR DO REINO
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

