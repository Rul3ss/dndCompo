import {
  Flame,
  Music,
  Star,
  Leaf,
  Sword,
  Zap,
  Shield,
  Target,
  Eye,
  Sparkles,
  Wand2,
} from "lucide-react";
import type { AbilityKey, CharacterState } from "../types/character.types";

// ─── D&D Lists ───────────────────────────────────────────────────────────────────

export const RACES = [
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
] as const;

export const CLASSES = [
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
] as const;

export const BACKGROUNDS = [
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
] as const;

export const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
] as const;

export const SCHOOLS = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
] as const;

// ─── Abilities ───────────────────────────────────────────────────────────────────

export const ABILITIES: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  str: "abilities.short.str",
  dex: "abilities.short.dex",
  con: "abilities.short.con",
  int: "abilities.short.int",
  wis: "abilities.short.wis",
  cha: "abilities.short.cha",
};

export const ABILITY_FULL_NAMES: Record<AbilityKey, string> = {
  str: "abilities.str",
  dex: "abilities.dex",
  con: "abilities.con",
  int: "abilities.int",
  wis: "abilities.wis",
  cha: "abilities.cha",
};

// ─── Skills ──────────────────────────────────────────────────────────────────────

export const ALL_SKILLS = [
  { key: "acrobatics", labelKey: "skills.acrobatics", ability: "dex" as AbilityKey },
  { key: "animalHandling", labelKey: "skills.animalHandling", ability: "wis" as AbilityKey },
  { key: "arcana", labelKey: "skills.arcana", ability: "int" as AbilityKey },
  { key: "athletics", labelKey: "skills.athletics", ability: "str" as AbilityKey },
  { key: "deception", labelKey: "skills.deception", ability: "cha" as AbilityKey },
  { key: "history", labelKey: "skills.history", ability: "int" as AbilityKey },
  { key: "insight", labelKey: "skills.insight", ability: "wis" as AbilityKey },
  { key: "intimidation", labelKey: "skills.intimidation", ability: "cha" as AbilityKey },
  { key: "investigation", labelKey: "skills.investigation", ability: "int" as AbilityKey },
  { key: "medicine", labelKey: "skills.medicine", ability: "wis" as AbilityKey },
  { key: "nature", labelKey: "skills.nature", ability: "int" as AbilityKey },
  { key: "perception", labelKey: "skills.perception", ability: "wis" as AbilityKey },
  { key: "performance", labelKey: "skills.performance", ability: "cha" as AbilityKey },
  { key: "persuasion", labelKey: "skills.persuasion", ability: "cha" as AbilityKey },
  { key: "religion", labelKey: "skills.religion", ability: "int" as AbilityKey },
  { key: "sleightOfHand", labelKey: "skills.sleightOfHand", ability: "dex" as AbilityKey },
  { key: "stealth", labelKey: "skills.stealth", ability: "dex" as AbilityKey },
  { key: "survival", labelKey: "skills.survival", ability: "wis" as AbilityKey },
] as const;

// ─── Class Appearance ────────────────────────────────────────────────────────────

export const CLASS_COLORS: Record<string, string> = {
  Barbarian: "#f97316",
  Bard:      "#ec4899",
  Cleric:    "#60a5fa",
  Druid:     "#84cc16",
  Fighter:   "#ef4444",
  Monk:      "#eab308",
  Paladin:   "#c9a84c",
  Ranger:    "#22c55e",
  Rogue:     "#14b8a6",
  Sorcerer:  "#8b5cf6",
  Warlock:   "#7c3aed",
  Wizard:    "#a855f7",
};

export const CLASS_ICONS: Record<string, React.ElementType> = {
  Barbarian: Flame,
  Bard:      Music,
  Cleric:    Star,
  Druid:     Leaf,
  Fighter:   Sword,
  Monk:      Zap,
  Paladin:   Shield,
  Ranger:    Target,
  Rogue:     Eye,
  Sorcerer:  Sparkles,
  Warlock:   Eye,
  Wizard:    Wand2,
};

// ─── Sheet Tabs ──────────────────────────────────────────────────────────────────

import { User, Swords, BookOpen, Package } from "lucide-react";

export const SHEET_TABS = [
  { id: "overview",   labelKey: "tabs.overview",   icon: User },
  { id: "combat",     labelKey: "tabs.combat",     icon: Swords },
  { id: "skills",     labelKey: "tabs.skills",     icon: Target },
  { id: "spells",     labelKey: "tabs.spells",     icon: Sparkles },
  { id: "inventory",  labelKey: "tabs.inventory",  icon: Package },
  { id: "story",      labelKey: "tabs.story",      icon: BookOpen },
] as const;

export type TabId = (typeof SHEET_TABS)[number]["id"];

// ─── Default Character ───────────────────────────────────────────────────────────

export const DEFAULT_CHARACTER: CharacterState = {
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
  hitDice: "",
  hitDiceRemaining: 1,
  deathSucc: 0,
  deathFail: 0,
  saveProficiencies: [],
  skillProficiencies: [],
  skillExpertise: [],
  combatNotes: "",
  attacks: [
    {
      id: "default-unarmed",
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
    { id: "default-backpack", name: "Backpack", qty: 1, weight: 5, equipped: false },
    { id: "default-rations", name: "Rations (5 days)", qty: 1, weight: 10, equipped: false },
  ],
  personalityTraits: "",
  ideals: "",
  bonds: "",
  flaws: "",
  backstory: "",
  features: "",
  feats: [],
  age: "",
  height: "",
  weight: "",
  eyes: "",
  hair: "",
  skin: "",
  languages: "Common",
  proficiencies: "",
};
