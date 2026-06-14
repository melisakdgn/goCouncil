export type WahlOMatAnswer = "agree" | "neutral" | "disagree";

export interface WahlOMatQuestion {
  id: string;
  text: string;
  text_de: string;
  /** Positions by candidate sort_order index (0-based, aligned with sorted API list) */
  candidatePositions: WahlOMatAnswer[];
}

export const WAHL_O_MAT_QUESTIONS: WahlOMatQuestion[] = [
  {
    id: "wom1",
    text: "Remote work should be expanded to at least three days per week for eligible roles.",
    text_de: "Homeoffice sollte für geeignete Tätigkeiten auf mindestens drei Tage pro Woche ausgeweitet werden.",
    candidatePositions: ["agree", "agree", "neutral", "disagree", "neutral", "agree"],
  },
  {
    id: "wom2",
    text: "The works council should prioritize salary and benefits in the next negotiation period.",
    text_de: "Der Betriebsrat sollte Gehalt und Leistungen in der nächsten Verhandlungsrunde priorisieren.",
    candidatePositions: ["agree", "neutral", "agree", "agree", "disagree", "neutral"],
  },
  {
    id: "wom3",
    text: "Workplace safety standards on the production floor should be reviewed at least once a year.",
    text_de: "Arbeitsschutzstandards in der Produktion sollten mindestens einmal jährlich überprüft werden.",
    candidatePositions: ["neutral", "disagree", "neutral", "agree", "agree", "agree"],
  },
];

/** Wahl-O-Mat style scoring: exact match = 2 pts, one neutral = 1 pt, opposite = 0 pts */
export function scoreAnswer(user: WahlOMatAnswer, candidate: WahlOMatAnswer): number {
  if (user === candidate) return 2;
  if (user === "neutral" || candidate === "neutral") return 1;
  return 0;
}

export function computeMatchPercentage(
  answers: Record<string, WahlOMatAnswer>,
  questions: WahlOMatQuestion[],
  candidateIndex: number,
): number {
  if (questions.length === 0) return 0;

  const maxPoints = questions.length * 2;
  let points = 0;

  for (const question of questions) {
    const userAnswer = answers[question.id];
    const candidateAnswer = question.candidatePositions[candidateIndex];
    if (!userAnswer || !candidateAnswer) continue;
    points += scoreAnswer(userAnswer, candidateAnswer);
  }

  return Math.round((points / maxPoints) * 100);
}
