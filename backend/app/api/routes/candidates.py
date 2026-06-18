import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import repositories
from app.database import get_db
from app.repositories import candidate as candidate_repo
from app.schemas.candidate import CandidateCreate, CandidateListOut, CandidateOut, CandidateUpdate

router = APIRouter()


@router.get("", response_model=CandidateListOut)
def list_candidates(db: Session = Depends(get_db)) -> CandidateListOut:
    items = candidate_repo.get_all(db)
    return CandidateListOut(items=items, total=len(items))


@router.get("/{candidate_id}", response_model=CandidateOut)
def get_candidate(candidate_id: uuid.UUID, db: Session = Depends(get_db)) -> CandidateOut:
    candidate = candidate_repo.get_by_id(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return candidate  # type: ignore[return-value]


@router.post("", response_model=CandidateOut, status_code=status.HTTP_201_CREATED)
def create_candidate(data: CandidateCreate, db: Session = Depends(get_db)) -> CandidateOut:
    return candidate_repo.create(db, data)  # type: ignore[return-value]


@router.put("/{candidate_id}", response_model=CandidateOut)
def update_candidate(
    candidate_id: uuid.UUID, data: CandidateUpdate, db: Session = Depends(get_db)
) -> CandidateOut:
    candidate = candidate_repo.get_by_id(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return candidate_repo.update(db, candidate, data)  # type: ignore[return-value]


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(candidate_id: uuid.UUID, db: Session = Depends(get_db)) -> None:
    candidate = candidate_repo.get_by_id(db, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    candidate_repo.delete(db, candidate)
