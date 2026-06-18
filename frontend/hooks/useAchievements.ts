import { useQuery } from "@tanstack/react-query";
import { fetchAchievements } from "@/services/achievementService";

export function useAchievements() {
  return useQuery({
    queryKey: ["achievements"],
    queryFn: fetchAchievements,
    staleTime: 10 * 60 * 1000,
  });
}
