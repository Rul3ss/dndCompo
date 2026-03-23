import type { CharacterState, UpdateFieldFn } from "../types/character.types";
import { StoryField } from "../components/StoryField";
import { LABEL_CLASS, INPUT_CLASS, fontStyles } from "../constants/theme";
import { useTranslation } from "react-i18next";

interface StoryTabProps {
  character: CharacterState;
  updateField: UpdateFieldFn;
}

const PHYSICAL_APPEARANCE_FIELDS: Array<{
  labelKey: string;
  key: keyof Pick<CharacterState, "age" | "height" | "weight" | "eyes" | "hair" | "skin">;
}> = [
  { labelKey: "overview.age",      key: "age" },
  { labelKey: "overview.height",   key: "height" },
  { labelKey: "overview.weight",   key: "weight" },
  { labelKey: "overview.eyes",     key: "eyes" },
  { labelKey: "overview.hair",     key: "hair" },
  { labelKey: "overview.skin",     key: "skin" },
];

export function StoryTab({ character, updateField }: StoryTabProps) {
  const { t } = useTranslation("character");

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Personality */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StoryField
          label={t("story.personalityTraits", "Personality Traits")}
          value={character.personalityTraits}
          onChange={(v) => updateField("personalityTraits", v)}
          placeholder={t("story.personalityPlaceholder", "I always have a plan for when things go wrong...")}
          rows={4}
        />
        <StoryField
          label={t("story.ideals", "Ideals")}
          value={character.ideals}
          onChange={(v) => updateField("ideals", v)}
          placeholder={t("story.idealsPlaceholder", "Freedom. Chains are meant to be broken...")}
          rows={4}
        />
        <StoryField
          label={t("story.bonds", "Bonds")}
          value={character.bonds}
          onChange={(v) => updateField("bonds", v)}
          placeholder={t("story.bondsPlaceholder", "I protect those who cannot protect themselves...")}
          rows={4}
        />
        <StoryField
          label={t("story.flaws", "Flaws")}
          value={character.flaws}
          onChange={(v) => updateField("flaws", v)}
          placeholder={t("story.flawsPlaceholder", "I have trouble trusting in my allies...")}
          rows={4}
        />
      </div>

      {/* Backstory */}
      <StoryField
        label={t("story.backstory", "Backstory")}
        value={character.backstory}
        onChange={(v) => updateField("backstory", v)}
        placeholder={t("story.backstoryPlaceholder", "Tell the story of your hero's origin...")}
        rows={8}
      />

      {/* Features & Class Traits */}
      <StoryField
        label={t("story.featuresAndTraits", "Features & Class Traits")}
        value={character.features}
        onChange={(v) => updateField("features", v)}
        placeholder={t("story.featuresPlaceholder", "List class features, racial traits, feats...")}
        rows={5}
      />

      {/* Physical Appearance */}
      <div
        className="rounded-xl border border-[#2a1f0f] p-5"
        style={{ background: "#140f0a" }}
      >
        <p className={LABEL_CLASS} style={fontStyles.display}>
          {t("overview.physicalAppearance", "Physical Appearance")}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {PHYSICAL_APPEARANCE_FIELDS.map(({ labelKey, key }) => (
            <div key={key}>
              <label className={LABEL_CLASS} style={fontStyles.display}>
                {t(labelKey)}
              </label>
              <input
                type="text"
                value={character[key]}
                onChange={(e) => updateField(key, e.target.value)}
                placeholder="—"
                className={INPUT_CLASS}
                style={fontStyles.body}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
