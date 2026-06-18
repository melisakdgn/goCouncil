from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.election import Election
from app.schemas.election import ElectionOut

router = APIRouter()


@router.get("", response_model=ElectionOut)
def get_active_election(db: Session = Depends(get_db)) -> ElectionOut:
    election = db.scalars(
        select(Election)
        .options(selectinload(Election.steps))
        .where(Election.is_active.is_(True))
        .order_by(Election.start_date.desc())
    ).first()

    if not election:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active election found")

    return election  # type: ignore[return-value]
