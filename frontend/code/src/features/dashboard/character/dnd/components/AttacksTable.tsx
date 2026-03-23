import { Plus, Trash2, Swords } from "lucide-react";
import type { Attack } from "../types/character.types";
import { generateId } from "../utils/character.utils";
import { fontStyles } from "../constants/theme";
import { useTranslation } from "react-i18next";

interface AttacksTableProps {
  attacks: Attack[];
  onChange: (attacks: Attack[]) => void;
}

const COLUMN_INPUT_CLASS =
  "bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 text-[#e8d5b0] outline-none rounded px-2 py-1.5 text-sm transition-colors";

const ATTACK_TABLE_HEADERS = [
  "combat.attackName",
  "combat.atkBonus",
  "combat.damage",
  "combat.damageType",
  "combat.emptyHeader"
];

export function AttacksTable({ attacks, onChange }: AttacksTableProps) {
  const { t } = useTranslation("character");

  function addAttack() {
    onChange([
      ...attacks,
      {
        id: generateId(),
        name: "",
        atkBonus: "+0",
        damageDice: "1d6",
        damageType: "Piercing",
      },
    ]);
  }

  function updateAttack(id: string, field: keyof Attack, value: string) {
    onChange(attacks.map((attack) => (attack.id === id ? { ...attack, [field]: value } : attack)));
  }

  function removeAttack(id: string) {
    onChange(attacks.filter((attack) => attack.id !== id));
  }

  return (
    <div
      className="rounded-xl border border-[#2a1f0f] overflow-hidden"
      style={{ background: "#140f0a" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1510]">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-[#c9a84c]" />
          <span
            className="text-[#a89070] text-sm"
            style={{ ...fontStyles.display, fontWeight: 600 }}
          >
            {t("combat.attacksSpellcasting", "Attacks & Spellcasting")}
          </span>
        </div>
        <button
          onClick={addAttack}
          className="flex items-center gap-1 text-[#c9a84c] hover:text-[#e8d5b0] text-xs transition-colors"
          style={fontStyles.body}
        >
          <Plus className="w-3.5 h-3.5" /> {t("combat.addAttack", "Add")}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-[#1a1510]">
              {ATTACK_TABLE_HEADERS.map((headerKey) => (
                <th
                  key={headerKey}
                  className="px-3 py-2 text-left text-[#3d2e1a] text-xs"
                  style={fontStyles.display}
                >
                  {headerKey === "combat.emptyHeader" ? "" : t(headerKey)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1510]">
            {attacks.map((attack) => (
              <tr key={attack.id} className="hover:bg-[#1a1510]/40 transition-colors">
                <td className="px-3 py-2">
                  <input
                    value={attack.name}
                    onChange={(e) => updateAttack(attack.id, "name", e.target.value)}
                    placeholder="Attack name"
                    className={COLUMN_INPUT_CLASS + " w-full"}
                    style={fontStyles.body}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={attack.atkBonus}
                    onChange={(e) => updateAttack(attack.id, "atkBonus", e.target.value)}
                    placeholder="+0"
                    className={COLUMN_INPUT_CLASS + " w-16 text-center"}
                    style={{ ...fontStyles.display, color: "#c9a84c" }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={attack.damageDice}
                    onChange={(e) => updateAttack(attack.id, "damageDice", e.target.value)}
                    placeholder="1d6"
                    className={COLUMN_INPUT_CLASS + " w-16 text-center"}
                    style={fontStyles.display}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={attack.damageType}
                    onChange={(e) => updateAttack(attack.id, "damageType", e.target.value)}
                    placeholder="Type"
                    className={COLUMN_INPUT_CLASS + " w-24"}
                    style={fontStyles.body}
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => removeAttack(attack.id)}
                    className="text-[#3d2e1a] hover:text-[#ef4444] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {attacks.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-4 text-center text-[#3d2e1a] text-sm"
                  style={fontStyles.body}
                >
                  No attacks yet — add one above
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
