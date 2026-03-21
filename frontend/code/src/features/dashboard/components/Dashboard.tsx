import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Scroll,
  LayoutDashboard,
  Users,
  Map,
  BookOpen,
  Library,
  Settings,
  Bell,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sword,
  Wand2,
  Shield,
  Target,
  Flame,
  Leaf,
  Star,
  Zap,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Dices,
  Menu,
  X,
  Globe,
  LogOut,
  User,
  ChevronDown,
  Activity,
  Loader2,
  Edit3,
  Trash2,
  Package,
  MessageSquare,
  Swords,
  ArrowUpRight,
} from "lucide-react";
import CharacterCard from "./CharacterCard";
import CharacterModal from "./CharacterModal";
import CharacterSheetModal from "./sheets/CharacterSheetModal";
import ConfirmationModal from "../../../components/ui/ConfirmationModal";
import {
  characterService,
  type Character,
} from "../../../lib/character.service";
import { apiClient } from "../../../lib/apiClient";
import { API_BASE_URL } from "../../../lib/config";

// ─── INTERFACES ─────────────────────────────────────────────────────────────────

interface DashboardProps {
  onLogout?: () => Promise<void>;
}

interface UserProfile {
  name: string;
  email?: string;
  avatarUrl?: string;
}

// ─── MOCK DATA (para views que não tem backend ainda) ──────────────────────────

const ACTIVITIES = [
  {
    id: 1,
    type: "levelup",
    icon: TrendingUp,
    color: "#22c55e",
    text: "Você criou um novo personagem",
    time: "2 horas atrás",
  },
  {
    id: 2,
    type: "session",
    icon: BookOpen,
    color: "#c9a84c",
    text: "Nova sessão registrada",
    time: "1 dia atrás",
  },
  {
    id: 3,
    type: "item",
    icon: Package,
    color: "#f97316",
    text: "Item adicionado ao inventário",
    time: "3 dias atrás",
  },
];

const COMPENDIUM_SECTIONS = [
  {
    icon: Users,
    label: "NPCs",
    count: 0,
    color: "#8b4a9c",
    desc: "Personagens não-jogáveis",
  },
  {
    icon: Globe,
    label: "Locações",
    count: 0,
    color: "#4c7ac9",
    desc: "Cidades, masmorras e reinos",
  },
  {
    icon: Package,
    label: "Itens",
    count: 0,
    color: "#f97316",
    desc: "Armas, armaduras e artefatos",
  },
  {
    icon: Scroll,
    label: "Lore",
    count: 0,
    color: "#c9a84c",
    desc: "História e mitologia do mundo",
  },
  {
    icon: Swords,
    label: "Monstros",
    count: 0,
    color: "#ef4444",
    desc: "Bestiário e estatísticas",
  },
  {
    icon: MessageSquare,
    label: "Quests",
    count: 0,
    color: "#22c55e",
    desc: "Missões ativas e completas",
  },
];

// ─── SIDEBAR ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "characters", label: "Personagens", icon: Users },
  { id: "campaigns", label: "Campanhas", icon: Map },
  { id: "sessions", label: "Sessões", icon: BookOpen },
  { id: "compendium", label: "Compêndio", icon: Library },
];

function Sidebar({
  activeView,
  setActiveView,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  userProfile,
  onLogout,
}: {
  activeView: string;
  setActiveView: (v: string) => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  userProfile: UserProfile | null;
  onLogout?: () => void;
}) {
  const navigate = useNavigate();

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

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: collapsed ? 68 : 240 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          border-r border-[#2a1f0f] overflow-hidden
          lg:relative lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ background: "#0f0c09", minWidth: collapsed ? 68 : 240 }}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 px-4 border-b border-[#2a1f0f] shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}
        >
          <Link to="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#8b5e0a] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(201,168,76,0.3)]">
              <Scroll className="w-4 h-4 text-[#0c0a08]" />
            </div>
            {!collapsed && (
              <span
                className="text-[#e8d5b0] truncate"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.85rem",
                  letterSpacing: "0.04em",
                }}
              >
                RP<span className="text-[#c9a84c]">Hub</span>
              </span>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="hidden lg:flex text-[#4a3820] hover:text-[#c9a84c] transition-colors shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-1 px-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group w-full text-left ${
                    isActive
                      ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c]"
                      : "text-[#6b5a3e] hover:text-[#a89070] hover:bg-[#1a1510]"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? "text-[#c9a84c]" : ""}`}
                  />
                  {!collapsed && (
                    <span
                      className="text-sm truncate"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.label}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-3 mx-2 h-px bg-[#2a1f0f]" />

          <div className="flex flex-col gap-1 px-2">
            <button
              onClick={() => {
                setActiveView("settings");
                setMobileOpen(false);
              }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full text-left ${
                activeView === "settings"
                  ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c]"
                  : "text-[#6b5a3e] hover:text-[#a89070] hover:bg-[#1a1510]"
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              {!collapsed && (
                <span
                  className="text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Configurações
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div
          className={`border-t border-[#2a1f0f] p-3 shrink-0 ${collapsed ? "flex justify-center" : ""}`}
        >
          {collapsed ? (
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b5e0a] flex items-center justify-center text-[#0c0a08] text-xs overflow-hidden"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
            >
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                userProfile?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2.5 mb-2.5">
                <div
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b5e0a] flex items-center justify-center text-[#0c0a08] text-xs shrink-0 overflow-hidden"
                  style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
                >
                  {userProfile?.avatarUrl ? (
                    <img
                      src={userProfile.avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    userProfile?.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div className="min-w-0">
                  <p
                    className="text-[#e8d5b0] text-xs truncate"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {userProfile?.name?.split(" ")[0] || "Aventureiro"}
                  </p>
                  <p
                    className="text-[#4a3820] text-xs truncate"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Herói do Reino
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[#4a3820] hover:text-[#ef4444] transition-colors text-xs mt-2 w-full"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <LogOut className="w-3 h-3" /> Sair do Reino
              </button>
            </div>
          )}
        </div>

        {/* Collapse toggle (desktop) */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden lg:flex items-center justify-center h-10 border-t border-[#2a1f0f] text-[#4a3820] hover:text-[#c9a84c] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </motion.aside>
    </>
  );
}

// ─── TOP BAR ────────────────────────────────────────────────────────────────────

function TopBar({
  activeView,
  setMobileOpen,
  notifications,
  setNotifications,
  userProfile,
}: {
  activeView: string;
  setMobileOpen: (v: boolean) => void;
  notifications: number;
  setNotifications: (v: number) => void;
  userProfile: UserProfile | null;
}) {
  const navigate = useNavigate();
  const [searchFocus, setSearchFocus] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const viewLabels: Record<string, string> = {
    overview: "Visão Geral",
    characters: "Meus Personagens",
    campaigns: "Campanhas",
    sessions: "Diário de Sessões",
    compendium: "Compêndio",
    settings: "Configurações",
  };

  return (
    <header
      className="h-16 border-b border-[#2a1f0f] flex items-center px-4 md:px-6 gap-4 shrink-0 sticky top-0 z-30"
      style={{ background: "#0f0c09" }}
    >
      {/* Mobile hamburger */}
      <button
        className="lg:hidden text-[#6b5a3e] hover:text-[#c9a84c] transition-colors"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <h1
        className="text-[#e8d5b0] hidden sm:block"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "1rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
      >
        {viewLabels[activeView]}
      </h1>

      {/* Search */}
      <div
        className={`flex-1 max-w-xs ml-auto sm:ml-0 relative transition-all duration-200 ${searchFocus ? "max-w-sm" : ""}`}
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#4a3820] pointer-events-none" />
        <input
          type="text"
          placeholder={
            activeView === "characters"
              ? "Buscar personagens..."
              : activeView === "campaigns"
                ? "Buscar campanhas..."
                : "Buscar..."
          }
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          className="w-full bg-[#1a1510]/80 border border-[#2a1f0f] focus:border-[#c9a84c]/40 rounded-lg pl-9 pr-4 py-2 text-[#a89070] placeholder:text-[#3d2e1a] outline-none text-sm transition-all duration-200"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifs(!showNotifs);
              if (notifications > 0) setNotifications(0);
            }}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#6b5a3e] hover:text-[#c9a84c] hover:bg-[#1a1510] transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            {notifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full" />
            )}
          </button>
          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-72 rounded-xl border border-[#2a1f0f] shadow-2xl z-50 overflow-hidden"
                style={{ background: "#140f0a" }}
              >
                <div className="px-4 py-3 border-b border-[#2a1f0f]">
                  <span
                    className="text-[#e8d5b0] text-sm"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Notificações
                  </span>
                </div>
                {ACTIVITIES.slice(0, 3).map((a) => {
                  const Icon = a.icon;
                  return (
                    <div
                      key={a.id}
                      className="px-4 py-3 border-b border-[#1a1510] hover:bg-[#1a1510]/60 transition-colors cursor-pointer"
                    >
                      <div className="flex gap-3 items-start">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: a.color + "20" }}
                        >
                          <Icon
                            className="w-3.5 h-3.5"
                            style={{ color: a.color }}
                          />
                        </div>
                        <div>
                          <p
                            className="text-[#a89070] text-xs leading-relaxed"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {a.text}
                          </p>
                          <p
                            className="text-[#4a3820] text-xs mt-0.5"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          >
                            {a.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-[#1a1510] transition-colors"
          >
            <div
              className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c9a84c] to-[#8b5e0a] flex items-center justify-center text-[#0c0a08] text-xs overflow-hidden"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
            >
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                userProfile?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <span
              className="text-[#a89070] text-sm hidden md:block"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {userProfile?.name?.split(" ")[0] || "Aventureiro"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#4a3820] hidden md:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-11 w-56 rounded-xl border border-[#2a1f0f] shadow-2xl z-50 overflow-hidden"
                style={{ background: "#140f0a" }}
              >
                <div className="px-4 py-3 border-b border-[#2a1f0f]">
                  <p
                    className="text-[#e8d5b0] text-sm font-medium"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {userProfile?.name || "Aventureiro"}
                  </p>
                  <p
                    className="text-[#4a3820] text-xs mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Herói do Reino
                  </p>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#1a1510] transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-[#c9a84c]" />
                    <span
                      className="text-[#a89070] text-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Meu Perfil
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      // Logout será chamado via Dashboard
                      const logoutEvent = new CustomEvent("requestLogout");
                      window.dispatchEvent(logoutEvent);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ef4444]/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-[#ef4444]" />
                    <span
                      className="text-[#ef4444] text-sm"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      Sair do Reino
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

// ─── STAT CARD ──────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl border border-[#2a1f0f] p-5 flex flex-col gap-3 group hover:border-[#c9a84c]/20 transition-all duration-300"
      style={{ background: "#140f0a" }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: color + "15" }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-[#3d2e1a] group-hover:text-[#c9a84c]/40 transition-colors" />
      </div>
      <div>
        <p
          className="text-[#e8d5b0]"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.6rem",
            fontWeight: 700,
          }}
        >
          {value}
        </p>
        <p
          className="text-[#a89070] text-sm mt-0.5"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {label}
        </p>
        <p
          className="text-[#4a3820] text-xs mt-1"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {sub}
        </p>
      </div>
    </motion.div>
  );
}

// ─── DICE ROLLER ────────────────────────────────────────────────────────────────

function DiceRoller() {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [dieType, setDieType] = useState(20);
  const dice = [4, 6, 8, 10, 12, 20, 100];

  function roll() {
    if (rolling) return;
    setRolling(true);
    setResult(null);
    const spins = 12;
    let i = 0;
    const interval = setInterval(() => {
      setResult(Math.ceil(Math.random() * dieType));
      i++;
      if (i >= spins) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 80);
  }

  const isCrit = result === dieType;
  const isFumble = result === 1;

  return (
    <div
      className="rounded-xl border border-[#2a1f0f] p-5"
      style={{ background: "#140f0a" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-[#e8d5b0] text-sm"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          Rolagem Rápida
        </h3>
        <Dices className="w-4 h-4 text-[#4a3820]" />
      </div>

      {/* Die selector */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {dice.map((d) => (
          <button
            key={d}
            onClick={() => {
              setDieType(d);
              setResult(null);
            }}
            className={`px-2.5 py-1 rounded text-xs transition-all duration-200 ${dieType === d ? "bg-[#c9a84c]/20 border border-[#c9a84c]/40 text-[#c9a84c]" : "border border-[#2a1f0f] text-[#6b5a3e] hover:border-[#3d2e1a] hover:text-[#a89070]"}`}
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            d{d}
          </button>
        ))}
      </div>

      {/* Result display */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={roll}
          whileTap={{ scale: 0.9 }}
          animate={rolling ? { rotate: [0, 20, -20, 15, -15, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #1a1510, #2a1f0f)",
            border: "2px solid #3d2e1a",
          }}
          title={`Rolar d${dieType}`}
        >
          🎲
        </motion.button>
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {result !== null ? (
              <motion.div
                key={result}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <p
                  className="text-4xl"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 900,
                    color: isCrit
                      ? "#22c55e"
                      : isFumble
                        ? "#ef4444"
                        : "#c9a84c",
                    textShadow: isCrit
                      ? "0 0 20px rgba(34,197,94,0.5)"
                      : isFumble
                        ? "0 0 20px rgba(239,68,68,0.5)"
                        : "0 0 20px rgba(201,168,76,0.3)",
                  }}
                >
                  {result}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    color: isCrit
                      ? "#22c55e"
                      : isFumble
                        ? "#ef4444"
                        : "#6b5a3e",
                  }}
                >
                  {isCrit
                    ? "✦ Crítico!"
                    : isFumble
                      ? "✦ Falha!"
                      : `d${dieType}`}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p
                  className="text-[#3d2e1a] text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Clique no dado para rolar d{dieType}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── OVERVIEW VIEW ──────────────────────────────────────────────────────────────

function OverviewView({
  setActiveView,
  characters,
  userProfile,
  onCreateCharacter,
  onOpenSheet,
  onEditProfile,
  onDelete,
}: {
  setActiveView: (v: string) => void;
  characters: Character[];
  userProfile: UserProfile | null;
  onCreateCharacter: () => void;
  onOpenSheet: (char: Character) => void;
  onEditProfile: (char: Character) => void;
  onDelete: (id: string) => void;
}) {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p
              className="text-[#4a3820] text-sm mb-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {today}
            </p>
            <h2
              className="text-[#e8d5b0]"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "clamp(1.2rem, 3vw, 1.6rem)",
                fontWeight: 700,
              }}
            >
              Bem-vindo,{" "}
              <span className="text-[#c9a84c]">
                {userProfile?.name?.split(" ")[0] || "Aventureiro"}
              </span>{" "}
              ✦
            </h2>
            <p
              className="text-[#6b5a3e] text-sm mt-1"
              style={{
                fontFamily: "'Crimson Text', serif",
                fontStyle: "italic",
              }}
            >
              {characters.length > 0
                ? `Você tem ${characters.length} ${characters.length === 1 ? "lenda" : "lendas"} em suas crônicas.`
                : "Sua jornada épica começa aqui."}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onCreateCharacter}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] text-sm hover:from-[#d4b85c] transition-all shadow-[0_0_15px_rgba(201,168,76,0.2)]"
              style={{
                fontFamily: "'Cinzel', serif",
                letterSpacing: "0.04em",
                fontWeight: 600,
              }}
            >
              <Plus className="w-3.5 h-3.5" /> Novo Personagem
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={Users}
          label="Personagens"
          value={characters.length}
          sub={characters.length === 1 ? "herói criado" : "heróis criados"}
          color="#c9a84c"
          delay={0.05}
        />
        <StatCard
          icon={Map}
          label="Campanhas"
          value={0}
          sub="em breve"
          color="#8b4a9c"
          delay={0.1}
        />
        <StatCard
          icon={BookOpen}
          label="Sessões"
          value={0}
          sub="histórico vazio"
          color="#4c7ac9"
          delay={0.15}
        />
        <StatCard
          icon={Zap}
          label="XP Total"
          value="0"
          sub="comece a aventura"
          color="#22c55e"
          delay={0.2}
        />
      </div>

      {/* Characters + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Characters */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-[#a89070]"
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Personagens Recentes
            </h3>
            <button
              onClick={() => setActiveView("characters")}
              className="text-[#c9a84c] text-xs hover:text-[#e8d5b0] transition-colors flex items-center gap-1"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Ver todos <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {characters.length === 0 ? (
              <div className="col-span-2 flex flex-col items-center justify-center py-16 bg-[#1a1510]/20 rounded-2xl border border-[#c9a84c]/10 border-dashed">
                <Users className="w-12 h-12 text-[#c9a84c]/20 mb-3" />
                <p
                  className="text-[#6b5a3e] text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Nenhum personagem ainda
                </p>
                <button
                  onClick={onCreateCharacter}
                  className="mt-4 text-[#c9a84c] text-xs hover:text-[#e8d5b0] transition-colors flex items-center gap-1"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    letterSpacing: "0.1em",
                  }}
                >
                  <Plus className="w-3 h-3" /> CRIAR PRIMEIRO PERSONAGEM
                </button>
              </div>
            ) : (
              characters
                .slice(0, 2)
                .map((char, i) => (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    onOpenSheet={() => onOpenSheet(char)}
                    onEditProfile={() => onEditProfile(char)}
                    onDelete={() => onDelete(char.id)}
                  />
                ))
            )}
          </div>
        </div>

        {/* Sidebar: Activity + Dice */}
        <div className="flex flex-col gap-4">
          {/* Recent Activity */}
          <div
            className="rounded-xl border border-[#2a1f0f] overflow-hidden"
            style={{ background: "#140f0a" }}
          >
            <div className="px-4 py-3 border-b border-[#1a1510] flex items-center justify-between">
              <h3
                className="text-[#a89070]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Atividades
              </h3>
              <Activity className="w-3.5 h-3.5 text-[#4a3820]" />
            </div>
            <div className="divide-y divide-[#1a1510]">
              {ACTIVITIES.slice(0, 4).map((act, i) => {
                const Icon = act.icon;
                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    className="px-4 py-3 flex gap-3 items-start hover:bg-[#1a1510]/40 transition-colors cursor-pointer"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: act.color + "20" }}
                    >
                      <Icon className="w-3 h-3" style={{ color: act.color }} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-[#8a7050] text-xs leading-relaxed"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {act.text}
                      </p>
                      <p
                        className="text-[#3d2e1a] text-xs mt-0.5"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {act.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Dice Roller */}
          <DiceRoller />
        </div>
      </div>
    </div>
  );
}

// ─── CHARACTERS VIEW ────────────────────────────────────────────────────────────

function CharactersView({
  characters,
  loading,
  onCreateCharacter,
  onOpenSheet,
  onEditProfile,
  onDelete,
}: {
  characters: Character[];
  loading: boolean;
  onCreateCharacter: () => void;
  onOpenSheet: (char: Character) => void;
  onEditProfile: (char: Character) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-[#e8d5b0]"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          >
            Meus Personagens
          </h2>
          <p
            className="text-[#6b5a3e] text-sm mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {characters.length}{" "}
            {characters.length === 1 ? "aventureiro" : "aventureiros"} no seu
            reino
          </p>
        </div>
        <button
          onClick={onCreateCharacter}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] text-sm shrink-0 hover:from-[#d4b85c] transition-all shadow-[0_0_15px_rgba(201,168,76,0.2)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" /> Novo Personagem
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32"
          >
            <Loader2 className="w-12 h-12 text-[#c9a84c] animate-spin mb-4" />
            <p className="font-cinzel text-[#a89070] tracking-widest">
              INVOCANDO LENDAS...
            </p>
          </motion.div>
        ) : characters.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 bg-[#1a1510]/20 rounded-3xl border border-[#c9a84c]/10 border-dashed"
          >
            <div className="w-20 h-20 bg-[#c9a84c]/5 rounded-full flex items-center justify-center mb-6">
              <Plus className="w-10 h-10 text-[#c9a84c]/40" />
            </div>
            <h2 className="font-cinzel text-xl font-bold text-[#e8d5b0] mb-2">
              O REINO ESTÁ VAZIO
            </h2>
            <p className="text-[#a89070] text-sm mb-8 text-center max-w-sm">
              Parece que você ainda não forjou nenhum herói. Comece sua jornada
              agora mesmo.
            </p>
            <button
              onClick={onCreateCharacter}
              className="py-3 px-8 bg-gradient-to-r from-[#c9a84c] to-[#a07830] rounded-xl text-[#0c0a08] font-cinzel text-xs font-bold tracking-widest shadow-xl hover:shadow-[#c9a84c]/10 transition-all active:scale-95"
            >
              FORJAR NOVO HERÓI
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {characters.map((char) => (
              <CharacterCard
                key={char.id}
                character={char}
                onOpenSheet={() => onOpenSheet(char)}
                onEditProfile={() => onEditProfile(char)}
                onDelete={() => onDelete(char.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── CAMPAIGNS VIEW ─────────────────────────────────────────────────────────────

function CampaignsView() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-[#e8d5b0]"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          >
            Campanhas
          </h2>
          <p
            className="text-[#6b5a3e] text-sm mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Gerencie seus mundos e aventuras
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] text-sm shrink-0 hover:from-[#d4b85c] transition-all shadow-[0_0_15px_rgba(201,168,76,0.2)]"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" /> Nova Campanha
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 bg-[#1a1510]/20 rounded-3xl border border-[#c9a84c]/10"
      >
        <div className="w-16 h-16 bg-[#c9a84c]/5 rounded-full flex items-center justify-center mb-6">
          <Swords className="w-8 h-8 text-[#c9a84c]/40" />
        </div>
        <h2 className="font-cinzel text-xl font-bold text-[#e8d5b0] mb-2">
          CAMPANHAS EM BREVE
        </h2>
        <p className="text-[#a89070] text-sm text-center max-w-sm">
          Estamos preparando os mapas e as masmorras para suas próximas grandes
          aventuras.
        </p>
      </motion.div>
    </div>
  );
}

// ─── SESSIONS VIEW ──────────────────────────────────────────────────────────────

function SessionsView() {
  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-[#e8d5b0]"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          >
            Diário de Sessões
          </h2>
          <p
            className="text-[#6b5a3e] text-sm mt-0.5"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Suas crônicas de aventuras passadas
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08] text-sm shrink-0 hover:from-[#d4b85c] transition-all"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        >
          <Plus className="w-4 h-4" /> Registrar Sessão
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 bg-[#1a1510]/20 rounded-3xl border border-[#c9a84c]/10"
      >
        <div className="w-16 h-16 bg-[#c9a84c]/5 rounded-full flex items-center justify-center mb-6">
          <BookOpen className="w-8 h-8 text-[#c9a84c]/40" />
        </div>
        <h2 className="font-cinzel text-xl font-bold text-[#e8d5b0] mb-2">
          SESSÕES EM BREVE
        </h2>
        <p className="text-[#a89070] text-sm text-center max-w-sm">
          Em breve você poderá registrar e acompanhar todas as suas sessões de
          jogo.
        </p>
      </motion.div>
    </div>
  );
}

// ─── COMPENDIUM VIEW ────────────────────────────────────────────────────────────

function CompendiumView() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h2
          className="text-[#e8d5b0]"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.2rem",
            fontWeight: 700,
          }}
        >
          Compêndio
        </h2>
        <p
          className="text-[#6b5a3e] text-sm mt-0.5"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Sua biblioteca de construção de mundos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMPENDIUM_SECTIONS.map((section, i) => (
          <motion.div
            key={section.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.35 }}
            className="rounded-xl border border-[#2a1f0f] hover:border-[#3d2e1a] p-5 cursor-pointer group transition-all duration-300"
            style={{ background: "#140f0a" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: section.color + "15" }}
              >
                <section.icon
                  className="w-6 h-6"
                  style={{ color: section.color }}
                />
              </div>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: section.color + "15",
                  color: section.color,
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 600,
                }}
              >
                {section.count}
              </span>
            </div>
            <h3
              className="text-[#e8d5b0] mb-1.5"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              {section.label}
            </h3>
            <p
              className="text-[#4a3820] text-xs leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {section.desc}
            </p>
            <button
              className="mt-4 flex items-center gap-1 text-xs transition-colors"
              style={{
                color: section.color,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Explorar <ArrowUpRight className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS VIEW ──────────────────────────────────────────────────────────────

function SettingsView({ userProfile }: { userProfile: UserProfile | null }) {
  const navigate = useNavigate();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  function Toggle({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: () => void;
  }) {
    return (
      <button
        onClick={onChange}
        className="relative w-10 h-5.5 rounded-full transition-all duration-300 shrink-0"
        style={{
          background: value
            ? "linear-gradient(90deg, #c9a84c, #a07830)"
            : "#2a1f0f",
          height: 22,
        }}
      >
        <motion.div
          animate={{ x: value ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-4 h-4 rounded-full bg-[#e8d5b0]"
        />
      </button>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="mb-6">
        <h2
          className="text-[#e8d5b0]"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.2rem",
            fontWeight: 700,
          }}
        >
          Configurações
        </h2>
        <p
          className="text-[#6b5a3e] text-sm mt-0.5"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Gerencie sua conta e preferências
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Profile card */}
        <div
          className="rounded-xl border border-[#2a1f0f] overflow-hidden"
          style={{ background: "#140f0a" }}
        >
          <div className="px-5 py-3.5 border-b border-[#1a1510]">
            <span
              className="text-[#a89070] text-xs uppercase tracking-widest"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Perfil
            </span>
          </div>
          <div className="p-5 flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c9a84c] to-[#8b5e0a] flex items-center justify-center text-[#0c0a08] text-xl shrink-0 overflow-hidden"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
            >
              {userProfile?.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                userProfile?.name?.charAt(0).toUpperCase() || "U"
              )}
            </div>
            <div>
              <p
                className="text-[#e8d5b0]"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {userProfile?.name || "Aventureiro"}
              </p>
              <p
                className="text-[#6b5a3e] text-sm mt-0.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {userProfile?.email || "email@exemplo.com"}
              </p>
              <span
                className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs bg-[#c9a84c]/10 border border-[#c9a84c]/20 text-[#c9a84c]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Herói do Reino
              </span>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#3d2e1a] text-[#a89070] hover:border-[#c9a84c]/30 hover:text-[#e8d5b0] transition-all text-sm shrink-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Edit3 className="w-3.5 h-3.5" /> Editar
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div
          className="rounded-xl border border-[#2a1f0f] overflow-hidden"
          style={{ background: "#140f0a" }}
        >
          <div className="px-5 py-3.5 border-b border-[#1a1510]">
            <span
              className="text-[#a89070] text-xs uppercase tracking-widest"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Preferências
            </span>
          </div>
          <div className="divide-y divide-[#1a1510]">
            {[
              {
                label: "Notificações por email",
                sub: "Lembretes de sessões e atualizações",
                value: emailNotifs,
                onChange: () => setEmailNotifs(!emailNotifs),
              },
              {
                label: "Perfil público",
                sub: "Permitir outros aventureiros te encontrarem",
                value: publicProfile,
                onChange: () => setPublicProfile(!publicProfile),
              },
              {
                label: "Auto-salvar fichas",
                sub: "Salvar mudanças automaticamente",
                value: autoSave,
                onChange: () => setAutoSave(!autoSave),
              },
            ].map((pref) => (
              <div
                key={pref.label}
                className="px-5 py-4 flex items-center justify-between gap-4"
              >
                <div>
                  <p
                    className="text-[#a89070] text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {pref.label}
                  </p>
                  <p
                    className="text-[#4a3820] text-xs mt-0.5"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {pref.sub}
                  </p>
                </div>
                <Toggle value={pref.value} onChange={pref.onChange} />
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div
          className="rounded-xl border border-[#ef4444]/20 overflow-hidden"
          style={{ background: "#140f0a" }}
        >
          <div className="px-5 py-3.5 border-b border-[#ef4444]/10">
            <span
              className="text-[#ef4444]/60 text-xs uppercase tracking-widest"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Zona de Perigo
            </span>
          </div>
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p
                className="text-[#a89070] text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Deletar Conta
              </p>
              <p
                className="text-[#4a3820] text-xs mt-0.5"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Remover permanentemente sua conta e dados
              </p>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#ef4444]/30 text-[#ef4444]/60 hover:border-[#ef4444]/60 hover:text-[#ef4444] transition-all text-sm shrink-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Trash2 className="w-3.5 h-3.5" /> Deletar Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ─────────────────────────────────────────────────────────────

export default function NewDashboard({ onLogout }: DashboardProps) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Character state
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null,
  );
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null,
  );
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // User profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const data = await characterService.getAllCharacters();
      setCharacters(data);
    } catch (e) {
      console.error("Error fetching characters:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await apiClient(`${API_BASE_URL}/user/me`);
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
      }
    } catch (e) {
      console.error("Failed to load user profile", e);
    }
  };

  useEffect(() => {
    fetchCharacters();
    loadUserProfile();
  }, []);

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
    const handleRequestLogout = () => {
      if (onLogout) {
        onLogout();
      }
    };

    window.addEventListener("avatarUpdated", handleAvatarUpdated);
    window.addEventListener("profileUpdated", handleProfileUpdated);
    window.addEventListener("requestLogout", handleRequestLogout);

    return () => {
      window.removeEventListener("avatarUpdated", handleAvatarUpdated);
      window.removeEventListener("profileUpdated", handleProfileUpdated);
      window.removeEventListener("requestLogout", handleRequestLogout);
    };
  }, [onLogout]);

  const handleEditProfile = (char: Character) => {
    setEditingCharacter(char);
    setModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingCharacter(null);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setCharacterToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!characterToDelete) return;

    try {
      setIsDeleting(true);
      await characterService.deleteCharacter(characterToDelete);
      setCharacters((prev) => prev.filter((c) => c.id !== characterToDelete));
      setIsConfirmDeleteOpen(false);
      setCharacterToDelete(null);
    } catch (e) {
      alert("Erro ao deletar personagem");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenSheet = (character: Character) => {
    navigate(`/dashboard/character/${character.id}/edit`);
  };

  const views: Record<string, React.ReactNode> = {
    overview: (
      <OverviewView
        setActiveView={setActiveView}
        characters={characters}
        userProfile={userProfile}
        onCreateCharacter={handleCreateNew}
        onOpenSheet={handleOpenSheet}
        onEditProfile={handleEditProfile}
        onDelete={handleDeleteClick}
      />
    ),
    characters: (
      <CharactersView
        characters={characters}
        loading={loading}
        onCreateCharacter={handleCreateNew}
        onOpenSheet={handleOpenSheet}
        onEditProfile={handleEditProfile}
        onDelete={handleDeleteClick}
      />
    ),
    campaigns: <CampaignsView />,
    sessions: <SessionsView />,
    compendium: <CompendiumView />,
    settings: <SettingsView userProfile={userProfile} />,
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0c0a08" }}
    >
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userProfile={userProfile}
        onLogout={onLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          activeView={activeView}
          setMobileOpen={setMobileOpen}
          notifications={notifications}
          setNotifications={setNotifications}
          userProfile={userProfile}
        />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {views[activeView]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <CharacterModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCharacters}
        character={editingCharacter}
      />

      <CharacterSheetModal
        character={selectedCharacter}
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        onUpdate={fetchCharacters}
      />

      <ConfirmationModal
        isOpen={isConfirmDeleteOpen}
        title="Apagar Lenda"
        message="Deseja realmente apagar esta lenda das crônicas? Esta ação é permanente e não poderá ser desfeita."
        confirmLabel={isDeleting ? "Apagando..." : "Apagar Lenda"}
        cancelLabel="Manter Lenda"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        variant="danger"
      />
    </div>
  );
}
