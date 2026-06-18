import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AchievementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    stat_value: str
    label: str
    label_de: str | None = None
    description: str | None = None
    description_de: str | None = None
    icon_name: str | None = None
    sort_order: int
    created_at: datetime
