// ─── Character Types ────────────────────────────────────────────────────────────

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface Attack {
  id: string;
  name: string;
  atkBonus: string;
  damageDice: string;
  damageType: string;
}

export interface SpellEntry {
  id: string;
  name: string;
  level: number;
  school: string;
  prepared: boolean;
}

export interface EquipmentItem {
  id: string;
  name: string;
  qty: number;
  weight: number;
  equipped: boolean;
}

export interface Feat {
  id: string;
  name: string;
  description: string;
  bonus: string;
}

export interface CharacterState {
  name: string;
  race: string;
  charClass: string;
  subclass: string;
  level: number;
  background: string;
  alignment: string;
  xp: number;
  inspiration: boolean;

  // Ability scores
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;

  // Hit points
  maxHp: number;
  currentHp: number;
  tempHp: number;

  // Combat stats
  armorClass: number;
  initiative?: number;
  proficiencyBonus?: number;
  passivePerception?: number;
  speed: number;
  hitDice: string;
  hitDiceRemaining: number;

  // Death saves
  deathSucc: number;
  deathFail: number;

  // Proficiencies
  saveProficiencies: AbilityKey[];
  skillProficiencies: string[];
  skillExpertise: string[];

  // Combat
  combatNotes: string;
  attacks: Attack[];

  // Spells
  spellcastingAbility: AbilityKey | "";
  spellSlots: Record<number, { max: number; used: number }>;
  spells: SpellEntry[];

  // Inventory
  currency: { cp: number; sp: number; ep: number; gp: number; pp: number };
  equipment: EquipmentItem[];

  // Story / personality
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  backstory: string;
  features: string;
  feats: Feat[];

  // Physical appearance
  age: string;
  height: string;
  weight: string;
  eyes: string;
  hair: string;
  skin: string;

  // Misc
  languages: string;
  proficiencies: string;
}

export type UpdateFieldFn = <K extends keyof CharacterState>(
  key: K,
  value: CharacterState[K],
) => void;
