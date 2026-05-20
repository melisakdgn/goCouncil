import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PreferenceQuestion(Base):
    __tablename__ = "preference_questions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    text_de: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    options: Mapped[list["AnswerOption"]] = relationship(
        "AnswerOption", back_populates="question", order_by="AnswerOption.sort_order"
    )


class AnswerOption(Base):
    __tablename__ = "answer_options"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("preference_questions.id"), nullable=False
    )
    text: Mapped[str] = mapped_column(Text, nullable=False)
    text_de: Mapped[str | None] = mapped_column(Text, nullable=True)
    value: Mapped[str] = mapped_column(String(100), nullable=False)  # semantic key used in matching
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    question: Mapped["PreferenceQuestion"] = relationship("PreferenceQuestion", back_populates="options")


class CandidatePreferenceProfile(Base):
    """Maps a candidate's stance (answer values) per question."""

    __tablename__ = "candidate_preference_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    candidate_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("candidates.id"), nullable=False, unique=True
    )
    # {question_id: answer_value}
    answers: Mapped[dict] = mapped_column(JSONB, nullable=False, default=dict)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    candidate: Mapped["Candidate"] = relationship(  # type: ignore[name-defined]
        "Candidate", back_populates="preference_profile"
    )


class UserMatchResult(Base):
    """Stores the result of a user's preference matching session."""

    __tablename__ = "user_match_results"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id: Mapped[str] = mapped_column(String(100), nullable=False, unique=True, index=True)
    # {question_id: chosen_value}
    user_answers: Mapped[dict] = mapped_column(JSONB, nullable=False)
    # [{candidate_id, score, reasons}]
    top_matches: Mapped[list] = mapped_column(JSONB, nullable=False, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
