import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FileText,
  Map,
  Cloud,
  Users,
  Search,
  Wand2,
  Sword,
  BookOpen,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Criação de Fichas",
    description:
      "Construa fichas detalhadas com atributos, habilidades, equipamentos e história. Suporte para diversos sistemas de RPG.",
    accent: "#c9a84c",
    tag: "Jogadores",
  },
  {
    icon: Map,
    title: "Gestão de Campanhas",
    description:
      "Mestres podem organizar mundos inteiros — mapas, NPCs, notas de sessão e encontros — tudo em um único painel.",
    accent: "#c9a84c",
    tag: "Mestres",
  },
  {
    icon: Cloud,
    title: "Armazenamento em Nuvem",
    description:
      "Nunca mais perca uma ficha. Todos os seus dados são armazenados com segurança e sincronizados entre todos os seus dispositivos.",
    accent: "#c9a84c",
    tag: "Em todo lugar",
  },
  {
    icon: Users,
    title: "Compartilhamento de Grupo",
    description:
      "Compartilhe fichas com seu grupo instantaneamente. Mestres podem ver os atributos de todos em tempo real durante as sessões.",
    accent: "#c9a84c",
    tag: "Colaboração",
  },
  {
    icon: Search,
    title: "Busca Inteligente",
    description:
      "Sistema poderoso de filtros e tags para encontrar qualquer personagem ou campanha em segundos.",
    accent: "#c9a84c",
    tag: "Produtividade",
  },
  {
    icon: Wand2,
    title: "Cálculos Automáticos",
    description:
      "Deixe o RP Hub cuidar da matemática. Modificadores, bônus de proficiência e espaços de magia são calculados automaticamente.",
    accent: "#c9a84c",
    tag: "Inteligente",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const Icon = feature.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative p-6 rounded-xl border border-[#c9a84c]/10 bg-[#110f0d]/50 backdrop-blur-sm hover:border-[#c9a84c]/30 transition-all duration-300 overflow-hidden"
    >
      {/* Card glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at top left, ${feature.accent}08 0%, transparent 70%)`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${feature.accent}60, transparent)`,
        }}
      />

      {/* Icon */}
      <div className="relative mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: `${feature.accent}15`, border: `1px solid ${feature.accent}30` }}
        >
          <Icon className="w-5 h-5" style={{ color: feature.accent }} />
        </div>
      </div>

      {/* Tag */}
      <span
        className="inline-block px-2.5 py-0.5 rounded-full text-xs mb-3 font-inter tracking-wider"
        style={{
          backgroundColor: `${feature.accent}15`,
          color: feature.accent,
          border: `1px solid ${feature.accent}25`,
        }}
      >
        {feature.tag}
      </span>

      {/* Title */}
      <h3
        className="text-[#e8d5b0] mb-2 group-hover:text-[#c9a84c] transition-colors duration-300 font-cinzel font-semibold"
        style={{
          fontSize: "1.1rem",
        }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        className="text-[#7a6a55] leading-relaxed text-sm font-inter"
      >
        {feature.description}
      </p>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
            <Sword className="w-4 h-4 text-[#c9a84c]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
          </div>

          <span
            className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase block mb-4 font-cinzel"
          >
            TUDO QUE VOCÊ PRECISA
          </span>

          <h2
            className="text-[#e8d5b0] mb-5 font-cinzel font-bold leading-tight"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            }}
          >
            Ferramentas Poderosas para Todo
            <span className="text-[#c9a84c]"> Aventureiro</span>
          </h2>

          <p
            className="text-[#7a6a55] max-w-2xl mx-auto font-serif italic text-lg opacity-80"
          >
            De batedores solitários a guildas inteiras — o RP Hub dá a jogadores e mestres tudo o que precisam para dar vida às suas histórias.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom ornament */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 flex items-center justify-center gap-4"
        >
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c9a84c]/30" />
          <BookOpen className="w-4 h-4 text-[#c9a84c]/40" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c9a84c]/30" />
        </motion.div>
      </div>
    </section>
  );
}
