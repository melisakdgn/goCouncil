# Team Collaboration Guide — Go Council

## Team Division

### Developer 1 — Home page + Shared Layout
**Branch:** `feature/home-page`

Responsibilities:
- `app/index.tsx` — Home page composition
- `components/layout/AppLayout.tsx` — Root layout wrapper
- `components/layout/Header.tsx` — Navigation bar
- `components/layout/Footer.tsx` — Footer
- `components/layout/LanguageSwitcher.tsx`
- `components/ui/Button.tsx`, `Card.tsx`, `SectionTitle.tsx`
- `components/sections/` — HeroSection, CTASection
- `constants/theme.ts` — design system (owns this file, others must not edit)

### Developer 2 — Candidates page + Detail
**Branch:** `feature/candidates`

Responsibilities:
- `app/candidates/index.tsx` — Candidate list with search
- `app/candidates/[id].tsx` — Candidate detail page
- `components/cards/CandidateCard.tsx`
- `hooks/useCandidates.ts`
- `services/candidateService.ts`

### Developer 3 — Preference Matching flow
**Branch:** `feature/preference-matching`

Responsibilities:
- `app/preference-matching/index.tsx` — Step-by-step questionnaire
- `app/preference-matching/results/[sessionId].tsx` — Results page
- `store/preferenceStore.ts`
- `services/preferenceService.ts`
- `hooks/usePreference.ts`

### Developer 4 — Backend API + Database
**Branch:** `feature/backend-api`

Responsibilities:
- All files in `backend/`
- Docker setup
- Alembic migrations
- Seed data in `backend/app/seed/seed_db.py`
- Exposes the endpoints defined in `docs/api-contract.md`

### Developer 5 — FAQ, Contact, Achievements, Election Process
**Branch:** `feature/secondary-pages`

Responsibilities:
- `app/faq.tsx`
- `app/contact.tsx`
- `app/achievements.tsx`
- `app/election-process.tsx`
- `components/sections/FAQAccordion.tsx`
- `components/sections/ElectionTimeline.tsx`
- `components/cards/AchievementCard.tsx`
- `components/forms/ContactForm.tsx`

---

## Git Branch Naming

```
feature/<page-or-feature>   e.g. feature/candidate-detail
fix/<description>           e.g. fix/nav-mobile-overflow
chore/<description>         e.g. chore/setup-ci
docs/<description>          e.g. docs/api-contract
```

## Pull Request Rules

1. **PR to `main` only** — never commit directly to `main`
2. **1 reviewer required** before merge
3. PR title format: `[Feature] Candidate page with search` or `[Fix] Header overflow on mobile`
4. Include a short description of what changed and how to test it
5. All PRs must pass type-check (`npm run type-check`) before review

## Shared Component Rules

- Shared UI components live in `components/ui/` — only Developer 1 owns these
- If you need a new shared component, **open an issue / PR, don't add it directly**
- Use the design system (`constants/theme.ts`) — do not hardcode colors, font sizes, or spacing
- All user-facing strings must use `useTranslation()` and exist in both `locales/en.json` and `locales/de.json`

## API Contract Rules

- The API contract lives in `docs/api-contract.md` — Developer 4 owns this
- If a frontend developer needs a new field or endpoint, **open a PR to api-contract.md first**
- Frontend uses mock data (`constants/mockData.ts`) while backend is in development
- When the backend is ready, swap mock data by updating the hooks to use real services (services are already wired)

## Connecting Mock Data to Real API

Each page currently uses mock data from `constants/mockData.ts`. To switch to real API:

1. Open the corresponding hook (e.g., `hooks/useCandidates.ts`)
2. The `queryFn` already points to the real service (`fetchCandidates`)
3. Remove mock data from the page component and use the hook instead:

```tsx
// Before (mock)
const candidates = MOCK_CANDIDATES;

// After (real API)
const { data, isLoading, error } = useCandidates();
const candidates = data?.items ?? [];
```

---

## Design System

All design tokens are in `constants/theme.ts`. **Do not hardcode values.**

| Token | Value | Usage |
|-------|-------|-------|
| `colors.primaryNavy` | `#0D2E5C` | Primary brand, nav, headings |
| `colors.accentOrange` | `#E87722` | CTAs, highlights, active states |
| `colors.backgroundWhite` | `#FFFFFF` | Cards, panels |
| `colors.backgroundLight` | `#F7F8FC` | Page background |
| `colors.textPrimary` | `#0D2E5C` | Main text |
| `colors.textSecondary` | `#4A5568` | Body text |
| `colors.textMuted` | `#8A9AB0` | Labels, captions |
| `borderRadius.lg` | `14` | Standard card radius |
| `shadows.card` | — | Standard card shadow |

---

## Implementation Roadmap

### Phase 1 — Foundation (Week 1)
- [ ] Monorepo setup, Docker Compose, `.env` files
- [ ] Expo project bootstrapped, Expo Router routing working
- [ ] FastAPI skeleton with health endpoint
- [ ] PostgreSQL running in Docker

### Phase 2 — Static UI (Week 2)
- [ ] Design system finalized (`theme.ts`)
- [ ] Shared components: Button, Card, Header, Footer, SectionTitle
- [ ] All 7 pages built with mock data
- [ ] i18n working (EN/DE switch)

### Phase 3 — API Integration (Week 3)
- [ ] Backend models, migrations, seed data
- [ ] All REST endpoints implemented and tested
- [ ] Frontend hooks connected to real API
- [ ] CORS configured

### Phase 4 — Preference Matching (Week 4)
- [ ] Questionnaire flow polished
- [ ] Matching algorithm tested with real candidate profiles
- [ ] Results page with match reasons

### Phase 5 — Polish + Deploy (Week 5+)
- [ ] Admin endpoints (create/update candidates, FAQ, achievements)
- [ ] JWT authentication
- [ ] CI/CD pipeline
- [ ] Production deployment (Expo web + Railway/Render for backend)
