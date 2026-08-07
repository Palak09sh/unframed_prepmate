# Shared Context — Interview Agent (ABTalks Hackathon)

**Read this file first, before any prompt below.** All three teammates work
against this same contract. Do not deviate from the interfaces defined here
without syncing with the other two — this is exactly what caused problems
last hackathon.

---

## 1. What we're building

An AI agent that conducts a multi-turn technical interview based on a
candidate's AI Cohort learning history. Single HTTP endpoint per the
technical spec. Minimum 8 questions across at least 4 curriculum days,
adaptive follow-ups, structured feedback at the end.

## 2. Stack

- Backend: Node.js + Express
- Frontend: React (Vite)
- LLM: Claude API (Anthropic SDK) — Haiku for interview turns, same model ok
  for feedback generation
- Session storage: in-memory `Map`, NOT a database
- **Deployment: Render or Railway (long-running server), NOT Vercel serverless
  functions.** Serverless = new instance per request = in-memory session
  state gets wiped between calls = interview breaks after message 1. This is
  non-negotiable for this architecture.

## 3. Repo structure

```
/frontend                              → Leader owns this entirely
/backend
  /src
    /routes/interview.route.js         → Radhika owns
    /services/interviewEngine.js       → Friend2 owns (the agent core)
    /services/feedback.js              → Radhika owns
    /sessions/sessionStore.js          → Radhika owns
  /data/curriculum.json
  server.js
PROMPTS.md
README.md
```

**Rule: don't edit files outside your own list above.** If you need a change
in someone else's file, ask them — don't just edit it.

## 4. The API (per technical-spec.md — fixed, don't change)

```
POST /api/interview
```

**First call (start):**
```json
Request:  { "sessionId": "abc-123", "candidate": { ...candidate.json shape } }
Response: { "reply": "Welcome. Let's begin...", "done": false }
```

**Every following call:**
```json
Request:  { "sessionId": "abc-123", "message": "..." }
Response: { "reply": "...", "done": false }
```

**Final call:**
```json
Response: {
  "reply": "Interview completed.",
  "done": true,
  "feedback": { "summary": "...", "strengths": [], "gaps": [], "next": [] }
}
```

## 5. Internal contract between Friend2 (engine) and Radhika (route)

This is the interface both of you must implement exactly — agree on any
change together before touching it.

**`interviewEngine.js` exports:**

```js
// Called once, on the very first request for a sessionId.
// Picks 4+ target curriculum days (prioritize days with high attempts
// or "skipped": true in the candidate's missions — those are the weak
// spots worth probing), builds the system prompt, returns the opening
// question.
function startInterview(candidate) {
  // returns:
  return {
    state: {
      candidate,
      targetDays: [/* >=4 day numbers, chosen deliberately */],
      askedDays: [],
      history: [{ role: "assistant", content: "<opening question>" }],
      questionCount: 1,
      phase: "interviewing", // or "done"
    },
    reply: "<opening question text>",
  };
}

// Called on every subsequent turn.
// Decides: ask a follow-up on the same day, move to the next target day,
// or wrap up (once questionCount >= 8 AND askedDays.length >= 4).
function processTurn(state, candidateMessage) {
  // returns:
  return {
    state: { ...updatedState },
    reply: "<next question, or closing line if done>",
    done: false, // true only when interview should end
  };
}

module.exports = { startInterview, processTurn };
```

**Enforce the 8-question / 4-day minimum in code, not by trusting the LLM
to count correctly.**

**`feedback.js` exports:**

```js
// Called once, when processTurn returns done: true.
// Takes the full state (history + candidate) and produces structured feedback.
async function generateFeedback(state) {
  return {
    summary: "string",
    strengths: ["..."],
    gaps: ["..."],
    next: ["..."],
  };
}

module.exports = { generateFeedback };
```

**`sessionStore.js` exports:**

```js
function createSession(sessionId, state) {}
function getSession(sessionId) {} // returns state or undefined
function updateSession(sessionId, newState) {}

module.exports = { createSession, getSession, updateSession };
```

**`interview.route.js` logic (Radhika):**

```
POST /api/interview
  if body has "candidate" (first call):
      { state, reply } = interviewEngine.startInterview(candidate)
      sessionStore.createSession(sessionId, state)
      respond { reply, done: false }
  else (has "message"):
      state = sessionStore.getSession(sessionId)
      { state: updatedState, reply, done } = interviewEngine.processTurn(state, message)
      sessionStore.updateSession(sessionId, updatedState)
      if done:
          feedback = await feedback.generateFeedback(updatedState)
          respond { reply, done: true, feedback }
      else:
          respond { reply, done: false }
```

## 6. Data shapes we already have

- `curriculum.json` — 8 modules, days 1–31, each day has `title`, `type`,
  `tools`, `objectives`.
- `candidates.json` — each candidate has `member` (role, experience),
  `missions` (array of `{day, title, passed, attempts}` or `{day, title,
  skipped: true}`), and `signals` (commitDays, missionsCompleted,
  missionsFirstTry).

Weak-spot signal: high `attempts` (3+) or `skipped: true` on a mission = good
candidate for a probing follow-up question.

## 7. Checkpoints (commit manually, don't let Claude Code commit)

1. Project setup + folder structure + interfaces locked
2. Interview engine: basic Q&A working end-to-end (no follow-up logic yet)
3. Follow-up logic + day-coverage enforcement
4. Feedback generation + full flow tested
5. Frontend polished + deployed + README/PROMPTS.md done
