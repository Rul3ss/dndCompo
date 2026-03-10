import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Heart, Users, Map, ScrollText, ChevronRight } from "lucide-react";

// Character Sheet Mockup
function CharacterSheetMockup() {
  const stats = [
    { name: "FOR", value: 18, mod: "+4" },
    { name: "DES", value: 14, mod: "+2" },
    { name: "CON", value: 16, mod: "+3" },
    { name: "INT", value: 10, mod: "+0" },
    { name: "SAB", value: 12, mod: "+1" },
    { name: "CAR", value: 15, mod: "+2" },
  ];

  const skills = [
    { name: "Atletismo", prof: true, value: "+7" },
    { name: "Percepção", prof: true, value: "+4" },
    { name: "Intimidação", prof: true, value: "+5" },
    { name: "Furtividade", prof: false, value: "+2" },
    { name: "História", prof: false, value: "+0" },
  ];

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1a1510, #120e0b)",
        border: "1px solid rgba(201,168,76,0.25)",
        boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.08)",
      }}
    >
      {/* Header bar */}
      <div
        className="px-5 py-3 flex items-center gap-2 border-b"
        style={{ borderColor: "rgba(201,168,76,0.15)", background: "rgba(201,168,76,0.05)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#8b1a1a]/80" />
          <div className="w-3 h-3 rounded-full bg-[#6b5a1a]/80" />
          <div className="w-3 h-3 rounded-full bg-[#1a4a1a]/80" />
        </div>
        <span
          className="ml-2 text-[#a89070] text-xs font-cinzel tracking-wider"
        >
          RP Hub — Ficha de Personagem
        </span>
        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded bg-[#c9a84c]/10 border border-[#c9a84c]/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[#c9a84c] text-xs font-inter">Live</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Character header */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #c9a84c20, #c9a84c10)", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            <span style={{ fontSize: "2rem" }}>⚔️</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="text-[#e8d5b0] truncate font-cinzel text-lg font-bold"
            >
              Thoradin Forja-Férrea
            </h3>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {["Guerreiro", "Nível 8", "Anão"].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-xs bg-[#c9a84c15] border border-[#c9a84c30] text-[#c9a84c] font-inter"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[#7a6a55] text-[10px] mb-0.5 font-inter uppercase tracking-tighter">Campanha</div>
            <div className="text-[#a89070] text-xs font-cinzel">As Minas Perdidas</div>
          </div>
        </div>

        {/* Main stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: Heart, label: "Vida", value: "78/85", color: "#8b1a1a", bg: "#8b1a1a20" },
            { icon: Shield, label: "CA", value: "18", color: "#4a8b9c", bg: "#4a8b9c20" },
            { icon: Zap, label: "Desloc.", value: "25 ft", color: "#c9a84c", bg: "#c9a84c20" },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div
              key={label}
              className="rounded-lg p-3 text-center border"
              style={{ background: bg, borderColor: `${color}30` }}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" style={{ color }} />
              <div className="text-[#e8d5b0] text-sm font-cinzel font-bold">
                {value}
              </div>
              <div className="text-[#7a6a55] text-[10px] mt-0.5 font-inter uppercase">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Ability Scores */}
        <div className="mb-5">
          <div
            className="text-[#a89070] text-[10px] tracking-[0.2em] uppercase mb-3 font-cinzel"
          >
            Atributos
          </div>
          <div className="grid grid-cols-6 gap-2">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="rounded-lg p-2 text-center bg-[#c9a84c05] border border-[#c9a84c15]"
              >
                <div
                  className="text-[#c9a84c] font-cinzel text-sm font-bold"
                >
                  {stat.mod}
                </div>
                <div
                  className="text-[#7a6a55] font-inter text-[8px]"
                >
                  {stat.name}
                </div>
                <div
                  className="text-[#a89070] mt-0.5 font-inter text-[10px]"
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div
            className="text-[#a89070] text-[10px] tracking-[0.2em] uppercase mb-3 font-cinzel"
          >
            Perícias
          </div>
          <div className="space-y-1.5">
            {skills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: skill.prof ? "#c9a84c" : "transparent",
                    border: `1px solid ${skill.prof ? "#c9a84c" : "rgba(201,168,76,0.3)"}`,
                  }}
                />
                <span className="text-[#a89070] text-xs flex-1 font-inter">
                  {skill.name}
                </span>
                <span className="text-[#c9a84c] text-xs font-cinzel font-bold">
                  {skill.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Campaign Dashboard Mockup
function CampaignDashboardMockup() {
  const quests = [
    { title: "O Ferreiro Desaparecido", status: "active", progress: 60 },
    { title: "Bandidos nas Estradas", status: "active", progress: 30 },
    { title: "Explorar a Cripta Perdida", status: "upcoming", progress: 0 },
  ];

  const party = [
    { name: "Thoradin", class: "Guerreiro", emoji: "⚔️", hp: "78/85" },
    { name: "Lyra", class: "Maga", emoji: "🔮", hp: "42/48" },
    { name: "Sylvan", class: "Ladino", emoji: "🗡️", hp: "56/56" },
    { name: "Mirela", class: "Clériga", emoji: "✨", hp: "61/70" },
  ];

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, #1a1510, #120e0b)",
        border: "1px solid rgba(201,168,76,0.25)",
        boxShadow: "0 0 60px rgba(0,0,0,0.6), 0 0 30px rgba(201,168,76,0.08)",
      }}
    >
      {/* Header bar */}
      <div
        className="px-5 py-3 flex items-center gap-2 border-b"
        style={{ borderColor: "rgba(201,168,76,0.15)", background: "rgba(201,168,76,0.05)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#8b1a1a]/80" />
          <div className="w-3 h-3 rounded-full bg-[#6b5a1a]/80" />
          <div className="w-3 h-3 rounded-full bg-[#1a4a1a]/80" />
        </div>
        <span
          className="ml-2 text-[#a89070] text-xs font-cinzel tracking-wider"
        >
          RP Hub — Painel da Mestra
        </span>
        <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded bg-[#c9a84c]/10 border border-[#c9a84c]/20">
          <Users className="w-3 h-3 text-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs font-inter">4 Jogadores</span>
        </div>
      </div>

      <div className="p-5">
        {/* Campaign header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3
              className="text-[#e8d5b0] font-cinzel text-lg font-bold"
            >
              A Mina Perdida de Phandelver
            </h3>
            <p className="text-[#7a6a55] text-xs mt-0.5 font-inter">
              D&D 5e · Sessão 12 · Mestre: Aldric
            </p>
          </div>
          <div
            className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-[#1a3a1a] border border-[#2a5a2a]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px] font-inter uppercase font-bold">
              Sessão Ativa
            </span>
          </div>
        </div>

        {/* Party overview */}
        <div className="mb-5">
          <div
            className="text-[#a89070] text-[10px] tracking-[0.2em] uppercase mb-3 font-cinzel"
          >
            Visão Geral do Grupo
          </div>
          <div className="grid grid-cols-2 gap-2">
            {party.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#c9a84c05] border border-[#c9a84c10]"
              >
                <span className="text-xl">{member.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-[#e8d5b0] text-[11px] truncate font-cinzel font-bold"
                  >
                    {member.name}
                  </div>
                  <div className="text-[#7a6a55] text-[9px] font-inter">
                    {member.class}
                  </div>
                </div>
                <div
                  className="text-[#c9a84c] text-[10px] flex-shrink-0 font-cinzel font-bold"
                >
                  ❤️ {member.hp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Quests */}
        <div>
          <div
            className="text-[#a89070] text-[10px] tracking-[0.2em] uppercase mb-3 flex items-center gap-2 font-cinzel"
          >
            <ScrollText className="w-3 h-3" />
            Missões Ativas
          </div>
          <div className="space-y-3">
            {quests.map((quest) => (
              <div key={quest.title} className="group/quest">
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[#a89070] text-[11px] flex items-center gap-1.5 font-inter"
                  >
                    <ChevronRight className="w-3 h-3 text-[#c9a84c] transition-transform group-hover/quest:translate-x-0.5" />
                    {quest.title}
                  </span>
                  <span
                    className="text-[10px] font-inter font-bold"
                    style={{
                      color: quest.status === "active" ? "#c9a84c" : "#7a6a55",
                    }}
                  >
                    {quest.status === "active" ? `${quest.progress}%` : "Em breve"}
                  </span>
                </div>
                {quest.status === "active" && (
                  <div className="h-1 rounded-full bg-[#1a1510] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: "linear-gradient(90deg, #c9a84c, #e0c06a)",
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${quest.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewSection() {
  const [activeTab, setActiveTab] = useState<"character" | "campaign">("character");

  return (
    <section id="preview" className="relative py-32 overflow-hidden">
      {/* Large glow behind the content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[1000px] h-[600px] rounded-full bg-[#c9a84c]/10 blur-[150px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span
            className="text-[#c9a84c] text-xs tracking-[0.25em] uppercase block mb-4 font-cinzel"
          >
            Contemple a Interface
          </span>
          <h2
            className="text-[#e8d5b0] mb-5 font-cinzel font-bold leading-tight"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            }}
          >
            Feito para o <span className="text-[#c9a84c]">Aventureiro Moderno</span>
          </h2>
          <p
            className="text-[#7a6a55] max-w-2xl mx-auto font-serif italic text-lg opacity-80"
          >
            Uma interface elegante que parece tão poderosa quanto o tomo de um mago e tão intuitiva quanto o menu de uma taverna.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div
            className="flex rounded-xl p-1 bg-[#110f0d]/80 border border-[#c9a84c15] backdrop-blur-md"
          >
            {[
              { key: "character", icon: Shield, label: "Ficha de Personagem" },
              { key: "campaign", icon: Map, label: "Painel de Campanha" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as "character" | "campaign")}
                className="flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 font-cinzel text-[11px] tracking-widest font-bold"
                style={{
                  background: activeTab === key ? "linear-gradient(135deg, #c9a84c, #a07830)" : "transparent",
                  color: activeTab === key ? "#0c0a08" : "#a89070",
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mockup container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >
            {activeTab === "character" ? (
              <CharacterSheetMockup />
            ) : (
              <CampaignDashboardMockup />
            )}
            
            {/* Soft decorative light */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#c9a84c05] blur-3xl pointer-events-none -z-10" />
          </motion.div>
        </AnimatePresence>

        {/* Floating badges / Supported systems */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-12"
        >
          {["D&D 5e", "Pathfinder 2e", "Shadowrun", "Call of Cthulhu", "Cyberpunk RED", "Vampire: The Masquerade"].map(
            (system) => (
              <span
                key={system}
                className="px-3 py-1.5 rounded-full text-[10px] bg-[#c9a84c08] border border-[#c9a84c15] text-[#a89070] font-inter font-medium tracking-wide"
              >
                {system}
              </span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
}
