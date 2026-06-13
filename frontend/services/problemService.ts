import type {
  ProblemCommentCreate,
  ProblemListResponse,
  ProblemPost,
  ProblemPostCreate,
  ProblemComment,
} from "@/types";
import apiClient from "./apiClient";

export async function fetchProblems(): Promise<ProblemListResponse> {
  const { data } = await apiClient.get<ProblemListResponse>("/problems");
  return data;
}

export async function fetchProblem(id: string): Promise<ProblemPost> {
  const { data } = await apiClient.get<ProblemPost>(`/problems/${id}`);
  return data;
}

export async function createProblem(payload: ProblemPostCreate): Promise<ProblemPost> {
  const { data } = await apiClient.post<ProblemPost>("/problems", payload);
  return data;
}

export async function likeProblem(id: string): Promise<ProblemPost> {
  const { data } = await apiClient.post<ProblemPost>(`/problems/${id}/like`);
  return data;
}

export async function addCouncilResponse(id: string, response: string): Promise<ProblemPost> {
  const { data } = await apiClient.post<ProblemPost>(`/problems/${id}/council-response`, {
    response,
  });
  return data;
}

export async function fetchComments(problemId: string): Promise<ProblemComment[]> {
  const { data } = await apiClient.get<ProblemComment[]>(`/problems/${problemId}/comments`);
  return data;
}

export async function addComment(
  problemId: string,
  payload: ProblemCommentCreate
): Promise<ProblemComment> {
  const { data } = await apiClient.post<ProblemComment>(
    `/problems/${problemId}/comments`,
    payload
  );
  return data;
}
