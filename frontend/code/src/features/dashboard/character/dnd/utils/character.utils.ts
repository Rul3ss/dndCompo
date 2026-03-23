// ─── Character Math Utilities ────────────────────────────────────────────────────

/**
 * Calcula o modifier de uma ability score D&D (floor((score - 10) / 2)).
 */
export function calculateAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Formata um modifier com sinal: "+3", "-1", "+0".
 */
export function formatModifier(score: number): string {
  const modifier = calculateAbilityModifier(score);
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/**
 * Retorna o Proficiency Bonus baseado no nível do personagem.
 * Fórmula oficial D&D 5e: ceil(level/4) + 1
 */
export function getProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}

/**
 * Limita um valor entre min e max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Retorna uma cor CSS baseada na porcentagem de HP atual do personagem.
 * ≤25% → vermelho (crítico), ≤50% → laranja (baixo),
 * ≤75% → amarelo (moderado), >75% → verde (saudável).
 */
export function getHpColor(hpPercent: number): string {
  if (hpPercent <= 25) return "#ef4444"; // red-500
  if (hpPercent <= 50) return "#f97316"; // orange-500
  if (hpPercent <= 75) return "#eab308"; // yellow-500
  return "#22c55e";                       // green-500
}

/**
 * Gera um ID único usando crypto.randomUUID quando disponível,
 * com fallback para timestamp + random.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
