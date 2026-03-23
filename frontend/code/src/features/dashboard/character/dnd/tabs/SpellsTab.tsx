import { Plus, Trash2, Sparkles, BookOpen, Check } from "lucide-react";
import type { CharacterState, UpdateFieldFn, SpellEntry, AbilityKey } from "../types/character.types";
import { ABILITIES, ABILITY_FULL_NAMES, SCHOOLS } from "../constants/character.constants";
import {
  calculateAbilityModifier,
  getProficiencyBonus,
  formatModifier,
  generateId,
} from "../utils/character.utils";
import { LABEL_CLASS, fontStyles } from "../constants/theme";
import { SpellSlotRow } from "../components/SpellSlotRow";
import { useTranslation } from "react-i18next";
interface SpellsTabProps {
  character: CharacterState;
  updateField: UpdateFieldFn;
}

export function SpellsTab({ character, updateField }: SpellsTabProps) {
  const { t } = useTranslation("character");
  const proficiencyBonus = getProficiencyBonus(character.level);
  const spellModifier = character.spellcastingAbility
    ? calculateAbilityModifier(character[character.spellcastingAbility])
    : 0;
  const spellSaveDC = character.spellcastingAbility
    ? 8 + proficiencyBonus + spellModifier
    : 0;
  const spellAttackBonus = character.spellcastingAbility
    ? proficiencyBonus + spellModifier
    : 0;

  function addSpell() {
    updateField("spells", [
      ...character.spells,
      { id: generateId(), name: "", level: 0, school: "Evocation", prepared: false },
    ]);
  }

  function updateSpell(
    id: string,
    field: keyof SpellEntry,
    value: string | number | boolean,
  ) {
    updateField(
      "spells",
      character.spells.map((spell) =>
        spell.id === id ? { ...spell, [field]: value } : spell,
      ),
    );
  }

  function removeSpell(id: string) {
    updateField(
      "spells",
      character.spells.filter((spell) => spell.id !== id),
    );
  }

  function updateSpellSlot(level: number, slot: { max: number; used: number }) {
    updateField("spellSlots", { ...character.spellSlots, [level]: slot });
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Spellcasting Stats */}
      <div
        className="rounded-xl border border-[#2a1f0f] p-4"
        style={{ background: "#140f0a" }}
      >
        <p className={LABEL_CLASS} style={fontStyles.display}>
          {t("spells.spellcasting", "Spellcasting")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className={LABEL_CLASS} style={fontStyles.display}>
              {t("spells.castingAbility", "Casting Ability")}
            </label>
            <select
              value={character.spellcastingAbility}
              onChange={(e) =>
                updateField("spellcastingAbility", e.target.value as AbilityKey | "")
              }
              className="bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/50 rounded-lg text-[#e8d5b0] outline-none text-sm px-3 py-2 transition-colors w-full cursor-pointer"
              style={{ ...fontStyles.body, background: "#0f0c09" }}
            >
              <option value="">— {t("spells.none", "None")} —</option>
              {ABILITIES.map((ability) => (
                <option key={ability} value={ability}>
                  {ABILITY_FULL_NAMES[ability]}
                </option>
              ))}
            </select>
          </div>

          {[
            {
              label: t("spells.spellDC", "Spell DC"),
              value: character.spellcastingAbility ? spellSaveDC : "—",
              color: "#a855f7",
            },
            {
              label: t("spells.spellAttack", "Spell Attack"),
              value: character.spellcastingAbility
                ? spellAttackBonus >= 0
                  ? `+${spellAttackBonus}`
                  : spellAttackBonus
                : "—",
              color: "#c9a84c",
            },
            {
              label: t("spells.modBonus", "Mod Bonus"),
              value: character.spellcastingAbility
                ? formatModifier(character[character.spellcastingAbility])
                : "—",
              color: "#60a5fa",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex flex-col items-center bg-[#0f0c09] border border-[#2a1f0f] rounded-xl py-3"
            >
              <span
                style={{
                  color,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                }}
              >
                {value}
              </span>
              <span className={LABEL_CLASS + " mb-0"} style={fontStyles.display}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Spell Slots */}
      <div
        className="rounded-xl border border-[#2a1f0f] overflow-hidden"
        style={{ background: "#140f0a" }}
      >
        <div className="px-4 py-3 border-b border-[#1a1510] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#a855f7]" />
          <span
            className="text-[#a89070] text-sm"
            style={{ ...fontStyles.display, fontWeight: 600 }}
          >
            {t("spells.spellSlots", "Spell Slots")}
          </span>
        </div>
        <div className="px-4 py-3">
          {Object.entries(character.spellSlots).map(([level, slot]) => (
            <SpellSlotRow
              key={level}
              level={Number(level)}
              slot={slot}
              onChange={(updatedSlot) => updateSpellSlot(Number(level), updatedSlot)}
            />
          ))}
        </div>
      </div>

      {/* Known Spells */}
      <div
        className="rounded-xl border border-[#2a1f0f] overflow-hidden"
        style={{ background: "#140f0a" }}
      >
        <div className="px-4 py-3 border-b border-[#1a1510] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#a855f7]" />
            <span
              className="text-[#a89070] text-sm"
              style={{ ...fontStyles.display, fontWeight: 600 }}
            >
              {t("spells.knownSpells", "Known Spells")}
            </span>
          </div>
          <button
            onClick={addSpell}
            className="flex items-center gap-1 text-[#a855f7] hover:text-[#e8d5b0] text-xs transition-colors"
            style={fontStyles.body}
          >
            <Plus className="w-3.5 h-3.5" /> {t("spells.addSpell", "Add Spell")}
          </button>
        </div>

        <div className="divide-y divide-[#1a1510]">
          {character.spells.map((spell) => (
            <div
              key={spell.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1510]/40 transition-colors"
            >
              {/* Prepared toggle */}
              <button
                onClick={() => updateSpell(spell.id, "prepared", !spell.prepared)}
                className="w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-all"
                style={{
                  borderColor: spell.prepared ? "#a855f7" : "#3d2e1a",
                  background: spell.prepared ? "#a855f720" : "transparent",
                }}
              >
                {spell.prepared && <Check className="w-3 h-3" style={{ color: "#a855f7" }} />}
              </button>

              {/* Spell name */}
              <input
                value={spell.name}
                onChange={(e) => updateSpell(spell.id, "name", e.target.value)}
                placeholder={t("spells.spellNamePlaceholder", "Spell name")}
                className="flex-1 bg-transparent text-[#e8d5b0] placeholder:text-[#3d2e1a] outline-none text-sm"
                style={fontStyles.body}
              />

              {/* Spell level */}
              <select
                value={spell.level}
                onChange={(e) => updateSpell(spell.id, "level", Number(e.target.value))}
                className="bg-[#0f0c09] border border-[#2a1f0f] rounded text-xs text-[#a855f7] outline-none px-2 py-1 cursor-pointer"
                style={fontStyles.display}
              >
                <option value={0}>{t("spells.cantrip", "Cantrip")}</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>

              {/* Magic school */}
              <select
                value={spell.school}
                onChange={(e) => updateSpell(spell.id, "school", e.target.value)}
                className="bg-[#0f0c09] border border-[#2a1f0f] rounded text-xs text-[#6b5a3e] outline-none px-2 py-1 cursor-pointer hidden sm:block"
                style={fontStyles.body}
              >
                {SCHOOLS.map((school) => (
                  <option key={school} value={school}>
                    {t(`schools.${school}`, school)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => removeSpell(spell.id)}
                className="text-[#3d2e1a] hover:text-[#ef4444] transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {character.spells.length === 0 && (
            <div
              className="px-4 py-6 text-center text-[#3d2e1a] text-sm"
              style={fontStyles.body}
            >
              {t("spells.noSpells", "No spells yet — add one above")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
