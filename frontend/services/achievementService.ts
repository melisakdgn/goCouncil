import type { Achievement } from "@/types";
import apiClient from "./apiClient";

export async function fetchAchievements(): Promise<Achievement[]> {
  const { data } = await apiClient.get<Achievement[]>("/achievements");
  return data;
}
