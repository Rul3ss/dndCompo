import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scroll } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthContainerProps {
  onLoginSuccess: () => void;
  initialMode?: 'login' | 'register';
  onBackToHome?: () => void;
}

export default function AuthContainer({ onLoginSuccess, initialMode = 'login', onBackToHome }: AuthContainerProps) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  const handleTabClick = (mode: 'login' | 'register') => {
    navigate(`/${mode}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar (Figma Design) */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-10 pt-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-[#6b5a3e] hover:text-[#c9a84c] transition-colors text-xs font-inter font-bold uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </Link>

        {/* Mobile logo (Visible on < lg) */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#c9a84c] to-[#8b5e0a] flex items-center justify-center">
            <Scroll className="w-4 h-4 text-[#0c0a08]" />
          </div>
          <span className="text-[#e8d5b0] font-cinzel text-[0.95rem] tracking-[0.05em]">
            Realm<span className="text-[#c9a84c]">Scroll</span>
          </span>
        </div>

        {/* Mode toggle tabs */}
        <div className="flex items-center gap-1 bg-[#1a1510]/80 border border-[#2a1f0f] rounded-lg p-1">
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleTabClick(m)}
              className={`px-4 py-1.5 rounded-md text-[10px] transition-all duration-200 uppercase font-cinzel font-bold tracking-[0.04em] ${
                (isLogin && m === 'login') || (!isLogin && m === 'register')
                  ? "bg-gradient-to-r from-[#c9a84c] to-[#a07830] text-[#0c0a08]"
                  : "text-[#6b5a3e] hover:text-[#a89070]"
              }`}
            >
              {m === "login" ? "Entrar" : "Registro"}
            </button>
          ))}
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-10 py-8">
        <div className="w-full max-w-md relative z-10">
          {/* Gold glow accent */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-[#c9a84c]/5 rounded-full blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {isLogin ? (
                <LoginForm onLoginSuccess={onLoginSuccess} />
              ) : (
                <RegisterForm onSuccess={() => setIsLogin(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
