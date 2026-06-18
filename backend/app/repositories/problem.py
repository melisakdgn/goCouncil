import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.problem import ProblemComment, ProblemPost
from app.schemas.problem import (
    CouncilResponseCreate,
    ProblemCommentCreate,
    ProblemPostCreate,
    ProblemStatusUpdate,
)


def get_all(db: Session) -> list[ProblemPost]:
    stmt = (
        select(ProblemPost)
        .options(selectinload(ProblemPost.comments))
        .order_by(ProblemPost.created_at.desc())
    )
    return list(db.scalars(stmt).all())


def get_by_id(db: Session, problem_id: uuid.UUID) -> ProblemPost | None:
    stmt = (
        select(ProblemPost)
        .options(selectinload(ProblemPost.comments))
        .where(ProblemPost.id == problem_id)
    )
    return db.scalars(stmt).first()


def create(db: Session, data: ProblemPostCreate) -> ProblemPost:
    problem = ProblemPost(**data.model_dump())
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return problem


def like(db: Session, problem: ProblemPost) -> ProblemPost:
    problem.like_count += 1
    db.commit()
    db.refresh(problem)
    return problem


def update_status(db: Session, problem: ProblemPost, data: ProblemStatusUpdate) -> ProblemPost:
    problem.status = data.status
    db.commit()
    db.refresh(problem)
    return problem


def add_council_response(
    db: Session, problem: ProblemPost, data: CouncilResponseCreate
) -> ProblemPost:
    problem.council_response = data.response
    problem.council_response_created_at = datetime.now(timezone.utc)
    problem.status = "responded"
    db.commit()
    db.refresh(problem)
    return problem


def get_comments(db: Session, problem_id: uuid.UUID) -> list[ProblemComment]:
    stmt = (
        select(ProblemComment)
        .where(ProblemComment.problem_id == problem_id)
        .order_by(ProblemComment.created_at)
    )
    return list(db.scalars(stmt).all())


def add_comment(db: Session, problem_id: uuid.UUID, data: ProblemCommentCreate) -> ProblemComment:
    comment = ProblemComment(problem_id=problem_id, content=data.content)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment
