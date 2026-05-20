import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_db
from app.models.preference import PreferenceQuestion, UserMatchResult
from app.schemas.preference import MatchResultOut, PreferenceQuestionOut, PreferenceSubmitIn
from app.services.preference_matching import compute_matches, get_result_by_session

router = APIRouter()


@router.get("/questions", response_model=list[PreferenceQuestionOut])
def list_questions(db: Session = Depends(get_db)) -> list[PreferenceQuestion]:
    return list(
        db.scalars(
            select(PreferenceQuestion)
            .options(selectinload(PreferenceQuestion.options))
            .order_by(PreferenceQuestion.sort_order)
        ).all()
    )


@router.post("/submit", response_model=MatchResultOut, status_code=status.HTTP_201_CREATED)
def submit_answers(data: PreferenceSubmitIn, db: Session = Depends(get_db)) -> MatchResultOut:
    session_id = str(uuid.uuid4())
    return compute_matches(db, data, session_id)


@router.get("/results/{session_id}", response_model=MatchResultOut)
def get_results(session_id: str, db: Session = Depends(get_db)) -> MatchResultOut:
    result = get_result_by_session(db, session_id)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")

    from app.schemas.preference import CandidateMatchOut
    return MatchResultOut(
        session_id=result.session_id,
        top_matches=[CandidateMatchOut(**m) for m in result.top_matches],
        total_questions=0,
        answered_questions=len(result.user_answers),
    )
