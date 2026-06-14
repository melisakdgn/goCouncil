import { useQuery } from "@tanstack/react-query";
import { fetchPreferenceQuestions } from "@/services/preferenceService";

export function usePreferenceQuestions() {
  return useQuery({
    queryKey: ["preference", "questions"],
    queryFn: fetchPreferenceQuestions,
    staleTime: 5 * 60 * 1000,
  });
}
