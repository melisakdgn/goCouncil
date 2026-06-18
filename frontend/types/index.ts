// ─── Candidate ────────────────────────────────────────────────────────────────

export interface Team {
  id: string;
  name: string;
  description?: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  bio?: string;
  bio_de?: string;
  photo_url?: string;
  is_independent: boolean;
  is_active: boolean;
  sort_order: number;
  team_id?: string;
  team?: Team;
  created_at: string;
  updated_at: string;
}

export interface CandidateListResponse {
  items: Candidate[];
  total: number;
}

// ─── Election ─────────────────────────────────────────────────────────────────

export interface ElectionStep {
  id: string;
  step_number: number;
  title: string;
  title_de?: string;
  description?: string;
  description_de?: string;
  date_label?: string;
  is_completed: boolean;
  is_current: boolean;
}

export interface Election {
  id: string;
  title: string;
  title_de?: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  steps: ElectionStep[];
  created_at: string;
}

// ─── Achievement ──────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  stat_value: string;
  label: string;
  label_de?: string;
  description?: string;
  description_de?: string;
  icon_name?: string;
  sort_order: number;
  created_at: string;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface FAQItem {
  id: string;
  question: string;
  question_de?: string;
  answer: string;
  answer_de?: string;
  category?: string;
  sort_order: number;
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export interface ContactMessageCreate {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// ─── Preference Matching ──────────────────────────────────────────────────────

export interface AnswerOption {
  id: string;
  text: string;
  text_de?: string;
  value: string;
  sort_order: number;
}

export interface PreferenceQuestion {
  id: string;
  text: string;
  text_de?: string;
  category?: string;
  sort_order: number;
  options: AnswerOption[];
}

export interface UserAnswerIn {
  question_id: string;
  selected_value: string;
}

export interface PreferenceSubmitPayload {
  answers: UserAnswerIn[];
}

export interface CandidateMatch {
  candidate_id: string;
  candidate_name: string;
  candidate_photo_url?: string;
  candidate_role: string;
  team_name?: string;
  score: number;
  match_percentage: number;
  matching_topics: string[];
}

export interface MatchResult {
  session_id: string;
  top_matches: CandidateMatch[];
  total_questions: number;
  answered_questions: number;
}

// ─── News ─────────────────────────────────────────────────────────────────────

export interface NewsUpdate {
  id: string;
  date: string;
  title: string;
  title_de?: string;
  summary?: string;
  summary_de?: string;
}

// ─── Problems ─────────────────────────────────────────────────────────────────

export type ProblemCategory =
  | "workplace_conditions"
  | "salary_benefits"
  | "management_communication"
  | "working_hours"
  | "health_safety"
  | "discrimination_fairness"
  | "infrastructure"
  | "other";

export type ProblemUrgency = "low" | "medium" | "high";

export type ProblemStatus = "new" | "under_review" | "responded" | "resolved";

export interface ProblemComment {
  id: string;
  problem_id: string;
  content: string;
  created_at: string;
}

export interface ProblemPost {
  id: string;
  title: string;
  content: string;
  category: ProblemCategory;
  urgency: ProblemUrgency;
  status: ProblemStatus;
  like_count: number;
  council_response?: string;
  council_response_created_at?: string;
  created_at: string;
  updated_at: string;
  comments: ProblemComment[];
}

export interface ProblemListResponse {
  items: ProblemPost[];
  total: number;
}

export interface ProblemPostCreate {
  title: string;
  content: string;
  category: ProblemCategory;
  urgency: ProblemUrgency;
}

export interface ProblemCommentCreate {
  content: string;
}

// ─── Locale ───────────────────────────────────────────────────────────────────

export type Locale = "en" | "de";
