# ABTalks Interview Agent — Current Project Status

**Date:** 2026-08-08
**Audit method:** live inspection of the actual repo + `git` state, plus executed build/test/E2E verification (no source code modified, nothing committed or pushed).

---

## 1. Executive Summary

| Item | Status |
|---|---|
| Git synchronization (local ↔ GitHub) | ✅ SYNCHRONIZED — local `main` == `origin/main` == `378cfbc`, working tree clean |
| Overall project completion | **~60%** (backend/agent solid; frontend→backend integration not done; no deployment) |
| Backend builds | ✅ YES — `mvn clean test` → BUILD SUCCESS, 6/6 tests pass |
| Frontend builds | ✅ YES — `npm run build` (tsc + vite) succeeds |
| Backend + frontend integrated | ❌ **NO — the frontend currently runs entirely on a mock client; it never calls the backend** |
| Interview flow works end-to-end | ⚠️ PARTIAL — the backend flow works (verified: start → 8 questions → done → feedback), but the app a user sees runs on canned mock data, not the real engine |
| Claude API integration | ⚠️ **NOT VERIFIED** — no `ANTHROPIC_API_KEY` configured; engine silently falls back to template questions when Claude is unavailable |
| Feedback generation | ⚠️ PARTIAL — contract shape correct, but `FeedbackService` returns a **hardcoded placeholder** (not real, Claude-based feedback) |
| Deployment ready | ❌ **NO** — no Render/Railway/Vercel config, no deployed URLs, no production env vars |
| Biggest remaining blockers | 1) Frontend not wired to backend (mock only); 2) real feedback not implemented; 3) live Claude + deployment unconfigured |

---

## 2. Team Ownership

| Contributor | Responsibility | Current Status | Evidence | Remaining Work |
|---|---|---|---|---|
| **Radhika** | Spring Boot Backend (controller, session, feedback, Claude transport, config, deployment) | **DONE (code) / PARTIAL (feedback is placeholder)** — backend builds, API verified E2E, health OK, CORS OK. FeedbackService not wired to Claude; no deployment config; no backend unit tests. | `InterviewController.java`, `SessionStore.java`, `FeedbackService.java`, `ClaudeService.java`, `WebConfig.java`, `HealthController.java`, `application.yml`, commits `f950026`, `378cfbc` | Real feedback generation; deployment (Render + env vars); optional controller/feedback tests; remove dead models |
| **Palak** | Interview Agent / Engine (day selection, prompts, question gen, follow-ups, counts) | **DONE** — real engine, code-enforced 8-question / 4-day minimums, fallback path, 6 passing JUnit tests + standalone self-test. Caveat: tests use a *custom* curriculum whose day numbers differ from `curriculum.json`. | `InterviewEngine.java`, `InterviewEngineTest.java`, `SelfTestMain.java`, commit `d936aeb` (merged via `8cc9d20`) | Reconcile the curriculum day-numbering between tests / frontend mock data and `curriculum.json`; end-to-end verify with a real Claude key |
| **Priya** | Frontend (React UI, chat, feedback screen, API integration) | **DONE (UI) / NOT DONE (integration)** — polished UI, landing page, chat, candidate picker, feedback card; production build passes. But the app is bound to `mockInterview` — the real API client exists but is unused. | `frontend/src/pages/Interview.tsx`, `src/lib/interview.ts`, `src/lib/api.ts`, `src/lib/mockInterview.ts`, commits `10263d0`, `b3f9c45`, `4f5e8d9`, `f0437b2`, `e387d49` | Switch `sendInterviewRequest` to the real client; fix backend URL; reconcile candidate curriculum day numbers; build a `.env.local`; point to deployed backend |

---

## 3. Backend Status — Radhika

### 3.1 Per-item verification

| Item | Status | Evidence | Problem | Remaining work |
|---|---|---|---|---|
| Spring Boot setup | ✅ DONE | `backend/pom.xml` — `spring-boot-starter-parent` 3.3.5, web + validation starters | — | — |
| Maven configuration | ✅ DONE | `backend/pom.xml` (java.version 21, anthropic-java 2.34.0, spring-boot-maven-plugin); root aggregator `pom.xml` added so `mvn` works from repo root | — | — |
| Main application class | ✅ DONE | `backend/src/main/java/com/hackathon/interview/InterviewApplication.java` — `@SpringBootApplication`, single entry point | — | — |
| Controller | ✅ DONE | `InterviewController.java` — start / follow-up / complete; validates exactly-one-of candidate|message; preserves session across turns | — | — |
| SessionStore | ✅ DONE | `session/SessionStore.java` — `ConcurrentHashMap`, `create/get/update/remove` | In-memory only (by design); lost on restart — must run as long-lived server | — |
| FeedbackService | ⚠️ **PARTIAL (placeholder)** | `FeedbackService.java` — returns hardcoded strings; Javadoc: "real feedback generation lands in Milestone 3" | Not wired to Claude; demo feedback is visibly fake | Implement Claude-based feedback (prompt → `{summary, strengths, gaps, next}`, parse + fallback) |
| ClaudeService | ✅ DONE (code) / ⚠️ NOT VERIFIED (live) | `ClaudeService.java` — official `anthropic-java` SDK, `complete()`/`sendMessage()`, `ClaudeApiException`; no-arg constructor for test stubs | No `ANTHROPIC_API_KEY` configured in env → runtime warns and calls fail | Test with a real key; confirm model `claude-haiku-4-5-20251001` works for interview turns |
| DTOs | ✅ DONE | `dto/InterviewRequest`, `InterviewResponse`, `Feedback`, `ErrorResponse` | — | — |
| Shared models | ✅ DONE (engine set) | `model/Candidate`, `CandidateMember`, `CandidateMission`, `CandidateSignals`, `InterviewSession`, `ChatMessage`, `CurriculumDay` | **Duplicate/dead models:** `model/Member`, `Mission`, `Signals` are unused leftovers | Delete `Member.java`, `Mission.java`, `Signals.java` |
| Exception handling | ✅ DONE | `GlobalExceptionHandler.java` + `SessionNotFoundException`, `ClaudeApiException` — 400/404/502/500 | `ClaudeApiException`→502 path is currently **unreachable**: `InterviewEngine.askClaude` catches all exceptions and falls back | Only matters once FeedbackService calls Claude directly |
| CORS | ✅ DONE | `config/WebConfig.java` — origins from `FRONTEND_URL`, methods GET/POST/OPTIONS, path `/api/**` | — | Set `FRONTEND_URL` at deploy time |
| Health endpoint | ✅ DONE (verified) | `HealthController.java` — `GET /health` → 200 "OK" | — | — |
| Configuration | ✅ DONE | `config/InterviewEngineConfig.java` (engine bean), `service/CurriculumLoader.java` (loads `curriculum.json`) | — | — |
| Environment variables | ✅ DONE | `application.yml`: `PORT`, `FRONTEND_URL`, `ANTHROPIC_API_KEY`, `CLAUDE_MODEL` | No `backend/.env.example` (README references one that doesn't exist) | Add `backend/.env.example` |
| Tests | ⚠️ PARTIAL | `mvn clean test` → 6/6 pass (`InterviewEngineTest`) | **No controller, session, or feedback tests** (no `@WebMvcTest`, no MockMvc, no FeedbackServiceTest) | Add controller integration tests + feedback tests |
| API contract | ✅ DONE (verified E2E) | Contract matches exactly (see §6) | — | — |
| Session persistence across turns | ✅ DONE (verified) | Controller stores/updates the session each turn; 8-turn E2E run completed | — | — |
| Feedback flow | ⚠️ PARTIAL | Final response returns `{summary, strengths, gaps, next}` but with placeholder content | See FeedbackService | Implement real generation |

### 3.2 Backend problems

- **No real feedback.** `FeedbackService.generateFeedback` is a stub → the "feedback" judges see is canned text.
- **Dead code:** `Member`, `Mission`, `Signals` models are unused (compile cleanly, just noise).
- **No backend integration tests** — only the engine is unit-tested; controller/error/session paths are only manually verified.
- **Deployment config absent** (no `render.yaml`/`Dockerfile`/`railway.json`).
- `candidates.json` has `"experience": "1 year"` (string) but `CandidateMember` declares `int experience` — the resource file is never loaded by the app, but the shapes are inconsistent with the contract types.

---

## 4. Interview Agent Status — Palak

| Item | Status | Evidence / location |
|---|---|---|
| Candidate weak-spot selection | ✅ DONE | `InterviewEngine.selectTargetDays()` — skipped missions first, then high-attempt failures, then first-try passes, padded from curriculum to ≥4; capped at 6 target days |
| Curriculum integration | ✅ DONE (with caveat) | `CurriculumLoader` loads real `curriculum.json` (days 1–31, 8 modules); questions grounded in day title/objectives/tools. **Caveat:** `TestCurriculum` + frontend mock candidates use a *different* day numbering (day5=RAG, day8=Agents) than the real `curriculum.json` (day5=NumPy arrays, day8=Visualization) — tests pass only because they feed the custom curriculum |
| Claude question generation | ✅ DONE (code) / ⚠️ NOT VERIFIED (live) | `askClaude()` builds system prompt + history + an ephemeral `INTERVIEWER INSTRUCTION` directive, calls `claudeService.complete(...)` |
| Adaptive follow-ups | ✅ DONE | `planNext()` — budget 2 questions on weak days / 1 on easy days during coverage, then a "deepening" cycle; prompts instruct probing follow-ups |
| Conversation history | ✅ DONE | `session.history` maintained and passed to Claude each turn (verified: `FakeClaudeService` records the candidate answers + directives) |
| Question counting | ✅ DONE | `questionCount` incremented in Java; never trusted to the LLM |
| Minimum 8 questions | ✅ DONE | `MIN_QUESTIONS = 8`; `planNext` wraps up only when `questionCount >= 8` (verified: exactly 8 then `done:true`) |
| Minimum 4 curriculum days | ✅ DONE | `MIN_DAYS = 4`; wrap-up requires `askedDays.size() >= 4` |
| Completion logic | ✅ DONE | `DONE_REPLY = "Interview completed."`; phase → `PHASE_DONE`; re-turns on a finished session return done with no new question |
| Fallback behaviour | ✅ DONE | `catch (Exception) → fallbackQuestion()` — interview survives a Claude outage (tested via `ThrowingClaudeService`) |
| Session mutation / persistence assumptions | ✅ DONE | Mutates `session` in place; controller persists the same object via `updateSession` (previously a null-NPE bug, fixed in the merge) |
| Integration with controller | ✅ DONE (verified) | E2E run: start → 8 turns → `done:true` → feedback returned |
| Tests | ✅ DONE | 6 JUnit tests + standalone `SelfTestMain` (8 checks) | 

**Assumption mismatch (important):** the engine tests and the frontend mock candidates assume a curriculum where day 5 = "RAG Fundamentals", day 8 = "Agents", day 12 = "Evaluation", day 15 = "Fine-tuning". The **real** `curriculum.json` maps those day numbers to **NumPy arrays / Visualization / ML pipeline / Overfitting**. When the frontend is wired to the real backend, candidates' day numbers will be interpreted against the real AI Cohort curriculum, so question topics will not match the labels in the frontend mock data. This must be reconciled before the E2E demo (see §10 P1-2).

---

## 5. Frontend Status — Priya

| Item | Status | Evidence / location |
|---|---|---|
| Candidate selection | ✅ DONE | `src/components/CandidatePicker.tsx`, `src/lib/candidates.ts` (3 hardcoded candidates with weak-spot badges) |
| Interview UI | ✅ DONE | `src/pages/Interview.tsx`, chat bubbles, input, typing indicator, empty/error states, header, theme toggle, landing page |
| API client | ✅ DONE (code) / ❌ **UNUSED** | `src/lib/api.ts` — `postInterview()` calls `POST {VITE_API_URL}/api/interview`. **Never imported by the app** |
| Backend URL configuration | ⚠️ PARTIAL | `VITE_API_URL` from `import.meta.env`, default `http://localhost:3000`; `.env.example` sets `http://localhost:3000`. **Backend default port is 8080, not 3000** → even when wired, the default URL is wrong |
| Start interview request | ⚠️ **NOT WIRED** | Goes through `sendInterviewRequest` → `mockInterview` (`src/lib/interview.ts` line 12) |
| Follow-up request | ⚠️ **NOT WIRED** | Same mock seam |
| Response handling | ✅ DONE | Handles `reply`, `done`, `feedback`; appends assistant message; transitions phases |
| Completion handling | ✅ DONE | On `done`, sets feedback + "done" phase; offers "Start a new interview" |
| Feedback UI | ✅ DONE | `src/components/FeedbackCard.tsx` renders summary/strengths/gaps/next |
| Loading state | ✅ DONE | `busy` flag, `TypingIndicator` |
| Error handling | ✅ DONE | `ErrorState` with retry; network errors surface the status text |
| Environment variables | ⚠️ PARTIAL | `frontend/.env.example` exists (single var, wrong default port); no `.env.local` in repo (expected — gitignored) |
| Production build | ✅ DONE (verified) | `npm run build` (tsc -b + vite build) → success, 38 modules, `dist/` generated |

**Key gap:** `src/lib/interview.ts` comment says "Milestone 2: switch App.tsx to use `sendInterviewRequestReal`" — **that switch was never made.** The entire app runs against `mockInterview` (canned replies + mock feedback). No part of the running UI talks to the Spring Boot backend, the real engine, or Claude.

---

## 6. API End-to-End Contract

Verified by running the actual backend and exercising every path (no code changed):

| Contract element | Spec | Actual | Match |
|---|---|---|---|
| Endpoint | `POST /api/interview` | `InterviewController @PostMapping` | ✅ |
| Start request | `{sessionId, candidate}` | `InterviewRequest(sessionId, candidate, message)` | ✅ |
| Follow-up request | `{sessionId, message}` | same record | ✅ |
| Start response | `{reply, done:false}` | `done:false`, reply is the opening question | ✅ |
| Turn responses | `{reply, done:false}` | correct | ✅ |
| Final response | `{reply:"Interview completed.", done:true, feedback:{summary,strengths,gaps,next}}` | verified — exact `"Interview completed."`, `done:true`, feedback object present | ✅ |
| `sessionId` handling | reuse across turns | session preserved in `ConcurrentHashMap` across all 8 turns | ✅ |
| `candidate` handling | start only; rejects combined `candidate`+`message` | both-fields → **400** | ✅ |
| `message` handling | follow-up only; rejects empty body | missing both → **400** | ✅ |
| Error responses | non-2xx with `{"error":"..."}` | 400 (validation / malformed JSON / both-or-neither), 404 (unknown session) verified | ✅ |
| Missing `sessionId` | 400 | verified **400** | ✅ |
| Unknown session | 404 | verified **404** | ✅ |
| 502 on Claude failure | spec'd in handler | **unreachable today** — engine falls back instead | ⚠️ (by design; only matters for feedback) |

**No contract mismatches found.** One note: the interview "completes" after exactly 8 questions when using a 4-mission candidate with weak spots (matches the 8-question minimum requirement; the engine wraps at `questionCount >= 8 && askedDays.size() >= 4`).

---

## 7. Current Build & Test Status

### Backend
- **Command:** `mvn clean test` (from `backend/`; also works from repo root via aggregator `pom.xml`)
- **Result:** ✅ **BUILD SUCCESS**
- **Compilation:** 27 source files, Java 21
- **Tests:** 6 run, 6 passed, 0 failures, 0 errors (`InterviewEngineTest`)
- **Warnings:** `ANTHROPIC_API_KEY is not set. … Claude API calls will fail at runtime.` — expected; app still boots
- **E2E (manual):** started on port 18082 → `/health` 200; start 200; 8 turns → `done:true`; error cases all correct; instance stopped

### Frontend
- **Command:** `npm ci` then `npm run build` (tsc -b && vite build)
- **Result:** ✅ **SUCCESS** — vite 8.2.1, 38 modules transformed, `dist/` built (index.html 1.56 kB, JS 218 kB / 67 kB gzip, CSS 24.7 kB)
- **Errors:** none (after dependencies installed)
- **Note:** this shell has `NODE_ENV=production`, which makes npm skip devDependencies — `npm ci` needed `NODE_ENV=development` (or `--include=dev`). This is an environment quirk, not a project defect.

---

## 8. Git / Collaboration Status

| Item | State |
|---|---|
| Current branch | `main` (tracks `origin/main`) |
| Local HEAD | `378cfbc` — "Merge pull request #1 from priyacha123/main" |
| Remote tracking | `origin/main` == local == `378cfbc` ✅ fully synchronized |
| Working tree | **CLEAN** — no uncommitted changes |
| Merge conflicts | **NONE** (no conflict markers anywhere; prior conflicts resolved in commit `8cc9d20`) |
| Ahead / behind | Local neither ahead nor behind `origin/main` |
| Local-only work | NONE (clean tree) |
| Remote-only work | `upstream/main` = `c50d57c` — one *cosmetic* merge commit ahead of origin, **same file content** (`git diff origin/main upstream/main` empty). `palak/main` = `d936aeb` — already merged into history |
| Duplicate / conflicting implementations | ⚠️ Duplicate model classes: `Member`/`Mission`/`Signals` (unused) vs `CandidateMember`/`CandidateMission`/`CandidateSignals` (used). Curriculum numbering mismatch between `TestCurriculum`/frontend mocks and `curriculum.json` (see §4) |
| Suspicious / unfinished files | `.gitignoregit` — empty tracked file (typo). `.idea/workspace.xml` + `backend/.idea/*` — IDE files committed during the merge; should be gitignored |

**Categorization:** all shared/merged work is on `origin/main` (**BOTH / SYNCHRONIZED**). No content is local-only or origin-only; `upstream/main` is content-identical to origin plus a merge wrapper.

---

## 9. Deployment Status

| Item | Status | Evidence / note |
|---|---|---|
| Render / Railway config | ❌ NOT FOUND | no `render.yaml`, `railway.json`, `Dockerfile`, `Procfile` anywhere |
| Vercel config | ❌ NOT FOUND | no `vercel.json` in `frontend/` |
| PORT handling | ✅ DONE | `application.yml`: `port: ${PORT:8080}` (Render injects `PORT`) |
| Frontend origin / CORS | ✅ DONE (config) | `WebConfig` reads `FRONTEND_URL` (default `http://localhost:5173`) |
| Claude API key | ⚠️ NOT VERIFIED | `ANTHROPIC_API_KEY` read by `ClaudeService`; no key set in this environment |
| Production frontend API URL | ❌ NOT SET | `VITE_API_URL` must be baked at build time; `.env.example` default is wrong (port 3000) |
| Backend build command | ⚠️ PARTIAL | documented in `backend/README.md` (`mvn spring-boot:run`); works locally |
| Backend start command | ⚠️ PARTIAL | `mvn spring-boot:run`; must run as a long-lived server (in-memory sessions) — documented |
| Frontend build command | ✅ DONE | `npm run build` verified |
| `.env.example` | ⚠️ PARTIAL | `frontend/.env.example` exists (wrong port default); **no `backend/.env.example`** despite README reference |
| `.gitignore` | ✅ DONE | root + `frontend/.gitignore` ignore `node_modules`, `dist`, `.env`; backend artifacts covered by root (`/backend/target/`, `*.class`) |
| README deployment instructions | ⚠️ PARTIAL | `backend/README.md` covers run/env/contract but **no actual deployment steps**; frontend README is the stock Vite template; **no root README** |
| Cold-start note | ⚠️ NOT PRESENT | shared-context says to document Render free-tier cold start so judges aren't confused — not in any README |

---

## 10. Critical Problems

### P0 — Blocks the demo

**P0-1 · Frontend is not connected to the backend (mock only)**
- **What:** The entire UI runs on `mockInterview` — canned replies and mock feedback. No request ever reaches Spring Boot, the InterviewEngine, or Claude.
- **Files:** `frontend/src/lib/interview.ts` (line 12), `frontend/src/pages/Interview.tsx` (line 11)
- **Owner:** Priya
- **Why it matters:** Without this, there is no working product — only a mockup. A live demo must show the real engine answering.
- **Fix:** Switch `sendInterviewRequest` to `postInterview` (or bind `sendInterviewRequestReal` in `interview.ts`), fix the backend URL, and add a `.env.local`.
- **Dependency:** needs a running backend + a known URL (see P1-3).

### P1 — Important

**P1-1 · Feedback generation is a placeholder**
- **What:** `FeedbackService.generateFeedback` returns hardcoded strings; no Claude call, no parsing, no fallback.
- **File:** `backend/src/main/java/com/hackathon/interview/service/FeedbackService.java`
- **Owner:** Radhika
- **Why it matters:** "Generate structured interview feedback" is an explicit requirement; the demo will show "Placeholder summary…" text.
- **Fix:** Implement Claude-based feedback (system prompt over session history → `{summary, strengths, gaps, next}`), with parse/fallback like the engine's.
- **Dependency:** none (code-side); needs API key to verify.

**P1-2 · Curriculum day-numbering mismatch between frontend mocks / tests and `curriculum.json`**
- **What:** Frontend `CANDIDATES` and `TestCurriculum` use day5=RAG, day8=Agents, day12=Evaluation, day15=Fine-tuning; the real `curriculum.json` maps those days to NumPy arrays / Visualization / ML pipeline / Overfitting.
- **Files:** `frontend/src/lib/candidates.ts`, `backend/src/test/.../TestCurriculum.java` vs `backend/src/main/resources/curriculum.json`
- **Owner:** Palak (engine/tests) + Priya (mock candidates) — coordinate
- **Why it matters:** Once wired, a candidate whose mission says "RAG Fundamentals" (day5) will be asked about NumPy arrays. Confusing and wrong for judges.
- **Fix:** Make the mock candidates use the real AI Cohort day numbers (like `backend/src/main/resources/candidates.json`), or agree on one canonical curriculum.
- **Dependency:** before/with P0-1.

**P1-3 · No Claude API key / live LLM path unverified**
- **What:** `ANTHROPIC_API_KEY` unset; engine's fallback silently masks failures, so "adaptive" questions can be template questions without anyone noticing.
- **File:** `backend/src/main/resources/application.yml` (env wiring)
- **Owner:** Radhika (config) — key from team
- **Why it matters:** The demo must show real Claude-generated adaptive questions and feedback.
- **Fix:** Set `ANTHROPIC_API_KEY` (and `CLAUDE_MODEL`) locally and in Render; run a full 8-turn live interview and read the replies.
- **Dependency:** none.

### P2 — Nice to fix

**P2-1 · Dead models** — `model/Member.java`, `Mission.java`, `Signals.java` unused → delete. **Owner:** Radhika.
**P2-2 · `VITE_API_URL` default is port 3000, backend is 8080** — fix `.env.example` (and the fallback in `api.ts`) to `http://localhost:8080`. **Owner:** Priya.
**P2-3 · Stray committed files** — `.gitignoregit` (empty), `.idea/workspace.xml`, `backend/.idea/*` committed. Add `**/.idea/` to `.gitignore` and `git rm --cached` the IDE files. **Owner:** Radhika (or whoever commits).
**P2-4 · Doc drift** — `docs/00_SHARED_CONTEXT.md` references `com/abtalks/interview`, `InterviewEngineService` interface, `application.properties`; actual code is `com/hackathon/interview`, concrete `InterviewEngine` class, `application.yml`. `backend/README.md` still calls the engine a "temporary stub". Update docs to reality. **Owner:** Radhika.
**P2-5 · No backend `.env.example`** — README references one. **Owner:** Radhika.
**P2-6 · No controller/feedback/session tests** — add minimal MockMvc + FeedbackService tests. **Owner:** Radhika.
**P2-7 · No deployment artifacts** — `render.yaml`/`Dockerfile`/`vercel.json` + README deploy steps. **Owner:** Radhika (backend) / Priya (frontend).
**P2-8 · `candidates.json` shape mismatch** — `"experience": "1 year"` (string) vs `CandidateMember(int)`; file is unused but should match the contract. **Owner:** Radhika.

---

## 11. What Each Person Should Do NEXT

### Radhika — NEXT STEPS
1. **Implement real feedback** in `FeedbackService.java` — build a Claude prompt from `session.getHistory()` and parse `{summary, strengths, gaps, next}` with a fallback. Add a `FeedbackServiceTest`.
2. **Add a controller/MockMvc test** covering start → 8 turns → done → feedback, plus the 400/404 paths (locks the contract so Priya can integrate safely).
3. **Set up deployment for the backend** (Render web service): `render.yaml` or manual config — build `mvn clean package`, start `mvn spring-boot:run` (or `java -jar target/interview-agent-0.1.0.jar`), env: `PORT`, `FRONTEND_URL`, `ANTHROPIC_API_KEY`, `CLAUDE_MODEL`. Document cold-start behavior.
4. **Cleanup (low priority):** delete `Member/Mission/Signals`, add `backend/.env.example`, remove `.idea/` from git, fix doc drift.

### Palak — NEXT STEPS
1. **Reconcile the curriculum day numbers** so the real `curriculum.json` is the single source of truth. Update `TestCurriculum` and (with Priya) the frontend mock candidates to real AI Cohort days (or agree on one mapping).
2. **Verify the engine against the real `curriculum.json`** — add a test that loads the actual classpath resource (via `CurriculumLoader`) instead of the in-code `TestCurriculum`.
3. **Run one live 8-turn interview** with a real `ANTHROPIC_API_KEY` and confirm questions are Claude-generated, adaptive, and grounded in the right day topics (coordinate with Radhika for the key).
4. **NO further engine feature work unless the demo exposes a gap** — the core (8Q/4D, fallback, adaptive) is complete.

### Priya — NEXT STEPS
1. **Wire the real API client** — in `frontend/src/lib/interview.ts`, bind `sendInterviewRequest` to `postInterview` (or export/import `sendInterviewRequestReal`), and confirm `Interview.tsx` uses it. Keep the mock as a fallback flag (`VITE_USE_MOCK`).
2. **Fix the backend URL** — set `VITE_API_URL=http://localhost:8080` in `.env.example`, and point the fallback in `api.ts` at 8080. Create a local `.env.local` for testing.
3. **Align candidate data with the real curriculum** (with Palak): update `candidates.ts` to use real AI Cohort day numbers/titles so questions match the profile badges.
4. **Add Vercel config** (`vercel.json`) + production API URL wiring (build-time `VITE_API_URL`), and test the built `dist/` against the deployed backend.

---

## 12. Recommended Team Execution Order

**PHASE 1 — Backend build + contract lock**
- Owner: Radhika
- Goal: Backend already builds/tests (verified). Lock the contract with a MockMvc E2E test and get a runnable instance on a known local URL (8080).
- Dependency: none.

**PHASE 2 — Agent reconciliation**
- Owner: Palak (with Priya input)
- Goal: Make `TestCurriculum` + frontend mock candidates use the real `curriculum.json` day numbers; add a test that loads the real resource. Verify live Claude questions once a key is available.
- Dependency: none (can run parallel with Phase 1).

**PHASE 3 — Frontend integration**
- Owner: Priya
- Goal: Switch `sendInterviewRequest` to `postInterview`; fix `VITE_API_URL`; verify the UI drives a real backend interview start→8 turns→done→feedback.
- Dependency: Phase 1 (running backend + known URL); Phase 2 (correct day numbers) ideally.

**PHASE 4 — Real feedback + live E2E**
- Owner: Radhika (+ Palak to verify questions)
- Goal: Replace placeholder `FeedbackService`; run the full flow with a real `ANTHROPIC_API_KEY`; confirm Claude-generated questions and feedback.
- Dependency: Phase 3 (frontend wired) so the E2E is through the UI.

**PHASE 5 — Deployment**
- Owner: Radhika (backend/Render) + Priya (frontend/Vercel)
- Goal: Deploy backend (web service, env vars) and frontend (`VITE_API_URL` → deployed backend, CORS via `FRONTEND_URL`); verify `/health` and a remote interview.
- Dependency: Phase 3/4 working locally.

**PHASE 6 — Final demo verification**
- Owner: all three
- Goal: Fresh candidate → 8+ questions across 4+ days, adaptive follow-ups visible, real feedback, no console/server errors; write the root README; rehearse.
- Dependency: Phases 1–5.

---

## 13. Definition of Done

### Backend
- [x] Spring Boot builds (`mvn clean test` green)
- [x] API works (verified start/turns/done/errors)
- [x] Session persists between turns (verified 8-turn run)
- [x] Claude integration **code** wired
- [ ] Claude integration **verified with a real key**
- [ ] Feedback is real (not placeholder)
- [ ] Error handling works (verified 400/404; 502 path to be exercised via feedback)

### Agent
- [x] Weak spots selected (skipped → high-attempt)
- [x] Curriculum grounded (real `curriculum.json`)
- [x] Adaptive questions (follow-ups + deepening)
- [x] 8-question minimum enforced in code (verified)
- [x] 4-day minimum enforced in code
- [x] Completion works (`Interview completed.`)
- [x] Fallback works (Claude-down survives)
- [ ] Tests use the real curriculum (not just `TestCurriculum`)

### Frontend
- [x] Candidate selection
- [x] Start interview (UI)
- [x] Send answers (UI)
- [x] Receive questions (UI — but from **mock**, not backend)
- [ ] Completion via real backend
- [ ] Feedback from real backend
- [x] Error/loading states (UI)
- [x] Production build

### Integration
- [ ] Frontend → backend works (P0-1)
- [ ] Backend → Claude works (live key)
- [ ] Session survives multiple turns (backend verified; through-UI pending)
- [ ] Final feedback returned correctly (shape verified; content pending)

### Deployment
- [ ] Backend deployed (Render) + env vars configured
- [ ] Frontend deployed (Vercel) + production `VITE_API_URL`
- [ ] CORS configured for production origin
- [ ] `.env.example` corrected (backend added, frontend port fixed)

### Demo
- [ ] Fresh candidate can start (through the UI → real backend)
- [ ] At least 8 questions (verified at API level)
- [ ] At least 4 curriculum days (verified at API level)
- [ ] Adaptive follow-ups visible (pending live Claude)
- [ ] Feedback generated (real content)
- [ ] No console/server errors

---

## 14. Final Verdict

**Current project stage: ~60%**

**Genuinely working (verified this audit):**
- Backend compiles, tests pass (6/6), app boots, `/health` OK.
- Full API contract works end-to-end: start → exactly 8 questions → `done:true` → correct final JSON with feedback shape; all error codes correct.
- Engine is real and code-enforced: weak-spot selection, day coverage, question/days minimums, fallback.
- Frontend UI is polished and builds for production.

**Only looks completed but is NOT verified:**
- **Claude integration** — no API key anywhere; every "adaptive" question so far is the template fallback.
- **Feedback** — contract present, content is placeholder.
- **Frontend→backend** — the app a judge would open is running canned mock data.

**What is broken / blocking:**
- Frontend never calls the backend (P0).
- Feedback placeholder (P1).
- Curriculum day-number mismatch between mocks/tests and `curriculum.json` (P1).
- No deployment at all (P1/P2).

**Biggest risk before demo:** presenting the polished mock UI as a working product — if the team wires it now, the curriculum mismatch and placeholder feedback will show up; if they don't wire it, there's no real product at all.

**Single most important next action:** **Priya flips `sendInterviewRequest` to `postInterview` and runs one real interview against the local backend on port 8080.** Everything else (feedback, Claude, deploy) becomes verifiable once the app genuinely talks to the backend.

---

## Final Terminal Summary

1. **Git synchronized:** YES (local `main` == `origin/main` == `378cfbc`, clean tree)
2. **Backend builds:** YES (`mvn clean test` → BUILD SUCCESS, 6/6)
3. **Frontend builds:** YES (`npm run build` succeeds)
4. **End-to-end interview works:** NO (backend API works standalone; the UI runs on mock data — not connected)
5. **Claude API works:** NOT VERIFIED (no `ANTHROPIC_API_KEY`; engine uses template fallback)
6. **Feedback works:** PARTIAL (shape correct; content is placeholder)
7. **Biggest blocker:** Frontend never calls the backend (`frontend/src/lib/interview.ts` still bound to `mockInterview`)
8. **Radhika's next task:** Implement real Claude-based feedback in `FeedbackService.java` + add a MockMvc contract test
9. **Palak's next task:** Reconcile `TestCurriculum` and frontend mock candidates with the real `curriculum.json` day numbers; add a test that loads the real resource
10. **Priya's next task:** Switch `sendInterviewRequest` → `postInterview` and set `VITE_API_URL` to `http://localhost:8080`
11. **Exact next command Radhika should run:**
    ```
    cd backend
    $env:ANTHROPIC_API_KEY="sk-ant-..."   # real key
    mvn spring-boot:run
    ```
    then `curl http://localhost:8080/health` (expect `OK`).
