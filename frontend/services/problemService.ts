import type {
  ProblemCommentCreate,
  ProblemListResponse,
  ProblemPost,
  ProblemPostCreate,
  ProblemComment,
} from "@/types";
import apiClient from "./apiClient";

const LOCAL_PROBLEMS_KEY = "localProblems";
const LOCAL_COMMENTS_KEY = "localProblemComments";

function getLocalProblems(): ProblemPost[] {
  if (typeof localStorage === "undefined") return [];

  const saved = localStorage.getItem(LOCAL_PROBLEMS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveLocalProblems(problems: ProblemPost[]) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(LOCAL_PROBLEMS_KEY, JSON.stringify(problems));
}

function getLocalComments(problemId: string): ProblemComment[] {
  if (typeof localStorage === "undefined") return [];

  const saved = localStorage.getItem(LOCAL_COMMENTS_KEY);
  const allComments: Record<string, ProblemComment[]> = saved ? JSON.parse(saved) : {};

  return allComments[problemId] ?? [];
}

function saveLocalComment(problemId: string, comment: ProblemComment) {
  if (typeof localStorage === "undefined") return;

  const saved = localStorage.getItem(LOCAL_COMMENTS_KEY);
  const allComments: Record<string, ProblemComment[]> = saved ? JSON.parse(saved) : {};

  const existing = allComments[problemId] ?? [];
  allComments[problemId] = [...existing, comment];

  localStorage.setItem(LOCAL_COMMENTS_KEY, JSON.stringify(allComments));
}

export async function fetchProblems(): Promise<ProblemListResponse> {
  try {
    const { data } = await apiClient.get<ProblemListResponse>("/problems");
    const localProblems = getLocalProblems();

    return {
      items: [...localProblems, ...data.items],
      total: localProblems.length + data.items.length,
    };
  } catch (error) {
    console.warn("Backend unavailable, using local problems:", error);

    const localProblems = getLocalProblems();

    return {
      items: localProblems,
      total: localProblems.length,
    };
  }
}

export async function fetchProblem(id: string): Promise<ProblemPost> {
  try {
    const { data } = await apiClient.get<ProblemPost>(`/problems/${id}`);
    return data;
  } catch {
    const localProblem = getLocalProblems().find((problem) => problem.id === id);

    if (!localProblem) {
      throw new Error("Problem not found");
    }

    return {
      ...localProblem,
      comments: getLocalComments(id),
    };
  }
}

export async function createProblem(
  payload: ProblemPostCreate
): Promise<ProblemPost> {
  try {
    const { data } = await apiClient.post<ProblemPost>("/problems", payload);
    return data;
  } catch (error) {
    console.warn("Backend unavailable, saving locally:", error);

    const newProblem: ProblemPost = {
      id: `local-${Date.now()}`,
      title: payload.title,
      content: payload.content,
      category: payload.category,
      urgency: payload.urgency,
      status: "new",
      like_count: 0,
      council_response: undefined,
      council_response_created_at: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      comments: [],
    };

    const existingProblems = getLocalProblems();
    saveLocalProblems([newProblem, ...existingProblems]);

    return newProblem;
  }
}

export async function likeProblem(id: string): Promise<ProblemPost> {
  try {
    const { data } = await apiClient.post<ProblemPost>(`/problems/${id}/like`);
    return data;
  } catch {
    const localProblems = getLocalProblems();

    const updatedProblems = localProblems.map((problem) =>
      problem.id === id
        ? {
          ...problem,
          like_count: problem.like_count + 1,
          updated_at: new Date().toISOString(),
        }
        : problem
    );

    saveLocalProblems(updatedProblems);

    const updatedProblem = updatedProblems.find((problem) => problem.id === id);

    if (!updatedProblem) {
      throw new Error("Problem not found");
    }

    return updatedProblem;
  }
}

export async function addCouncilResponse(
  id: string,
  response: string
): Promise<ProblemPost> {
  try {
    const { data } = await apiClient.post<ProblemPost>(
      `/problems/${id}/council-response`,
      { response }
    );
    return data;
  } catch {
    const localProblems = getLocalProblems();

    const updatedProblems = localProblems.map((problem) =>
      problem.id === id
        ? {
          ...problem,
          status: "responded" as const,
          council_response: response,
          council_response_created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        : problem
    );

    saveLocalProblems(updatedProblems);

    const updatedProblem = updatedProblems.find((problem) => problem.id === id);

    if (!updatedProblem) {
      throw new Error("Problem not found");
    }

    return updatedProblem;
  }
}

export async function fetchComments(problemId: string): Promise<ProblemComment[]> {
  try {
    const { data } = await apiClient.get<ProblemComment[]>(
      `/problems/${problemId}/comments`
    );
    return data;
  } catch {
    return getLocalComments(problemId);
  }
}

export async function addComment(
  problemId: string,
  payload: ProblemCommentCreate
): Promise<ProblemComment> {
  try {
    const { data } = await apiClient.post<ProblemComment>(
      `/problems/${problemId}/comments`,
      payload
    );
    return data;
  } catch {
    const newComment: ProblemComment = {
      id: `comment-${Date.now()}`,
      problem_id: problemId,
      content: payload.content,
      created_at: new Date().toISOString(),
    };

    saveLocalComment(problemId, newComment);

    const localProblems = getLocalProblems();
    const updatedProblems = localProblems.map((problem) =>
      problem.id === problemId
        ? {
          ...problem,
          comments: [...problem.comments, newComment],
          updated_at: new Date().toISOString(),
        }
        : problem
    );

    saveLocalProblems(updatedProblems);

    return newComment;
  }
}