import { Platform } from "react-native";

/**
 * Robust section scrolling for react-native-web.
 *
 * The page scrolls inside react-native-web's <ScrollView/> DOM node, not the
 * window. Rather than tracking that node (whose lifecycle races with route
 * transitions), we resolve the scroll container at scroll time by walking up
 * from the target element to the nearest scrollable ancestor. This is immune to
 * mount/unmount ordering and works identically for same-page and cross-page
 * navigation.
 */

const SCROLL_OFFSET = 24;
const RETRY_MS = 40;
const MAX_ATTEMPTS = 120; // ~4.8s of polling while a page mounts/lays out

// Layout can shift after we scroll (images/fonts loading). Re-assert the target
// position for a short window AFTER motion settles, so we never interrupt the
// in-flight smooth animation (which would make the scroll snap/jank).
const STABILIZE_INTERVAL_MS = 100;
const STABILIZE_MAX_TICKS = 18; // ~1.8s watching for late layout shifts
const STABILIZE_SETTLE_TICKS = 2; // ticks of no movement before we may correct
const STABILIZE_MOVE_EPSILON = 1; // px change that still counts as "animating"
const STABILIZE_TOLERANCE = 3;

const PENDING_KEY = "goCouncilPendingScroll";

export const ELECTION_SECTIONS = {
  candidates: "election-candidates",
  process: "election-process",
  preference: "election-preference",
} as const;

export type ElectionSectionId =
  (typeof ELECTION_SECTIONS)[keyof typeof ELECTION_SECTIONS];

const isWeb = Platform.OS === "web";

let pendingId: string | null = null;
let pollTimer: ReturnType<typeof setTimeout> | null = null;
let stabilizeTimer: ReturnType<typeof setInterval> | null = null;
let stabilizeCleanup: (() => void) | null = null;

export function isElectionRoute(pathname: string) {
  return pathname === "/election" || pathname.startsWith("/election/");
}

function isElectionSection(id: string) {
  return id.startsWith("election-");
}

// ─── Scroll container resolution ────────────────────────────────────────────

function isScrollable(el: HTMLElement): boolean {
  const { overflowY } = window.getComputedStyle(el);
  const canOverflow =
    overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  return canOverflow && el.scrollHeight > el.clientHeight + 1;
}

/** Nearest ancestor that actually scrolls; falls back to the scrolling root. */
function findScroller(el: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = el.parentElement;
  while (node && node !== document.body) {
    if (isScrollable(node)) return node;
    node = node.parentElement;
  }

  const root = (document.scrollingElement ||
    document.documentElement) as HTMLElement;
  if (root && root.scrollHeight > root.clientHeight + 1) return root;
  return null;
}

function targetTop(scroller: HTMLElement, el: HTMLElement): number {
  const raw =
    scroller.scrollTop +
    el.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top -
    SCROLL_OFFSET;
  const max = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  return Math.min(Math.max(0, raw), max);
}

function applyScroll(id: string, smooth: boolean): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const scroller = findScroller(el);
  if (!scroller) return false;

  const top = targetTop(scroller, el);
  try {
    scroller.scroll({ top, behavior: smooth ? "smooth" : "auto" });
  } catch {
    scroller.scrollTop = top;
  }
  return true;
}

// ─── Layout-shift stabilization ─────────────────────────────────────────────

function stopStabilize() {
  if (stabilizeTimer) {
    clearInterval(stabilizeTimer);
    stabilizeTimer = null;
  }
  if (stabilizeCleanup) {
    stabilizeCleanup();
    stabilizeCleanup = null;
  }
}

/**
 * After landing, keep the target pinned through late layout shifts WITHOUT
 * fighting the smooth animation. We watch scrollTop and only correct once
 * motion has settled (no change for a couple of ticks), which means the
 * smooth scroll has finished. If a later layout shift then moves the target,
 * we re-assert. Bails the instant the user scrolls, so we never fight them.
 */
function stabilize(id: string) {
  stopStabilize();
  if (typeof window === "undefined") return;

  let cancelled = false;
  const cancel = () => {
    cancelled = true;
    stopStabilize();
  };
  const opts = { passive: true } as AddEventListenerOptions;
  window.addEventListener("wheel", cancel, opts);
  window.addEventListener("touchmove", cancel, opts);
  window.addEventListener("keydown", cancel, opts);
  stabilizeCleanup = () => {
    window.removeEventListener("wheel", cancel, opts);
    window.removeEventListener("touchmove", cancel, opts);
    window.removeEventListener("keydown", cancel, opts);
  };

  let totalTicks = 0;
  let stableTicks = 0;
  let lastTop = Number.NaN;

  const tick = () => {
    if (cancelled) return;
    totalTicks += 1;
    if (totalTicks > STABILIZE_MAX_TICKS) {
      stopStabilize();
      return;
    }

    const el = document.getElementById(id);
    const scroller = el ? findScroller(el) : null;
    if (!el || !scroller) return;

    const cur = scroller.scrollTop;

    // Still moving (smooth animation in flight) — wait, never interrupt it.
    if (Number.isNaN(lastTop) || Math.abs(cur - lastTop) > STABILIZE_MOVE_EPSILON) {
      lastTop = cur;
      stableTicks = 0;
      return;
    }

    // Motion has settled; require a couple of stable ticks to be sure.
    stableTicks += 1;
    if (stableTicks < STABILIZE_SETTLE_TICKS) return;

    // Only correct if a layout shift has pushed the target out of place.
    const top = targetTop(scroller, el);
    if (Math.abs(cur - top) > STABILIZE_TOLERANCE) {
      scroller.scrollTop = top;
      lastTop = top;
      stableTicks = 0;
    }
  };

  stabilizeTimer = setInterval(tick, STABILIZE_INTERVAL_MS);
}

// ─── Pending-target lifecycle ───────────────────────────────────────────────

function clearPoll() {
  if (pollTimer) {
    clearTimeout(pollTimer);
    pollTimer = null;
  }
}

function clearPersisted() {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(PENDING_KEY);
  }
}

function persist(id: string) {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem(PENDING_KEY, id);
  }
}

function readPersisted(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(PENDING_KEY);
}

function succeed(id: string) {
  pendingId = null;
  clearPoll();
  clearPersisted();
  if (isElectionSection(id)) {
    try {
      window.history.replaceState(null, "", `/election#${id}`);
    } catch {
      // Hash is cosmetic; landing is what matters.
    }
  }
  stabilize(id);
}

function poll(id: string, smooth: boolean, attempt: number) {
  if (pendingId !== id) return; // superseded by a newer request
  if (applyScroll(id, smooth)) {
    succeed(id);
    return;
  }
  if (attempt >= MAX_ATTEMPTS) {
    pendingId = null;
    return;
  }
  pollTimer = setTimeout(() => poll(id, smooth, attempt + 1), RETRY_MS);
}

function start(id: string, smooth: boolean) {
  if (!isWeb || typeof document === "undefined") return;
  stopStabilize();
  clearPoll();
  pendingId = id;
  poll(id, smooth, 0);
}

// ─── Public API ─────────────────────────────────────────────────────────────

/** Same-page scroll to any section id (home sections, election quick links). */
export function requestScrollToSection(id: string) {
  if (!isWeb) return;
  if (isElectionSection(id)) persist(id);
  start(id, true);
}

/** Stash a target before navigating to /election from another route. */
export function stagePendingScroll(id: ElectionSectionId) {
  if (!isWeb) return;
  pendingId = id;
  persist(id);
}

function initialHashTarget(): string | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  return hash.startsWith("election-") ? hash : null;
}

/** Run on every page mount: pick up a target staged before navigation. */
export function resumePendingScroll() {
  if (!isWeb) return;
  const id = pendingId ?? readPersisted() ?? initialHashTarget();
  if (!id) return;
  // A fresh page load should land instantly rather than animate from the top.
  start(id, false);
}

/** Sync scrolling with the URL hash (#election-...). */
export function installHashScrollListener() {
  if (!isWeb || typeof window === "undefined") return () => {};

  const onHashChange = () => {
    const hash = window.location.hash.replace(/^#/, "");
    if (hash.startsWith("election-")) {
      requestScrollToSection(hash);
    }
  };

  window.addEventListener("hashchange", onHashChange);
  return () => window.removeEventListener("hashchange", onHashChange);
}
