import type { CharacterState, UpdateFieldFn } from "../types/character.types";
import { LABEL_CLASS, INPUT_CLASS, fontStyles } from "../constants/theme";
import { HPTracker } from "../components/HPTracker";
import { DeathSaves } from "../components/DeathSaves";
import { AttacksTable } from "../components/AttacksTable";
import { useTranslation } from "react-i18next";

interface CombatTabProps {
  character: CharacterState;
  updateField: UpdateFieldFn;
}

const COMBAT_STAT_FIELDS = [
  {
    labelKey: "combat.armorClass",
    key: "armorClass" as keyof CharacterState,
    color: "#60a5fa",
  },
  {
    labelKey: "combat.speed",
    key: "speed" as keyof CharacterState,
    color: "#e8d5b0",
  },
] as const;

export function CombatTab({ character, updateField }: CombatTabProps) {
  const { t } = useTranslation("character");

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left column — HP & Death Saves */}
        <div className="space-y-4">
          <HPTracker character={character} updateField={updateField} />
          <DeathSaves character={character} updateField={updateField} />
        </div>

        {/* Right column — Combat Statistics */}
        <div
          className="rounded-xl border border-[#2a1f0f] p-5"
          style={{ background: "#140f0a" }}
        >
          <p className={LABEL_CLASS} style={fontStyles.display}>
            {t("combat.combatStatistics", "Combat Statistics")}
          </p>

          <div className="grid grid-cols-2 gap-3">
            {COMBAT_STAT_FIELDS.map(({ labelKey, key, color }) => (
              <div
                key={labelKey}
                className="flex flex-col items-center rounded-xl bg-[#0f0c09] border border-[#2a1f0f] py-4 px-2 gap-1"
              >
                <input
                  type="number"
                  value={character[key] as number}
                  onChange={(e) =>
                    updateField(key, Number(e.target.value) || 0)
                  }
                  className="w-16 text-center bg-transparent outline-none"
                  style={{
                    color,
                    fontFamily: "'Cinzel', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                />
                <span
                  className={LABEL_CLASS + " mb-0 whitespace-nowrap overflow-hidden text-ellipsis"}
                  style={fontStyles.display}
                >
                  {t(labelKey.replace("character:", ""))}
                </span>
              </div>
            ))}
          </div>

          {/* Hit Dice */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className={LABEL_CLASS} style={fontStyles.display}>
                {t("combat.hitDice", "Hit Dice")}
              </label>
              <input
                type="text"
                value={character.hitDice}
                onChange={(e) => updateField("hitDice", e.target.value)}
                placeholder={t("combat.hitDicePlaceholder", "{{count}}d8", { count: character.level })}
                className={INPUT_CLASS}
                style={fontStyles.display}
              />
            </div>
            <div>
              <label className={LABEL_CLASS} style={fontStyles.display}>
                {t("combat.hitDiceLeft", "Hit Dice Left")}
              </label>
              <input
                type="number"
                min={0}
                max={character.level}
                value={character.hitDiceRemaining}
                onChange={(e) =>
                  updateField("hitDiceRemaining", Number(e.target.value) || 0)
                }
                className={INPUT_CLASS}
                style={fontStyles.display}
              />
            </div>
          </div>

          {/* Combat Notes */}
          <div className="mt-4">
            <label className={LABEL_CLASS} style={fontStyles.display}>
              {t("combat.combatNotes", "Combat Notes")}
            </label>
            <textarea
              rows={3}
              value={character.combatNotes}
              onChange={(e) => updateField("combatNotes", e.target.value)}
              placeholder={t("combat.combatNotesPlaceholder", "Conditions, notes, reactions...")}
              className="w-full bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 rounded-lg text-[#a89070] placeholder:text-[#2a1f0f] outline-none px-3 py-2 resize-none text-sm leading-relaxed transition-colors"
              style={fontStyles.body}
            />
          </div>
        </div>
      </div>

      <AttacksTable
        attacks={character.attacks}
        onChange={(attacks) => updateField("attacks", attacks)}
      />
    </div>
  );
}
