import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.repositories import problem as problem_repo
from app.schemas.problem import (
    CouncilResponseCreate,
    ProblemCommentCreate,
    ProblemCommentOut,
    ProblemListOut,
    ProblemPostCreate,
    ProblemPostOut,
    ProblemStatusUpdate,
)

router = APIRouter()


@router.get("", response_model=ProblemListOut)
def list_problems(db: Session = Depends(get_db)) -> ProblemListOut:
    items = problem_repo.get_all(db)
    return ProblemListOut(items=items, total=len(items))


@router.get("/{problem_id}", response_model=ProblemPostOut)
def get_problem(problem_id: uuid.UUID, db: Session = Depends(get_db)) -> ProblemPostOut:
    problem = problem_repo.get_by_id(db, problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return problem  # type: ignore[return-value]


@router.post("", response_model=ProblemPostOut, status_code=status.HTTP_201_CREATED)
def create_problem(data: ProblemPostCreate, db: Session = Depends(get_db)) -> ProblemPostOut:
    return problem_repo.create(db, data)  # type: ignore[return-value]


@router.post("/{problem_id}/like", response_model=ProblemPostOut)
def like_problem(problem_id: uuid.UUID, db: Session = Depends(get_db)) -> ProblemPostOut:
    problem = problem_repo.get_by_id(db, problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return problem_repo.like(db, problem)  # type: ignore[return-value]


@router.patch("/{problem_id}/status", response_model=ProblemPostOut)
def update_status(
    problem_id: uuid.UUID, data: ProblemStatusUpdate, db: Session = Depends(get_db)
) -> ProblemPostOut:
    problem = problem_repo.get_by_id(db, problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return problem_repo.update_status(db, problem, data)  # type: ignore[return-value]


@router.post("/{problem_id}/council-response", response_model=ProblemPostOut)
def add_council_response(
    problem_id: uuid.UUID, data: CouncilResponseCreate, db: Session = Depends(get_db)
) -> ProblemPostOut:
    problem = problem_repo.get_by_id(db, problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return problem_repo.add_council_response(db, problem, data)  # type: ignore[return-value]


@router.get("/{problem_id}/comments", response_model=list[ProblemCommentOut])
def list_comments(
    problem_id: uuid.UUID, db: Session = Depends(get_db)
) -> list[ProblemCommentOut]:
    problem = problem_repo.get_by_id(db, problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return problem_repo.get_comments(db, problem_id)  # type: ignore[return-value]


@router.post(
    "/{problem_id}/comments",
    response_model=ProblemCommentOut,
    status_code=status.HTTP_201_CREATED,
)
def add_comment(
    problem_id: uuid.UUID, data: ProblemCommentCreate, db: Session = Depends(get_db)
) -> ProblemCommentOut:
    problem = problem_repo.get_by_id(db, problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return problem_repo.add_comment(db, problem_id, data)  # type: ignore[return-value]
