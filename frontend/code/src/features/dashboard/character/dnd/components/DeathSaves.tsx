import { Check } from "lucide-react";
import type { CharacterState, UpdateFieldFn } from "../types/character.types";
import { LABEL_CLASS, fontStyles } from "../constants/theme";
import { useTranslation } from "react-i18next";

interface DeathSavesProps {
  character: CharacterState;
  updateField: UpdateFieldFn;
}

export function DeathSaves({ character, updateField }: DeathSavesProps) {
  const { t } = useTranslation("character");

  function handleToggleSuccess(index: number) {
    updateField("deathSucc", character.deathSucc === index ? index - 1 : index);
  }

  function handleToggleFailure(index: number) {
    updateField("deathFail", character.deathFail === index ? index - 1 : index);
  }

  return (
    <div
      className="rounded-xl border border-[#2a1f0f] p-3"
      style={{ background: "#140f0a" }}
    >
      <p className={LABEL_CLASS} style={fontStyles.display}>
        {t("combat.deathSavingThrows", "Death Saving Throws")}
      </p>

      <div className="flex flex-col gap-2">
        {/* Successes */}
        <div className="flex items-center gap-2">
          <span
            className="text-[#22c55e] text-xs w-20"
            style={fontStyles.body}
          >
            {t("combat.successes", "Successes")}
          </span>
          <div className="flex gap-1">
            {[1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => handleToggleSuccess(index)}
                className="w-6 h-6 rounded-full border transition-all duration-200"
                style={{
                  borderColor: index <= character.deathSucc ? "#22c55e" : "#3d2e1a",
                  background: index <= character.deathSucc ? "#22c55e" : "transparent",
                }}
              >
                {index <= character.deathSucc && (
                  <Check className="w-3 h-3 text-[#0c0a08] m-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Failures */}
        <div className="flex items-center gap-3">
          <span
            className="text-[#ef4444] text-xs w-20"
            style={fontStyles.body}
          >
            {t("combat.failures", "Failures")}
          </span>
          <div className="flex gap-2">
            {[1, 2, 3].map((index) => (
              <button
                key={index}
                onClick={() => handleToggleFailure(index)}
                className="w-6 h-6 rounded-full border transition-all duration-200 flex items-center justify-center"
                style={{
                  borderColor: index <= character.deathFail ? "#ef4444" : "#3d2e1a",
                  background: index <= character.deathFail ? "#ef4444" : "transparent",
                }}
              >
                {index <= character.deathFail && (
                  <span className="text-[#0c0a08] text-xs leading-none">✕</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
