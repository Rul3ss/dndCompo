import { Plus, Trash2, Package, Check } from "lucide-react";
import type { UpdateFieldFn, EquipmentItem } from "../types/character.types";
import { fontStyles } from "../constants/theme";
import { useTranslation } from "react-i18next";
import { generateId } from "../utils/character.utils";

interface EquipmentBoxProps {
  equipment: EquipmentItem[];
  updateField: UpdateFieldFn;
}

export function EquipmentBox({ equipment, updateField }: EquipmentBoxProps) {
  const { t } = useTranslation("character");

  function addItem() {
    updateField("equipment", [
      ...equipment,
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
      equipment.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeItem(id: string) {
    updateField(
      "equipment",
      equipment.filter((item) => item.id !== id),
    );
  }

  return (
    <div
      className="rounded-xl border border-[#2a1f0f] flex flex-col h-full overflow-hidden"
      style={{ background: "#140f0a" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1510]">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-[#c9a84c]" />
          <span
            className="text-[#a89070] text-xs uppercase tracking-widest"
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
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1a1510] bg-[#0c0906]">
              <th className="px-2 py-1.5 text-[10px] text-[#3d2e1a] uppercase" style={fontStyles.display}>Eq</th>
              <th className="px-2 py-1.5 text-[10px] text-[#3d2e1a] uppercase" style={fontStyles.display}>Item</th>
              <th className="px-2 py-1.5 text-[10px] text-[#3d2e1a] uppercase text-center" style={fontStyles.display}>Qtd</th>
              <th className="px-2 py-1.5 text-[10px] text-[#3d2e1a] uppercase text-center" style={fontStyles.display}>Lb</th>
              <th className="px-2 py-1.5 w-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1510]">
            {equipment.map((item) => (
              <tr key={item.id} className="hover:bg-[#1a1510]/40 transition-colors">
                <td className="px-2 py-1.5">
                  <button
                    onClick={() => updateItem(item.id, "equipped", !item.equipped)}
                    className="w-4 h-4 rounded border flex items-center justify-center transition-all m-auto"
                    style={{
                      borderColor: item.equipped ? "#c9a84c" : "#3d2e1a",
                      background: item.equipped ? "#c9a84c20" : "transparent",
                    }}
                  >
                    {item.equipped && <Check className="w-2.5 h-2.5 text-[#c9a84c]" />}
                  </button>
                </td>
                <td className="px-2 py-1.5">
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    className="bg-transparent text-[#e8d5b0] outline-none text-xs w-full"
                    style={fontStyles.body}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(item.id, "qty", Number(e.target.value) || 0)}
                    className="w-8 text-center bg-transparent text-[#a89070] outline-none text-[10px]"
                    style={fontStyles.display}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <input
                    type="number"
                    value={item.weight}
                    onChange={(e) => updateItem(item.id, "weight", Number(e.target.value) || 0)}
                    className="w-10 text-center bg-transparent text-[#a89070] outline-none text-[10px]"
                    style={fontStyles.display}
                  />
                </td>
                <td className="px-2 py-1.5">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-[#3d2e1a] hover:text-red-900 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
