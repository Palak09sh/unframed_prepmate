package com.hackathon.interview.service;

import com.hackathon.interview.dto.InterviewResponse;
import com.hackathon.interview.model.Candidate;
import com.hackathon.interview.model.CandidateMission;
import com.hackathon.interview.model.ChatMessage;
import com.hackathon.interview.model.CurriculumDay;
import com.hackathon.interview.model.InterviewSession;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

/**
 * The interview agent core (friend2's module).
 *
 * <p>Owns: day selection, prompt engineering, question generation, follow-up
 * decisions, and the interview flow. It is deliberately Spring-free so it
 * compiles and unit-tests standalone; Radhika wires it into her Spring config
 * via constructor injection.</p>
 *
 * <p><b>Contract seams (for Radhika):</b> the engine depends on exactly two
 * things you own — {@link ClaudeService} (it calls
 * {@code claudeService.complete(systemPrompt, messages)}) and the shapes under
 * {@code model/} and {@code dto/}. Keep those aligned and this file works
 * unchanged.</p>
 */
public class InterviewEngine {

    /** Hard minimums — enforced in code, never left to the LLM to count. */
    public static final int MIN_QUESTIONS = 8;
    public static final int MIN_DAYS = 4;

    /** Soft cap on selected target days so the interview stays tight. */
    static final int MAX_TARGET_DAYS = 6;

    /** Exact closing line expected by the REST contract. */
    public static final String DONE_REPLY = "Interview completed.";

    /** Marks the ephemeral per-turn directive so it is never mistaken for a candidate message. */
    static final String INSTRUCTION_PREFIX =
            "INTERVIEWER INSTRUCTION (this is a directive to you, the interviewer — not a message from the candidate): ";

    private final ClaudeService claudeService;
    private final Map<Integer, CurriculumDay> curriculum;

    public InterviewEngine(ClaudeService claudeService, Map<Integer, CurriculumDay> curriculum) {
        this.claudeService = Objects.requireNonNull(claudeService, "claudeService");
        this.curriculum = curriculum == null ? Map.of() : Map.copyOf(curriculum);
    }

    // ------------------------------------------------------------------
    // startInterview
    // ------------------------------------------------------------------

    /** Documented contract entry point. Builds a fresh session and opens the interview. */
    public InterviewResponse startInterview(Candidate candidate) {
        return startInterview(new InterviewSession(), candidate);
    }

    /**
     * Initializes {@code session} for the candidate and returns the opening
     * question. The route persists the built session via
     * {@link InterviewResponse#session()}. A fresh sessionId is generated when
     * the session has none.
     */
    public InterviewResponse startInterview(InterviewSession session, Candidate candidate) {
        Objects.requireNonNull(candidate, "candidate");
        Objects.requireNonNull(session, "session");
        if (session.getSessionId() == null || session.getSessionId().isBlank()) {
            session.setSessionId(UUID.randomUUID().toString());
        }
        session.setCandidate(candidate);
        session.setHistory(new ArrayList<>());
        session.setAskedDays(new ArrayList<>());
        session.setQuestionCount(0);
        session.setCurrentDayIndex(0);
        session.setQuestionsOnCurrentDay(0);
        session.setPhase(InterviewSession.PHASE_INTERVIEWING);

        List<Integer> targetDays = selectTargetDays(candidate);
        session.setTargetDays(targetDays);

        int firstDay = targetDays.get(0);
        CurriculumDay day = dayFor(firstDay);
        String dayContext = candidateRecordForDay(candidate, firstDay);

        String reply = askClaude(
                buildSystemPrompt(candidate, firstDay, day, dayContext),
                List.of(),
                buildTurnInstruction(firstDay, day, dayContext, /*isOpening*/ true, /*isFirstOnDay*/ true),
                day, /*firstOnDay*/ true);

        session.getHistory().add(new ChatMessage("assistant", reply));
        session.setQuestionCount(1);
        session.getAskedDays().add(firstDay);
        session.setQuestionsOnCurrentDay(1);

        return new InterviewResponse(reply, false, null, session);
    }

    // ------------------------------------------------------------------
    // processTurn
    // ------------------------------------------------------------------

    /**
     * Appends the candidate's message, decides follow-up vs next-day vs
     * wrap-up (in code), and returns the next question. Mutates {@code session}
     * in place so the route can persist it with SessionStore.updateSession.
     */
    public InterviewResponse processTurn(InterviewSession session, String message) {
        Objects.requireNonNull(session, "session");
        if (InterviewSession.PHASE_DONE.equals(session.getPhase())) {
            return InterviewResponse.turn(DONE_REPLY, true);
        }
        if (session.getTargetDays() == null || session.getTargetDays().isEmpty()) {
            throw new IllegalStateException("session has not been started: call startInterview first");
        }

        session.getHistory().add(new ChatMessage("user", message));

        Plan plan = planNext(session);
        if (plan.done()) {
            session.setPhase(InterviewSession.PHASE_DONE);
            session.getHistory().add(new ChatMessage("assistant", DONE_REPLY));
            return InterviewResponse.turn(DONE_REPLY, true);
        }

        int dayNumber = plan.day();
        CurriculumDay day = dayFor(dayNumber);
        String dayContext = candidateRecordForDay(session.getCandidate(), dayNumber);
        boolean firstOnDay = !session.getAskedDays().contains(dayNumber);

        String reply = askClaude(
                buildSystemPrompt(session.getCandidate(), dayNumber, day, dayContext),
                session.getHistory(),
                buildTurnInstruction(dayNumber, day, dayContext, /*isOpening*/ false, firstOnDay),
                day, firstOnDay);

        session.getHistory().add(new ChatMessage("assistant", reply));
        session.setQuestionCount(session.getQuestionCount() + 1);
        if (firstOnDay) {
            session.getAskedDays().add(dayNumber);
        }
        session.setCurrentDayIndex(plan.nextIndex());
        session.setQuestionsOnCurrentDay(plan.questionsAfter());

        return InterviewResponse.turn(reply, false);
    }

    // ------------------------------------------------------------------
    // Flow decisions (code-enforced)
    // ------------------------------------------------------------------

    /**
     * Decides the next step from hard counts, never trusting the LLM to count.
     *
     * <p>Two phases:</p>
     * <ul>
     *   <li><b>Coverage:</b> while un-asked target days remain, give each day up
     *       to its budget of questions (2 for weak spots, 1 for easy days), then
     *       move to the next un-asked day. Guarantees every target day is asked
     *       about, so {@code askedDays.size() >= MIN_DAYS}.</li>
     *   <li><b>Deepening:</b> once all target days are covered, cycle through
     *       them with deeper follow-ups until {@code questionCount >= 8}.</li>
     * </ul>
     */
    private Plan planNext(InterviewSession s) {
        if (s.getQuestionCount() >= MIN_QUESTIONS && s.getAskedDays().size() >= MIN_DAYS) {
            return Plan.wrapUp();
        }
        List<Integer> target = s.getTargetDays();
        int current = target.get(s.getCurrentDayIndex());
        boolean currentAsked = s.getAskedDays().contains(current);
        int budget = dayBudget(s.getCandidate(), current);
        List<Integer> unasked = target.stream().filter(d -> !s.getAskedDays().contains(d)).toList();

        if (!unasked.isEmpty()) {
            if (currentAsked && s.getQuestionsOnCurrentDay() >= budget) {
                int nextDay = unasked.get(0);
                return Plan.question(nextDay, target.indexOf(nextDay), 1);
            }
            return Plan.question(current, s.getCurrentDayIndex(), s.getQuestionsOnCurrentDay() + 1);
        }
        int nextIndex = (s.getCurrentDayIndex() + 1) % target.size();
        int nextDay = target.get(nextIndex);
        int questionsAfter = nextDay == current ? s.getQuestionsOnCurrentDay() + 1 : 1;
        return Plan.question(nextDay, nextIndex, questionsAfter);
    }

    /** Immutable result of {@link #planNext(InterviewSession)}. */
    private static final class Plan {
        private final boolean done;
        private final int day;
        private final int nextIndex;
        private final int questionsAfter;

        private Plan(boolean done, int day, int nextIndex, int questionsAfter) {
            this.done = done;
            this.day = day;
            this.nextIndex = nextIndex;
            this.questionsAfter = questionsAfter;
        }

        static Plan wrapUp() {
            return new Plan(true, 0, 0, 0);
        }

        static Plan question(int day, int nextIndex, int questionsAfter) {
            return new Plan(false, day, nextIndex, questionsAfter);
        }

        boolean done() { return done; }
        int day() { return day; }
        int nextIndex() { return nextIndex; }
        int questionsAfter() { return questionsAfter; }
    }

    // ------------------------------------------------------------------
    // Day selection
    // ------------------------------------------------------------------

    /**
     * Picks the target days for the interview: weak spots first (skipped
     * missions, then high-attempt-but-failed), then first-try passes for a
     * confidence-building opener, padded from the curriculum to at least
     * {@value MIN_DAYS} days.
     */
    List<Integer> selectTargetDays(Candidate candidate) {
        List<CandidateMission> missions = candidate.missions() == null ? List.of() : candidate.missions();
        List<Integer> target = new ArrayList<>();

        List<CandidateMission> weak = missions.stream()
                .filter(CandidateMission::isWeak)
                .sorted(Comparator
                        .comparing((CandidateMission m) -> !Boolean.TRUE.equals(m.skipped())) // skipped first
                        .thenComparing(Comparator
                                .comparingInt((CandidateMission m) -> m.attempts() == null ? 0 : m.attempts())
                                .reversed()))
                .toList();
        for (CandidateMission m : weak) {
            if (target.size() >= MAX_TARGET_DAYS) {
                break;
            }
            if (!target.contains(m.day())) {
                target.add(m.day());
            }
        }

        List<CandidateMission> easy = missions.stream()
                .filter(m -> Boolean.TRUE.equals(m.passed()) && m.attempts() != null && m.attempts() <= 1)
                .sorted(Comparator.comparingInt(CandidateMission::day))
                .toList();
        for (CandidateMission m : easy) {
            if (target.size() >= MAX_TARGET_DAYS) {
                break;
            }
            if (!target.contains(m.day())) {
                target.add(m.day());
            }
        }

        List<Integer> curriculumDays = curriculum.keySet().stream().sorted().toList();
        for (int d : curriculumDays) {
            if (target.size() >= MIN_DAYS) {
                break;
            }
            if (!target.contains(d)) {
                target.add(d);
            }
        }
        return target;
    }

    /** 2 for weak spots, 1 otherwise — bounds how many coverage questions a day gets. */
    private int dayBudget(Candidate candidate, int day) {
        CandidateMission m = candidate.missionForDay(day).orElse(null);
        return m != null && m.isWeak() ? 2 : 1;
    }

    /** Human-readable note about the candidate's record for a day, used in prompts. */
    private String candidateRecordForDay(Candidate candidate, int day) {
        CandidateMission m = candidate.missionForDay(day).orElse(null);
        if (m == null) {
            return "has no recorded mission for Day " + day + " (" + dayFor(day).title() + ")";
        }
        if (Boolean.TRUE.equals(m.skipped())) {
            return "skipped the Day " + day + " mission (" + m.title() + ")";
        }
        if (Boolean.TRUE.equals(m.passed())) {
            if (m.attempts() != null && m.attempts() <= 1) {
                return "passed the Day " + day + " mission (" + m.title() + ") on the first attempt";
            }
            return "passed the Day " + day + " mission (" + m.title() + ") after "
                    + (m.attempts() == null ? 1 : m.attempts()) + " attempts";
        }
        return "attempted the Day " + day + " mission (" + m.title() + ") "
                + (m.attempts() == null ? 1 : m.attempts()) + " times without passing";
    }

    // ------------------------------------------------------------------
    // Prompting
    // ------------------------------------------------------------------

    private CurriculumDay dayFor(int day) {
        return curriculum.getOrDefault(day, new CurriculumDay(day, "Day " + day, "lesson", List.of(), List.of()));
    }

    private String buildSystemPrompt(Candidate candidate, int dayNumber, CurriculumDay day, String dayContext) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a friendly but rigorous technical interviewer for an AI cohort program.\n");
        sb.append("Candidate background: ").append(candidate.member().role())
                .append(" with ").append(candidate.member().experience()).append(" year(s) of experience.\n\n");
        sb.append("Today's topic — Day ").append(dayNumber).append(": ").append(day.title()).append("\n");
        sb.append("What was taught: ").append(String.join("; ", day.objectives())).append("\n");
        sb.append("Tools covered: ").append(String.join(", ", day.tools())).append("\n");
        sb.append("Candidate's record for this day: ").append(dayContext).append("\n\n");
        sb.append("Guidelines:\n");
        sb.append("- Ask exactly ONE question per turn.\n");
        sb.append("- Be conversational, warm, and adaptive — react naturally to what the candidate says.\n");
        sb.append("- Probe understanding: if an answer is vague, shallow, or reveals a misunderstanding, dig deeper "
                + "with a targeted follow-up.\n");
        sb.append("- Never reveal the correct answer; guide with questions.\n");
        sb.append("- Keep each question concise (1-4 sentences).\n");
        sb.append("- Vary your phrasing between turns; do not sound scripted.\n");
        return sb.toString();
    }

    private String buildTurnInstruction(int dayNumber, CurriculumDay day, String dayContext,
                                        boolean isOpening, boolean isFirstOnDay) {
        String directive;
        if (isOpening) {
            directive = "This is the first message of the interview. Greet the candidate briefly and ask your "
                    + "first question about Day " + dayNumber + " (" + day.title() + "). You may mention that the "
                    + "candidate " + dayContext + ".";
        } else if (isFirstOnDay) {
            directive = "Move on to a new topic: Day " + dayNumber + " (" + day.title() + "). Briefly note the "
                    + "transition, then ask your first question about it. You may mention that the candidate "
                    + dayContext + ".";
        } else {
            directive = "The candidate has just answered. Ask a focused follow-up question about " + day.title()
                    + " that probes their understanding more deeply. React to what they actually said; do not "
                    + "repeat an earlier question.";
        }
        return INSTRUCTION_PREFIX + directive;
    }

    /**
     * Sends the (ephemeral) directive to Claude alongside the conversation and
     * returns the next question. Falls back to a templated question if the LLM
     * is unavailable so the interview never dead-ends on a backend outage.
     */
    private String askClaude(String systemPrompt, List<ChatMessage> conversation, String instruction,
                             CurriculumDay day, boolean firstOnDay) {
        try {
            List<ChatMessage> call = new ArrayList<>(conversation);
            call.add(new ChatMessage("user", instruction));
            return claudeService.complete(systemPrompt, call);
        } catch (Exception e) {
            return fallbackQuestion(day, firstOnDay);
        }
    }

    private String fallbackQuestion(CurriculumDay day, boolean firstOnDay) {
        String focus = day.objectives().isEmpty()
                ? "the key ideas from Day " + day.day()
                : day.objectives().get(0);
        if (firstOnDay) {
            return "Let's talk about " + day.title() + ". Can you explain " + focus + "?";
        }
        return "Let's go a bit deeper on " + day.title() + ". How would you apply " + focus + " in a real task?";
    }
}
