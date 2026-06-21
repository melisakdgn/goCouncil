import { useEffect } from "react";
import { Platform } from "react-native";
import {
  installHashScrollListener,
  resumePendingScroll,
} from "@/utils/scroll";

/** Keeps election section scrolling in sync with pending targets and URL hash. */
export function useElectionHashScroll() {
  useEffect(() => {
    if (Platform.OS !== "web") return;

    resumePendingScroll();
    return installHashScrollListener();
  }, []);
}
