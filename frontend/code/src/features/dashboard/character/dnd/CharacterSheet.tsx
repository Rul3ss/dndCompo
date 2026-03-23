import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Scroll, Check, Loader2, Heart, Sword } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useCharacter } from "./hooks/useCharacter";
import {
  CLASS_COLORS,
  CLASS_ICONS,
  SHEET_TABS,
} from "./constants/character.constants";
import {
  getProficiencyBonus,
  getHpColor,
  clamp,
} from "./utils/character.utils";
import { fontStyles } from "./constants/theme";

import { OverviewTab } from "./tabs/OverviewTab";
import { CombatTab } from "./tabs/CombatTab";
import { SkillsTab } from "./tabs/SkillsTab";
import { SpellsTab } from "./tabs/SpellsTab";
import { InventoryTab } from "./tabs/InventoryTab";
import { StoryTab } from "./tabs/StoryTab";

import { useState } from "react";
import type { TabId } from "./constants/character.constants";

// ─── Tab Content Router ──────────────────────────────────────────────────────────

function TabContent({
  activeTab,
  character,
  updateField,
  classColor,
}: {
  activeTab: TabId;
  character: ReturnType<typeof useCharacter>["character"];
  updateField: ReturnType<typeof useCharacter>["updateField"];
  classColor: string;
}) {
  switch (activeTab) {
    case "overview":
      return (
        <OverviewTab
          character={character}
          updateField={updateField}
          classColor={classColor}
        />
      );
    case "combat":
      return <CombatTab character={character} updateField={updateField} />;
    case "skills":
      return <SkillsTab character={character} updateField={updateField} />;
    case "spells":
      return <SpellsTab character={character} updateField={updateField} />;
    case "inventory":
      return <InventoryTab character={character} updateField={updateField} />;
    case "story":
      return <StoryTab character={character} updateField={updateField} />;
  }
}

// ─── Loading State ───────────────────────────────────────────────────────────────

function LoadingScreen() {
  const { t } = useTranslation("character");
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0c0a08" }}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-[#c9a84c] animate-spin" />
        <p className="text-[#a89070] font-cinzel tracking-widest uppercase">
          {t("loading")}
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────

export default function CharacterSheet() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { t } = useTranslation("character");

  const {
    character,
    updateField,
    isLoading,
    isSaving,
    saveSuccess,
    error,
    handleSave,
  } = useCharacter(id);

  const classColor = CLASS_COLORS[character.charClass] ?? "#c9a84c";
  const ClassIcon = CLASS_ICONS[character.charClass] ?? Sword;
  const proficiencyBonus = getProficiencyBonus(character.level);
  const hpPercent =
    character.maxHp > 0
      ? clamp((character.currentHp / character.maxHp) * 100, 0, 100)
      : 0;
  const hpColor = getHpColor(hpPercent);

  if (isLoading) return <LoadingScreen />;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0c0a08" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b border-[#2a1f0f]"
        style={{ background: "#0f0c09" }}
      >
        {/* Class color accent line */}
        <div
          className="h-0.5"
          style={{
            background: `linear-gradient(90deg, ${classColor}, ${classColor}40, transparent)`,
          }}
        />

        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center gap-4">
            {/* Back button */}
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-[#4a3820] hover:text-[#c9a84c] transition-colors shrink-0 text-sm"
              style={fontStyles.body}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{t("backToDashboard", "Dashboard")}</span>
            </Link>

            {/* Class icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: classColor + "20" }}
            >
              <ClassIcon className="w-5 h-5" style={{ color: classColor }} />
            </div>

            {/* Character name & summary */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={character.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder={t("characterNamePlaceholder", "Nome do Personagem")}
                className="bg-transparent text-[#e8d5b0] placeholder:text-[#3d2e1a] outline-none w-full truncate"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                  fontWeight: 700,
                }}
              />

              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: classColor + "20",
                    color: classColor,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {t(`classes.${character.charClass}`, character.charClass)}
                </span>
                <span
                  className="text-[#4a3820] text-xs"
                  style={fontStyles.body}
                >
                  {t(`races.${character.race}`, character.race)}
                </span>
                <span className="text-[#3d2e1a] text-xs">·</span>
                <span
                  className="text-[#4a3820] text-xs"
                  style={fontStyles.display}
                >
                  {t("level")} {character.level}
                </span>
                <span className="text-[#3d2e1a] text-xs">·</span>
                <span
                  className="text-[#4a3820] text-xs flex items-center gap-1"
                  style={fontStyles.body}
                >
                  <Heart className="w-3 h-3" style={{ color: hpColor }} />
                  {character.currentHp}/{character.maxHp} HP
                </span>
                <span className="text-[#3d2e1a] text-xs">·</span>
                <span
                  className="text-[#4a3820] text-xs"
                  style={fontStyles.body}
                >
                  {t("prof")} +{proficiencyBonus}
                </span>
              </div>
            </div>

            {/* Save button */}
            <motion.button
              onClick={handleSave}
              whileTap={{ scale: 0.95 }}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm shrink-0 transition-all duration-300 disabled:opacity-60"
              style={{
                background: saveSuccess
                  ? "linear-gradient(135deg, #22c55e20, #16a34a20)"
                  : `linear-gradient(135deg, ${classColor}30, ${classColor}15)`,
                border: `1px solid ${saveSuccess ? "#22c55e60" : classColor + "50"}`,
                color: saveSuccess ? "#22c55e" : classColor,
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4" />
              ) : (
                <Scroll className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {isSaving
                  ? t("saving", "Salvando…")
                  : saveSuccess
                    ? t("saved", "Salvo!")
                    : t("saveSheet", "Salvar Ficha")}
              </span>
            </motion.button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-[#1a1510] overflow-x-auto scrollbar-hide">
          {SHEET_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-all duration-200 relative shrink-0"
                style={{
                  color: isActive ? classColor : "#4a3820",
                  fontFamily: "'Cinzel', serif",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t(tab.labelKey)}</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: classColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabContent
              activeTab={activeTab}
              character={character}
              updateField={updateField}
              classColor={classColor}
            />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
