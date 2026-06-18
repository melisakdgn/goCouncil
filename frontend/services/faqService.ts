import type { FAQItem } from "@/types";
import apiClient from "./apiClient";

export async function fetchFAQs(): Promise<FAQItem[]> {
  const { data } = await apiClient.get<FAQItem[]>("/faqs");
  return data;
}
