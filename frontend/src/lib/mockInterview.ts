import type {
  Candidate,
  InterviewRequest,
  InterviewResponse,
} from './types'

/**
 * Hardcoded sample candidate, matching the candidates.json shape
 * (see docs/00_SHARED_CONTEXT.md §6). Used for Milestone 1 so the UI is
 * demoable without a running backend. Real candidate selection comes later.
 */
export const SAMPLE_CANDIDATE: Candidate = {
  member: { role: 'AI Engineer', experience: 2 },
  missions: [
    { day: 2, title: 'Day 2 - Prompting Basics', passed: true, attempts: 1 },
    { day: 5, title: 'Day 5 - RAG Fundamentals', passed: false, attempts: 3 },
    { day: 8, title: 'Day 8 - Agents', skipped: true },
    { day: 12, title: 'Day 12 - Evaluation', passed: true, attempts: 1 },
    { day: 15, title: 'Day 15 - Fine-tuning', passed: false, attempts: 4 },
  ],
  signals: { commitDays: 10, missionsCompleted: 3, missionsFirstTry: 2 },
}

/** Canned assistant replies, cycled through before the mock interview ends. */
const MOCK_REPLIES = [
  "Welcome! I'm your technical interviewer today. Let's start with RAG fundamentals — you attempted Day 5's mission a few times, so I'd like to dig in there. Can you walk me through the high-level flow of a RAG pipeline?",
  "Good, you've got the retrieval step. Now, why does chunking strategy matter for retrieval quality, and how would you choose a chunk size?",
  'Solid. One more on that day: how would you evaluate whether your RAG system is actually retrieving well, before you even get to the answer generation?',
  "Nice. Let's switch to Agents, which I see you skipped in the curriculum. What are the core building blocks of an autonomous agent, and how do they differ from a plain LLM call?",
  'Interview complete. Let me pull together your feedback.',
]

const MOCK_FEEDBACK = {
  summary:
    'You have a solid grasp of RAG fundamentals and showed good intuition around evaluation. The Agents topic (which you skipped in the curriculum) is a clear gap worth closing before moving on.',
  strengths: [
    'Explained the RAG retrieval flow clearly',
    'Good awareness of evaluation strategies',
  ],
  gaps: [
    'Core agent concepts unfamiliar — skipped Day 8',
    'Chunk-size tradeoffs were vague under probing',
  ],
  next: [
    'Complete the Day 8 Agents mission',
    'Build one small RAG eval harness to cement evaluation intuition',
  ],
}

/**
 * Mock interview engine for Milestone 1. Implements the same request/response
 * contract as the real backend so the UI can be swapped to postInterview()
 * without changes. Uses a module-level counter to walk through the canned
 * replies; the last reply marks the interview done and returns mock feedback.
 */
let _turn = 0

export async function mockInterview(
  req: InterviewRequest,
): Promise<InterviewResponse> {
  // Simulate network latency.
  await new Promise((resolve) => setTimeout(resolve, 700))

  const isStart = 'candidate' in req
  const index = isStart ? 0 : Math.min(_turn + 1, MOCK_REPLIES.length - 1)
  if (!isStart) _turn = index

  const done = index >= MOCK_REPLIES.length - 1
  return {
    reply: MOCK_REPLIES[index],
    done,
    feedback: done ? MOCK_FEEDBACK : undefined,
  }
}
