import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserService } from "@/services/UserService";
import { calculateMatch, MatchResult } from "@/utils/matchCalculator";
import { User } from "@/types/user";

export interface RankedUser extends User, MatchResult {}

const MIN_COMPATIBILITY_SCORE = 50;

/**
 * Hook que isola a regra de negócio "buscar usuários recomendados".
 * Componentes de apresentação dependem apenas deste hook, não do
 * UserService diretamente.
 */
export function useRecommendedUsers(): RankedUser[] {
  const { user } = useAuth();

  return useMemo<RankedUser[]>(() => {
    if (!user) return [];

    return UserService.getUsers()
      .filter(u => u.id !== user.id)
      .map(u => ({ ...u, ...calculateMatch(user, u) }))
      .filter(u => u.score > MIN_COMPATIBILITY_SCORE)
      .sort((a, b) => b.score - a.score);
  }, [user]);
}
