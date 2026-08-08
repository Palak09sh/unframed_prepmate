// Types mirroring the API contract in docs/00_SHARED_CONTEXT.md §4 and §6.
// Do NOT change these shapes — the backend is built against the same contract.

/** A single mission attempt or skip from the candidate's learning history. */
export type CandidateMission =
  | { day: number; title: string; passed: boolean; attempts: number }
  | { day: number; title: string; skipped: true };

/** Candidate shape (candidates.json). */
export interface Candidate {
  member: { role: string; experience: number };
  missions: CandidateMission[];
  signals: {
    commitDays: number;
    missionsCompleted: number;
    missionsFirstTry: number;
  };
}

/** First request — starts the interview. */
export interface StartInterviewRequest {
  sessionId: string;
  candidate: Candidate;
}

/** Follow-up request — sends the candidate's reply. */
export interface TurnRequest {
  sessionId: string;
  message: string;
}

export type InterviewRequest = StartInterviewRequest | TurnRequest;

/** Structured feedback returned when done: true. */
export interface Feedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

/** Response envelope — same for every call. */
export interface InterviewResponse {
  reply: string;
  done: boolean;
  feedback?: Feedback;
}

/** A rendered chat message in the UI. */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Epoch ms, set when the message is appended. */
  createdAt: number;
}
