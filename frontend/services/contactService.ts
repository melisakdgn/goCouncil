import type { ContactMessageCreate } from "@/types";
import apiClient from "./apiClient";

export async function submitContactMessage(data: ContactMessageCreate): Promise<void> {
  await apiClient.post("/contact", data);
}
