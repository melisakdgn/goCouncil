import uuid

from pydantic import BaseModel, ConfigDict


class AnswerOptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    text: str
    text_de: str | None = None
    value: str
    sort_order: int


class PreferenceQuestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    text: str
    text_de: str | None = None
    category: str | None = None
    sort_order: int
    options: list[AnswerOptionOut]


class UserAnswerIn(BaseModel):
    question_id: uuid.UUID
    selected_value: str


class PreferenceSubmitIn(BaseModel):
    answers: list[UserAnswerIn]


class CandidateMatchOut(BaseModel):
    candidate_id: uuid.UUID
    candidate_name: str
    candidate_photo_url: str | None = None
    candidate_role: str
    team_name: str | None = None
    score: float
    match_percentage: int
    matching_topics: list[str]


class MatchResultOut(BaseModel):
    session_id: str
    top_matches: list[CandidateMatchOut]
    total_questions: int
    answered_questions: int
