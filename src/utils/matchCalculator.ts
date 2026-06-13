import { User } from "@/types/user";

export type MatchLabel = "Excelente" | "Boa" | "Potencial";

export interface MatchResult {
  score: number;
  commonSkills: string[];
  label: MatchLabel;
  color: string;
  bgColor: string;
  textColor: string;
}

interface MatchLevel {
  minScore: number;
  label: MatchLabel;
  color: string;
  bgColor: string;
  textColor: string;
}

// ── Configuração declarativa dos níveis de compatibilidade ──────────────────
// Para adicionar um novo nível (ex: "Excepcional" >= 90), basta inserir um
// novo objeto aqui. A função resolveMatchLevel e calculateMatch NÃO precisam
// ser alteradas (Open/Closed Principle).
const MATCH_LEVELS: MatchLevel[] = [
  {
    minScore: 70,
    label: "Excelente",
    color: "hsl(168, 80%, 36%)",
    bgColor: "hsl(168, 60%, 92%)",
    textColor: "hsl(168, 80%, 20%)",
  },
  {
    minScore: 45,
    label: "Boa",
    color: "hsl(38, 92%, 50%)",
    bgColor: "hsl(38, 100%, 93%)",
    textColor: "hsl(38, 80%, 25%)",
  },
  {
    minScore: 0,
    label: "Potencial",
    color: "hsl(25, 90%, 55%)",
    bgColor: "hsl(25, 100%, 94%)",
    textColor: "hsl(25, 80%, 28%)",
  },
];

function resolveMatchLevel(score: number): MatchLevel {
  return (
    MATCH_LEVELS.find(level => score >= level.minScore) ??
    MATCH_LEVELS[MATCH_LEVELS.length - 1]
  );
}

/**
 * Calcula a compatibilidade entre dois usuários.
 *
 * Critérios:
 *  - Jaccard similarity entre habilidades:   0–70 pts
 *  - Completude do perfil do outro usuário:  0–30 pts
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

  const level = resolveMatchLevel(score);

  return { score, commonSkills: common, ...level };
}
