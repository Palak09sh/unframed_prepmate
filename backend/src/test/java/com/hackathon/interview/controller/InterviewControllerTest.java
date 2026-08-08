package com.hackathon.interview.controller;

import com.hackathon.interview.dto.Feedback;
import com.hackathon.interview.dto.InterviewResponse;
import com.hackathon.interview.model.Candidate;
import com.hackathon.interview.model.InterviewSession;
import com.hackathon.interview.service.FeedbackService;
import com.hackathon.interview.service.InterviewEngine;
import com.hackathon.interview.session.SessionStore;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Web-slice tests for the fixed {@code POST /api/interview} contract: start,
 * follow-up, completion-with-feedback, and the 400/404 error paths. The engine
 * and feedback service are mocked so the contract is what's under test.
 */
@WebMvcTest(InterviewController.class)
class InterviewControllerTest {

    private static final String SESSION_ID = "test-session-1";

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InterviewEngine interviewEngine;

    @MockBean
    private SessionStore sessionStore;

    @MockBean
    private FeedbackService feedbackService;

    // ------------------------------------------------------------------
    // Happy paths
    // ------------------------------------------------------------------

    @Test
    void startRequest_returnsOpeningQuestionAndPersistsSession() throws Exception {
        InterviewSession session = new InterviewSession();
        session.setSessionId(SESSION_ID);
        when(interviewEngine.startInterview(any(Candidate.class)))
                .thenReturn(new InterviewResponse("Welcome, let's begin.", false, null, session));

        mockMvc.perform(post("/api/interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(startBody()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reply").value("Welcome, let's begin."))
                .andExpect(jsonPath("$.done").value(false))
                .andExpect(jsonPath("$.feedback").doesNotExist())
                .andExpect(jsonPath("$.session").doesNotExist());

        verify(sessionStore).createSession(eq(SESSION_ID), any(InterviewSession.class));
    }

    @Test
    void followUpRequest_returnsNextTurnAndUpdatesSession() throws Exception {
        InterviewSession session = new InterviewSession();
        session.setSessionId(SESSION_ID);
        when(sessionStore.getSession(SESSION_ID)).thenReturn(Optional.of(session));
        when(interviewEngine.processTurn(session, "my answer"))
                .thenReturn(InterviewResponse.turn("Tell me more.", false));

        mockMvc.perform(post("/api/interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sessionId\":\"test-session-1\",\"message\":\"my answer\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reply").value("Tell me more."))
                .andExpect(jsonPath("$.done").value(false))
                .andExpect(jsonPath("$.feedback").doesNotExist());

        verify(sessionStore).updateSession(SESSION_ID, session);
    }

    @Test
    void completion_returnsDoneTrueWithFeedback() throws Exception {
        InterviewSession session = new InterviewSession();
        session.setSessionId(SESSION_ID);
        when(sessionStore.getSession(SESSION_ID)).thenReturn(Optional.of(session));
        when(interviewEngine.processTurn(session, "final answer"))
                .thenReturn(InterviewResponse.turn("Interview completed.", true));
        Feedback feedback = new Feedback("Good work.", List.of("strong"), List.of("gap"), List.of("next step"));
        when(feedbackService.generateFeedback(session)).thenReturn(feedback);

        mockMvc.perform(post("/api/interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sessionId\":\"test-session-1\",\"message\":\"final answer\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reply").value("Interview completed."))
                .andExpect(jsonPath("$.done").value(true))
                .andExpect(jsonPath("$.feedback.summary").value("Good work."))
                .andExpect(jsonPath("$.feedback.strengths[0]").value("strong"))
                .andExpect(jsonPath("$.feedback.gaps[0]").value("gap"))
                .andExpect(jsonPath("$.feedback.next[0]").value("next step"));
    }

    // ------------------------------------------------------------------
    // Error paths
    // ------------------------------------------------------------------

    @Test
    void missingSessionId_returns400() throws Exception {
        mockMvc.perform(post("/api/interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"hi\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void missingBothCandidateAndMessage_returns400() throws Exception {
        mockMvc.perform(post("/api/interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sessionId\":\"test-session-1\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void bothCandidateAndMessage_returns400() throws Exception {
        mockMvc.perform(post("/api/interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sessionId\":\"test-session-1\",\"candidate\":"
                                + candidateJson() + ",\"message\":\"hi\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void malformedJson_returns400() throws Exception {
        mockMvc.perform(post("/api/interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("this is not json"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void unknownSession_returns404() throws Exception {
        when(sessionStore.getSession("missing-session")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/interview")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"sessionId\":\"missing-session\",\"message\":\"hi\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getOnInterviewEndpoint_returns405Not500() throws Exception {
        mockMvc.perform(get("/api/interview"))
                .andExpect(status().isMethodNotAllowed())
                .andExpect(jsonPath("$.error").value("Method not allowed."));
    }

    @Test
    void unknownPath_returns404Not500() throws Exception {
        mockMvc.perform(get("/api/nope"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("Not found."));
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private static String startBody() {
        return "{\"sessionId\":\"test-session-1\",\"candidate\":" + candidateJson() + "}";
    }

    private static String candidateJson() {
        return """
                {"member":{"role":"AI Engineer Trainee","experience":1},
                 "missions":[{"day":9,"title":"Probability foundations","skipped":true}],
                 "signals":{"commitDays":10,"missionsCompleted":5,"missionsFirstTry":3}}""";
    }
}
