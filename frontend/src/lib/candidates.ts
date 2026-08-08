import type { Candidate } from './types'

/**
 * Hardcoded candidate pool, matching the candidates.json shape
 * (see docs/00_SHARED_CONTEXT.md §6). The backend will eventually serve
 * candidates; for now the picker chooses among these. Each candidate's
 * weak spots (skipped missions / high-attempt missions) drive what the
 * interviewer probes.
 */
export const CANDIDATES: Candidate[] = [
  {
    member: { role: 'AI Engineer', experience: 2 },
    missions: [
      { day: 2, title: 'Day 2 - Prompting Basics', passed: true, attempts: 1 },
      { day: 5, title: 'Day 5 - RAG Fundamentals', passed: false, attempts: 3 },
      { day: 8, title: 'Day 8 - Agents', skipped: true },
      { day: 12, title: 'Day 12 - Evaluation', passed: true, attempts: 1 },
      { day: 15, title: 'Day 15 - Fine-tuning', passed: false, attempts: 4 },
    ],
    signals: { commitDays: 10, missionsCompleted: 3, missionsFirstTry: 2 },
  },
  {
    member: { role: 'Web Developer', experience: 1 },
    missions: [
      { day: 1, title: 'Day 1 - HTML & CSS', passed: true, attempts: 1 },
      { day: 3, title: 'Day 3 - JavaScript', passed: true, attempts: 2 },
      { day: 6, title: 'Day 6 - Accessibility', skipped: true },
      { day: 9, title: 'Day 9 - Performance', passed: false, attempts: 3 },
      { day: 14, title: 'Day 14 - Testing', skipped: true },
    ],
    signals: { commitDays: 6, missionsCompleted: 2, missionsFirstTry: 1 },
  },
  {
    member: { role: 'Data Scientist', experience: 4 },
    missions: [
      { day: 4, title: 'Day 4 - Data Cleaning', passed: true, attempts: 1 },
      { day: 7, title: 'Day 7 - Statistics', passed: true, attempts: 1 },
      { day: 11, title: 'Day 11 - Modeling', passed: true, attempts: 2 },
      { day: 13, title: 'Day 13 - MLOps', passed: false, attempts: 3 },
      { day: 16, title: 'Day 16 - Storytelling', skipped: true },
    ],
    signals: { commitDays: 14, missionsCompleted: 4, missionsFirstTry: 3 },
  },
]

/** Default selection for quick start (or auto-start without the picker). */
export const DEFAULT_CANDIDATE: Candidate = CANDIDATES[0]
