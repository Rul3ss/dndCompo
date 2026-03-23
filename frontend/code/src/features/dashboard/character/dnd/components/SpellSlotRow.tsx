import { fontStyles } from "../constants/theme";
import { useTranslation } from "react-i18next";

interface SpellSlot {
  max: number;
  used: number;
}

interface SpellSlotRowProps {
  level: number;
  slot: SpellSlot;
  onChange: (slot: SpellSlot) => void;
}

export function SpellSlotRow({ level, slot, onChange }: SpellSlotRowProps) {
  const availableSlots = slot.max - slot.used;
  const { t } = useTranslation("character");

  function handleToggleSlot(slotIndex: number) {
    const isUsed = slotIndex >= availableSlots;
    onChange({
      ...slot,
      used: isUsed ? slot.used - 1 : slot.used + 1,
    });
  }

  return (
    <div className="flex items-center gap-3 py-2 border-b border-[#1a1510]">
      <div className="w-16 shrink-0">
        <span className="text-[#4a3820] text-xs" style={fontStyles.display}>
          {t("spells.level", "Level")} {level}
        </span>
      </div>

      {/* Max slot input */}
      <input
        type="number"
        value={slot.max}
        min={0}
        max={9}
        onChange={(e) => {
          const newMax = Number(e.target.value) || 0;
          onChange({ max: newMax, used: Math.min(slot.used, newMax) });
        }}
        className="w-10 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 rounded text-[#a89070] outline-none text-xs py-0.5 transition-colors shrink-0"
        style={fontStyles.display}
      />

      {/* Slot bubbles */}
      <div className="flex flex-wrap gap-1.5 flex-1">
        {Array.from({ length: slot.max }).map((_, index) => {
          const isUsed = index >= availableSlots;
          return (
            <button
              key={index}
              onClick={() => handleToggleSlot(index)}
              className="w-5 h-5 rounded-full border transition-all duration-200"
              style={{
                borderColor: isUsed ? "#3d2e1a" : "#a855f7",
                background: isUsed ? "transparent" : "#a855f720",
              }}
            />
          );
        })}
        {slot.max === 0 && (
          <span className="text-[#3d2e1a] text-xs" style={fontStyles.body}>
            {t("spells.setMaxSlots", "Set max slots →")}
          </span>
        )}
      </div>

      {/* Available / Max indicator */}
      <span className="text-[#6b5a3e] text-xs shrink-0" style={fontStyles.body}>
        {availableSlots}/{slot.max}
      </span>
    </div>
  );
}
