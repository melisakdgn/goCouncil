# API Contract — Go Council

Base URL: `http://localhost:8000/api`

All responses use JSON. Errors follow `{ "detail": "..." }`.

---

## Candidates

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/candidates` | List all active candidates (with team) |
| GET | `/candidates/{id}` | Single candidate detail |
| POST | `/candidates` | Create candidate (admin) |
| PUT | `/candidates/{id}` | Update candidate (admin) |
| DELETE | `/candidates/{id}` | Soft-delete candidate (admin) |

### GET /candidates response
```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Anna Müller",
      "role": "HR Business Partner",
      "bio": "...",
      "bio_de": "...",
      "photo_url": null,
      "is_independent": false,
      "is_active": true,
      "sort_order": 1,
      "team_id": "uuid",
      "team": { "id": "uuid", "name": "Team A" },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 6
}
```

---

## Election Process

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/election-process` | Get active election with steps |

### GET /election-process response
```json
{
  "id": "uuid",
  "title": "Works Council Election 2024",
  "title_de": "Betriebsratswahl 2024",
  "start_date": "2024-06-10",
  "end_date": "2024-06-21",
  "is_active": true,
  "steps": [
    {
      "id": "uuid",
      "step_number": 1,
      "title": "Announcement",
      "title_de": "Bekanntmachung",
      "description": "We inform you about the election.",
      "description_de": "Wir informieren über die Wahl.",
      "date_label": "April 2024",
      "is_completed": true,
      "is_current": false
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## Achievements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/achievements` | List all achievements ordered by sort_order |

---

## FAQ

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/faqs` | List all FAQ items |

---

## Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/contact` | Submit a contact message |

### POST /contact body
```json
{
  "name": "Max Mustermann",
  "email": "max@example.com",
  "subject": "Question about voting",
  "message": "..."
}
```

---

## Preference Matching

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/preference/questions` | List all questions with options |
| POST | `/preference/submit` | Submit answers, get top-3 matches |
| GET | `/preference/results/{session_id}` | Retrieve stored match result |

### POST /preference/submit body
```json
{
  "answers": [
    { "question_id": "uuid", "selected_value": "remote" },
    { "question_id": "uuid", "selected_value": "digital" }
  ]
}
```

### POST /preference/submit response
```json
{
  "session_id": "uuid",
  "top_matches": [
    {
      "candidate_id": "uuid",
      "candidate_name": "Markus Becker",
      "candidate_photo_url": null,
      "candidate_role": "Software Engineer",
      "team_name": "Team A",
      "score": 0.667,
      "match_percentage": 67,
      "matching_topics": ["What topic matters most to you?", "Which working model do you prefer?"]
    }
  ],
  "total_questions": 3,
  "answered_questions": 3
}
```

---

## Future Admin Endpoints (Phase 5)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Obtain JWT token |
| GET | `/admin/candidates` | List all (including inactive) |
| POST | `/admin/candidates` | Create |
| PUT | `/admin/candidates/{id}` | Update |
| DELETE | `/admin/candidates/{id}` | Hard delete |
| GET | `/admin/contact-messages` | List all contact messages |
| PUT | `/admin/faqs/{id}` | Update FAQ |
| POST | `/admin/achievements` | Create achievement |
