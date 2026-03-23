import type {
  CharacterState,
  UpdateFieldFn,
  AbilityKey,
} from "../types/character.types";
import {
  ABILITIES,
  RACES,
  CLASSES,
  BACKGROUNDS,
  ALIGNMENTS,
} from "../constants/character.constants";
import {
  calculateAbilityModifier,
  getProficiencyBonus,
  clamp,
} from "../utils/character.utils";
import { LABEL_CLASS, INPUT_CLASS, fontStyles } from "../constants/theme";
import { FeatsBox } from "../components/FeatsBox";
import { useTranslation } from "react-i18next";
import { AbilityCard } from "../components/AbilityCard";
import { StatBox } from "../components/StatBox";
import { FieldSelect } from "../components/FieldSelect";
import { HPTracker } from "../components/HPTracker";
import { DeathSaves } from "../components/DeathSaves";
import { EquipmentBox } from "../components/EquipmentBox";
import { DiceRoller } from "../components/DiceRoller";

interface OverviewTabProps {
  character: CharacterState;
  updateField: UpdateFieldFn;
  classColor: string;
}

const PHYSICAL_APPEARANCE_FIELDS: Array<{
  label: string;
  key: keyof Pick<
    CharacterState,
    "age" | "height" | "weight" | "eyes" | "hair" | "skin"
  >;
}> = [
  { label: "Age", key: "age" },
  { label: "Height", key: "height" },
  { label: "Weight", key: "weight" },
  { label: "Eyes", key: "eyes" },
  { label: "Hair", key: "hair" },
  { label: "Skin", key: "skin" },
];

export function OverviewTab({
  character,
  updateField,
  classColor,
}: OverviewTabProps) {
  const { t } = useTranslation("character");
  const defaultProfBonus = getProficiencyBonus(character.level);
  const proficiencyBonus = character.proficiencyBonus ?? defaultProfBonus;
  const perceptionProficiencyBonus = character.skillProficiencies.includes(
    "perception",
  )
    ? defaultProfBonus
    : 0;
  const defaultPassivePerception =
    10 + calculateAbilityModifier(character.wis) + perceptionProficiencyBonus;
  const passivePerception =
    character.passivePerception ?? defaultPassivePerception;

  const initiative =
    character.initiative ?? calculateAbilityModifier(character.dex);

  function toggleSaveProficiency(ability: AbilityKey) {
    const currentProficiencies = character.saveProficiencies;
    const isCurrentlyProficient = currentProficiencies.includes(ability);
    const updated = isCurrentlyProficient
      ? currentProficiencies.filter((a) => a !== ability)
      : [...currentProficiencies, ability];
    updateField("saveProficiencies", updated);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Ability Scores */}
        <div>
          <p
            className={LABEL_CLASS}
            style={{ ...fontStyles.display, letterSpacing: "0.1em" }}
          >
            {t("overview.abilityScores", "Ability Scores")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-fit">
            {ABILITIES.map((ability) => (
              <AbilityCard
                key={ability}
                ability={ability}
                score={character[ability]}
                classColor={classColor}
                onChange={(value) => updateField(ability, value)}
                isSaveProficient={character.saveProficiencies.includes(ability)}
                onToggleSave={() => toggleSaveProficiency(ability)}
                proficiencyBonus={proficiencyBonus}
              />
            ))}
          </div>
        </div>

        {/* Core Stats */}
        <div className="w-fit">
          <p
            className={LABEL_CLASS}
            style={{ ...fontStyles.display, letterSpacing: "0.1em" }}
          >
            {t("overview.coreStats", "Core Stats")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-fit">
            <StatBox
              label={t("overview.armorClass", "Armor Class")}
              value={character.armorClass}
              onChange={(v) => updateField("armorClass", v)}
              color="#60a5fa"
            />
            <StatBox
              label={t("overview.initiative", "Initiative")}
              value={initiative}
              onChange={(v) => updateField("initiative", v)}
              color={initiative >= 0 ? "#22c55e" : "#ef4444"}
            />
            <StatBox
              label={t("overview.speed", "Speed (ft)")}
              value={character.speed}
              onChange={(v) => updateField("speed", v)}
              color="#e8d5b0"
            />
            <StatBox
              label={t("overview.profBonus", "Prof. Bonus")}
              value={proficiencyBonus}
              onChange={(v) => updateField("proficiencyBonus", v)}
              color={classColor}
            />
            <StatBox
              label={t("overview.passivePerception", "Passive Percep.")}
              value={passivePerception}
              onChange={(v) => updateField("passivePerception", v)}
              color="#a89070"
            />

            {/* Inspiration — inline porque tem comportamento especial */}
            <div
              className="flex flex-col items-center justify-center rounded-xl border border-[#2a1f0f] p-2 gap-0 cursor-pointer w-[110px] h-[130px]"
              style={{ background: "#140f0a" }}
              onClick={() => updateField("inspiration", !character.inspiration)}
            >
              <span className="text-2xl h-8 flex items-center justify-center">
                {character.inspiration ? "✦" : "◇"}
              </span>
              <span
                className={
                  LABEL_CLASS +
                  " mb-0 text-center px-1 w-full whitespace-normal break-words leading-tight tracking-normal mt-1"
                }
                style={{
                  ...fontStyles.display,
                  fontSize: "0.65rem",
                  color: character.inspiration ? "#c9a84c" : "#3d2e1a",
                }}
              >
                {t("overview.inspiration", "Inspiration")}
              </span>
            </div>
          </div>
        </div>

        {/* Character Details */}
        <div className="flex-1 flex flex-col mt-1">
          <p
            className={LABEL_CLASS}
            style={{ ...fontStyles.display, letterSpacing: "0.1em" }}
          >
            {t("overview.characterDetails", "Character Details")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-3">
            <FieldSelect
              label={t("overview.race", "Race")}
              value={character.race}
              onChange={(v) => updateField("race", v)}
              options={RACES}
            />
            <FieldSelect
              label={t("overview.class", "Class")}
              value={character.charClass}
              onChange={(v) => updateField("charClass", v)}
              options={CLASSES}
            />

            <div>
              <label className={LABEL_CLASS} style={fontStyles.display}>
                {t("overview.subclass", "Subclass")}
              </label>
              <input
                type="text"
                value={character.subclass}
                onChange={(e) => updateField("subclass", e.target.value)}
                placeholder="e.g. Evocation"
                className={INPUT_CLASS}
                style={fontStyles.body}
              />
            </div>

            <div>
              <label className={LABEL_CLASS} style={fontStyles.display}>
                {t("overview.level", "Level")}
              </label>
              <input
                type="number"
                value={character.level}
                min={1}
                max={20}
                onChange={(e) =>
                  updateField(
                    "level",
                    clamp(Number(e.target.value) || 1, 1, 20),
                  )
                }
                className={INPUT_CLASS}
                style={{
                  ...fontStyles.display,
                  fontWeight: 700,
                  color: classColor,
                }}
              />
            </div>

            <FieldSelect
              label={t("overview.background", "Background")}
              value={character.background}
              onChange={(v) => updateField("background", v)}
              options={BACKGROUNDS}
            />
            <FieldSelect
              label={t("overview.alignment", "Alignment")}
              value={character.alignment}
              onChange={(v) => updateField("alignment", v)}
              options={ALIGNMENTS}
            />

            <div>
              <label className={LABEL_CLASS} style={fontStyles.display}>
                {t("overview.xp", "Experience Points")}
              </label>
              <input
                type="number"
                value={character.xp}
                onChange={(e) => updateField("xp", Number(e.target.value) || 0)}
                className={INPUT_CLASS}
                style={fontStyles.body}
              />
            </div>

            {/* Campos de Aparência Física integrados aqui */}
            {PHYSICAL_APPEARANCE_FIELDS.map(({ label, key }) => (
              <div key={key}>
                <label className={LABEL_CLASS} style={fontStyles.display}>
                  {t(`overview.${key}`, label)}
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

      {/* Seção Inferior: Talentos | HP/Morte | Equipamento | Proficiências/Idiomas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Talentos */}
        <div className="flex flex-col h-[400px]">
          <FeatsBox
            feats={character.feats || []}
            onChange={(feats) => updateField("feats", feats)}
            classColor={classColor}
          />
        </div>

        {/* HP, Death Saves e Dado (Meio, Compacto) */}
        <div className="flex flex-col h-[400px] gap-1.5 overflow-hidden">
          <HPTracker character={character} updateField={updateField} />
          <DeathSaves character={character} updateField={updateField} />
          <DiceRoller />
        </div>

        {/* Equipamento (Novo) */}
        <div className="flex flex-col h-[400px]">
          <EquipmentBox
            equipment={character.equipment}
            updateField={updateField}
          />
        </div>

        {/* Proficiência e Idiomas */}
        <div className="flex flex-col h-[400px] gap-4">
          <div
            className="rounded-xl border border-[#2a1f0f] overflow-hidden flex-1"
            style={{ background: "#140f0a" }}
          >
            <div className="px-3 py-2 border-b border-[#1a1510]">
              <span
                className="text-[#a89070] text-[10px] uppercase tracking-widest"
                style={fontStyles.display}
              >
                {t("overview.proficiencies", "Proficiencies")}
              </span>
            </div>
            <textarea
              value={character.proficiencies}
              onChange={(e) => updateField("proficiencies", e.target.value)}
              placeholder="..."
              className="w-full h-[calc(100%-32px)] bg-transparent text-[#a89070] placeholder:text-[#2a1f0f] outline-none px-3 py-2 resize-none text-xs leading-relaxed"
              style={fontStyles.body}
            />
          </div>

          <div
            className="rounded-xl border border-[#2a1f0f] overflow-hidden flex-1"
            style={{ background: "#140f0a" }}
          >
            <div className="px-3 py-2 border-b border-[#1a1510]">
              <span
                className="text-[#a89070] text-[10px] uppercase tracking-widest"
                style={fontStyles.display}
              >
                {t("overview.languages", "Languages")}
              </span>
            </div>
            <textarea
              value={character.languages}
              onChange={(e) => updateField("languages", e.target.value)}
              placeholder="..."
              className="w-full h-[calc(100%-32px)] bg-transparent text-[#a89070] placeholder:text-[#2a1f0f] outline-none px-3 py-2 resize-none text-xs leading-relaxed"
              style={fontStyles.body}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
