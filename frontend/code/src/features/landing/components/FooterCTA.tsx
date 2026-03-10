import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Star } from "lucide-react";

export default function FooterCTA() {
  const navigate = useNavigate();

  return (
    <section id="cta" className="relative py-32 overflow-hidden">
      {/* Decorative glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#c9a84c]/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-[#c9a84c]/5 blur-[80px] pointer-events-none" />

      {/* Animated particles */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + (i * 7.5) % 80}%`,
            top: `${20 + (i * 13) % 60}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{
            duration: 3 + (i % 3),
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Star className="w-2 h-2 text-[#c9a84c]/50" />
        </motion.div>
      ))}

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Ornamental top */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c9a84c]/50" />
          <div
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#c9a84c]/30 bg-[#c9a84c]/10 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c9a84c]" />
            <span
              className="text-[#c9a84c] text-xs tracking-[0.2em] uppercase font-cinzel"
            >
              Plano gratuito eterno disponível
            </span>
          </div>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c9a84c]/50" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-[#e8d5b0] mb-6 font-cinzel font-bold leading-tight drop-shadow-[0_0_60px_rgba(201,168,76,0.15)]"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
          }}
        >
          Comece Sua{" "}
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-[#c9a84c] via-[#e8c870] to-[#a07830]"
          >
            Aventura
          </span>{" "}
          Agora
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-[#a89070] max-w-xl mx-auto mb-10 font-serif italic text-lg"
        >
          Junte-se a milhares de aventureiros. Crie sua primeira ficha gratuitamente — sem compromissos. Sua missão espera por você.
        </motion.p>

        {/* Main CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
        >
          <motion.button
            onClick={() => navigate("/register")}
            className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl overflow-hidden font-cinzel font-bold tracking-widest text-[#0c0a08] transition-all duration-300 shadow-[0_0_30px_rgba(201,168,76,0.3)]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "linear-gradient(135deg, #c9a84c, #a07830)",
            }}
          >
            <span className="relative">✦ CRIAR CONTA GRÁTIS</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </motion.button>

          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 text-[#a89070] hover:text-[#e8d5b0] transition-colors duration-300 text-sm font-inter"
          >
            Ou entre com sua conta existente →
          </button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex flex-wrap justify-center gap-6 text-[#7a6a55] text-xs font-inter"
        >
          {[
            "✓ Plano gratuito para sempre",
            "✓ Sem cartão de crédito",
            "✓ Cancele a qualquer momento",
            "✓ Suporte multissistema",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1">
              {item}
            </span>
          ))}
        </motion.div>

        {/* Bottom decorative ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-14 flex items-center justify-center gap-3"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]/30" />
          <span className="text-[#c9a84c]/40 text-lg">⚔</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]/30" />
        </motion.div>
      </div>
    </section>
  );
}
