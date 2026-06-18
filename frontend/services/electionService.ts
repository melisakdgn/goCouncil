import type { Election } from "@/types";
import apiClient from "./apiClient";

export async function fetchElectionProcess(): Promise<Election> {
  const { data } = await apiClient.get<Election>("/election-process");
  return data;
}
