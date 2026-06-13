"""
Run with:  python -m app.seed.seed_db
"""

import uuid
from datetime import date, datetime, timezone

from app.database import SessionLocal
from app.models.achievement import Achievement
from app.models.candidate import Candidate, Team
from app.models.election import Election, ElectionStep
from app.models.faq import FAQItem
from app.models.preference import AnswerOption, CandidatePreferenceProfile, PreferenceQuestion
from app.models.problem import ProblemComment, ProblemPost


def seed() -> None:
    db = SessionLocal()
    try:
        # ── Teams ──────────────────────────────────────────────────────────
        team_a = Team(name="Team A", description="Human Resources & Partnerships")
        team_b = Team(name="Team B", description="Engineering & Operations")
        team_c = Team(name="Team C", description="Quality & Process")
        db.add_all([team_a, team_b, team_c])
        db.flush()

        # ── Candidates ─────────────────────────────────────────────────────
        candidates = [
            Candidate(
                name="Anna Müller",
                role="HR Business Partner",
                team_id=team_a.id,
                bio="Anna has 8 years of experience in HR and advocates strongly for fair representation and transparent communication.",
                bio_de="Anna hat 8 Jahre Erfahrung im HR-Bereich und setzt sich für faire Interessenvertretung ein.",
                photo_url=None,
                sort_order=1,
            ),
            Candidate(
                name="Markus Becker",
                role="Software Engineer",
                team_id=team_a.id,
                bio="Markus brings a data-driven mindset to every issue and champions better remote-work policies.",
                bio_de="Markus bringt eine datengetriebene Denkweise ein und setzt sich für bessere Remote-Work-Richtlinien ein.",
                photo_url=None,
                sort_order=2,
            ),
            Candidate(
                name="Julia Schneider",
                role="Project Manager",
                team_id=team_b.id,
                bio="Julia has led cross-functional initiatives and believes in structured, inclusive processes.",
                bio_de="Julia hat bereichsübergreifende Initiativen geleitet und glaubt an strukturierte, inklusive Prozesse.",
                photo_url=None,
                sort_order=3,
            ),
            Candidate(
                name="Thomas Lehmann",
                role="Production Specialist",
                team_id=team_b.id,
                bio="Thomas focuses on workplace safety and ergonomics improvements for the production floor.",
                bio_de="Thomas konzentriert sich auf Arbeitsplatzsicherheit und ergonomische Verbesserungen.",
                photo_url=None,
                sort_order=4,
            ),
            Candidate(
                name="Selina Yilmaz",
                role="Quality Manager",
                team_id=team_c.id,
                bio="Selina drives continuous improvement and has negotiated several impactful quality agreements.",
                bio_de="Selina treibt kontinuierliche Verbesserungen voran und hat mehrere wirkungsvolle Qualitätsvereinbarungen ausgehandelt.",
                photo_url=None,
                sort_order=5,
            ),
            Candidate(
                name="Peter König",
                role="IT Architect",
                team_id=None,
                is_independent=True,
                bio="Peter runs as an independent candidate, focusing on digital transformation and data privacy.",
                bio_de="Peter kandidiert als unabhängiger Kandidat mit Fokus auf digitale Transformation und Datenschutz.",
                photo_url=None,
                sort_order=6,
            ),
        ]
        db.add_all(candidates)
        db.flush()

        # ── Election ───────────────────────────────────────────────────────
        election = Election(
            title="Works Council Election 2024",
            title_de="Betriebsratswahl 2024",
            start_date=date(2024, 6, 10),
            end_date=date(2024, 6, 21),
            is_active=True,
        )
        db.add(election)
        db.flush()

        steps = [
            ElectionStep(election_id=election.id, step_number=1, title="Announcement", title_de="Bekanntmachung", description="We inform you about the election.", description_de="Wir informieren über die Wahl.", date_label="April 2024", is_completed=True, is_current=False),
            ElectionStep(election_id=election.id, step_number=2, title="Nomination", title_de="Nominierung", description="Employees can nominate themselves or others.", description_de="Mitarbeiter können sich oder andere nominieren.", date_label="May 2024", is_completed=True, is_current=False),
            ElectionStep(election_id=election.id, step_number=3, title="Candidate list", title_de="Kandidatenliste", description="The final list of candidates is published.", description_de="Die endgültige Kandidatenliste wird veröffentlicht.", date_label="End of May 2024", is_completed=True, is_current=False),
            ElectionStep(election_id=election.id, step_number=4, title="Election period", title_de="Wahlzeitraum", description="10. – 21. June 2024", description_de="10.–21. Juni 2024", date_label="10.–21. June 2024", is_completed=False, is_current=True),
            ElectionStep(election_id=election.id, step_number=5, title="Results", title_de="Ergebnisse", description="The result is determined and announced.", description_de="Das Ergebnis wird ermittelt und bekanntgegeben.", date_label="June 2024", is_completed=False, is_current=False),
        ]
        db.add_all(steps)

        # ── Achievements ───────────────────────────────────────────────────
        achievements = [
            Achievement(stat_value="28", label="initiatives", label_de="Initiativen", description="improved working conditions", description_de="verbesserte Arbeitsbedingungen", icon_name="award", sort_order=1),
            Achievement(stat_value="156", label="programs", label_de="Programme", description="training & development", description_de="Weiterbildung & Entwicklung", icon_name="graduation-cap", sort_order=2),
            Achievement(stat_value="42", label="agreements", label_de="Vereinbarungen", description="fair agreements achieved", description_de="faire Vereinbarungen erreicht", icon_name="handshake", sort_order=3),
            Achievement(stat_value="€1.2M+", label="value added", label_de="Mehrwert", description="employee benefits secured", description_de="Mitarbeitervorteile gesichert", icon_name="heart", sort_order=4),
        ]
        db.add_all(achievements)

        # ── FAQ ────────────────────────────────────────────────────────────
        faqs = [
            FAQItem(question="Who can vote?", question_de="Wer darf wählen?", answer="All employees who have been employed for at least 6 months are eligible to vote.", answer_de="Alle Mitarbeiter, die seit mindestens 6 Monaten beschäftigt sind, sind wahlberechtigt.", category="Voting", sort_order=1),
            FAQItem(question="How is my vote kept secret?", question_de="Wie wird meine Stimme geheim gehalten?", answer="Votes are cast anonymously. No one can trace your vote back to you.", answer_de="Die Wahl erfolgt anonym. Niemand kann Ihre Stimme auf Sie zurückführen.", category="Privacy", sort_order=2),
            FAQItem(question="When does the election take place?", question_de="Wann findet die Wahl statt?", answer="The election takes place from 10 to 21 June 2024.", answer_de="Die Wahl findet vom 10. bis 21. Juni 2024 statt.", category="Process", sort_order=3),
            FAQItem(question="What does the works council do?", question_de="Was macht der Betriebsrat?", answer="The works council represents employee interests, negotiates working conditions, and ensures legal compliance.", answer_de="Der Betriebsrat vertritt die Interessen der Mitarbeiter, verhandelt Arbeitsbedingungen und sorgt für Rechtssicherheit.", category="General", sort_order=4),
            FAQItem(question="Can I run as a candidate?", question_de="Kann ich kandidieren?", answer="Yes! Any employee who has been with the company for at least 6 months can nominate themselves during the nomination period.", answer_de="Ja! Jeder Mitarbeiter, der seit mindestens 6 Monaten im Unternehmen ist, kann sich im Nominierungszeitraum selbst nominieren.", category="Candidates", sort_order=5),
        ]
        db.add_all(faqs)

        # ── Preference Questions ───────────────────────────────────────────
        q1 = PreferenceQuestion(text="What topic matters most to you?", text_de="Welches Thema ist Ihnen am wichtigsten?", category="priorities", sort_order=1)
        q2 = PreferenceQuestion(text="How do you prefer the council to communicate?", text_de="Wie soll der Betriebsrat kommunizieren?", category="communication", sort_order=2)
        q3 = PreferenceQuestion(text="Which working model do you prefer?", text_de="Welches Arbeitsmodell bevorzugen Sie?", category="workmodel", sort_order=3)
        db.add_all([q1, q2, q3])
        db.flush()

        options = [
            AnswerOption(question_id=q1.id, text="Remote & Flexibility", text_de="Remote & Flexibilität", value="remote", sort_order=1),
            AnswerOption(question_id=q1.id, text="Salary & Benefits", text_de="Gehalt & Leistungen", value="salary", sort_order=2),
            AnswerOption(question_id=q1.id, text="Workplace Safety", text_de="Arbeitssicherheit", value="safety", sort_order=3),
            AnswerOption(question_id=q1.id, text="Career Development", text_de="Karriereentwicklung", value="career", sort_order=4),

            AnswerOption(question_id=q2.id, text="Regular town halls", text_de="Regelmäßige Versammlungen", value="townhall", sort_order=1),
            AnswerOption(question_id=q2.id, text="Monthly newsletter", text_de="Monatlicher Newsletter", value="newsletter", sort_order=2),
            AnswerOption(question_id=q2.id, text="Digital chat/intranet", text_de="Digitaler Chat/Intranet", value="digital", sort_order=3),

            AnswerOption(question_id=q3.id, text="Full remote", text_de="Vollständig remote", value="full_remote", sort_order=1),
            AnswerOption(question_id=q3.id, text="Hybrid (2–3 days office)", text_de="Hybrid (2–3 Tage Büro)", value="hybrid", sort_order=2),
            AnswerOption(question_id=q3.id, text="Mostly on-site", text_de="Überwiegend vor Ort", value="onsite", sort_order=3),
        ]
        db.add_all(options)
        db.flush()

        # ── Candidate preference profiles ──────────────────────────────────
        profiles_data = [
            (candidates[0], {str(q1.id): "salary", str(q2.id): "townhall", str(q3.id): "hybrid"}),
            (candidates[1], {str(q1.id): "remote", str(q2.id): "digital", str(q3.id): "full_remote"}),
            (candidates[2], {str(q1.id): "career", str(q2.id): "newsletter", str(q3.id): "hybrid"}),
            (candidates[3], {str(q1.id): "safety", str(q2.id): "townhall", str(q3.id): "onsite"}),
            (candidates[4], {str(q1.id): "career", str(q2.id): "digital", str(q3.id): "hybrid"}),
            (candidates[5], {str(q1.id): "remote", str(q2.id): "digital", str(q3.id): "full_remote"}),
        ]
        for candidate, answers in profiles_data:
            db.add(CandidatePreferenceProfile(candidate_id=candidate.id, answers=answers))

        # ── Problem Posts ──────────────────────────────────────────────────
        now = datetime.now(timezone.utc)

        def dt(days_ago: int) -> datetime:
            from datetime import timedelta
            return datetime(2024, 6, 1, tzinfo=timezone.utc) - timedelta(days=days_ago)

        p1 = ProblemPost(
            title="Unclear communication about shift changes",
            content=(
                "Shift changes are often communicated with less than 24 hours notice, "
                "making it extremely difficult to arrange childcare, transportation, or adjust personal plans. "
                "This has happened at least 5 times in the last two months and is affecting morale and work-life balance."
            ),
            category="management_communication",
            urgency="high",
            status="responded",
            like_count=12,
            council_response=(
                "We have heard your concern and are actively working with management to improve shift change procedures. "
                "Starting next month, all shift changes must be communicated at least 5 working days in advance via the company app. "
                "Exceptions will require direct approval from department heads. Thank you for raising this."
            ),
            council_response_created_at=dt(2),
            created_at=dt(14),
            updated_at=dt(2),
        )
        p2 = ProblemPost(
            title="Noisy workspace makes focused work difficult",
            content=(
                "The open-plan office has become increasingly noisy, especially in the afternoons. "
                "Phone calls, loud conversations, and construction noise from the renovation next door make it "
                "nearly impossible to concentrate on tasks requiring deep focus. "
                "Several colleagues have resorted to working from home full-time just to get things done."
            ),
            category="workplace_conditions",
            urgency="medium",
            status="under_review",
            like_count=23,
            created_at=dt(10),
            updated_at=dt(5),
        )
        p3 = ProblemPost(
            title="Questions about overtime compensation policy",
            content=(
                "The current overtime compensation policy is very unclear. Many employees have been working "
                "extra hours without being sure whether they will receive time off in lieu or additional pay. "
                "HR gives different answers depending on who you ask. A clear, written policy that is accessible "
                "to all employees is urgently needed."
            ),
            category="salary_benefits",
            urgency="high",
            status="new",
            like_count=18,
            created_at=dt(6),
            updated_at=dt(6),
        )
        p4 = ProblemPost(
            title="Need a better process for reporting team conflicts",
            content=(
                "When interpersonal conflicts arise between colleagues or with a manager, there is no clear, "
                "safe process for reporting them. Employees are afraid of retaliation if they escalate formally, "
                "and informal conversations often go nowhere. An anonymous, structured reporting channel would "
                "make a significant difference."
            ),
            category="discrimination_fairness",
            urgency="medium",
            status="resolved",
            like_count=8,
            council_response=(
                "We have updated our HR conflict resolution process and added a fully anonymous reporting channel. "
                "You can now report team conflicts through the HR portal under 'Anonymous Feedback'. "
                "Reports are reviewed by an independent mediator, not your direct management chain."
            ),
            council_response_created_at=dt(20),
            created_at=dt(30),
            updated_at=dt(20),
        )

        db.add_all([p1, p2, p3, p4])
        db.flush()

        problem_comments = [
            ProblemComment(problem_id=p1.id, content="This has been going on for months. Really glad it is finally being addressed.", created_at=dt(12)),
            ProblemComment(problem_id=p1.id, content="My entire team agrees. We sometimes find out about changes less than 12 hours before the shift starts.", created_at=dt(11)),
            ProblemComment(problem_id=p2.id, content="I have had to work from home more and more because of this. Not a long-term solution.", created_at=dt(9)),
            ProblemComment(problem_id=p2.id, content="Quiet zones or sound-dampening panels would make a huge difference.", created_at=dt(8)),
            ProblemComment(problem_id=p2.id, content="Even just enforcing a no-calls-at-desk policy in the focus area would help.", created_at=dt(7)),
            ProblemComment(problem_id=p3.id, content="The policy is completely opaque. I have been working overtime for three months with no clear answer.", created_at=dt(5)),
            ProblemComment(problem_id=p4.id, content="This was really needed. Thank you to the council for acting on it.", created_at=dt(18)),
        ]
        db.add_all(problem_comments)

        db.commit()
        print("✅ Seed data inserted successfully.")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
