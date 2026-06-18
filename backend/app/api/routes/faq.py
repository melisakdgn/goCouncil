from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.faq import FAQItem
from app.schemas.faq import FAQItemOut

router = APIRouter()


@router.get("", response_model=list[FAQItemOut])
def list_faqs(db: Session = Depends(get_db)) -> list[FAQItem]:
    return list(
        db.scalars(select(FAQItem).order_by(FAQItem.sort_order)).all()
    )
