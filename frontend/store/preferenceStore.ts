import { create } from "zustand";
import type { MatchResult, PreferenceQuestion, UserAnswerIn } from "@/types";

interface PreferenceState {
  questions: PreferenceQuestion[];
  answers: Record<string, string>; // question_id → selected_value
  currentStep: number;
  result: MatchResult | null;
  sessionId: string | null;

  setQuestions: (questions: PreferenceQuestion[]) => void;
  setAnswer: (questionId: string, value: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  clampStep: (totalQuestions: number) => void;
  setResult: (result: MatchResult) => void;
  reset: () => void;

  getAnswerPayload: () => UserAnswerIn[];
}

export const usePreferenceStore = create<PreferenceState>((set, get) => ({
  questions: [],
  answers: {},
  currentStep: 0,
  result: null,
  sessionId: null,

  setQuestions: (questions) => set({ questions }),
  setAnswer: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),
  nextStep: () =>
    set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  clampStep: (totalQuestions) =>
    set((state) => ({
      currentStep:
        totalQuestions > 0
          ? Math.min(state.currentStep, totalQuestions - 1)
          : 0,
    })),
  setResult: (result) => set({ result, sessionId: result.session_id }),
  reset: () =>
    set({ answers: {}, currentStep: 0, result: null, sessionId: null }),

  getAnswerPayload: () =>
    Object.entries(get().answers).map(([question_id, selected_value]) => ({
      question_id,
      selected_value,
    })),
}));
