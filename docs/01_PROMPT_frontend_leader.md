# Claude Code Prompt — Frontend (Leader)

Paste this into Claude Code at the start of your session, in the repo root.

---

I'm building the frontend for an AI Interview Agent hackathon project. Read
`00_SHARED_CONTEXT.md` in this repo first — it has the full architecture,
API contract, and repo structure. Follow it exactly; don't invent a
different API shape.

**My scope:** `/frontend` only. Do not create or edit anything under
`/backend`.

**What to build:**

A chat-style React (Vite) interface that:
1. On load, starts an interview: generates a `sessionId` (e.g. `crypto.randomUUID()`),
   sends `POST /api/interview` with `{ sessionId, candidate }` — for now, use
   a hardcoded sample candidate object from `candidates.json` (I'll wire up
   real candidate selection later if time permits), and renders the first
   `reply` as a chat bubble.
2. Shows a text input for the user to respond. On submit, sends
   `POST /api/interview` with `{ sessionId, message }`, appends both the
   user's message and the `reply` to the chat.
3. Handles `done: true` — when it arrives, stop showing the input and render
   the `feedback` object (`summary`, `strengths`, `gaps`, `next`) as a clean
   summary card instead of a chat bubble.
4. Loading state while waiting for a response (typing indicator or spinner).
5. Empty state before the interview starts.
6. Error handling if the backend call fails (network error, non-200) — show
   a retry option, don't just break silently.
7. Responsive layout, but no need to over-design — clean and functional over
   fancy.

**Backend URL:** for now, hit `http://localhost:PORT/api/interview` via an
env variable (`VITE_API_URL`) so it's easy to swap for the deployed backend
URL later — don't hardcode localhost.

**Don't:**
- Don't implement any interview logic client-side — you only ever send/
  receive per the contract in `00_SHARED_CONTEXT.md`.
- Don't touch `/backend`.
- Don't create git commits — I'll commit manually.

**Work in phases, check in with me between them:**
1. Basic chat UI skeleton with mock data (no real API calls yet) — show me
   before wiring up the real endpoint.
2. Wire up real API calls + loading/error states.
3. Feedback screen + polish.

Ask me if anything about the candidate data shape or API contract is
unclear before assuming.
