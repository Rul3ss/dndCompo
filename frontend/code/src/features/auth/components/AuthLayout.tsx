import React from "react";
import { motion } from "framer-motion";
import { Scroll } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

import bgImage from "../../../assets/login-create/teladefundo.jpg";

const BG_IMAGE = bgImage;

const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛃ"];

function FloatingRune({
  rune,
  style,
}: {
  rune: string;
  style: React.CSSProperties;
}) {
  return (
    <motion.span
      animate={{ y: [0, -12, 0], opacity: [0.15, 0.4, 0.15] }}
      transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 3,
      }}
      className="absolute select-none pointer-events-none"
      style={{
        fontFamily: "'Cinzel', serif",
        color: "#c9a84c",
        fontSize: "1.5rem",
        ...style,
      }}
    >
      {rune}
    </motion.span>
  );
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const runePositions = [
    { top: "8%", left: "10%" },
    { top: "15%", right: "12%" },
    { top: "35%", left: "5%" },
    { top: "55%", right: "8%" },
    { top: "72%", left: "14%" },
    { top: "85%", right: "15%" },
    { top: "25%", left: "45%" },
    { top: "65%", left: "38%" },
    { top: "45%", right: "22%" },
  ];

  return (
    <div className="min-h-screen flex bg-[#0c0a08] overflow-hidden select-none">
      {/* ── Left Decorative Panel (Figma Design) ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col items-center justify-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BG_IMAGE})` }}
        />
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a08]/10 via-[#0c0a08]/30 to-[#0c0a08]/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a08]/70 via-transparent to-[#0c0a08]/80" />

        {/* Floating runes */}
        {runePositions.map((pos, i) => (
          <FloatingRune
            key={i}
            rune={RUNES[i % RUNES.length]}
            style={pos as React.CSSProperties}
          />
        ))}

        {/* Gold vignette border on right */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-[#c9a84c]/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a84c] to-[#8b5e0a] flex items-center justify-center shadow-[0_0_24px_rgba(201,168,76,0.5)]">
              <Scroll className="w-6 h-6 text-[#0c0a08]" />
            </div>
            <span className="text-[#e8d5b0] font-cinzel text-[1.4rem] tracking-[0.06em]">
              Realm<span className="text-[#c9a84c]">Scroll</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-[#e8d5b0] mb-4 font-cinzel font-bold text-[1.8rem] leading-[1.3] text-shadow-[0_0_40px_rgba(201,168,76,0.3)]"
          >
            Cada Lenda
            <br />
            <span className="text-[#c9a84c]">Começa Aqui</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-[#8a7050] mb-10 font-crimson text-[1.1rem] italic leading-[1.7]"
          >
            "As maiores aventuras começam com um simples pergaminho — sua ficha
            de personagem aguarda, alma valente."
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="grid grid-cols-3 gap-6 w-full"
          >
            {[
              { value: "50K+", label: "Aventureiros" },
              { value: "200K+", label: "Personagens" },
              { value: "15K+", label: "Campanhas" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-[#c9a84c] font-cinzel text-[1.3rem] font-bold">
                  {s.value}
                </span>
                <span className="text-[#6b5a3e] text-[10px] uppercase tracking-widest mt-0.5 font-bold font-inter">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Decorative divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex items-center gap-3 w-full"
          >
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#c9a84c]/40" />
            <span className="text-[#c9a84c]/60 text-lg">✦</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#c9a84c]/40" />
          </motion.div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,168,76,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 flex-1 flex flex-col">{children}</div>

        {/* Footer note */}
        <div className="relative z-10 p-8 text-center">
          <p className="text-[#3d2e1a] text-[10px] uppercase tracking-[0.2em] font-medium font-inter">
            Protegido por feitiçaria sombria • Criptografia de 256 bits • Seus
            dados são sagrados
          </p>
        </div>
      </div>
    </div>
  );
}
