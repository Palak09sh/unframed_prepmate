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

- Backend: **Java 17 + Spring Boot 3** (Spring Web), Maven
- Frontend: React (Vite)
- LLM: Claude API (Anthropic) — called via Spring's `RestClient`/`WebClient`
  with raw HTTP (there's no official Anthropic Java SDK, so this is a plain
  REST call to `api.anthropic.com`). Use Haiku for interview turns, same/
  stronger model ok for feedback generation.
- Session storage: in-memory store — a `ConcurrentHashMap<String,
  InterviewSession>` wrapped in a `@Service` singleton bean. No database.
- **Deployment: Render or Railway (a real running JVM process), NOT a
  serverless platform.** Serverless = new instance per request = in-memory
  session state wiped between calls = interview breaks after message 1.
  This is non-negotiable for this architecture. Note: JVM cold starts are
  slower than Node's — if using Render free tier, expect a slow first
  request after idle; mention this in the README so judges aren't confused.

**Important — this changes the earlier Node.js plan:** since Radhika's
route/session/feedback code and Friend2's interview-engine code now live in
the *same Spring Boot app* (not separate JS modules), Friend2's part is
also written in Java, as a Spring `@Service` bean — not a standalone JS
file. Same logical split of ownership, different implementation language.

## 3. Repo structure

```
/frontend                                          → Leader owns this entirely
/backend  (single Maven Spring Boot project)
  /src/main/java/com/abtalks/interview
    /controller/InterviewController.java            → Radhika owns
    /service/InterviewEngineService.java             → Friend2 owns (the agent core)
    /service/FeedbackService.java                    → Radhika owns
    /session/SessionStore.java                       → Radhika owns
    /model/InterviewSession.java                     → shared model, agree together before editing
    /model/Candidate.java, CurriculumDay.java, etc.  → shared models
  /src/main/resources/curriculum.json
  /src/main/resources/application.properties
  pom.xml
PROMPTS.md
README.md
```

**Rule: don't edit files outside your own list above.** If you need a
change in someone else's file (including shared `/model` classes), ask them
— don't just edit it.

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

## 5. Internal contract between Friend2 (engine) and Radhika (controller)

This is the interface both of you must implement exactly — agree on any
change together before touching it.

**`InterviewEngineService` (Friend2) — interface both of you agree on:**

```java
public interface InterviewEngineService {

    // Called once, on the very first request for a sessionId.
    // Picks 4+ target curriculum days (prioritize days where the
    // candidate's mission has high `attempts` (3+) or `skipped: true` in
    // candidates.json — those are the weak spots worth probing). Cross-
    // reference curriculum.json for each day's title/objectives/tools to
    // ground the question. Builds the system prompt, generates the
    // opening question.
    StartResult startInterview(Candidate candidate);

    // Called on every subsequent turn. Decides: ask a follow-up on the
    // current day, move to the next target day, or wrap up.
    // Wrap up ONLY once questionCount >= 8 AND askedDays.size() >= 4 —
    // enforce this with an explicit check in code, don't rely on the LLM
    // to count correctly.
    TurnResult processTurn(InterviewSession session, String candidateMessage);
}

// returned from startInterview
record StartResult(InterviewSession session, String reply) {}

// returned from processTurn
record TurnResult(InterviewSession session, String reply, boolean done) {}
```

**`InterviewSession` (shared model — agree before editing):**

```java
public class InterviewSession {
    Candidate candidate;
    List<Integer> targetDays;   // >=4 day numbers, chosen deliberately
    List<Integer> askedDays;
    List<Message> history;      // {role: "user"|"assistant", content}
    int questionCount;
    String phase;               // "interviewing" or "done"
}
```

**`FeedbackService` (Radhika):**

```java
public interface FeedbackService {
    // Called once, when processTurn returns done = true.
    Feedback generateFeedback(InterviewSession session);
}

record Feedback(String summary, List<String> strengths,
                 List<String> gaps, List<String> next) {}
```

**`SessionStore` (Radhika):**

```java
public interface SessionStore {
    void createSession(String sessionId, InterviewSession session);
    InterviewSession getSession(String sessionId); // null/Optional if not found
    void updateSession(String sessionId, InterviewSession session);
}
```

**`InterviewController` (Radhika) — request flow:**

```
POST /api/interview
  if body has "candidate" (first call):
      StartResult r = engineService.startInterview(candidate)
      sessionStore.createSession(sessionId, r.session())
      respond { reply: r.reply(), done: false }
  else (has "message"):
      InterviewSession session = sessionStore.getSession(sessionId)
      // validate: 404/400 if session not found
      TurnResult r = engineService.processTurn(session, message)
      sessionStore.updateSession(sessionId, r.session())
      if r.done():
          Feedback feedback = feedbackService.generateFeedback(r.session())
          respond { reply: r.reply(), done: true, feedback }
      else:
          respond { reply: r.reply(), done: false }
```

Validate the request body (missing `sessionId`, missing both `candidate`
and `message`, unknown `sessionId` on a follow-up call) and return
sensible 400s with `@ControllerAdvice`/clear error responses — don't let
it throw an unhandled 500.

## 6. Data shapes we already have

- `curriculum.json` — 8 modules, days 1–31, each day has `title`, `type`,
  `tools`, `objectives`.
- `candidates.json` — each candidate has `member` (role, experience),
  `missions` (array of `{day, title, passed, attempts}` or `{day, title,
  skipped: true}`), and `signals` (commitDays, missionsCompleted,
  missionsFirstTry). Map these to Java records/POJOs via Jackson.

Weak-spot signal: high `attempts` (3+) or `skipped: true` on a mission = good
candidate for a probing follow-up question.

## 7. Checkpoints (commit manually, don't let Claude Code commit)

1. Project setup (Maven, folder structure, shared model classes) +
   interfaces locked
2. Interview engine: basic Q&A working end-to-end (no follow-up logic yet)
3. Follow-up logic + day-coverage enforcement
4. Feedback generation + full flow tested
5. Frontend polished + deployed + README/PROMPTS.md done