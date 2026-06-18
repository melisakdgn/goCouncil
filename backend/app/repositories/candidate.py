import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.candidate import Candidate
from app.schemas.candidate import CandidateCreate, CandidateUpdate


def get_all(db: Session, *, active_only: bool = True) -> list[Candidate]:
    stmt = select(Candidate).options(selectinload(Candidate.team))
    if active_only:
        stmt = stmt.where(Candidate.is_active.is_(True))
    stmt = stmt.order_by(Candidate.sort_order, Candidate.name)
    return list(db.scalars(stmt).all())


def get_by_id(db: Session, candidate_id: uuid.UUID) -> Candidate | None:
    stmt = (
        select(Candidate)
        .options(selectinload(Candidate.team))
        .where(Candidate.id == candidate_id)
    )
    return db.scalars(stmt).first()


def create(db: Session, data: CandidateCreate) -> Candidate:
    candidate = Candidate(**data.model_dump())
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


def update(db: Session, candidate: Candidate, data: CandidateUpdate) -> Candidate:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(candidate, field, value)
    db.commit()
    db.refresh(candidate)
    return candidate


def delete(db: Session, candidate: Candidate) -> None:
    candidate.is_active = False
    db.commit()
