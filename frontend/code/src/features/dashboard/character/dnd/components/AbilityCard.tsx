import { Plus, Minus, Check } from "lucide-react";
import type { AbilityKey } from "../types/character.types";
import { ABILITY_LABELS } from "../constants/character.constants";
import {
  calculateAbilityModifier,
  clamp,
  formatModifier,
} from "../utils/character.utils";
import { useTranslation } from "react-i18next";

interface AbilityCardProps {
  ability: AbilityKey;
  score: number;
  onChange: (value: number) => void;
  isSaveProficient: boolean;
  onToggleSave: () => void;
  proficiencyBonus: number;
  classColor: string;
}

export function AbilityCard({
  ability,
  score,
  onChange,
  isSaveProficient,
  onToggleSave,
  proficiencyBonus,
  classColor,
}: AbilityCardProps) {
  const { t } = useTranslation("character");
  const modifier = calculateAbilityModifier(score);
  const saveTotal = modifier + (isSaveProficient ? proficiencyBonus : 0);

  return (
    <div
      className="flex flex-col items-center justify-between rounded-xl border border-[#2a1f0f] hover:border-[#3d2e1a] transition-all duration-200 py-3 px-1 relative overflow-hidden group w-[110px] h-[130px] mx-auto"
      style={{ background: "#140f0a" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, ${classColor}60, transparent)`,
        }}
      />

      <span
        className="text-[#4a3820] text-xs tracking-widest uppercase group-hover:text-[#6b5a3e] transition-colors"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {t(ABILITY_LABELS[ability])}
      </span>

      <div className="flex items-center justify-center">
        <span
          className="min-w-[2.5rem] text-center"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: classColor,
          }}
        >
          {modifier >= 0 ? `+${modifier}` : modifier}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(clamp(score - 1, 1, 30))}
          className="w-5 h-5 flex items-center justify-center text-[#3d2e1a] hover:text-[#c9a84c] transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <input
          type="number"
          value={score}
          min={1}
          max={30}
          onChange={(e) => onChange(clamp(Number(e.target.value) || 10, 1, 30))}
          className="w-10 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 rounded-lg text-[#e8d5b0] outline-none py-1 text-sm transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
        />

        <button
          onClick={() => onChange(clamp(score + 1, 1, 30))}
          className="w-5 h-5 flex items-center justify-center text-[#3d2e1a] hover:text-[#c9a84c] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        onClick={onToggleSave}
        className="flex items-center gap-1.5 transition-colors mt-0.5"
        style={{ color: isSaveProficient ? "#c9a84c" : "#4a3820" }}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all ${
            isSaveProficient ? "border-[#c9a84c]" : "border-[#4a3820]"
          }`}
          style={{ background: isSaveProficient ? classColor : "transparent" }}
        >
          {isSaveProficient && <Check className="w-1.5 h-1.5 text-[#0c0a08]" />}
        </span>
        <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
          {isSaveProficient
            ? `${saveTotal >= 0 ? "+" : ""}${saveTotal}`
            : formatModifier(score)}{" "}
          {t("overview.save", "save")}
        </span>
      </button>
    </div>
  );
}
