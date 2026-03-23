import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Feat } from "../types/character.types";
import { LABEL_CLASS, INPUT_CLASS, fontStyles } from "../constants/theme";

interface FeatsBoxProps {
  feats: Feat[];
  onChange: (feats: Feat[]) => void;
  classColor: string;
}

export function FeatsBox({ feats, onChange, classColor }: FeatsBoxProps) {
  const { t } = useTranslation("character");
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addFeat = () => {
    const newId = crypto.randomUUID();
    onChange([
      ...feats,
      {
        id: newId,
        name: "",
        bonus: "",
        description: "",
      },
    ]);
    // Expand the new feat automatically
    setExpandedIds((prev) => [...prev, newId]);
  };

  const removeFeat = (id: string) => {
    onChange(feats.filter((f) => f.id !== id));
    setExpandedIds((prev) => prev.filter((i) => i !== id));
  };

  const updateFeat = (id: string, field: keyof Feat, value: string) => {
    onChange(
      feats.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  return (
    <div
      className="rounded-xl border border-[#2a1f0f] p-4 flex flex-col h-full overflow-hidden"
      style={{ background: "#140f0a" }}
    >
      <div className="flex items-center justify-between mb-4 border-b border-[#1a1510] pb-2">
        <h3 className={LABEL_CLASS} style={{ ...fontStyles.display, margin: 0, letterSpacing: "0.1em" }}>
          {t("overview.feats", "Feats")}
        </h3>
        <button
          onClick={addFeat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5 active:scale-95"
          style={{
            color: classColor,
            fontFamily: "'Cinzel', serif",
            border: `1px solid ${classColor}30`,
          }}
        >
          <Plus className="w-3.5 h-3.5" />
          {t("overview.addFeat", "Add Feat")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar pr-2 -mr-2">
        {feats.length === 0 ? (
          <div className="text-center py-8 text-[#4a3820] text-sm" style={fontStyles.body}>
            {t("overview.emptyFeats", "No feats yet — add one above")}
          </div>
        ) : (
          feats.map((feat) => {
            const isExpanded = expandedIds.includes(feat.id);
            return (
              <div
                key={feat.id}
                className={`group rounded-lg border border-[#2a1f0f] bg-[#0c0906] transition-all ${
                  isExpanded ? "p-3 space-y-3" : "p-1.5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpand(feat.id)}
                    className="p-1 hover:bg-white/5 rounded transition-colors text-[#4a3820] hover:text-[#a89070]"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  <input
                    type="text"
                    value={feat.name}
                    onChange={(e) => updateFeat(feat.id, "name", e.target.value)}
                    placeholder={t("overview.featName", "Name")}
                    className={`bg-transparent border-none focus:ring-0 outline-none font-bold text-[#e8d5b0] text-sm w-full placeholder:text-[#2a1f0f]`}
                    style={fontStyles.body}
                  />

                  {(!isExpanded || feat.bonus) && (
                    <input
                      type="text"
                      value={feat.bonus}
                      onChange={(e) => updateFeat(feat.id, "bonus", e.target.value)}
                      placeholder={t("overview.featBonus", "Bonus")}
                      className={`bg-transparent border-none focus:ring-0 outline-none text-xs text-center w-20 border-l border-[#1a1510] text-[#a89070] placeholder:text-[#2a1f0f]`}
                      style={fontStyles.body}
                    />
                  )}

                  <button
                    onClick={() => removeFeat(feat.id)}
                    className="p-1 text-[#4a3820] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ml-1.5"
                    title="Remove Feat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <textarea
                      value={feat.description}
                      onChange={(e) => updateFeat(feat.id, "description", e.target.value)}
                      placeholder={t("overview.featDescription", "Description")}
                      className={INPUT_CLASS + " text-sm resize-none h-24 w-full bg-[#0f0c09]/50"}
                      style={fontStyles.body}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
