export const ROUTES = {
  home: "/",

  election: "/election",

  candidates: "/election",
  electionProcess: "/election",
  preferenceMatching: "/election",

  candidateDetail: (id: string) => `/candidates/${id}`,
  preferenceResults: (sessionId: string) =>
    `/preference-matching/results/${sessionId}`,

  achievements: "/achievements",
  faq: "/faq",
  contact: "/contact",
  problems: "/problems",
  imprint: "/imprint",
  dataProtection: "/data-protection",
  accessibility: "/accessibility",
} as const;