import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, Shield } from 'lucide-react';

interface HeroProps {
  onCreateClick: () => void;
}

const floatingParticles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 4,
  duration: Math.random() * 4 + 4,
}));

export default function Hero({ onCreateClick }: HeroProps) {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');

  const handlePrimaryClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      onCreateClick();
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated grid overlay - Subtle design touch */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-[#c9a84c]/5 blur-[100px]" />
      </div>

      {/* Floating particles background effect */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#c9a84c] pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
          <span
            className="text-[#c9a84c] text-xs tracking-widest uppercase font-cinzel"
          >
            O COMPANHEIRO SUPREMO DE RPG
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-6 text-[#e8d5b0] font-cinzel font-bold leading-[1.15] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 4rem)",
          }}
        >
          Gerencie Seus Personagens<br />
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#c9a84c] via-[#e8c870] to-[#a07830]"
          >
            e Campanhas
          </span>{" "}
          em Um Só Lugar
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
          <Shield className="w-4 h-4 text-[#c9a84c]/60" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-[#a89070] max-w-2xl mx-auto mb-10 leading-relaxed font-serif italic"
          style={{
            fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
          }}
        >
          Seja você um mestre veterano ou um aventureiro de primeira viagem, o RP Hub permite criar, 
          armazenar e organizar fichas e campanhas online — acessível de qualquer lugar.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={handlePrimaryClick}
            className="group relative px-10 py-5 rounded-lg overflow-hidden font-cinzel font-semibold tracking-widest text-[#0c0a08] transition-all duration-300 shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#c9a84c] to-[#a07830] transition-all duration-300 group-hover:from-[#d4b85c] group-hover:to-[#b08840]" />
            <span className="relative flex items-center gap-2">
              ✦ {isAuthenticated ? 'IR PARA O PAINEL' : 'CRIAR FICHA AGORA'}
            </span>
          </button>

          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-10 py-5 rounded-lg border border-[#c9a84c]/40 bg-[#c9a84c]/5 backdrop-blur-sm text-[#e8d5b0] hover:border-[#c9a84c]/70 hover:bg-[#c9a84c]/10 transition-all duration-300 font-cinzel font-semibold tracking-widest"
          >
            <span className="flex items-center gap-2">
              ⚔ EXPLORAR RECURSOS
            </span>
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-[#a89070]/60 text-xs tracking-[0.2em] uppercase font-inter">
          Role para explorar
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#c9a84c]/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
