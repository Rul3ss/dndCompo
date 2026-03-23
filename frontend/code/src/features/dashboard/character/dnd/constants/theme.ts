import type { CSSProperties } from "react";

// ─── Color Palette ───────────────────────────────────────────────────────────────

export const COLORS = {
  bg: {
    page: "#0c0a08",
    header: "#0f0c09",
    surface: "#140f0a",
    input: "#0f0c09",
  },
  border: {
    subtle: "#1a1510",
    default: "#2a1f0f",
    muted: "#3d2e1a",
    visible: "#4a3820",
  },
  text: {
    primary: "#e8d5b0",
    secondary: "#a89070",
    muted: "#6b5a3e",
    faint: "#4a3820",
    placeholder: "#3d2e1a",
  },
  accent: "#c9a84c",
  hp: {
    high: "#22c55e",
    medium: "#f59e0b",
    low: "#ef4444",
  },
  spell: "#a855f7",
  blue: "#60a5fa",
  danger: "#ef4444",
  success: "#22c55e",
  dark: "#0c0a08",
} as const;

// ─── HP Color Helper ─────────────────────────────────────────────────────────────

export const HP_THRESHOLDS = { danger: 30, warning: 60 } as const;

export function getHpColor(hpPercent: number): string {
  if (hpPercent > HP_THRESHOLDS.warning) return COLORS.hp.high;
  if (hpPercent > HP_THRESHOLDS.danger) return COLORS.hp.medium;
  return COLORS.hp.low;
}

// ─── Font Families ───────────────────────────────────────────────────────────────

export const FONTS = {
  display: "'Cinzel', serif",
  body: "'Inter', sans-serif",
  narrative: "'Crimson Text', serif",
} as const;

// ─── Reusable Style Objects ──────────────────────────────────────────────────────

export const fontStyles = {
  display: { fontFamily: FONTS.display } satisfies CSSProperties,
  body: { fontFamily: FONTS.body } satisfies CSSProperties,
  narrative: { fontFamily: FONTS.narrative } satisfies CSSProperties,
};

// ─── Tailwind Class Strings ──────────────────────────────────────────────────────

export const INPUT_CLASS =
  "bg-[#0f0c09] border border-[#2a1f0f] focus:border-[#c9a84c]/50 rounded-lg text-[#e8d5b0] outline-none text-sm px-3 py-2 transition-colors w-full placeholder:text-[#3d2e1a] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

export const SELECT_CLASS = INPUT_CLASS + " cursor-pointer";

export const LABEL_CLASS =
  "text-[#4a3820] text-xs uppercase tracking-wider mb-1 block";

export const CARD_CLASS =
  "rounded-xl border border-[#2a1f0f] overflow-hidden";

export const SURFACE_CLASS =
  "rounded-xl border border-[#2a1f0f]";
