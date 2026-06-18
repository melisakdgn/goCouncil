from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.achievement import Achievement
from app.schemas.achievement import AchievementOut

router = APIRouter()


@router.get("", response_model=list[AchievementOut])
def list_achievements(db: Session = Depends(get_db)) -> list[Achievement]:
    return list(
        db.scalars(select(Achievement).order_by(Achievement.sort_order)).all()
    )
