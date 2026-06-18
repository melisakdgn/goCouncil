import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ProblemCommentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    problem_id: uuid.UUID
    content: str
    created_at: datetime


class ProblemCommentCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)


class ProblemPostCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    content: str = Field(..., min_length=1, max_length=5000)
    category: str = Field(..., min_length=1, max_length=100)
    urgency: str = Field("medium", pattern="^(low|medium|high)$")


class ProblemPostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    content: str
    category: str
    urgency: str
    status: str
    like_count: int
    council_response: Optional[str] = None
    council_response_created_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    comments: list[ProblemCommentOut] = []


class ProblemListOut(BaseModel):
    items: list[ProblemPostOut]
    total: int


class ProblemStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|under_review|responded|resolved)$")


class CouncilResponseCreate(BaseModel):
    response: str = Field(..., min_length=1, max_length=5000)
