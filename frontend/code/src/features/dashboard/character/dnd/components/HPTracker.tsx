import { motion } from "framer-motion";
import type { CharacterState, UpdateFieldFn } from "../types/character.types";
import { clamp, getHpColor } from "../utils/character.utils";
import { LABEL_CLASS, fontStyles } from "../constants/theme";
import { useTranslation } from "react-i18next";

interface HPTrackerProps {
  character: CharacterState;
  updateField: UpdateFieldFn;
}

export function HPTracker({ character, updateField }: HPTrackerProps) {
  const { t } = useTranslation("character");
  const hpPercent =
    character.maxHp > 0
      ? clamp((character.currentHp / character.maxHp) * 100, 0, 100)
      : 0;
  const hpColor = getHpColor(hpPercent);
  const maxCurrentHp = character.maxHp + character.tempHp;

  return (
    <div
      className="rounded-xl border border-[#2a1f0f] p-3"
      style={{ background: "#140f0a" }}
    >
      <p className={LABEL_CLASS} style={fontStyles.display}>
        {t("combat.hitPoints", "Hit Points")}
      </p>

      <div className="h-1.5 bg-[#0f0c09] rounded-full overflow-hidden mb-3">
        <motion.div
          animate={{ width: `${hpPercent}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full"
          style={{ background: hpColor }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Current HP */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                updateField("currentHp", clamp(character.currentHp - 1, 0, maxCurrentHp))
              }
              className="w-8 h-8 rounded-lg bg-[#0f0c09] border border-[#2a1f0f] flex items-center justify-center text-[#ef4444] hover:border-[#ef4444]/40 transition-colors"
            >
              <span className="text-lg leading-none">-</span>
            </button>
            <input
              type="number"
              value={character.currentHp}
              onChange={(e) =>
                updateField("currentHp", clamp(Number(e.target.value) || 0, 0, 999))
              }
              className="w-14 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#22c55e]/50 rounded-lg outline-none py-1.5"
              style={{
                color: hpColor,
                fontFamily: "'Cinzel', serif",
                fontSize: "1.2rem",
                fontWeight: 700,
              }}
            />
            <button
              onClick={() =>
                updateField("currentHp", clamp(character.currentHp + 1, 0, maxCurrentHp))
              }
              className="w-8 h-8 rounded-lg bg-[#0f0c09] border border-[#2a1f0f] flex items-center justify-center text-[#22c55e] hover:border-[#22c55e]/40 transition-colors"
            >
              <span className="text-lg leading-none">+</span>
            </button>
          </div>
          <span className={LABEL_CLASS + " text-[8px] mt-0.5"}>
            {t("combat.currentHp", "Current HP")}
          </span>
        </div>

        {/* Max HP */}
        <div className="flex flex-col items-center gap-1">
          <input
            type="number"
            value={character.maxHp}
            onChange={(e) => updateField("maxHp", Number(e.target.value) || 0)}
            className="w-14 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/50 rounded-lg text-[#e8d5b0] outline-none py-1.5"
            style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", fontWeight: 700 }}
          />
          <span className={LABEL_CLASS + " text-[8px] mt-0.5"}>
            {t("combat.maxHp", "Max HP")}
          </span>
        </div>

        {/* Temp HP */}
        <div className="flex flex-col items-center gap-1">
          <input
            type="number"
            value={character.tempHp}
            onChange={(e) => updateField("tempHp", Number(e.target.value) || 0)}
            className="w-14 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#60a5fa]/50 rounded-lg outline-none py-1.5"
            style={{
              color: "#60a5fa",
              fontFamily: "'Cinzel', serif",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          />
          <span className={LABEL_CLASS + " text-[8px] mt-0.5"}>
            {t("combat.tempHp", "Temp HP")}
          </span>
        </div>
      </div>
    </div>
  );
}

function clampHp(value: number, min: number, max: number): number {
  return clamp(value, min, max);
}

// Re-export clampHp para uso dos botões de HP (alias explícito para legibilidade local)
export { clampHp };
