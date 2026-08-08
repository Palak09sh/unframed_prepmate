package com.hackathon.interview.service;

import com.hackathon.interview.dto.Feedback;
import com.hackathon.interview.model.Candidate;
import com.hackathon.interview.model.CandidateMember;
import com.hackathon.interview.model.CandidateMission;
import com.hackathon.interview.model.CandidateSignals;
import com.hackathon.interview.model.ChatMessage;
import com.hackathon.interview.model.InterviewSession;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Coverage for {@link FeedbackService}: Claude success path, tolerant parsing of
 * noisy Claude output, and the fallback when Claude fails or returns malformed text.
 */
class FeedbackServiceTest {

    private final ClaudeService claudeService = mock(ClaudeService.class);
    private final FeedbackService feedbackService = new FeedbackService(claudeService);

    @Test
    void success_parsesStructuredFeedbackFromClaude() {
        when(claudeService.complete(anyString(), anyList())).thenReturn("""
                {"summary":"Solid grasp of the core ideas.","strengths":["Explained clearly","Probed back well"],"gaps":["Shaky on Bayes"],"next":["Redo Day 9","Try a practice mission"]}""");

        Feedback f = feedbackService.generateFeedback(completedSession());

        assertEquals("Solid grasp of the core ideas.", f.summary());
        assertEquals(List.of("Explained clearly", "Probed back well"), f.strengths());
        assertEquals(List.of("Shaky on Bayes"), f.gaps());
        assertEquals(List.of("Redo Day 9", "Try a practice mission"), f.next());
    }

    @Test
    void success_toleratesMarkdownCodeFenceAndSurroundingProse() {
        when(claudeService.complete(anyString(), anyList())).thenReturn("""
                Here is my evaluation of the candidate:
                ```json
                { "summary": "Good", "strengths": ["A"], "gaps": ["B"], "next": ["C"] }
                ```
                Hope this helps!""");

        Feedback f = feedbackService.generateFeedback(completedSession());

        assertEquals("Good", f.summary());
        assertEquals(List.of("A"), f.strengths());
        assertEquals(List.of("B"), f.gaps());
        assertEquals(List.of("C"), f.next());
    }

    @Test
    void missingFieldsDefaultToEmptyLists() {
        when(claudeService.complete(anyString(), anyList())).thenReturn("""
                {"summary":"Only a summary was returned"}""");

        Feedback f = feedbackService.generateFeedback(completedSession());

        assertEquals("Only a summary was returned", f.summary());
        assertTrue(f.strengths().isEmpty());
        assertTrue(f.gaps().isEmpty());
        assertTrue(f.next().isEmpty());
    }

    @Test
    void fallback_whenClaudeReturnsNonJson() {
        when(claudeService.complete(anyString(), anyList())).thenReturn("Thanks for the great interview, goodbye!");

        Feedback f = feedbackService.generateFeedback(completedSession());

        assertFalse(f.summary().isBlank(), "fallback must provide a summary");
        assertFalse(f.strengths().isEmpty(), "fallback must provide a strength");
        assertFalse(f.gaps().isEmpty());
        assertFalse(f.next().isEmpty());
    }

    @Test
    void fallback_whenClaudeThrows() {
        when(claudeService.complete(anyString(), anyList()))
                .thenThrow(new ClaudeApiException("simulated Claude outage", new RuntimeException()));

        Feedback f = feedbackService.generateFeedback(completedSession());

        assertFalse(f.summary().isBlank());
        assertFalse(f.next().isEmpty());
    }

    @Test
    void promptIncludesCandidateBackgroundAndTranscriptReachesClaude() {
        when(claudeService.complete(anyString(), anyList())).thenReturn("{}");

        feedbackService.generateFeedback(completedSession());

        ArgumentCaptor<String> promptCaptor = ArgumentCaptor.forClass(String.class);
        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<ChatMessage>> historyCaptor = ArgumentCaptor.forClass(List.class);
        verify(claudeService).complete(promptCaptor.capture(), historyCaptor.capture());

        String prompt = promptCaptor.getValue();
        assertTrue(prompt.contains("AI Engineer Trainee"), "prompt should mention the candidate's role");
        assertTrue(prompt.contains("summary"), "prompt should request the summary field");

        List<ChatMessage> transcript = historyCaptor.getValue();
        assertTrue(transcript.stream().anyMatch(m -> m.content().contains("Probability foundations")),
                "transcript should include the assistant's questions");
        assertTrue(transcript.stream().anyMatch(m -> m.content().contains("I would break the problem down")),
                "transcript should include the candidate's answers");
    }

    /** A realistic completed session with candidate profile and a short transcript. */
    private static InterviewSession completedSession() {
        Candidate candidate = new Candidate(
                new CandidateMember("AI Engineer Trainee", 1),
                List.of(new CandidateMission(9, "Probability foundations", null, null, true)),
                new CandidateSignals(10, 5, 3));
        InterviewSession session = new InterviewSession();
        session.setSessionId("session-1");
        session.setCandidate(candidate);
        session.setHistory(List.of(
                new ChatMessage("assistant", "Let's talk about Probability foundations. Can you explain conditional probability?"),
                new ChatMessage("user", "I would break the problem down and verify each step.")));
        return session;
    }
}
