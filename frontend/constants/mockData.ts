import type { Achievement, Candidate, Election, FAQItem, MatchResult, NewsUpdate, PreferenceQuestion } from "@/types";

export const MOCK_CANDIDATES: Candidate[] = [
  { id: "1", name: "Anna Müller", role: "HR Business Partner", team_id: "a", team: { id: "a", name: "Team A" }, bio: "Anna has 8 years of HR experience and advocates for fair representation.", bio_de: "Anna hat 8 Jahre HR-Erfahrung und setzt sich für faire Vertretung ein.", photo_url: undefined, is_independent: false, is_active: true, sort_order: 1, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "2", name: "Markus Becker", role: "Software Engineer", team_id: "a", team: { id: "a", name: "Team A" }, bio: "Markus champions remote-work policies and data-driven decision making.", bio_de: "Markus setzt sich für Remote-Arbeit und datengestützte Entscheidungen ein.", photo_url: undefined, is_independent: false, is_active: true, sort_order: 2, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "3", name: "Julia Schneider", role: "Project Manager", team_id: "b", team: { id: "b", name: "Team B" }, bio: "Julia leads cross-functional initiatives and believes in inclusive processes.", bio_de: "Julia leitet bereichsübergreifende Initiativen und glaubt an inklusive Prozesse.", photo_url: undefined, is_independent: false, is_active: true, sort_order: 3, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "4", name: "Thomas Lehmann", role: "Production Specialist", team_id: "b", team: { id: "b", name: "Team B" }, bio: "Thomas focuses on workplace safety and ergonomics on the production floor.", bio_de: "Thomas konzentriert sich auf Arbeitssicherheit und Ergonomie.", photo_url: undefined, is_independent: false, is_active: true, sort_order: 4, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "5", name: "Selina Yilmaz", role: "Quality Manager", team_id: "c", team: { id: "c", name: "Team C" }, bio: "Selina drives continuous improvement and has negotiated impactful quality agreements.", bio_de: "Selina treibt kontinuierliche Verbesserungen voran.", photo_url: undefined, is_independent: false, is_active: true, sort_order: 5, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { id: "6", name: "Peter König", role: "IT Architect", team_id: undefined, team: undefined, bio: "Peter runs independently, focusing on digital transformation and data privacy.", bio_de: "Peter kandidiert unabhängig mit Fokus auf digitale Transformation.", photo_url: undefined, is_independent: true, is_active: true, sort_order: 6, created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
];

export const MOCK_ELECTION: Election = {
  id: "e1",
  title: "Works Council Election 2024",
  title_de: "Betriebsratswahl 2024",
  start_date: "2024-06-10",
  end_date: "2024-06-21",
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
  steps: [
    { id: "s1", step_number: 1, title: "Announcement", title_de: "Bekanntmachung", description: "We inform you about the election.", description_de: "Wir informieren über die Wahl.", date_label: "April 2024", is_completed: true, is_current: false },
    { id: "s2", step_number: 2, title: "Nomination", title_de: "Nominierung", description: "Employees can nominate themselves or others.", description_de: "Mitarbeiter können sich selbst oder andere nominieren.", date_label: "May 2024", is_completed: true, is_current: false },
    { id: "s3", step_number: 3, title: "Candidate list", title_de: "Kandidatenliste", description: "The final list of candidates is published.", description_de: "Die endgültige Kandidatenliste wird veröffentlicht.", date_label: "End of May 2024", is_completed: true, is_current: false },
    { id: "s4", step_number: 4, title: "Election period", title_de: "Wahlzeitraum", description: "10. – 21. June 2024", description_de: "10.–21. Juni 2024", date_label: "10.–21. June 2024", is_completed: false, is_current: true },
    { id: "s5", step_number: 5, title: "Results", title_de: "Ergebnisse", description: "The result is determined and announced.", description_de: "Das Ergebnis wird ermittelt und bekanntgegeben.", date_label: "June 2024", is_completed: false, is_current: false },
  ],
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", stat_value: "28", label: "initiatives", label_de: "Initiativen", description: "improved working conditions", description_de: "verbesserte Arbeitsbedingungen", icon_name: "award", sort_order: 1, created_at: "2024-01-01T00:00:00Z" },
  { id: "a2", stat_value: "156", label: "programs", label_de: "Programme", description: "training & development", description_de: "Weiterbildung & Entwicklung", icon_name: "graduation-cap", sort_order: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: "a3", stat_value: "42", label: "agreements", label_de: "Vereinbarungen", description: "fair agreements achieved", description_de: "faire Vereinbarungen erreicht", icon_name: "handshake", sort_order: 3, created_at: "2024-01-01T00:00:00Z" },
  { id: "a4", stat_value: "€1.2M+", label: "value added", label_de: "Mehrwert", description: "employee benefits secured", description_de: "Mitarbeitervorteile gesichert", icon_name: "heart", sort_order: 4, created_at: "2024-01-01T00:00:00Z" },
];

export const MOCK_FAQS: FAQItem[] = [
  { id: "f1", question: "Who can vote?", question_de: "Wer darf wählen?", answer: "All employees employed for at least 6 months are eligible to vote.", answer_de: "Alle Mitarbeiter, die seit mindestens 6 Monaten beschäftigt sind.", category: "Voting", sort_order: 1 },
  { id: "f2", question: "How is my vote kept secret?", question_de: "Wie wird meine Stimme geheim gehalten?", answer: "Votes are cast anonymously. No one can trace your vote back to you.", answer_de: "Die Wahl erfolgt anonym. Niemand kann Ihre Stimme auf Sie zurückführen.", category: "Privacy", sort_order: 2 },
  { id: "f3", question: "When does the election take place?", question_de: "Wann findet die Wahl statt?", answer: "The election takes place from 10 to 21 June 2024.", answer_de: "Die Wahl findet vom 10. bis 21. Juni 2024 statt.", category: "Process", sort_order: 3 },
  { id: "f4", question: "What does the works council do?", question_de: "Was macht der Betriebsrat?", answer: "The works council represents employee interests, negotiates working conditions, and ensures legal compliance.", answer_de: "Der Betriebsrat vertritt die Interessen der Mitarbeiter und verhandelt Arbeitsbedingungen.", category: "General", sort_order: 4 },
  { id: "f5", question: "Can I run as a candidate?", question_de: "Kann ich kandidieren?", answer: "Yes! Any employee with 6+ months at the company can nominate themselves.", answer_de: "Ja! Jeder Mitarbeiter mit mindestens 6 Monaten Betriebszugehörigkeit kann sich nominieren.", category: "Candidates", sort_order: 5 },
];

export const MOCK_NEWS: NewsUpdate[] = [
  { id: "n1", date: "2024-05-15", title: "Information event about the works council election", title_de: "Informationsveranstaltung zur Betriebsratswahl", summary: "Registration is open for our online information event.", summary_de: "Die Anmeldung für unsere Online-Informationsveranstaltung ist offen." },
  { id: "n2", date: "2024-05-02", title: "Why your voice matters", title_de: "Warum Ihre Stimme wichtig ist", summary: "The works council shapes many decisions that affect your daily work.", summary_de: "Der Betriebsrat gestaltet viele Entscheidungen, die Ihren Arbeitsalltag beeinflussen." },
  { id: "n3", date: "2024-04-25", title: "Election period announced", title_de: "Wahlzeitraum bekanntgegeben", summary: "The works council election will take place from 10.–21. June 2024.", summary_de: "Die Betriebsratswahl findet vom 10.–21. Juni 2024 statt." },
];

function scaleOptions(qId: string): PreferenceQuestion["options"] {
  return [
    { id: `${qId}_sa`, text: "Strongly agree", text_de: "Stimme voll zu", value: "strongly_agree", sort_order: 1 },
    { id: `${qId}_a`, text: "Agree", text_de: "Stimme zu", value: "agree", sort_order: 2 },
    { id: `${qId}_n`, text: "Neutral", text_de: "Neutral", value: "neutral", sort_order: 3 },
    { id: `${qId}_d`, text: "Disagree", text_de: "Stimme nicht zu", value: "disagree", sort_order: 4 },
    { id: `${qId}_sd`, text: "Strongly disagree", text_de: "Stimme gar nicht zu", value: "strongly_disagree", sort_order: 5 },
  ];
}

export const MOCK_PREFERENCE_QUESTIONS: PreferenceQuestion[] = [
  { id: "q1",  text: "The works council should prioritize flexible working hour models.", text_de: "Der Betriebsrat sollte flexible Arbeitszeitmodelle priorisieren.", category: "flexible_hours", sort_order: 1, options: scaleOptions("q1") },
  { id: "q2",  text: "Remote and hybrid work options should be expanded across more roles.", text_de: "Remote- und Hybrid-Arbeitsoptionen sollten für mehr Rollen ausgeweitet werden.", category: "remote_work", sort_order: 2, options: scaleOptions("q2") },
  { id: "q3",  text: "The works council should push for greater salary transparency.", text_de: "Der Betriebsrat sollte sich für mehr Gehaltstransparenz einsetzen.", category: "salary_transparency", sort_order: 3, options: scaleOptions("q3") },
  { id: "q4",  text: "Improving workplace safety standards should be a top priority.", text_de: "Die Verbesserung von Arbeitssicherheitsstandards sollte eine Top-Priorität sein.", category: "workplace_safety", sort_order: 4, options: scaleOptions("q4") },
  { id: "q5",  text: "The works council should actively promote diversity and inclusion.", text_de: "Der Betriebsrat sollte Diversität und Inklusion aktiv fördern.", category: "diversity_inclusion", sort_order: 5, options: scaleOptions("q5") },
  { id: "q6",  text: "The works council should push for better mental health support for employees.", text_de: "Der Betriebsrat sollte sich für bessere Unterstützung der psychischen Gesundheit einsetzen.", category: "mental_health", sort_order: 6, options: scaleOptions("q6") },
  { id: "q7",  text: "More investment in employee training and career development is needed.", text_de: "Mehr Investitionen in Mitarbeiterweiterbildung und Karriereentwicklung sind nötig.", category: "training", sort_order: 7, options: scaleOptions("q7") },
  { id: "q8",  text: "Better communication between employees and management is a key priority.", text_de: "Bessere Kommunikation zwischen Mitarbeitern und Management hat hohe Priorität.", category: "communication", sort_order: 8, options: scaleOptions("q8") },
  { id: "q9",  text: "Fair treatment and equal opportunities for all employees should be a core focus.", text_de: "Faire Behandlung und gleiche Chancen für alle Mitarbeiter sollte ein Kernthema sein.", category: "fair_treatment", sort_order: 9, options: scaleOptions("q9") },
  { id: "q10", text: "Digitalization of workplace processes is important and should be accelerated.", text_de: "Die Digitalisierung von Arbeitsprozessen ist wichtig und sollte beschleunigt werden.", category: "digitalization", sort_order: 10, options: scaleOptions("q10") },
  { id: "q11", text: "The works council should provide stronger support for young employees and trainees.", text_de: "Der Betriebsrat sollte junge Mitarbeiter und Auszubildende stärker unterstützen.", category: "young_employees", sort_order: 11, options: scaleOptions("q11") },
  { id: "q12", text: "Improving work-life balance should be central to the works council's agenda.", text_de: "Die Verbesserung der Work-Life-Balance sollte zentral auf der Agenda stehen.", category: "work_life_balance", sort_order: 12, options: scaleOptions("q12") },
];

const ANSWER_SCORES: Record<string, number> = {
  strongly_agree: 2, agree: 1, neutral: 0, disagree: -1, strongly_disagree: -2,
};

const CATEGORY_LABELS: Record<string, string> = {
  flexible_hours: "Flexible working hours",
  remote_work: "Remote work",
  salary_transparency: "Salary transparency",
  workplace_safety: "Workplace safety",
  diversity_inclusion: "Diversity & inclusion",
  mental_health: "Mental health support",
  training: "Training opportunities",
  communication: "Communication with management",
  fair_treatment: "Fair treatment",
  digitalization: "Digitalization",
  young_employees: "Support for young employees",
  work_life_balance: "Work-life balance",
};

const CANDIDATE_PRIORITIES: Record<string, string[]> = {
  "1": ["fair_treatment", "communication", "mental_health"],
  "2": ["remote_work", "digitalization", "training"],
  "3": ["diversity_inclusion", "communication", "young_employees"],
  "4": ["workplace_safety", "fair_treatment", "flexible_hours"],
  "5": ["training", "salary_transparency", "digitalization"],
  "6": ["digitalization", "remote_work", "salary_transparency"],
};

export function computeLocalMatchResult(
  answers: Record<string, string>,
  questions: PreferenceQuestion[],
): MatchResult {
  const categoryScores: Record<string, number> = {};
  for (const q of questions) {
    const ans = answers[q.id];
    if (!ans || ans === "skip" || !q.category) continue;
    categoryScores[q.category] = (categoryScores[q.category] ?? 0) + (ANSWER_SCORES[ans] ?? 0);
  }

  const positiveTopics = Object.entries(categoryScores)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([k]) => k);

  const matches = MOCK_CANDIDATES.map((c) => {
    const priorities = CANDIDATE_PRIORITIES[c.id] ?? [];
    const matching = positiveTopics.filter((t) => priorities.includes(t));
    const base = priorities.length > 0 ? Math.round((matching.length / priorities.length) * 100) : 50;
    const pct = Math.max(20, Math.min(97, base));
    return {
      candidate_id: c.id,
      candidate_name: c.name,
      candidate_role: c.role,
      team_name: c.team?.name,
      score: matching.length,
      match_percentage: pct,
      matching_topics: matching.map((t) => CATEGORY_LABELS[t] ?? t),
    };
  });

  matches.sort((a, b) => b.match_percentage - a.match_percentage);

  return {
    session_id: `local-${Date.now()}`,
    top_matches: matches.slice(0, 3),
    total_questions: questions.length,
    answered_questions: Object.values(answers).filter((v) => v && v !== "skip").length,
  };
}
