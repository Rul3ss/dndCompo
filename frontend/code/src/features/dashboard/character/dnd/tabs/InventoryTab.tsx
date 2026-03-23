import { Plus, Trash2, Package, Check } from "lucide-react";
import type {
  CharacterState,
  UpdateFieldFn,
  EquipmentItem,
} from "../types/character.types";
import { generateId } from "../utils/character.utils";
import { LABEL_CLASS, fontStyles } from "../constants/theme";
import { useTranslation } from "react-i18next";

interface InventoryTabProps {
  character: CharacterState;
  updateField: UpdateFieldFn;
}

const CURRENCY_COLORS: Record<keyof CharacterState["currency"], string> = {
  cp: "#a16207",
  sp: "#71717a",
  ep: "#60a5fa",
  gp: "#c9a84c",
  pp: "#a855f7",
};

const CURRENCY_LABELS: Record<keyof CharacterState["currency"], string> = {
  cp: "CP",
  sp: "SP",
  ep: "EP",
  gp: "GP",
  pp: "PP",
};

const CARRY_CAPACITY_MULTIPLIER = 15;
const EQUIPMENT_TABLE_HEADERS = [
  "inventory.eq",
  "inventory.itemName",
  "inventory.qty",
  "inventory.weightLb",
  "inventory.emptyHeader",
];

export function InventoryTab({ character, updateField }: InventoryTabProps) {
  const { t } = useTranslation("character");
  const totalWeight = character.equipment.reduce(
    (sum, item) => sum + item.qty * item.weight,
    0,
  );
  const carryCapacity = character.str * CARRY_CAPACITY_MULTIPLIER;
  const isOverEncumbered = totalWeight > carryCapacity;

  function addItem() {
    updateField("equipment", [
      ...character.equipment,
      { id: generateId(), name: "", qty: 1, weight: 0, equipped: false },
    ]);
  }

  function updateItem(
    id: string,
    field: keyof EquipmentItem,
    value: string | number | boolean,
  ) {
    updateField(
      "equipment",
      character.equipment.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeItem(id: string) {
    updateField(
      "equipment",
      character.equipment.filter((item) => item.id !== id),
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Currency */}
      <div
        className="rounded-xl border border-[#2a1f0f] p-5"
        style={{ background: "#140f0a" }}
      >
        <p className={LABEL_CLASS} style={fontStyles.display}>
          {t("inventory.currency", "Currency")}
        </p>
        <div className="grid grid-cols-5 gap-3">
          {(Object.keys(character.currency) as Array<keyof typeof character.currency>).map(
            (currencyKey) => (
              <div key={currencyKey} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: CURRENCY_COLORS[currencyKey],
                    background: CURRENCY_COLORS[currencyKey] + "15",
                  }}
                >
                  <span
                    className="text-xs"
                    style={{
                      color: CURRENCY_COLORS[currencyKey],
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 700,
                    }}
                  >
                    {CURRENCY_LABELS[currencyKey]}
                  </span>
                </div>
                <input
                  type="number"
                  value={character.currency[currencyKey]}
                  onChange={(e) =>
                    updateField("currency", {
                      ...character.currency,
                      [currencyKey]: Number(e.target.value) || 0,
                    })
                  }
                  className="w-16 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 rounded-lg outline-none text-sm py-1.5 transition-colors"
                  style={{
                    color: CURRENCY_COLORS[currencyKey],
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                  }}
                />
              </div>
            ),
          )}
        </div>
      </div>

      {/* Carry Weight */}
      <div className="flex items-center gap-4 px-1">
        <Package className="w-4 h-4 text-[#4a3820]" />
        <div className="flex-1">
          <div
            className="flex justify-between text-xs mb-1"
            style={fontStyles.body}
          >
            <span className="text-[#6b5a3e]">{t("inventory.carryWeight", "Carry weight")}</span>
            <span className="text-[#a89070]">
              {totalWeight} / {carryCapacity} lb
            </span>
          </div>
          <div className="h-1.5 bg-[#1a1510] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((totalWeight / carryCapacity) * 100, 100)}%`,
                background: isOverEncumbered ? "#ef4444" : "#c9a84c",
              }}
            />
          </div>
        </div>
      </div>

      {/* Equipment table */}
      <div
        className="rounded-xl border border-[#2a1f0f] overflow-hidden"
        style={{ background: "#140f0a" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1510]">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#c9a84c]" />
            <span
              className="text-[#a89070] text-sm"
              style={{ ...fontStyles.display, fontWeight: 600 }}
            >
              {t("inventory.equipment", "Equipment")}
            </span>
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-[#c9a84c] hover:text-[#e8d5b0] text-xs transition-colors"
            style={fontStyles.body}
          >
            <Plus className="w-3.5 h-3.5" /> {t("inventory.addItem", "Add Item")}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[450px]">
            <thead>
              <tr className="border-b border-[#1a1510]">
                {EQUIPMENT_TABLE_HEADERS.map((headerKey) => (
                  <th
                    key={headerKey}
                    className="px-3 py-2 text-left text-[#3d2e1a] text-xs"
                    style={fontStyles.display}
                  >
                    {headerKey === "inventory.emptyHeader" ? "" : t(headerKey)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1510]">
              {character.equipment.map((item) => (
                <tr key={item.id} className="hover:bg-[#1a1510]/40 transition-colors">
                  {/* Equipped toggle */}
                  <td className="px-3 py-2">
                    <button
                      onClick={() => updateItem(item.id, "equipped", !item.equipped)}
                      className="w-5 h-5 rounded border flex items-center justify-center transition-all"
                      style={{
                        borderColor: item.equipped ? "#c9a84c" : "#3d2e1a",
                        background: item.equipped ? "#c9a84c20" : "transparent",
                      }}
                    >
                      {item.equipped && <Check className="w-3 h-3 text-[#c9a84c]" />}
                    </button>
                  </td>

                  <td className="px-3 py-2">
                    <input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      placeholder={t("inventory.itemNamePlaceholder", "Item name")}
                      className="bg-transparent text-[#e8d5b0] placeholder:text-[#3d2e1a] outline-none text-sm w-full"
                      style={fontStyles.body}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.qty}
                      min={0}
                      onChange={(e) =>
                        updateItem(item.id, "qty", Number(e.target.value) || 0)
                      }
                      className="w-12 text-center bg-[#0f0c09] border border-[#2a1f0f] rounded text-[#a89070] outline-none text-xs py-1 focus:border-[#c9a84c]/40 transition-colors"
                      style={fontStyles.display}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.weight}
                      min={0}
                      onChange={(e) =>
                        updateItem(item.id, "weight", Number(e.target.value) || 0)
                      }
                      className="w-16 text-center bg-[#0f0c09] border border-[#2a1f0f] rounded text-[#a89070] outline-none text-xs py-1 focus:border-[#c9a84c]/40 transition-colors"
                      style={fontStyles.display}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#3d2e1a] hover:text-[#ef4444] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}

              {character.equipment.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-5 text-center text-[#3d2e1a] text-sm"
                    style={fontStyles.body}
                  >
                    {t("inventory.emptyPockets", "Empty pockets — add items above")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
