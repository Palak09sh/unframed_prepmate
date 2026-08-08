package com.hackathon.interview.service;

import com.hackathon.interview.dto.InterviewResponse;
import com.hackathon.interview.model.InterviewSession;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * JUnit coverage for the InterviewEngine (runs via {@code mvn test}). The same
 * scenarios are mirrored in {@link SelfTestMain}, which runs without Maven.
 */
class InterviewEngineTest {

    private static final String ANSWER = "I would iterate and verify each step with a small test.";

    @Test
    void startInterview_returnsFourPlusTargetDaysPrioritizingWeakSpots() {
        InterviewEngine engine = new InterviewEngine(new FakeClaudeService(), TestCurriculum.all());
        InterviewSession session = engine.startInterview(TestCandidates.aiEngineer()).session();

        List<Integer> days = session.getTargetDays();
        assertTrue(days.size() >= 4, "need at least 4 target days");
        assertEquals(8, days.get(0), "skipped mission (day 8) should be the first probe target");
        assertTrue(days.containsAll(List.of(8, 15, 5)), "all weak spots should be selected");
        assertEquals(days.size(), days.stream().distinct().count(), "no duplicate target days");
    }

    @Test
    void startInterview_padsSparseCandidateToFourDays() {
        InterviewEngine engine = new InterviewEngine(new FakeClaudeService(), TestCurriculum.all());
        InterviewSession session = engine.startInterview(TestCandidates.noWeakSpotsSparse()).session();

        List<Integer> days = session.getTargetDays();
        assertTrue(days.size() >= 4);
        assertTrue(days.containsAll(List.of(2, 5)));
    }

    @Test
    void startInterview_initializesSessionState() {
        FakeClaudeService claude = new FakeClaudeService();
        InterviewEngine engine = new InterviewEngine(claude, TestCurriculum.all());
        InterviewResponse response = engine.startInterview(TestCandidates.aiEngineer());
        InterviewSession session = response.session();

        assertNotNull(session.getSessionId());
        assertEquals(1, session.getQuestionCount());
        assertEquals(List.of(session.getTargetDays().get(0)), session.getAskedDays());
        assertEquals(InterviewSession.PHASE_INTERVIEWING, session.getPhase());
        assertEquals(1, session.getHistory().size());
        assertFalse(response.done());
        assertTrue(claude.systemPrompts.get(0).contains("Agents"));
    }

    @Test
    void fullRun_enforcesEightQuestionsAndFourDays() {
        InterviewEngine engine = new InterviewEngine(new FakeClaudeService(), TestCurriculum.all());
        InterviewSession session = engine.startInterview(TestCandidates.aiEngineer()).session();

        InterviewResponse finalResponse = runToCompletion(engine, session);

        assertTrue(finalResponse.done());
        assertEquals(8, session.getQuestionCount());
        assertEquals(session.getTargetDays(), session.getAskedDays());
        assertEquals(InterviewSession.PHASE_DONE, session.getPhase());
        assertEquals(InterviewEngine.DONE_REPLY, finalResponse.reply());
        assertEquals(17, session.getHistory().size());
    }

    @Test
    void processTurn_neverEndsBeforeBothMinimaAreMet() {
        InterviewEngine engine = new InterviewEngine(new FakeClaudeService(), TestCurriculum.all());
        InterviewSession session = engine.startInterview(TestCandidates.aiEngineer()).session();

        InterviewResponse response = null;
        for (int i = 0; i < 6; i++) {
            response = engine.processTurn(session, ANSWER);
        }

        assertNotNull(response);
        assertFalse(response.done(), "must not finish before questionCount >= 8");
        assertEquals(7, session.getQuestionCount());
        assertEquals(4, session.getAskedDays().size());
    }

    @Test
    void fallbackKeepsInterviewAliveWhenClaudeIsDown() {
        InterviewEngine engine = new InterviewEngine(new ThrowingClaudeService(), TestCurriculum.all());
        InterviewSession session = engine.startInterview(TestCandidates.aiEngineer()).session();

        InterviewResponse finalResponse = runToCompletion(engine, session);

        assertTrue(finalResponse.done());
        assertEquals(8, session.getQuestionCount());
        assertTrue(session.getHistory().stream()
                .filter(m -> "assistant".equals(m.role()))
                .allMatch(m -> !m.content().isBlank()));
    }

    private static InterviewResponse runToCompletion(InterviewEngine engine, InterviewSession session) {
        InterviewResponse response = null;
        for (int i = 0; i < 100; i++) {
            response = engine.processTurn(session, ANSWER);
            if (response.done()) {
                return response;
            }
        }
        throw new IllegalStateException("engine did not terminate");
    }
}
