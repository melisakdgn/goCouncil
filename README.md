# Go Council / WorkVote

A full-stack web app helping employees understand works council elections, learn about candidates, follow the election process, see achievements, and find the best-matching candidates via a preference questionnaire.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React Native (Expo), Expo Router, TypeScript, Zustand, React Query |
| Backend | Python FastAPI, SQLAlchemy, Alembic, Pydantic |
| Database | PostgreSQL 16 |
| Container | Docker / Docker Compose |

## Getting Started

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose

### 1. Clone and set up environment
```bash
git clone <repo-url>
cd go-council
cp .env.example .env
```

### 2. Start the database and backend
```bash
docker compose up -d db
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
python -m app.seed.seed_db
uvicorn app.main:app --reload
```

### 3. Start the frontend
```bash
cd frontend
npm install
npx expo start --web
```

## Project Structure

```
go-council/
├── frontend/          # Expo React Native app
├── backend/           # FastAPI + PostgreSQL
├── docs/              # API contracts, team guides
├── docker-compose.yml
└── .env.example
```

## Pages

1. **Home** — hero, candidates preview, news, election timeline preview, achievements
2. **Candidates** — full candidate grid with search/filter
3. **Election Process** — step-by-step timeline
4. **Achievements** — statistics and accomplishments
5. **Preference Matching** — questionnaire → top-3 candidate results
6. **FAQ** — accordion Q&A
7. **Contact** — contact form

## Languages

The app supports English (`en`) and German (`de`). Add translations in `frontend/locales/`.

## Branch Naming

```
feature/<page-or-feature>   e.g. feature/candidate-detail
fix/<description>           e.g. fix/nav-mobile-overflow
chore/<description>         e.g. chore/setup-ci
```
