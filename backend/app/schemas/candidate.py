import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TeamOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    description: str | None = None


class CandidateBase(BaseModel):
    name: str
    role: str
    bio: str | None = None
    bio_de: str | None = None
    photo_url: str | None = None
    is_independent: bool = False
    sort_order: int = 0


class CandidateCreate(CandidateBase):
    team_id: uuid.UUID | None = None


class CandidateUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    bio: str | None = None
    bio_de: str | None = None
    photo_url: str | None = None
    is_independent: bool | None = None
    team_id: uuid.UUID | None = None
    sort_order: int | None = None


class CandidateOut(CandidateBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    team_id: uuid.UUID | None = None
    team: TeamOut | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime


class CandidateListOut(BaseModel):
    items: list[CandidateOut]
    total: int
