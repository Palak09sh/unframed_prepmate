package com.hackathon.interview.service;

import com.hackathon.interview.dto.InterviewResponse;
import com.hackathon.interview.model.InterviewSession;

import java.util.List;

/**
 * Plain-Java verification runner for the InterviewEngine — no JUnit, no Spring,
 * no network. Run after compiling main + test sources:
 *
 * <pre>java com.hackathon.interview.service.SelfTestMain</pre>
 *
 * Prints each check and exits non-zero if anything fails. Mirrors the JUnit
 * test suite (InterviewEngineTest) so `mvn test` covers the same ground.
 */
public final class SelfTestMain {

    private static final String ANSWER =
            "I would break the problem into small pieces and verify each one with a quick test.";

    private static int checks = 0;
    private static int failures = 0;

    public static void main(String[] args) {
        System.out.println("InterviewEngine self-test");
        System.out.println("-------------------------");
        try {
            daySelection_prioritizesWeakSpots();
            daySelection_padsToFourDays();
            startInterview_buildsCorrectState();
            fullRun_candidateA_hitsMinimaExactly();
            fullRun_candidateC_coversFourDays();
            noPrematureDone();
            fallback_whenClaudeDown();
            candidateMessagesReachClaude();
        } catch (Throwable t) {
            fail("unexpected exception: " + t);
        }
        System.out.println("-------------------------");
        if (failures == 0) {
            System.out.println("PASS: all " + checks + " checks passed");
        } else {
            System.out.println("FAIL: " + failures + "/" + checks + " checks failed");
            System.exit(1);
        }
    }

    // ------------------------------------------------------------------
    // Scenarios
    // ------------------------------------------------------------------

    private static void daySelection_prioritizesWeakSpots() {
        InterviewEngine engine = new InterviewEngine(new FakeClaudeService(), TestCurriculum.all());
        List<Integer> days = engine.startInterview(TestCandidates.aiEngineer()).session().getTargetDays();
        check("targetDays >= 4", days.size() >= 4);
        check("first target is a skipped weak spot (day 8)", days.get(0) == 8);
        check("all weak days selected (8, 15, 5)", days.containsAll(List.of(8, 15, 5)));
        check("no duplicate target days", days.size() == days.stream().distinct().count());
    }

    private static void daySelection_padsToFourDays() {
        InterviewEngine engine = new InterviewEngine(new FakeClaudeService(), TestCurriculum.all());
        List<Integer> days = engine.startInterview(TestCandidates.noWeakSpotsSparse()).session().getTargetDays();
        check("sparse candidate still gets >= 4 days", days.size() >= 4);
        check("padding keeps the candidate's own days", days.containsAll(List.of(2, 5)));
        check("padding adds days from the curriculum", days.size() == 4 && days.get(0) == 2 && days.get(1) == 5);
    }

    private static void startInterview_buildsCorrectState() {
        FakeClaudeService claude = new FakeClaudeService();
        InterviewEngine engine = new InterviewEngine(claude, TestCurriculum.all());
        InterviewResponse resp = engine.startInterview(TestCandidates.aiEngineer());
        InterviewSession s = resp.session();
        check("start returns the built session", s != null);
        check("session has a generated id", s.getSessionId() != null && !s.getSessionId().isBlank());
        check("questionCount == 1", s.getQuestionCount() == 1);
        check("askedDays starts with the first target day",
                s.getAskedDays().equals(List.of(s.getTargetDays().get(0))));
        check("phase is interviewing", InterviewSession.PHASE_INTERVIEWING.equals(s.getPhase()));
        check("history holds one assistant message",
                s.getHistory().size() == 1 && "assistant".equals(s.getHistory().get(0).role()));
        check("opening reply is non-blank", resp.reply() != null && !resp.reply().isBlank());
        check("opening system prompt is grounded in day 8 (Agents)",
                claude.systemPrompts.get(0).contains("Agents"));
        check("opening system prompt surfaces the skip",
                claude.systemPrompts.get(0).contains("skipped"));
        check("opening system prompt carries candidate background",
                claude.systemPrompts.get(0).contains("AI Engineer"));
    }

    private static void fullRun_candidateA_hitsMinimaExactly() {
        FakeClaudeService claude = new FakeClaudeService();
        InterviewEngine engine = new InterviewEngine(claude, TestCurriculum.all());
        InterviewSession s = engine.startInterview(TestCandidates.aiEngineer()).session();
        InterviewResponse resp = runToCompletion(engine, s);
        check("A: interview terminates", resp != null && resp.done());
        check("A: questionCount == 8 exactly", s.getQuestionCount() == 8);
        check("A: all 5 target days covered",
                s.getAskedDays().size() == 5 && s.getAskedDays().equals(s.getTargetDays()));
        check("A: phase is done", InterviewSession.PHASE_DONE.equals(s.getPhase()));
        check("A: final reply is the contract done line", InterviewEngine.DONE_REPLY.equals(resp.reply()));
        check("A: history = opening + 8 turns x 2 messages", s.getHistory().size() == 17);
    }

    private static void fullRun_candidateC_coversFourDays() {
        InterviewEngine engine = new InterviewEngine(new FakeClaudeService(), TestCurriculum.all());
        InterviewSession s = engine.startInterview(TestCandidates.dataScientist()).session();
        InterviewResponse resp = runToCompletion(engine, s);
        check("C: interview terminates", resp != null && resp.done());
        check("C: questionCount == 8", s.getQuestionCount() == 8);
        check("C: exactly 4 target days covered",
                s.getAskedDays().size() == 4 && s.getAskedDays().equals(s.getTargetDays()));
    }

    private static void noPrematureDone() {
        InterviewEngine engine = new InterviewEngine(new FakeClaudeService(), TestCurriculum.all());
        InterviewSession s = engine.startInterview(TestCandidates.aiEngineer()).session();
        InterviewResponse resp = null;
        for (int i = 0; i < 6; i++) {
            resp = engine.processTurn(s, ANSWER);
        }
        check("not done at 7 questions even with 4+ days covered",
                resp != null && !resp.done() && s.getQuestionCount() == 7 && s.getAskedDays().size() == 4);
    }

    private static void fallback_whenClaudeDown() {
        InterviewEngine engine = new InterviewEngine(new ThrowingClaudeService(), TestCurriculum.all());
        InterviewSession s = engine.startInterview(TestCandidates.aiEngineer()).session();
        check("fallback opening reply is non-blank", !s.getHistory().get(0).content().isBlank());
        InterviewResponse resp = runToCompletion(engine, s);
        check("fallback: interview still completes", resp != null && resp.done());
        check("fallback: questionCount == 8", s.getQuestionCount() == 8);
        check("fallback: every assistant reply is non-blank",
                s.getHistory().stream()
                        .filter(m -> "assistant".equals(m.role()))
                        .allMatch(m -> !m.content().isBlank()));
    }

    private static void candidateMessagesReachClaude() {
        FakeClaudeService claude = new FakeClaudeService();
        InterviewEngine engine = new InterviewEngine(claude, TestCurriculum.all());
        InterviewSession s = engine.startInterview(TestCandidates.aiEngineer()).session();
        runToCompletion(engine, s);
        boolean sawDirective = claude.messageCalls.stream()
                .flatMap(List::stream)
                .anyMatch(m -> m.content().startsWith(InterviewEngine.INSTRUCTION_PREFIX));
        boolean sawAnswer = claude.messageCalls.stream()
                .flatMap(List::stream)
                .anyMatch(m -> ANSWER.equals(m.content()));
        boolean allEndWithDirective = claude.messageCalls.stream()
                .allMatch(call -> call.get(call.size() - 1).content().startsWith(InterviewEngine.INSTRUCTION_PREFIX));
        check("Claude receives the ephemeral turn directive", sawDirective);
        check("Claude receives the candidate's real answers", sawAnswer);
        check("every Claude call ends with the directive", allEndWithDirective);
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private static InterviewResponse runToCompletion(InterviewEngine engine, InterviewSession session) {
        InterviewResponse resp = null;
        for (int i = 0; i < 100; i++) {
            resp = engine.processTurn(session, ANSWER);
            if (resp.done()) {
                return resp;
            }
        }
        return resp; // guard against a non-terminating engine
    }

    private static void check(String label, boolean ok) {
        checks++;
        if (ok) {
            System.out.println("  ok    " + label);
        } else {
            failures++;
            System.out.println("  FAIL  " + label);
        }
    }

    private static void fail(String label) {
        check(label, false);
    }
}
