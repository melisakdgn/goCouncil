import { useQuery } from "@tanstack/react-query";
import { fetchFAQs } from "@/services/faqService";

export function useFAQ() {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: fetchFAQs,
    staleTime: 10 * 60 * 1000,
  });
}
