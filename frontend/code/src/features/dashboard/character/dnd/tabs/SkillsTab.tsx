import type { CharacterState, UpdateFieldFn, AbilityKey } from "../types/character.types";
import { ALL_SKILLS, ABILITIES, ABILITY_FULL_NAMES } from "../constants/character.constants";
import { calculateAbilityModifier, getProficiencyBonus } from "../utils/character.utils";
import { LABEL_CLASS, fontStyles } from "../constants/theme";
import { SkillRow } from "../components/SkillRow";
import { useTranslation } from "react-i18next";

interface SkillsTabProps {
  character: CharacterState;
  updateField: UpdateFieldFn;
}

export function SkillsTab({ character, updateField }: SkillsTabProps) {
  const { t } = useTranslation("character");
  const proficiencyBonus = getProficiencyBonus(character.level);

  function toggleSkill(skillKey: string) {
    const isProficient = character.skillProficiencies.includes(skillKey);
    const hasExpertise = character.skillExpertise.includes(skillKey);

    if (hasExpertise) {
      // Expertise → remove both proficiency and expertise
      updateField(
        "skillExpertise",
        character.skillExpertise.filter((k) => k !== skillKey),
      );
      updateField(
        "skillProficiencies",
        character.skillProficiencies.filter((k) => k !== skillKey),
      );
    } else if (isProficient) {
      // Proficient → upgrade to expertise
      updateField("skillExpertise", [...character.skillExpertise, skillKey]);
    } else {
      // Not proficient → add proficiency
      updateField("skillProficiencies", [...character.skillProficiencies, skillKey]);
    }
  }

  function toggleSaveProficiency(ability: AbilityKey) {
    const isProficient = character.saveProficiencies.includes(ability);
    const updated = isProficient
      ? character.saveProficiencies.filter((a) => a !== ability)
      : [...character.saveProficiencies, ability];
    updateField("saveProficiencies", updated);
  }

  return (
    <div className="p-4 md:p-6">
      {/* Legend */}
      <div
        className="flex items-center gap-6 mb-5 text-xs"
        style={fontStyles.body}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-[#3d2e1a]" />
          {t("skills.notProficient", "Not proficient")}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-[#c9a84c] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
          </span>{" "}
          <span className="text-[#a89070]">{t("skills.proficient", "Proficient")}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#c9a84c] border border-[#c9a84c] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0c0a08]" />
          </span>{" "}
          <span className="text-[#c9a84c]">{t("skills.expertise", "Expertise")}</span>
        </div>
        <span className="text-[#3d2e1a]">{t("skills.clickToCycle", "Click to cycle")}</span>
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {ALL_SKILLS.map((skill) => (
          <SkillRow
            key={skill.key}
            skill={skill}
            abilityModifier={calculateAbilityModifier(character[skill.ability])}
            isProficient={character.skillProficiencies.includes(skill.key)}
            hasExpertise={character.skillExpertise.includes(skill.key)}
            proficiencyBonus={proficiencyBonus}
            onToggle={() => toggleSkill(skill.key)}
          />
        ))}
      </div>

      {/* Saving Throws Summary */}
      <div
        className="mt-6 rounded-xl border border-[#2a1f0f] p-4"
        style={{ background: "#140f0a" }}
      >
        <p className={LABEL_CLASS} style={fontStyles.display}>
          {t("skills.savingThrowsSummary", "Saving Throws Summary")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ABILITIES.map((ability) => {
            const isProficient = character.saveProficiencies.includes(ability);
            const total =
              calculateAbilityModifier(character[ability]) +
              (isProficient ? proficiencyBonus : 0);
            return (
              <button
                key={ability}
                onClick={() => toggleSaveProficiency(ability)}
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[#1a1510]/50 transition-colors"
              >
                <span
                  className={`w-3 h-3 rounded-full border shrink-0 flex items-center justify-center ${
                    isProficient ? "border-[#c9a84c]" : "border-[#3d2e1a]"
                  }`}
                >
                  {isProficient && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                  )}
                </span>
                <span
                  className="text-[#c9a84c] text-xs w-8"
                  style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
                >
                  {total >= 0 ? `+${total}` : total}
                </span>
                <span className="text-[#a89070] text-sm" style={fontStyles.body}>
                  {t(ABILITY_FULL_NAMES[ability])}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
