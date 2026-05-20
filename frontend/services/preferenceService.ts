import type { MatchResult, PreferenceQuestion, PreferenceSubmitPayload } from "@/types";
import apiClient from "./apiClient";

export async function fetchPreferenceQuestions(): Promise<PreferenceQuestion[]> {
  const { data } = await apiClient.get<PreferenceQuestion[]>("/preference/questions");
  return data;
}

export async function submitPreferenceAnswers(
  payload: PreferenceSubmitPayload
): Promise<MatchResult> {
  const { data } = await apiClient.post<MatchResult>("/preference/submit", payload);
  return data;
}

export async function fetchMatchResult(sessionId: string): Promise<MatchResult> {
  const { data } = await apiClient.get<MatchResult>(`/preference/results/${sessionId}`);
  return data;
}
