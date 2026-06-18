import uuid
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class ElectionStepOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    step_number: int
    title: str
    title_de: str | None = None
    description: str | None = None
    description_de: str | None = None
    date_label: str | None = None
    is_completed: bool
    is_current: bool


class ElectionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    title_de: str | None = None
    start_date: date
    end_date: date
    is_active: bool
    steps: list[ElectionStepOut]
    created_at: datetime
