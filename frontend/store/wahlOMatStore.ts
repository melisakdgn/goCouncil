import { create } from "zustand";
import type { WahlOMatAnswer } from "@/constants/wahlOMatData";

interface WahlOMatState {
  answers: Record<string, WahlOMatAnswer>;
  currentStep: number;
  showResults: boolean;

  setAnswer: (questionId: string, value: WahlOMatAnswer) => void;
  nextStep: (totalQuestions: number) => void;
  prevStep: () => void;
  complete: () => void;
  reset: () => void;
}

export const useWahlOMatStore = create<WahlOMatState>((set) => ({
  answers: {},
  currentStep: 0,
  showResults: false,

  setAnswer: (questionId, value) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: value } })),

  nextStep: (totalQuestions) =>
    set((state) => {
      const isLast = state.currentStep >= totalQuestions - 1;
      if (isLast) {
        return { showResults: true };
      }
      return { currentStep: state.currentStep + 1 };
    }),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(0, state.currentStep - 1),
      showResults: false,
    })),

  complete: () => set({ showResults: true }),

  reset: () => set({ answers: {}, currentStep: 0, showResults: false }),
}));
