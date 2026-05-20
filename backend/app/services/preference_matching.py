import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.candidate import Candidate
from app.models.preference import CandidatePreferenceProfile, PreferenceQuestion, UserMatchResult
from app.schemas.preference import CandidateMatchOut, MatchResultOut, PreferenceSubmitIn


def compute_matches(db: Session, payload: PreferenceSubmitIn, session_id: str) -> MatchResultOut:
    user_answers: dict[str, str] = {
        str(a.question_id): a.selected_value for a in payload.answers
    }

    questions = db.scalars(select(PreferenceQuestion)).all()
    question_map = {str(q.id): q for q in questions}

    profiles = db.scalars(
        select(CandidatePreferenceProfile).options(
            selectinload(CandidatePreferenceProfile.candidate).selectinload(Candidate.team)
        )
    ).all()

    top_matches: list[CandidateMatchOut] = []

    for profile in profiles:
        candidate = profile.candidate
        if not candidate.is_active:
            continue

        matches = 0
        matching_topics: list[str] = []

        for q_id, user_val in user_answers.items():
            candidate_val = profile.answers.get(q_id)
            if candidate_val and candidate_val == user_val:
                matches += 1
                if q_id in question_map:
                    matching_topics.append(question_map[q_id].text)

        total = len(user_answers)
        score = matches / total if total else 0.0

        top_matches.append(
            CandidateMatchOut(
                candidate_id=candidate.id,
                candidate_name=candidate.name,
                candidate_photo_url=candidate.photo_url,
                candidate_role=candidate.role,
                team_name=candidate.team.name if candidate.team else None,
                score=round(score, 3),
                match_percentage=round(score * 100),
                matching_topics=matching_topics,
            )
        )

    top_matches.sort(key=lambda m: m.score, reverse=True)
    top_3 = top_matches[:3]

    result = UserMatchResult(
        session_id=session_id,
        user_answers=user_answers,
        top_matches=[m.model_dump() for m in top_3],
    )
    db.add(result)
    db.commit()

    return MatchResultOut(
        session_id=session_id,
        top_matches=top_3,
        total_questions=len(questions),
        answered_questions=len(user_answers),
    )


def get_result_by_session(db: Session, session_id: str) -> UserMatchResult | None:
    return db.scalars(
        select(UserMatchResult).where(UserMatchResult.session_id == session_id)
    ).first()
