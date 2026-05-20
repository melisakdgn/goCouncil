import type { Achievement, Candidate, Election, FAQItem, NewsUpdate, PreferenceQuestion } from "@/types";

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

export const MOCK_PREFERENCE_QUESTIONS: PreferenceQuestion[] = [
  {
    id: "q1",
    text: "What topic matters most to you?",
    text_de: "Welches Thema ist Ihnen am wichtigsten?",
    category: "priorities",
    sort_order: 1,
    options: [
      { id: "o1", text: "Remote & Flexibility", text_de: "Remote & Flexibilität", value: "remote", sort_order: 1 },
      { id: "o2", text: "Salary & Benefits", text_de: "Gehalt & Leistungen", value: "salary", sort_order: 2 },
      { id: "o3", text: "Workplace Safety", text_de: "Arbeitssicherheit", value: "safety", sort_order: 3 },
      { id: "o4", text: "Career Development", text_de: "Karriereentwicklung", value: "career", sort_order: 4 },
    ],
  },
  {
    id: "q2",
    text: "How do you prefer the council to communicate?",
    text_de: "Wie soll der Betriebsrat kommunizieren?",
    category: "communication",
    sort_order: 2,
    options: [
      { id: "o5", text: "Regular town halls", text_de: "Regelmäßige Versammlungen", value: "townhall", sort_order: 1 },
      { id: "o6", text: "Monthly newsletter", text_de: "Monatlicher Newsletter", value: "newsletter", sort_order: 2 },
      { id: "o7", text: "Digital chat/intranet", text_de: "Digitaler Chat/Intranet", value: "digital", sort_order: 3 },
    ],
  },
  {
    id: "q3",
    text: "Which working model do you prefer?",
    text_de: "Welches Arbeitsmodell bevorzugen Sie?",
    category: "workmodel",
    sort_order: 3,
    options: [
      { id: "o8", text: "Full remote", text_de: "Vollständig remote", value: "full_remote", sort_order: 1 },
      { id: "o9", text: "Hybrid (2–3 days office)", text_de: "Hybrid (2–3 Tage Büro)", value: "hybrid", sort_order: 2 },
      { id: "o10", text: "Mostly on-site", text_de: "Überwiegend vor Ort", value: "onsite", sort_order: 3 },
    ],
  },
];
