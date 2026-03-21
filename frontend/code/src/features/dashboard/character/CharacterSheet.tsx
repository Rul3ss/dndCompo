import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Sword,
  Wand2,
  Shield,
  Target,
  Flame,
  Leaf,
  Star,
  Sparkles,
  Plus,
  Trash2,
  Heart,
  BookOpen,
  Package,
  User,
  Scroll,
  Music,
  Zap,
  Eye,
  ChevronUp,
  ChevronDown,
  Check,
  Globe,
  Swords,
  Loader2,
} from "lucide-react";
import {
  characterService,
  type Character,
} from "../../../lib/character.service";

// ─── Types ─────────────────────────────────────────────────────────────────────

type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

interface Attack {
  id: number;
  name: string;
  atkBonus: string;
  damageDice: string;
  damageType: string;
}
interface SpellEntry {
  id: number;
  name: string;
  level: number;
  school: string;
  prepared: boolean;
}
interface EqItem {
  id: number;
  name: string;
  qty: number;
  weight: number;
  equipped: boolean;
}
interface CharState {
  name: string;
  race: string;
  charClass: string;
  subclass: string;
  level: number;
  background: string;
  alignment: string;
  xp: number;
  inspiration: boolean;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  armorClass: number;
  speed: number;
  deathSucc: number;
  deathFail: number;
  saveProficiencies: AbilityKey[];
  skillProficiencies: string[];
  skillExpertise: string[];
  attacks: Attack[];
  spellcastingAbility: AbilityKey | "";
  spellSlots: Record<number, { max: number; used: number }>;
  spells: SpellEntry[];
  currency: { cp: number; sp: number; ep: number; gp: number; pp: number };
  equipment: EqItem[];
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
  age: string;
  height: string;
  weight: string;
  eyes: string;
  hair: string;
  skin: string;
  languages: string;
  proficiencies: string;
  features: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const ALL_SKILLS = [
  { key: "acrobatics", name: "Acrobatics", ability: "dex" as AbilityKey },
  {
    key: "animalHandling",
    name: "Animal Handling",
    ability: "wis" as AbilityKey,
  },
  { key: "arcana", name: "Arcana", ability: "int" as AbilityKey },
  { key: "athletics", name: "Athletics", ability: "str" as AbilityKey },
  { key: "deception", name: "Deception", ability: "cha" as AbilityKey },
  { key: "history", name: "History", ability: "int" as AbilityKey },
  { key: "insight", name: "Insight", ability: "wis" as AbilityKey },
  { key: "intimidation", name: "Intimidation", ability: "cha" as AbilityKey },
  { key: "investigation", name: "Investigation", ability: "int" as AbilityKey },
  { key: "medicine", name: "Medicine", ability: "wis" as AbilityKey },
  { key: "nature", name: "Nature", ability: "int" as AbilityKey },
  { key: "perception", name: "Perception", ability: "wis" as AbilityKey },
  { key: "performance", name: "Performance", ability: "cha" as AbilityKey },
  { key: "persuasion", name: "Persuasion", ability: "cha" as AbilityKey },
  { key: "religion", name: "Religion", ability: "int" as AbilityKey },
  {
    key: "sleightOfHand",
    name: "Sleight of Hand",
    ability: "dex" as AbilityKey,
  },
  { key: "stealth", name: "Stealth", ability: "dex" as AbilityKey },
  { key: "survival", name: "Survival", ability: "wis" as AbilityKey },
];

const CLASS_COLORS: Record<string, string> = {
  Barbarian: "#f97316",
  Bard: "#ec4899",
  Cleric: "#60a5fa",
  Druid: "#84cc16",
  Fighter: "#ef4444",
  Monk: "#eab308",
  Paladin: "#c9a84c",
  Ranger: "#22c55e",
  Rogue: "#14b8a6",
  Sorcerer: "#8b5cf6",
  Warlock: "#7c3aed",
  Wizard: "#a855f7",
};
const CLASS_ICONS: Record<string, React.ElementType> = {
  Barbarian: Flame,
  Bard: Music,
  Cleric: Star,
  Druid: Leaf,
  Fighter: Sword,
  Monk: Zap,
  Paladin: Shield,
  Ranger: Target,
  Rogue: Eye,
  Sorcerer: Sparkles,
  Warlock: Eye,
  Wizard: Wand2,
};

const RACES = [
  "Human",
  "Elf",
  "Half-Elf",
  "Dwarf",
  "Halfling",
  "Half-Orc",
  "Tiefling",
  "Dragonborn",
  "Gnome",
  "Aasimar",
  "Tabaxi",
  "Firbolg",
  "Genasi",
  "Goliath",
  "Kenku",
];
const CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
];
const BACKGROUNDS = [
  "Acolyte",
  "Charlatan",
  "Criminal",
  "Entertainer",
  "Folk Hero",
  "Guild Artisan",
  "Hermit",
  "Noble",
  "Outlander",
  "Sage",
  "Sailor",
  "Soldier",
  "Urchin",
];
const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];
const ABILITIES: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];
const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: "STR",
  dex: "DEX",
  con: "CON",
  int: "INT",
  wis: "WIS",
  cha: "CHA",
};
const ABILITY_FULL: Record<AbilityKey, string> = {
  str: "Strength",
  dex: "Dexterity",
  con: "Constitution",
  int: "Intelligence",
  wis: "Wisdom",
  cha: "Charisma",
};
const SCHOOLS = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function abmod(s: number) {
  return Math.floor((s - 10) / 2);
}
function fmtMod(s: number) {
  const m = abmod(s);
  return m >= 0 ? `+${m}` : `${m}`;
}
function profBonusFromLevel(lvl: number) {
  return Math.ceil(lvl / 4) + 1;
}
function clamp(v: number, mn: number, mx: number) {
  return Math.min(Math.max(v, mn), mx);
}
let _uid = 200;
function uid() {
  return ++_uid;
}

// ─── Default Character ──────────────────────────────────────────────────────────

const DEFAULT_CHAR: CharState = {
  name: "",
  race: "Human",
  charClass: "Fighter",
  subclass: "",
  level: 1,
  background: "Folk Hero",
  alignment: "True Neutral",
  xp: 0,
  inspiration: false,
  str: 10,
  dex: 10,
  con: 10,
  int: 10,
  wis: 10,
  cha: 10,
  maxHp: 10,
  currentHp: 10,
  tempHp: 0,
  armorClass: 10,
  speed: 30,
  deathSucc: 0,
  deathFail: 0,
  saveProficiencies: [],
  skillProficiencies: [],
  skillExpertise: [],
  attacks: [
    {
      id: 1,
      name: "Unarmed Strike",
      atkBonus: "+2",
      damageDice: "1+STR",
      damageType: "Bludgeoning",
    },
  ],
  spellcastingAbility: "",
  spellSlots: Object.fromEntries(
    Array.from({ length: 9 }, (_, i) => [i + 1, { max: 0, used: 0 }]),
  ),
  spells: [],
  currency: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
  equipment: [
    { id: 1, name: "Backpack", qty: 1, weight: 5, equipped: false },
    { id: 2, name: "Rations (5 days)", qty: 1, weight: 10, equipped: false },
  ],
  personalityTraits: "",
  ideals: "",
  bonds: "",
  flaws: "",
  backstory: "",
  age: "",
  height: "",
  weight: "",
  eyes: "",
  hair: "",
  skin: "",
  languages: "Common",
  proficiencies: "",
  features: "",
};

// ─── Input Styles ────────────────────────────────────────────────────────────────

const inputCls =
  "bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/50 rounded-lg text-[#e8d5b0] outline-none text-sm px-3 py-2 transition-colors w-full placeholder:text-[#3d2e1a]";
const selectCls = inputCls + " cursor-pointer";
const labelCls = "text-[#4a3820] text-xs uppercase tracking-wider mb-1 block";

// ─── Components (mantendo todos os componentes do código original) ──────────────

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectCls}
        style={{ fontFamily: "'Inter', sans-serif", background: "#0f0c09" }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function AbilityCard({
  abbr,
  score,
  onChange,
  isSaveProf,
  onToggleSave,
  pb,
  classColor,
}: {
  abbr: AbilityKey;
  score: number;
  onChange: (v: number) => void;
  isSaveProf: boolean;
  onToggleSave: () => void;
  pb: number;
  classColor: string;
}) {
  const m = abmod(score);
  const saveTotal = m + (isSaveProf ? pb : 0);
  return (
    <div
      className="flex flex-col items-center rounded-xl border border-[#2a1f0f] hover:border-[#3d2e1a] transition-all duration-200 py-4 px-3 gap-2 relative overflow-hidden group"
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
        {ABILITY_LABELS[abbr]}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(clamp(score - 1, 1, 30))}
          className="w-5 h-5 flex items-center justify-center text-[#3d2e1a] hover:text-[#c9a84c] transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
        <span
          className="min-w-[2.5rem] text-center"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: classColor,
          }}
        >
          {m >= 0 ? `+${m}` : m}
        </span>
        <button
          onClick={() => onChange(clamp(score + 1, 1, 30))}
          className="w-5 h-5 flex items-center justify-center text-[#3d2e1a] hover:text-[#c9a84c] transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      </div>
      <input
        type="number"
        value={score}
        min={1}
        max={30}
        onChange={(e) => onChange(clamp(Number(e.target.value) || 10, 1, 30))}
        className="w-12 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 rounded-lg text-[#e8d5b0] outline-none py-1 text-sm transition-colors"
        style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
      />
      <button
        onClick={onToggleSave}
        className="flex items-center gap-1.5 transition-colors mt-0.5"
        style={{ color: isSaveProf ? "#c9a84c" : "#4a3820" }}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all ${isSaveProf ? "border-[#c9a84c]" : "border-[#4a3820]"}`}
          style={{ background: isSaveProf ? classColor : "transparent" }}
        >
          {isSaveProf && <Check className="w-1.5 h-1.5 text-[#0c0a08]" />}
        </span>
        <span className="text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
          {isSaveProf
            ? `${saveTotal >= 0 ? "+" : ""}${saveTotal}`
            : fmtMod(score)}{" "}
          save
        </span>
      </button>
    </div>
  );
}

function HPTracker({
  char,
  upd,
}: {
  char: CharState;
  upd: <K extends keyof CharState>(k: K, v: CharState[K]) => void;
}) {
  const hpPct =
    char.maxHp > 0 ? clamp((char.currentHp / char.maxHp) * 100, 0, 100) : 0;
  const hpColor = hpPct > 60 ? "#22c55e" : hpPct > 30 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="rounded-xl border border-[#2a1f0f] p-5"
      style={{ background: "#140f0a" }}
    >
      <p className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
        Hit Points
      </p>
      <div className="h-2 bg-[#0f0c09] rounded-full overflow-hidden mb-4">
        <motion.div
          animate={{ width: `${hpPct}%` }}
          transition={{ duration: 0.4 }}
          className="h-full rounded-full"
          style={{ background: hpColor }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() =>
                upd(
                  "currentHp",
                  clamp(char.currentHp - 1, 0, char.maxHp + char.tempHp),
                )
              }
              className="w-8 h-8 rounded-lg bg-[#0f0c09] border border-[#2a1f0f] flex items-center justify-center text-[#ef4444] hover:border-[#ef4444]/40 transition-colors"
            >
              <span className="text-lg leading-none">-</span>
            </button>
            <input
              type="number"
              value={char.currentHp}
              onChange={(e) =>
                upd("currentHp", clamp(Number(e.target.value) || 0, 0, 999))
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
                upd(
                  "currentHp",
                  clamp(char.currentHp + 1, 0, char.maxHp + char.tempHp),
                )
              }
              className="w-8 h-8 rounded-lg bg-[#0f0c09] border border-[#2a1f0f] flex items-center justify-center text-[#22c55e] hover:border-[#22c55e]/40 transition-colors"
            >
              <span className="text-lg leading-none">+</span>
            </button>
          </div>
          <span className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
            Current HP
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <input
            type="number"
            value={char.maxHp}
            onChange={(e) => upd("maxHp", Number(e.target.value) || 0)}
            className="w-14 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/50 rounded-lg text-[#e8d5b0] outline-none py-1.5"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          />
          <span className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
            Max HP
          </span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <input
            type="number"
            value={char.tempHp}
            onChange={(e) => upd("tempHp", Number(e.target.value) || 0)}
            className="w-14 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#60a5fa]/50 rounded-lg outline-none py-1.5"
            style={{
              color: "#60a5fa",
              fontFamily: "'Cinzel', serif",
              fontSize: "1.2rem",
              fontWeight: 700,
            }}
          />
          <span className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
            Temp HP
          </span>
        </div>
      </div>
    </div>
  );
}

function DeathSaves({
  char,
  upd,
}: {
  char: CharState;
  upd: <K extends keyof CharState>(k: K, v: CharState[K]) => void;
}) {
  return (
    <div
      className="rounded-xl border border-[#2a1f0f] p-4"
      style={{ background: "#140f0a" }}
    >
      <p className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
        Death Saving Throws
      </p>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span
            className="text-[#22c55e] text-xs w-20"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Successes
          </span>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() =>
                  upd("deathSucc", char.deathSucc === i ? i - 1 : i)
                }
                className="w-6 h-6 rounded-full border transition-all duration-200"
                style={{
                  borderColor: i <= char.deathSucc ? "#22c55e" : "#3d2e1a",
                  background: i <= char.deathSucc ? "#22c55e" : "transparent",
                }}
              >
                {i <= char.deathSucc && (
                  <Check className="w-3 h-3 text-[#0c0a08] m-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-[#ef4444] text-xs w-20"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Failures
          </span>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <button
                key={i}
                onClick={() =>
                  upd("deathFail", char.deathFail === i ? i - 1 : i)
                }
                className="w-6 h-6 rounded-full border transition-all duration-200 flex items-center justify-center"
                style={{
                  borderColor: i <= char.deathFail ? "#ef4444" : "#3d2e1a",
                  background: i <= char.deathFail ? "#ef4444" : "transparent",
                }}
              >
                {i <= char.deathFail && (
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

function StatBox({
  label,
  value,
  onChange,
  color = "#e8d5b0",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  color?: string;
}) {
  return (
    <div
      className="flex flex-col items-center rounded-xl border border-[#2a1f0f] py-3 px-2 gap-1"
      style={{ background: "#140f0a" }}
    >
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-14 text-center bg-transparent outline-none text-center"
        style={{
          color,
          fontFamily: "'Cinzel', serif",
          fontSize: "1.5rem",
          fontWeight: 700,
        }}
      />
      <span
        className={labelCls + " mb-0 text-center"}
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {label}
      </span>
    </div>
  );
}

function AttacksTable({
  attacks,
  onChange,
}: {
  attacks: Attack[];
  onChange: (attacks: Attack[]) => void;
}) {
  function addAtk() {
    onChange([
      ...attacks,
      {
        id: uid(),
        name: "",
        atkBonus: "+0",
        damageDice: "1d6",
        damageType: "Piercing",
      },
    ]);
  }
  function updateAtk(id: number, field: keyof Attack, val: string) {
    onChange(attacks.map((a) => (a.id === id ? { ...a, [field]: val } : a)));
  }
  function removeAtk(id: number) {
    onChange(attacks.filter((a) => a.id !== id));
  }

  const colCls =
    "bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 text-[#e8d5b0] outline-none rounded px-2 py-1.5 text-sm transition-colors";

  return (
    <div
      className="rounded-xl border border-[#2a1f0f] overflow-hidden"
      style={{ background: "#140f0a" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1510]">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-[#c9a84c]" />
          <span
            className="text-[#a89070] text-sm"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
          >
            Attacks & Spellcasting
          </span>
        </div>
        <button
          onClick={addAtk}
          className="flex items-center gap-1 text-[#c9a84c] hover:text-[#e8d5b0] text-xs transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-[#1a1510]">
              {["Name", "Atk Bonus", "Damage", "Type", ""].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-left text-[#3d2e1a] text-xs"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1510]">
            {attacks.map((atk) => (
              <tr
                key={atk.id}
                className="hover:bg-[#1a1510]/40 transition-colors"
              >
                <td className="px-3 py-2">
                  <input
                    value={atk.name}
                    onChange={(e) => updateAtk(atk.id, "name", e.target.value)}
                    placeholder="Attack name"
                    className={colCls + " w-full"}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={atk.atkBonus}
                    onChange={(e) =>
                      updateAtk(atk.id, "atkBonus", e.target.value)
                    }
                    placeholder="+0"
                    className={colCls + " w-16 text-center"}
                    style={{ fontFamily: "'Cinzel', serif", color: "#c9a84c" }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={atk.damageDice}
                    onChange={(e) =>
                      updateAtk(atk.id, "damageDice", e.target.value)
                    }
                    placeholder="1d6"
                    className={colCls + " w-16 text-center"}
                    style={{ fontFamily: "'Cinzel', serif" }}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={atk.damageType}
                    onChange={(e) =>
                      updateAtk(atk.id, "damageType", e.target.value)
                    }
                    placeholder="Type"
                    className={colCls + " w-24"}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => removeAtk(atk.id)}
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
                  style={{ fontFamily: "'Inter', sans-serif" }}
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

function SkillRow({
  skill,
  abilityMod,
  isProf,
  isExpert,
  pb,
  onToggle,
}: {
  skill: (typeof ALL_SKILLS)[0];
  abilityMod: number;
  isProf: boolean;
  isExpert: boolean;
  pb: number;
  onToggle: () => void;
}) {
  const bonus = abilityMod + (isExpert ? pb * 2 : isProf ? pb : 0);
  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2.5 py-1.5 hover:bg-[#1a1510]/50 rounded-lg px-2 transition-colors w-full text-left group"
    >
      <span
        className={`w-3 h-3 rounded-full border shrink-0 flex items-center justify-center transition-all ${
          isExpert
            ? "bg-[#c9a84c] border-[#c9a84c]"
            : isProf
              ? "border-[#c9a84c]"
              : "border-[#3d2e1a] group-hover:border-[#4a3820]"
        }`}
      >
        {(isProf || isExpert) && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isExpert ? "#0c0a08" : "#c9a84c" }}
          />
        )}
      </span>
      <span
        className="text-[#6b5a3e] text-xs w-5 text-center"
        style={{
          fontFamily: "'Cinzel', serif",
          color: bonus >= 0 ? "#c9a84c" : "#ef4444",
          fontWeight: 600,
        }}
      >
        {bonus >= 0 ? `+${bonus}` : bonus}
      </span>
      <span
        className="text-[#a89070] text-sm flex-1"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {skill.name}
      </span>
      <span
        className="text-[#3d2e1a] text-xs uppercase"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {ABILITY_LABELS[skill.ability]}
      </span>
    </button>
  );
}

function SpellSlotRow({
  level,
  slot,
  onChange,
}: {
  level: number;
  slot: { max: number; used: number };
  onChange: (s: { max: number; used: number }) => void;
}) {
  const available = slot.max - slot.used;
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[#1a1510]">
      <div className="w-16 shrink-0">
        <span
          className="text-[#4a3820] text-xs"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          Level {level}
        </span>
      </div>
      <input
        type="number"
        value={slot.max}
        min={0}
        max={9}
        onChange={(e) =>
          onChange({
            ...slot,
            max: Number(e.target.value) || 0,
            used: Math.min(slot.used, Number(e.target.value) || 0),
          })
        }
        className="w-10 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 rounded text-[#a89070] outline-none text-xs py-0.5 transition-colors shrink-0"
        style={{ fontFamily: "'Cinzel', serif" }}
      />
      <div className="flex flex-wrap gap-1.5 flex-1">
        {Array.from({ length: slot.max }).map((_, i) => {
          const isUsed = i >= available;
          return (
            <button
              key={i}
              onClick={() =>
                onChange({
                  ...slot,
                  used: isUsed ? slot.used - 1 : slot.used + 1,
                })
              }
              className="w-5 h-5 rounded-full border transition-all duration-200"
              style={{
                borderColor: isUsed ? "#3d2e1a" : "#a855f7",
                background: isUsed ? "transparent" : "#a855f720",
              }}
            />
          );
        })}
        {slot.max === 0 && (
          <span
            className="text-[#3d2e1a] text-xs"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Set max slots →
          </span>
        )}
      </div>
      <span
        className="text-[#6b5a3e] text-xs shrink-0"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {available}/{slot.max}
      </span>
    </div>
  );
}

function StoryField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div
      className="rounded-xl border border-[#2a1f0f] overflow-hidden"
      style={{ background: "#140f0a" }}
    >
      <div className="px-4 py-2.5 border-b border-[#1a1510]">
        <span
          className="text-[#a89070] text-xs uppercase tracking-widest"
          style={{ fontFamily: "'Cinzel', serif" }}
        >
          {label}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-transparent text-[#a89070] placeholder:text-[#2a1f0f] outline-none px-4 py-3 resize-none text-sm leading-relaxed"
        style={{ fontFamily: "'Crimson Text', serif", fontSize: "1rem" }}
      />
    </div>
  );
}

// ─── TAB VIEWS (mantendo todas as tabs do código original) ─────────────────────

function OverviewTab({
  char,
  upd,
  classColor,
}: {
  char: CharState;
  upd: <K extends keyof CharState>(k: K, v: CharState[K]) => void;
  classColor: string;
}) {
  const pb = profBonusFromLevel(char.level);
  const passivePerc =
    10 +
    abmod(char.wis) +
    (char.skillProficiencies.includes("perception") ? pb : 0);
  const initiative = abmod(char.dex);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <p
          className={labelCls}
          style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
        >
          Ability Scores
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ABILITIES.map((ab) => (
            <AbilityCard
              key={ab}
              abbr={ab}
              score={char[ab]}
              classColor={classColor}
              onChange={(v) => upd(ab, v)}
              isSaveProf={char.saveProficiencies.includes(ab)}
              onToggleSave={() => {
                const s = char.saveProficiencies.includes(ab)
                  ? char.saveProficiencies.filter((x) => x !== ab)
                  : [...char.saveProficiencies, ab];
                upd("saveProficiencies", s);
              }}
              pb={pb}
            />
          ))}
        </div>
      </div>

      <div>
        <p
          className={labelCls}
          style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
        >
          Core Stats
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <StatBox
            label="Armor Class"
            value={char.armorClass}
            onChange={(v) => upd("armorClass", v)}
            color="#60a5fa"
          />
          <StatBox
            label="Initiative"
            value={initiative}
            onChange={() => {}}
            color={initiative >= 0 ? "#22c55e" : "#ef4444"}
          />
          <StatBox
            label="Speed (ft)"
            value={char.speed}
            onChange={(v) => upd("speed", v)}
            color="#e8d5b0"
          />
          <StatBox
            label="Prof. Bonus"
            value={pb}
            onChange={() => {}}
            color={classColor}
          />
          <StatBox
            label="Passive Percep."
            value={passivePerc}
            onChange={() => {}}
            color="#a89070"
          />
          <div
            className="flex flex-col items-center rounded-xl border border-[#2a1f0f] py-3 px-2 gap-1 cursor-pointer"
            style={{ background: "#140f0a" }}
            onClick={() => upd("inspiration", !char.inspiration)}
          >
            <span className="text-2xl">{char.inspiration ? "✦" : "◇"}</span>
            <span
              className={labelCls + " mb-0"}
              style={{
                fontFamily: "'Cinzel', serif",
                color: char.inspiration ? "#c9a84c" : "#3d2e1a",
              }}
            >
              Inspiration
            </span>
          </div>
        </div>
      </div>

      <div>
        <p
          className={labelCls}
          style={{ fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}
        >
          Character Details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <FieldSelect
            label="Race"
            value={char.race}
            onChange={(v) => upd("race", v)}
            options={RACES}
          />
          <FieldSelect
            label="Class"
            value={char.charClass}
            onChange={(v) => upd("charClass", v)}
            options={CLASSES}
          />
          <div>
            <label
              className={labelCls}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Subclass
            </label>
            <input
              type="text"
              value={char.subclass}
              onChange={(e) => upd("subclass", e.target.value)}
              placeholder="e.g. Evocation"
              className={inputCls}
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div>
            <label
              className={labelCls}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Level
            </label>
            <input
              type="number"
              value={char.level}
              min={1}
              max={20}
              onChange={(e) =>
                upd("level", clamp(Number(e.target.value) || 1, 1, 20))
              }
              className={inputCls}
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 700,
                color: classColor,
              }}
            />
          </div>
          <FieldSelect
            label="Background"
            value={char.background}
            onChange={(v) => upd("background", v)}
            options={BACKGROUNDS}
          />
          <FieldSelect
            label="Alignment"
            value={char.alignment}
            onChange={(v) => upd("alignment", v)}
            options={ALIGNMENTS}
          />
          <div>
            <label
              className={labelCls}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Experience Points
            </label>
            <input
              type="number"
              value={char.xp}
              onChange={(e) => upd("xp", Number(e.target.value) || 0)}
              className={inputCls}
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
          <div>
            <label
              className={labelCls}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Hit Dice
            </label>
            <input
              type="text"
              placeholder={`1d8 per ${char.charClass} lvl`}
              className={inputCls}
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="rounded-xl border border-[#2a1f0f] overflow-hidden"
          style={{ background: "#140f0a" }}
        >
          <div className="px-4 py-2.5 border-b border-[#1a1510]">
            <span
              className="text-[#a89070] text-xs uppercase tracking-widest"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Proficiencies
            </span>
          </div>
          <textarea
            value={char.proficiencies}
            onChange={(e) => upd("proficiencies", e.target.value)}
            placeholder="Weapons, tools, armor types..."
            rows={3}
            className="w-full bg-transparent text-[#a89070] placeholder:text-[#2a1f0f] outline-none px-4 py-3 resize-none text-sm leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>
        <div
          className="rounded-xl border border-[#2a1f0f] overflow-hidden"
          style={{ background: "#140f0a" }}
        >
          <div className="px-4 py-2.5 border-b border-[#1a1510]">
            <span
              className="text-[#a89070] text-xs uppercase tracking-widest"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Languages
            </span>
          </div>
          <textarea
            value={char.languages}
            onChange={(e) => upd("languages", e.target.value)}
            placeholder="Common, Elvish..."
            rows={3}
            className="w-full bg-transparent text-[#a89070] placeholder:text-[#2a1f0f] outline-none px-4 py-3 resize-none text-sm leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>
      </div>
    </div>
  );
}

function CombatTab({
  char,
  upd,
}: {
  char: CharState;
  upd: <K extends keyof CharState>(k: K, v: CharState[K]) => void;
}) {
  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-4">
          <HPTracker char={char} upd={upd} />
          <DeathSaves char={char} upd={upd} />
        </div>
        <div
          className="rounded-xl border border-[#2a1f0f] p-5"
          style={{ background: "#140f0a" }}
        >
          <p className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
            Combat Statistics
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Armor Class",
                key: "armorClass" as keyof CharState,
                color: "#60a5fa",
              },
              {
                label: "Speed (ft)",
                key: "speed" as keyof CharState,
                color: "#e8d5b0",
              },
            ].map(({ label, key, color }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-xl bg-[#0f0c09] border border-[#2a1f0f] py-4 px-2 gap-1"
              >
                <input
                  type="number"
                  value={char[key] as number}
                  onChange={(e) => upd(key, Number(e.target.value) || 0)}
                  className="w-16 text-center bg-transparent outline-none"
                  style={{
                    color,
                    fontFamily: "'Cinzel', serif",
                    fontSize: "2rem",
                    fontWeight: 700,
                  }}
                />
                <span
                  className={labelCls + " mb-0"}
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label
                className={labelCls}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Hit Dice
              </label>
              <input
                type="text"
                placeholder={`${char.level}d8`}
                className={inputCls}
                style={{ fontFamily: "'Cinzel', serif" }}
              />
            </div>
            <div>
              <label
                className={labelCls}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Hit Dice Left
              </label>
              <input
                type="number"
                min={0}
                max={char.level}
                defaultValue={char.level}
                className={inputCls}
                style={{ fontFamily: "'Cinzel', serif" }}
              />
            </div>
          </div>
          <div className="mt-4">
            <label
              className={labelCls}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Combat Notes
            </label>
            <textarea
              rows={3}
              placeholder="Conditions, notes, reactions..."
              className="w-full bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 rounded-lg text-[#a89070] placeholder:text-[#2a1f0f] outline-none px-3 py-2 resize-none text-sm leading-relaxed transition-colors"
              style={{ fontFamily: "'Inter', sans-serif" }}
            />
          </div>
        </div>
      </div>
      <AttacksTable
        attacks={char.attacks}
        onChange={(attacks) => upd("attacks", attacks)}
      />
    </div>
  );
}

function SkillsTab({
  char,
  upd,
}: {
  char: CharState;
  upd: <K extends keyof CharState>(k: K, v: CharState[K]) => void;
}) {
  const pb = profBonusFromLevel(char.level);

  function toggleSkill(key: string) {
    const isProf = char.skillProficiencies.includes(key);
    const isExpert = char.skillExpertise.includes(key);
    if (isExpert) {
      upd(
        "skillExpertise",
        char.skillExpertise.filter((k) => k !== key),
      );
      upd(
        "skillProficiencies",
        char.skillProficiencies.filter((k) => k !== key),
      );
    } else if (isProf) {
      upd("skillExpertise", [...char.skillExpertise, key]);
    } else {
      upd("skillProficiencies", [...char.skillProficiencies, key]);
    }
  }

  return (
    <div className="p-4 md:p-6">
      <div
        className="flex items-center gap-6 mb-5 text-xs"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-[#3d2e1a]" />
          Not proficient
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border border-[#c9a84c] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
          </span>{" "}
          <span className="text-[#a89070]">Proficient</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#c9a84c] border border-[#c9a84c] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0c0a08]" />
          </span>{" "}
          <span className="text-[#c9a84c]">Expertise</span>
        </div>
        <span className="text-[#3d2e1a]">Click to cycle</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
        {ALL_SKILLS.map((skill) => (
          <SkillRow
            key={skill.key}
            skill={skill}
            abilityMod={abmod(char[skill.ability])}
            isProf={char.skillProficiencies.includes(skill.key)}
            isExpert={char.skillExpertise.includes(skill.key)}
            pb={pb}
            onToggle={() => toggleSkill(skill.key)}
          />
        ))}
      </div>

      <div
        className="mt-6 rounded-xl border border-[#2a1f0f] p-4"
        style={{ background: "#140f0a" }}
      >
        <p className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
          Saving Throws Summary
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ABILITIES.map((ab) => {
            const isProf = char.saveProficiencies.includes(ab);
            const total = abmod(char[ab]) + (isProf ? pb : 0);
            return (
              <button
                key={ab}
                onClick={() => {
                  const s = isProf
                    ? char.saveProficiencies.filter((x) => x !== ab)
                    : [...char.saveProficiencies, ab];
                  upd("saveProficiencies", s);
                }}
                className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-[#1a1510]/50 transition-colors"
              >
                <span
                  className={`w-3 h-3 rounded-full border shrink-0 flex items-center justify-center ${isProf ? "border-[#c9a84c]" : "border-[#3d2e1a]"}`}
                >
                  {isProf && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                  )}
                </span>
                <span
                  className="text-[#c9a84c] text-xs w-8"
                  style={{ fontFamily: "'Cinzel', serif", fontWeight: 700 }}
                >
                  {total >= 0 ? `+${total}` : total}
                </span>
                <span
                  className="text-[#a89070] text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {ABILITY_FULL[ab]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SpellsTab({
  char,
  upd,
}: {
  char: CharState;
  upd: <K extends keyof CharState>(k: K, v: CharState[K]) => void;
}) {
  const pb = profBonusFromLevel(char.level);
  const spellMod = char.spellcastingAbility
    ? abmod(char[char.spellcastingAbility])
    : 0;
  const spellDC = char.spellcastingAbility ? 8 + pb + spellMod : 0;
  const spellAtk = char.spellcastingAbility ? pb + spellMod : 0;

  function addSpell() {
    upd("spells", [
      ...char.spells,
      { id: uid(), name: "", level: 0, school: "Evocation", prepared: false },
    ]);
  }
  function updateSpell(
    id: number,
    field: keyof SpellEntry,
    val: string | number | boolean,
  ) {
    upd(
      "spells",
      char.spells.map((s) => (s.id === id ? { ...s, [field]: val } : s)),
    );
  }
  function removeSpell(id: number) {
    upd(
      "spells",
      char.spells.filter((s) => s.id !== id),
    );
  }
  function updateSlot(level: number, slot: { max: number; used: number }) {
    upd("spellSlots", { ...char.spellSlots, [level]: slot });
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div
        className="rounded-xl border border-[#2a1f0f] p-4"
        style={{ background: "#140f0a" }}
      >
        <p className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
          Spellcasting
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label
              className={labelCls}
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Casting Ability
            </label>
            <select
              value={char.spellcastingAbility}
              onChange={(e) =>
                upd("spellcastingAbility", e.target.value as AbilityKey | "")
              }
              className={selectCls}
              style={{
                fontFamily: "'Inter', sans-serif",
                background: "#0f0c09",
              }}
            >
              <option value="">— None —</option>
              {ABILITIES.map((ab) => (
                <option key={ab} value={ab}>
                  {ABILITY_FULL[ab]}
                </option>
              ))}
            </select>
          </div>
          {[
            {
              label: "Spell DC",
              value: char.spellcastingAbility ? spellDC : "—",
              color: "#a855f7",
            },
            {
              label: "Spell Attack",
              value: char.spellcastingAbility
                ? spellAtk >= 0
                  ? `+${spellAtk}`
                  : spellAtk
                : "—",
              color: "#c9a84c",
            },
            {
              label: "Mod Bonus",
              value: char.spellcastingAbility
                ? fmtMod(char[char.spellcastingAbility])
                : "—",
              color: "#60a5fa",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex flex-col items-center bg-[#0f0c09] border border-[#2a1f0f] rounded-xl py-3"
            >
              <span
                style={{
                  color,
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                }}
              >
                {value}
              </span>
              <span
                className={labelCls + " mb-0"}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-xl border border-[#2a1f0f] overflow-hidden"
        style={{ background: "#140f0a" }}
      >
        <div className="px-4 py-3 border-b border-[#1a1510] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#a855f7]" />
          <span
            className="text-[#a89070] text-sm"
            style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
          >
            Spell Slots
          </span>
        </div>
        <div className="px-4 py-3">
          {Object.entries(char.spellSlots).map(([lvl, slot]) => (
            <SpellSlotRow
              key={lvl}
              level={Number(lvl)}
              slot={slot}
              onChange={(s) => updateSlot(Number(lvl), s)}
            />
          ))}
        </div>
      </div>

      <div
        className="rounded-xl border border-[#2a1f0f] overflow-hidden"
        style={{ background: "#140f0a" }}
      >
        <div className="px-4 py-3 border-b border-[#1a1510] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#a855f7]" />
            <span
              className="text-[#a89070] text-sm"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Known Spells
            </span>
          </div>
          <button
            onClick={addSpell}
            className="flex items-center gap-1 text-[#a855f7] hover:text-[#e8d5b0] text-xs transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Plus className="w-3.5 h-3.5" /> Add Spell
          </button>
        </div>
        <div className="divide-y divide-[#1a1510]">
          {char.spells.map((spell) => (
            <div
              key={spell.id}
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#1a1510]/40 transition-colors"
            >
              <button
                onClick={() =>
                  updateSpell(spell.id, "prepared", !spell.prepared)
                }
                className="w-5 h-5 rounded border shrink-0 flex items-center justify-center transition-all"
                style={{
                  borderColor: spell.prepared ? "#a855f7" : "#3d2e1a",
                  background: spell.prepared ? "#a855f720" : "transparent",
                }}
              >
                {spell.prepared && (
                  <Check className="w-3 h-3" style={{ color: "#a855f7" }} />
                )}
              </button>
              <input
                value={spell.name}
                onChange={(e) => updateSpell(spell.id, "name", e.target.value)}
                placeholder="Spell name"
                className="flex-1 bg-transparent text-[#e8d5b0] placeholder:text-[#3d2e1a] outline-none text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
              <select
                value={spell.level}
                onChange={(e) =>
                  updateSpell(spell.id, "level", Number(e.target.value))
                }
                className="bg-[#0f0c09] border border-[#2a1f0f] rounded text-xs text-[#a855f7] outline-none px-2 py-1 cursor-pointer"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                <option value={0}>Cantrip</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((l) => (
                  <option key={l} value={l}>
                    Level {l}
                  </option>
                ))}
              </select>
              <select
                value={spell.school}
                onChange={(e) =>
                  updateSpell(spell.id, "school", e.target.value)
                }
                className="bg-[#0f0c09] border border-[#2a1f0f] rounded text-xs text-[#6b5a3e] outline-none px-2 py-1 cursor-pointer hidden sm:block"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {SCHOOLS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeSpell(spell.id)}
                className="text-[#3d2e1a] hover:text-[#ef4444] transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {char.spells.length === 0 && (
            <div
              className="px-4 py-6 text-center text-[#3d2e1a] text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              No spells yet — add one above
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InventoryTab({
  char,
  upd,
}: {
  char: CharState;
  upd: <K extends keyof CharState>(k: K, v: CharState[K]) => void;
}) {
  const currencyColors = {
    cp: "#a16207",
    sp: "#71717a",
    ep: "#60a5fa",
    gp: "#c9a84c",
    pp: "#a855f7",
  };
  const currencyLabels = { cp: "CP", sp: "SP", ep: "EP", gp: "GP", pp: "PP" };

  function addItem() {
    upd("equipment", [
      ...char.equipment,
      { id: uid(), name: "", qty: 1, weight: 0, equipped: false },
    ]);
  }
  function updateItem(
    id: number,
    field: keyof EqItem,
    val: string | number | boolean,
  ) {
    upd(
      "equipment",
      char.equipment.map((i) => (i.id === id ? { ...i, [field]: val } : i)),
    );
  }
  function removeItem(id: number) {
    upd(
      "equipment",
      char.equipment.filter((i) => i.id !== id),
    );
  }

  const totalWeight = char.equipment.reduce(
    (sum, i) => sum + i.qty * i.weight,
    0,
  );
  const carryCapacity = char.str * 15;

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div
        className="rounded-xl border border-[#2a1f0f] p-5"
        style={{ background: "#140f0a" }}
      >
        <p className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
          Currency
        </p>
        <div className="grid grid-cols-5 gap-3">
          {(Object.keys(char.currency) as (keyof typeof char.currency)[]).map(
            (key) => (
              <div key={key} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                  style={{
                    borderColor: currencyColors[key],
                    background: currencyColors[key] + "15",
                  }}
                >
                  <span
                    className="text-xs"
                    style={{
                      color: currencyColors[key],
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 700,
                    }}
                  >
                    {currencyLabels[key]}
                  </span>
                </div>
                <input
                  type="number"
                  value={char.currency[key]}
                  onChange={(e) =>
                    upd("currency", {
                      ...char.currency,
                      [key]: Number(e.target.value) || 0,
                    })
                  }
                  className="w-16 text-center bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/40 rounded-lg outline-none text-sm py-1.5 transition-colors"
                  style={{
                    color: currencyColors[key],
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                  }}
                />
              </div>
            ),
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 px-1">
        <Package className="w-4 h-4 text-[#4a3820]" />
        <div className="flex-1">
          <div
            className="flex justify-between text-xs mb-1"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span className="text-[#6b5a3e]">Carry weight</span>
            <span className="text-[#a89070]">
              {totalWeight} / {carryCapacity} lb
            </span>
          </div>
          <div className="h-1.5 bg-[#1a1510] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((totalWeight / carryCapacity) * 100, 100)}%`,
                background: totalWeight > carryCapacity ? "#ef4444" : "#c9a84c",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="rounded-xl border border-[#2a1f0f] overflow-hidden"
        style={{ background: "#140f0a" }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1510]">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#c9a84c]" />
            <span
              className="text-[#a89070] text-sm"
              style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
            >
              Equipment
            </span>
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-[#c9a84c] hover:text-[#e8d5b0] text-xs transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[450px]">
            <thead>
              <tr className="border-b border-[#1a1510]">
                {["Eq.", "Item Name", "Qty", "Weight (lb)", ""].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left text-[#3d2e1a] text-xs"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1510]">
              {char.equipment.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-[#1a1510]/40 transition-colors"
                >
                  <td className="px-3 py-2">
                    <button
                      onClick={() =>
                        updateItem(item.id, "equipped", !item.equipped)
                      }
                      className="w-5 h-5 rounded border flex items-center justify-center transition-all"
                      style={{
                        borderColor: item.equipped ? "#c9a84c" : "#3d2e1a",
                        background: item.equipped ? "#c9a84c20" : "transparent",
                      }}
                    >
                      {item.equipped && (
                        <Check className="w-3 h-3 text-[#c9a84c]" />
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      placeholder="Item name"
                      className="bg-transparent text-[#e8d5b0] placeholder:text-[#3d2e1a] outline-none text-sm w-full"
                      style={{ fontFamily: "'Inter', sans-serif" }}
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
                      style={{ fontFamily: "'Cinzel', serif" }}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={item.weight}
                      min={0}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          "weight",
                          Number(e.target.value) || 0,
                        )
                      }
                      className="w-16 text-center bg-[#0f0c09] border border-[#2a1f0f] rounded text-[#a89070] outline-none text-xs py-1 focus:border-[#c9a84c]/40 transition-colors"
                      style={{ fontFamily: "'Cinzel', serif" }}
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
              {char.equipment.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-5 text-center text-[#3d2e1a] text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Empty pockets — add items above
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

function StoryTab({
  char,
  upd,
}: {
  char: CharState;
  upd: <K extends keyof CharState>(k: K, v: CharState[K]) => void;
}) {
  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StoryField
          label="Personality Traits"
          value={char.personalityTraits}
          onChange={(v) => upd("personalityTraits", v)}
          placeholder="I always have a plan for when things go wrong. I am always polite and respectful..."
          rows={4}
        />
        <StoryField
          label="Ideals"
          value={char.ideals}
          onChange={(v) => upd("ideals", v)}
          placeholder="Freedom. Chains are meant to be broken, as are those who forge them..."
          rows={4}
        />
        <StoryField
          label="Bonds"
          value={char.bonds}
          onChange={(v) => upd("bonds", v)}
          placeholder="I protect those who cannot protect themselves..."
          rows={4}
        />
        <StoryField
          label="Flaws"
          value={char.flaws}
          onChange={(v) => upd("flaws", v)}
          placeholder="I have trouble trusting in my allies..."
          rows={4}
        />
      </div>

      <StoryField
        label="Backstory"
        value={char.backstory}
        onChange={(v) => upd("backstory", v)}
        placeholder="Tell the story of your hero's origin. Where were they born? What shaped them? What drives them forward into the unknown..."
        rows={8}
      />

      <StoryField
        label="Features & Class Traits"
        value={char.features}
        onChange={(v) => upd("features", v)}
        placeholder="List class features, racial traits, feats and special abilities..."
        rows={5}
      />

      <div
        className="rounded-xl border border-[#2a1f0f] p-5"
        style={{ background: "#140f0a" }}
      >
        <p className={labelCls} style={{ fontFamily: "'Cinzel', serif" }}>
          Physical Appearance
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: "Age", key: "age" },
            { label: "Height", key: "height" },
            { label: "Weight", key: "weight" },
            { label: "Eyes", key: "eyes" },
            { label: "Hair", key: "hair" },
            { label: "Skin", key: "skin" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label
                className={labelCls}
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {label}
              </label>
              <input
                type="text"
                value={char[key as keyof CharState] as string}
                onChange={(e) =>
                  upd(key as keyof CharState, e.target.value as never)
                }
                placeholder="—"
                className={inputCls}
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "combat", label: "Combat", icon: Swords },
  { id: "skills", label: "Skills", icon: Target },
  { id: "spells", label: "Spells", icon: Sparkles },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "story", label: "Story", icon: BookOpen },
];

export default function CharacterSheet() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [char, setChar] = useState<CharState>(DEFAULT_CHAR);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Load character if editing
  useEffect(() => {
    if (id) {
      loadCharacter(id);
    }
  }, [id]);

  async function loadCharacter(characterId: string) {
    try {
      setLoading(true);
      const character = await characterService.getCharacter(characterId);

      // Map backend data to CharState
      const sheetData = character.sheetData || {};
      setChar({
        ...DEFAULT_CHAR,
        ...sheetData,
        name: character.name, // name por último para sobrescrever
      });
    } catch (e) {
      console.error("Error loading character:", e);
      setError("Erro ao carregar personagem");
    } finally {
      setLoading(false);
    }
  }

  function upd<K extends keyof CharState>(key: K, value: CharState[K]) {
    setChar((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!char.name.trim()) {
      setError("O nome do personagem é obrigatório");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // Prepare data for backend
      const sheetData = { ...char };

      if (id) {
        // Update existing character
        await characterService.updateCharacter(id, {
          name: char.name,
          sheetData,
        });
      } else {
        // Create new character
        const newChar = await characterService.createCharacter({
          name: char.name,
          system: "DND_5E",
          sheetData,
        });
        // Redirect to edit mode
        navigate(`/dashboard/character/${newChar.id}/edit`, { replace: true });
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e: any) {
      console.error("Error saving character:", e);
      setError(e.message || "Erro ao salvar personagem");
    } finally {
      setSaving(false);
    }
  }

  const classColor = CLASS_COLORS[char.charClass] || "#c9a84c";
  const ClassIcon = CLASS_ICONS[char.charClass] || Sword;
  const pb = profBonusFromLevel(char.level);
  const hpPct =
    char.maxHp > 0 ? clamp((char.currentHp / char.maxHp) * 100, 0, 100) : 0;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0c0a08" }}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#c9a84c] animate-spin" />
          <p className="text-[#a89070] font-cinzel tracking-widest">
            CARREGANDO FICHA...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#0c0a08" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b border-[#2a1f0f]"
        style={{ background: "#0f0c09" }}
      >
        <div
          className="h-0.5"
          style={{
            background: `linear-gradient(90deg, ${classColor}, ${classColor}40, transparent)`,
          }}
        />

        <div className="px-4 md:px-6 py-3">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-[#4a3820] hover:text-[#c9a84c] transition-colors shrink-0 text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <ArrowLeft className="w-4 h-4" />{" "}
              <span className="hidden sm:inline">Dashboard</span>
            </Link>

            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: classColor + "20" }}
            >
              <ClassIcon className="w-5 h-5" style={{ color: classColor }} />
            </div>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={char.name}
                onChange={(e) => upd("name", e.target.value)}
                placeholder="Nome do Personagem"
                className="bg-transparent text-[#e8d5b0] placeholder:text-[#3d2e1a] outline-none w-full truncate"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                  fontWeight: 700,
                }}
              />
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{
                    background: classColor + "20",
                    color: classColor,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {char.charClass}
                </span>
                <span
                  className="text-[#4a3820] text-xs"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {char.race}
                </span>
                <span className="text-[#3d2e1a] text-xs">·</span>
                <span
                  className="text-[#4a3820] text-xs"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  Level {char.level}
                </span>
                <span className="text-[#3d2e1a] text-xs">·</span>
                <span
                  className="text-[#4a3820] text-xs flex items-center gap-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  <Heart
                    className="w-3 h-3"
                    style={{
                      color:
                        hpPct > 60
                          ? "#22c55e"
                          : hpPct > 30
                            ? "#f59e0b"
                            : "#ef4444",
                    }}
                  />
                  {char.currentHp}/{char.maxHp} HP
                </span>
                <span className="text-[#3d2e1a] text-xs">·</span>
                <span
                  className="text-[#4a3820] text-xs"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Prof +{pb}
                </span>
              </div>
            </div>

            <motion.button
              onClick={handleSave}
              whileTap={{ scale: 0.95 }}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm shrink-0 transition-all duration-300 disabled:opacity-60"
              style={{
                background: saved
                  ? "linear-gradient(135deg, #22c55e20, #16a34a20)"
                  : `linear-gradient(135deg, ${classColor}30, ${classColor}15)`,
                border: `1px solid ${saved ? "#22c55e60" : classColor + "50"}`,
                color: saved ? "#22c55e" : classColor,
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Scroll className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {saving ? "Salvando…" : saved ? "Salvo!" : "Salvar Ficha"}
              </span>
            </motion.button>
          </div>

          {error && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
              {error}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-[#1a1510] overflow-x-auto scrollbar-hide">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap transition-all duration-200 relative shrink-0"
                style={{
                  color: isActive ? classColor : "#4a3820",
                  fontFamily: "'Cinzel', serif",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: classColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab === "overview" && (
              <OverviewTab char={char} upd={upd} classColor={classColor} />
            )}
            {tab === "combat" && <CombatTab char={char} upd={upd} />}
            {tab === "skills" && <SkillsTab char={char} upd={upd} />}
            {tab === "spells" && <SpellsTab char={char} upd={upd} />}
            {tab === "inventory" && <InventoryTab char={char} upd={upd} />}
            {tab === "story" && <StoryTab char={char} upd={upd} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
