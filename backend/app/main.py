from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.routes import candidates, election_process, achievements, faq, contact, preference

app = FastAPI(
    title="Go Council API",
    description="Backend API for the Go Council works-council election platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router, prefix="/api/candidates", tags=["Candidates"])
app.include_router(election_process.router, prefix="/api/election-process", tags=["Election Process"])
app.include_router(achievements.router, prefix="/api/achievements", tags=["Achievements"])
app.include_router(faq.router, prefix="/api/faqs", tags=["FAQ"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(preference.router, prefix="/api/preference", tags=["Preference Matching"])


@app.get("/health", tags=["Health"])
def health_check() -> dict:
    return {"status": "ok", "version": "1.0.0"}
