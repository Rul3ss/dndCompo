import { ABILITY_LABELS } from "../constants/character.constants";
import { fontStyles } from "../constants/theme";
import type { AbilityKey } from "../types/character.types";
import { useTranslation } from "react-i18next";

interface Skill {
  key: string;
  labelKey: string;
  ability: AbilityKey;
}

interface SkillRowProps {
  skill: Skill;
  abilityModifier: number;
  isProficient: boolean;
  hasExpertise: boolean;
  proficiencyBonus: number;
  onToggle: () => void;
}

export function SkillRow({
  skill,
  abilityModifier,
  isProficient,
  hasExpertise,
  proficiencyBonus,
  onToggle,
}: SkillRowProps) {
  const { t } = useTranslation(["character"]);
  const bonus =
    abilityModifier + (hasExpertise ? proficiencyBonus * 2 : isProficient ? proficiencyBonus : 0);

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2.5 py-1.5 hover:bg-[#1a1510]/50 rounded-lg px-2 transition-colors w-full text-left group"
    >
      {/* Proficiency indicator dot */}
      <span
        className={`w-3 h-3 rounded-full border shrink-0 flex items-center justify-center transition-all ${
          hasExpertise
            ? "bg-[#c9a84c] border-[#c9a84c]"
            : isProficient
              ? "border-[#c9a84c]"
              : "border-[#3d2e1a] group-hover:border-[#4a3820]"
        }`}
      >
        {(isProficient || hasExpertise) && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: hasExpertise ? "#0c0a08" : "#c9a84c" }}
          />
        )}
      </span>

      {/* Bonus value */}
      <span
        className="text-[#6b5a3e] text-xs w-5 text-center"
        style={{
          fontFamily: "'Cinzel', serif",
          color: bonus >= 0 ? "#c9a84c" : "#ef4444",
          fontWeight: 600,
        }}
      >
        {bonus >= 0 ? `+${bonus}` : bonus}
      </span>

      {/* Skill name */}
      <span className="text-[#a89070] text-sm flex-1" style={fontStyles.body}>
        {t(skill.labelKey)}
      </span>

      {/* Ability abbreviation */}
      <span className="text-[#3d2e1a] text-xs uppercase" style={fontStyles.display}>
        {t(ABILITY_LABELS[skill.ability])}
      </span>
    </button>
  );
}
