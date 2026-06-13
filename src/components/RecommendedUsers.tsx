import { useAuth } from "@/contexts/AuthContext";
import { useRecommendedUsers, RankedUser } from "@/hooks/useRecommendedUsers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, GraduationCap, Sparkles, Users } from "lucide-react";

// ── Tipos ────────────────────────────────────────────────────────────────────


// ── Sub-componente: barra de compatibilidade ─────────────────────────────────

interface CompatibilityBarProps {
  score: number;
  color: string;
}

const CompatibilityBar = ({ score, color }: CompatibilityBarProps) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
    <span
      className="text-sm font-semibold tabular-nums w-9 text-right"
      style={{ color }}
    >
      {score}%
    </span>
  </div>
);

// ── Sub-componente: card de usuário ──────────────────────────────────────────

interface UserCardProps {
  ranked: RankedUser;
}

const UserCard = ({ ranked }: UserCardProps) => {
  const isEmpresa = ranked.profileType === "empresa";
  const initials  = ranked.name
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const MAX_VISIBLE_SKILLS  = 3;
  const visibleSkills       = ranked.habilidades?.slice(0, MAX_VISIBLE_SKILLS) ?? [];
  const hiddenSkillsCount   = (ranked.habilidades?.length ?? 0) - MAX_VISIBLE_SKILLS;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-md">
      {/* Cabeçalho: avatar + info + badge de compatibilidade */}
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback
            className="text-sm font-semibold"
            style={{
              backgroundColor: isEmpresa ? "hsl(168, 60%, 92%)" : "hsl(210, 20%, 93%)",
              color:           isEmpresa ? "hsl(168, 80%, 20%)" : "hsl(220, 25%, 30%)",
            }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight truncate" style={{ fontFamily: "var(--font-heading)" }}>
            {ranked.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {isEmpresa
              ? <Building2   className="h-3 w-3 text-muted-foreground" />
              : <GraduationCap className="h-3 w-3 text-muted-foreground" />
            }
            <span className="text-xs text-muted-foreground capitalize">{ranked.profileType}</span>
          </div>
        </div>

        {/* Badge label */}
        <span
          className="shrink-0 text-xs font-medium rounded-full px-2 py-0.5"
          style={{ backgroundColor: ranked.bgColor, color: ranked.textColor }}
        >
          {ranked.label}
        </span>
      </div>

      {/* Barra de compatibilidade */}
      <CompatibilityBar score={ranked.score} color={ranked.color} />

      {/* Skills */}
      {visibleSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleSkills.map(skill => {
            const isCommon = ranked.commonSkills
              .map(s => s.toLowerCase())
              .includes(skill.toLowerCase());
            return (
              <Badge
                key={skill}
                variant={isCommon ? "default" : "secondary"}
                className="text-xs py-0 px-2"
                title={isCommon ? "Habilidade em comum" : undefined}
              >
                {skill}
              </Badge>
            );
          })}
          {hiddenSkillsCount > 0 && (
            <Badge variant="outline" className="text-xs py-0 px-2 text-muted-foreground">
              +{hiddenSkillsCount}
            </Badge>
          )}
        </div>
      )}

      {/* Skills em comum */}
      {ranked.commonSkills.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-medium" style={{ color: ranked.color }}>
            {ranked.commonSkills.length} habilidade{ranked.commonSkills.length > 1 ? "s" : ""} em comum
          </span>
        </p>
      )}
    </div>
  );
};

// ── Componente principal ──────────────────────────────────────────────────────

const RecommendedUsers = () => {
  const { user } = useAuth();
  const ranked = useRecommendedUsers();

  if (!user) return null;

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <Sparkles className="h-4 w-4 text-primary" />
            Compatibilidade
            {ranked.length > 0 && (
              <span className="text-muted-foreground font-normal text-base">
                ({ranked.length})
              </span>
            )}
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Usuários cadastrados</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Exibe apenas usuários com mais de 50% de compatibilidade.
        </p>
      </CardHeader>

      <CardContent>
        {ranked.length === 0 ? (
          <p className="text-sm text-muted-foreground italic text-center py-6">
            Nenhum usuário com mais de 50% de compatibilidade encontrado.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {ranked.map(u => (
              <UserCard key={u.id} ranked={u} />
            ))}
          </div>
        )}

        {/* Legenda */}
        {ranked.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
            {(
              [
                { label: "Excelente", bg: "hsl(168, 60%, 92%)", text: "hsl(168, 80%, 20%)" },
                { label: "Boa",       bg: "hsl(38, 100%, 93%)", text: "hsl(38, 80%, 25%)" },
                { label: "Potencial", bg: "hsl(25, 100%, 94%)", text: "hsl(25, 80%, 28%)" },
              ] as const
            ).map(({ label, bg, text }) => (
              <span
                key={label}
                className="text-xs font-medium rounded-full px-2.5 py-0.5"
                style={{ backgroundColor: bg, color: text }}
              >
                {label}
              </span>
            ))}
            <span className="text-xs text-muted-foreground self-center">
              — Habilidades em <Badge variant="default" className="text-xs py-0 px-1.5 inline-flex">destaque</Badge>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedUsers;
