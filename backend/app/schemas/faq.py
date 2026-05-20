import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FAQItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    question: str
    question_de: str | None = None
    answer: str
    answer_de: str | None = None
    category: str | None = None
    sort_order: int
    created_at: datetime
