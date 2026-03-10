import { motion } from "framer-motion";

import bgImage from "../../assets/landingpage/bg.jpg";

const BACKGROUND_IMAGE = bgImage;

const floatingParticles = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 5 + 5,
}));

export default function StaticBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0c0a08]">
      {/* Base Image with Map Theme */}
      <div className="absolute inset-0">
        <img
          src={BACKGROUND_IMAGE}
          alt="Fantasy background"
          className="w-full h-full object-cover opacity-[0.15]"
        />

        {/* Depth Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0a08]/80 via-[#0c0a08]/40 to-[#0c0a08]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a08] via-transparent to-[#0c0a08]" />

        {/* Vignette effect */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
      </div>

      {/* Subtle Design Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Floating Magic Particles */}
      {floatingParticles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#c9a84c] opacity-0"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.4, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#c9a84c]/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#8b5e0a]/5 blur-[150px]" />
    </div>
  );
}
