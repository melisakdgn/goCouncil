import type { Candidate, CandidateListResponse } from "@/types";
import apiClient from "./apiClient";

export async function fetchCandidates(): Promise<CandidateListResponse> {
  const { data } = await apiClient.get<CandidateListResponse>("/candidates");
  return data;
}

export async function fetchCandidate(id: string): Promise<Candidate> {
  const { data } = await apiClient.get<Candidate>(`/candidates/${id}`);
  return data;
}
