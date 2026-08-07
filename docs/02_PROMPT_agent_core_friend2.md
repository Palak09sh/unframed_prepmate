# Claude Code Prompt — Interview Agent Core (Friend2)

Paste this into Claude Code at the start of your session, in the repo root.

---

I'm building the core AI interview logic for a hackathon Interview Agent
project. Read `00_SHARED_CONTEXT.md` in this repo first — it has the full
architecture, API contract, and the exact function signatures I need to
implement. Follow the contract exactly; a teammate's route code will call
these functions directly, so the shape must match.

**My scope:** `/backend/src/services/interviewEngine.js` only. Do not create
or edit files in `/backend/src/routes`, `/backend/src/sessions`,
`/backend/src/services/feedback.js`, or `/frontend`.

**What to build:**

`interviewEngine.js`, exporting exactly two functions (signatures are in
`00_SHARED_CONTEXT.md` section 5):

1. **`startInterview(candidate)`** — reads the candidate's `missions` array
   (from `candidates.json` shape) and picks at least 4 target curriculum
   days to interview on. Prioritize:
   - days where `attempts` is high (3+) — candidate struggled, good for a
     probing question
   - days marked `skipped: true` — worth checking if they understand the
     concept anyway
   - mix in 1–2 days they passed easily, for a confidence-building opener
   Cross-reference `curriculum.json` to get the day's `title`, `objectives`,
   and `tools` so the question is grounded in what was actually taught.
   Build a system prompt for Claude that establishes the interviewer
   persona and constraints, then generate an opening question for the
   first target day. Return the state object + reply exactly as specified
   in the contract.

2. **`processTurn(state, candidateMessage)`** — appends the candidate's
   message to history, calls Claude with the conversation so far + system
   prompt, and decides one of:
   - ask a natural follow-up on the current day (if the answer was
     shallow or interesting)
   - move to the next target day
   - wrap up (only once `questionCount >= 8` AND `askedDays.length >= 4` —
     **enforce this in code with an explicit check, don't rely on the LLM
     to count correctly**)
   Returns updated state + reply + `done` flag per the contract.

**Prompt engineering notes:**
- The interview should feel adaptive and conversational, not like a
  scripted quiz — vary phrasing, react to what the candidate actually said.
- Use Claude Haiku for these turns (fast, cheap) — this is a hackathon, we
  don't need the strongest model for every turn.
- Keep the system prompt focused: interviewer persona, the candidate's
  background (jobRole, yearsExperience), the current target day's
  objectives, and instructions not to reveal the "right answer" but to
  probe understanding.

**Don't:**
- Don't handle HTTP directly — this file has no Express code, it's pure
  logic that the route (teammate's file) will call.
- Don't touch session storage — you receive `state` as an argument and
  return a new one; you don't persist anything yourself.
- Don't create git commits — I'll commit manually.

**Work in phases, check in with me between them:**
1. `startInterview` — day selection logic + opening question, test it
   standalone with a sample candidate before moving on.
2. `processTurn` — basic Q&A loop (no follow-up sophistication yet), get
   the 8-question/4-day counting logic solid first.
3. Improve follow-up quality / adaptiveness once the basic loop works.

Ask me if the day-selection prioritization logic or the counting rule is
unclear before assuming.
