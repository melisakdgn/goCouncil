import { useQuery } from "@tanstack/react-query";
import { fetchElectionProcess } from "@/services/electionService";

export function useElection() {
  return useQuery({
    queryKey: ["election-process"],
    queryFn: fetchElectionProcess,
    staleTime: 10 * 60 * 1000,
  });
}
