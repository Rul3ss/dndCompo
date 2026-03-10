import { motion } from "framer-motion";
import { FolderOpen, Globe, Monitor, Flame } from "lucide-react";

const benefits = [
  {
    icon: FolderOpen,
    title: "Chega de Fichas Perdidas",
    description:
      "Esqueça papéis manchados de café e cadernos perdidos. Cada personagem que você cria fica guardado na nuvem para sempre.",
    color: "#c9a84c",
    quote: '"Finalmente achei meu mago nível 14 que achei que tinha perdido há 3 anos." — Sarah T.',
  },
  {
    icon: Globe,
    title: "Perfeito para Presencial e Online",
    description:
      "Seja jogando via Discord ou em volta de uma mesa física, o RP Hub se adapta. Compartilhe fichas via link — sem necessidade de conta para visualizar.",
    color: "#c9a84c",
    quote: '"Funciona perfeitamente com nossas sessões semanais no Roll20." — Marcus D.',
  },
  {
    icon: Monitor,
    title: "Acessível de Qualquer Dispositivo",
    description:
      "Seus personagens e campanhas estão sempre com você. Acesse do laptop, tablet ou celular — com interface otimizada para todas as telas.",
    color: "#c9a84c",
    quote: '"Gerencio minhas campanhas direto do tablet durante a sessão." — Mestre Alex',
  },
];

export default function BenefitsSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#c9a84c]/60" />
            <Flame className="w-4 h-4 text-[#c9a84c]" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#c9a84c]/60" />
          </div>
          <span
            className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase block mb-4 font-cinzel"
          >
            Por que escolher o RP Hub
          </span>
          <h2
            className="text-[#e8d5b0] mb-5 font-cinzel font-bold leading-tight"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            }}
          >
            Feito para a Sua{" "}
            <span className="text-[#c9a84c]"> Mesa de Jogo</span>
          </h2>
          <p
            className="text-[#7a6a55] max-w-2xl mx-auto font-serif italic text-lg opacity-80"
          >
            Conversamos com milhares de jogadores e mestres para construir a ferramenta que eles realmente queriam usar.
          </p>
        </motion.div>

        {/* Benefits cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                className="group relative rounded-xl overflow-hidden bg-[#151210]/50 border border-[#c9a84c15] backdrop-blur-sm"
              >
                {/* Top color accent bar */}
                <div
                  className="h-1 w-full bg-gradient-to-r from-[#c9a84c] to-transparent"
                />

                <div className="p-8">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-[#c9a84c15] border border-[#c9a84c25]"
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-6 h-6 text-[#c9a84c]" />
                  </motion.div>

                  {/* Title */}
                  <h3
                    className="text-[#e8d5b0] mb-4 group-hover:text-[#c9a84c] transition-colors duration-300 font-cinzel text-lg font-bold"
                  >
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-[#7a6a55] leading-relaxed mb-6 text-sm font-inter"
                  >
                    {benefit.description}
                  </p>

                  {/* Quote */}
                  <div
                    className="rounded-lg p-4 mt-auto bg-[#c9a84c08] border border-[#c9a84c15]"
                  >
                    <p
                      className="text-[#a89070] font-serif italic text-sm leading-relaxed"
                    >
                      {benefit.quote}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Decorative stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: "99.9%", label: "Uptime" },
            { value: "<50ms", label: "Latência" },
            { value: "Sincronizado", label: "Dados" },
            { value: "4.9/5", label: "Satisfação" },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center py-6 rounded-xl bg-[#c9a84c05] border border-[#c9a84c10]"
            >
              <div
                className="text-[#c9a84c] mb-1 font-cinzel text-2xl font-bold"
              >
                {item.value}
              </div>
              <div
                className="text-[#7a6a55] text-[10px] tracking-[0.2em] uppercase font-inter"
              >
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
