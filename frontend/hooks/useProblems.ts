import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addComment,
  addCouncilResponse,
  createProblem,
  fetchProblems,
  likeProblem,
} from "@/services/problemService";
import type { ProblemCommentCreate, ProblemPostCreate } from "@/types";

export function useProblems() {
  return useQuery({
    queryKey: ["problems"],
    queryFn: fetchProblems,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ProblemPostCreate) => createProblem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}

export function useLikeProblem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => likeProblem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ problemId, data }: { problemId: string; data: ProblemCommentCreate }) =>
      addComment(problemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}

export function useAddCouncilResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ problemId, response }: { problemId: string; response: string }) =>
      addCouncilResponse(problemId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
  });
}
