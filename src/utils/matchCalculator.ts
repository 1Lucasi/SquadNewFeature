import { User } from "@/types/user";

export type MatchLabel = "Excelente" | "Boa" | "Potencial";

export interface MatchResult {
  score: number;           // 0–100
  commonSkills: string[];  // habilidades em comum
  label: MatchLabel;
  color: string;           // cor CSS usada na barra e no badge
  bgColor: string;         // cor de fundo do badge
  textColor: string;       // cor do texto do badge
}

/**
 * Calcula a compatibilidade entre dois usuários.
 *
 * Critérios:
 *  - Jaccard similarity entre habilidades:   0–70 pts
 *  - Completude do perfil do outro usuário:  0–30 pts
 *    • Tem nome:                              +10
 *    • Tem ao menos 1 habilidade:             +10
 *    • Tem 3 ou mais habilidades:             +10
 *
 * Total: 0–100 (arredondado)
 */
export function calculateMatch(current: User, other: User): MatchResult {
  const mySkills    = current.habilidades ?? [];
  const otherSkills = other.habilidades   ?? [];

  // ── Skills ──────────────────────────────────────────────────
  const common = mySkills.filter(s =>
    otherSkills.map(x => x.toLowerCase()).includes(s.toLowerCase())
  );
  const union  = [...new Set([...mySkills.map(s => s.toLowerCase()), ...otherSkills.map(s => s.toLowerCase())])];
  const skillScore = union.length > 0 ? (common.length / union.length) * 70 : 0;

  // ── Completude ───────────────────────────────────────────────
  let completeness = 0;
  if (other.name?.trim())      completeness += 10;
  if (otherSkills.length >= 1) completeness += 10;
  if (otherSkills.length >= 3) completeness += 10;

  const score = Math.min(100, Math.round(skillScore + completeness));

  // ── Label e Cores ────────────────────────────────────────────
  let label:     MatchLabel;
  let color:     string;
  let bgColor:   string;
  let textColor: string;

  if (score >= 70) {
    label     = "Excelente";
    color     = "hsl(168, 80%, 36%)";   // primary verde
    bgColor   = "hsl(168, 60%, 92%)";   // accent verde claro
    textColor = "hsl(168, 80%, 20%)";   // accent-foreground
  } else if (score >= 45) {
    label     = "Boa";
    color     = "hsl(38, 92%, 50%)";    // âmbar
    bgColor   = "hsl(38, 100%, 93%)";
    textColor = "hsl(38, 80%, 25%)";
  } else {
    label     = "Potencial";
    color     = "hsl(25, 90%, 55%)";    // laranja suave
    bgColor   = "hsl(25, 100%, 94%)";
    textColor = "hsl(25, 80%, 28%)";
  }

  return { score, commonSkills: common, label, color, bgColor, textColor };
}
