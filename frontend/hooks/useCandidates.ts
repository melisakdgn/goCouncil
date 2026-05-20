import { useQuery } from "@tanstack/react-query";
import { fetchCandidate, fetchCandidates } from "@/services/candidateService";

export function useCandidates() {
  return useQuery({
    queryKey: ["candidates"],
    queryFn: fetchCandidates,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCandidate(id: string) {
  return useQuery({
    queryKey: ["candidates", id],
    queryFn: () => fetchCandidate(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
}
