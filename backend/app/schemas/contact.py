import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str | None = None
    message: str


class ContactMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: str
    subject: str | None = None
    message: str
    created_at: datetime
