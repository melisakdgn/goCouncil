import { useCallback } from "react";
import { requestScrollToSection } from "@/utils/scroll";

export function useScrollToSection() {
  return useCallback((sectionId: string) => {
    requestScrollToSection(sectionId);
  }, []);
}
