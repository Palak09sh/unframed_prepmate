# Claude Code Prompt — Backend API, Session Store, Feedback, Deployment (Radhika)

Paste this into Claude Code at the start of your session, in the repo root.
I want to write/review the actual logic myself where it matters for
learning — use this prompt to scaffold and for the parts I explicitly ask
you to implement, but check in with me before generating large chunks of
business logic.

---

I'm building the backend wiring for a hackathon Interview Agent project.
Read `00_SHARED_CONTEXT.md` in this repo first — it has the full
architecture, API contract, and exact function signatures for the modules
my teammates own (`interviewEngine.js`, and the frontend). Follow the
contract exactly — my route code calls their functions by the signatures
defined there.

**My scope:**
- `/backend/src/routes/interview.route.js`
- `/backend/src/sessions/sessionStore.js`
- `/backend/src/services/feedback.js`
- `/backend/server.js`
- deployment config, README, env var docs

Do not create or edit `/backend/src/services/interviewEngine.js` or
anything under `/frontend` — those belong to teammates.

**What to build:**

1. **`sessionStore.js`** — a simple in-memory session store using a `Map`.
   Exports `createSession(sessionId, state)`, `getSession(sessionId)`,
   `updateSession(sessionId, newState)`. Keep it dumb and simple — no need
   for TTL/expiry logic given the hackathon timeframe, but flag it as a
   known limitation in a comment.

2. **`interview.route.js`** — implements `POST /api/interview` exactly per
   the flow in `00_SHARED_CONTEXT.md` section 5: detects first call vs.
   follow-up call by whether the body has `candidate` or `message`, calls
   into `interviewEngine.startInterview` / `processTurn`, stores/updates
   session state, and calls `feedback.generateFeedback` when `done: true`.
   Validate the request body (missing `sessionId`, missing both `candidate`
   and `message`, etc.) and return sensible 400s with clear error messages
   — don't let it crash on malformed input.

3. **`feedback.js`** — `generateFeedback(state)`, an async function that
   sends the full conversation history + candidate data to Claude with a
   prompt asking for structured feedback in the exact shape:
   `{ summary, strengths: [], gaps: [], next: [] }`. Parse the LLM response
   as JSON (handle parse failures gracefully — retry once or fall back to a
   safe default rather than crashing the final response).

4. **`server.js`** — Express app setup, mounts the route, CORS enabled for
   the frontend's origin, a basic health-check route (`GET /health`), and
   binds to `process.env.PORT`.

5. **Deployment** — set this up for Render (not Vercel — serverless breaks
   our in-memory session store, see `00_SHARED_CONTEXT.md` section 2).
   Document the required env vars (`ANTHROPIC_API_KEY`, `PORT`,
   `FRONTEND_ORIGIN`) in a `.env.example` and in the README. Make sure
   `.env` is in `.gitignore`.

6. **Testing** — write a short set of curl or Postman examples covering:
   start interview → a few turns → completion with feedback, and the error
   cases (missing sessionId, unknown sessionId on a follow-up call). Put
   these in a `TESTING.md` or in the README.

**Don't:**
- Don't touch `interviewEngine.js` internals — treat it as a black box
  matching the contract.
- Don't create git commits — I'll commit manually.
- Don't over-engineer the session store into a real DB — in-memory Map is
  intentional and sufficient for this scope.

**Work in phases, check in with me between them:**
1. Scaffold `server.js` + `sessionStore.js` + basic route wiring (can stub
   `interviewEngine` calls with dummy responses until teammate's file
   exists), confirm the request/response shapes match the spec exactly.
2. Wire in real `interviewEngine` calls once teammate's module is ready.
3. `feedback.js` implementation.
4. Deployment + testing + docs.

When you get to actual interview-flow or feedback-generation logic, walk me
through your approach before writing the full implementation — I want to
understand the design, not just have it appear.
