package com.hackathon.interview.controller;

import com.hackathon.interview.dto.Feedback;
import com.hackathon.interview.dto.InterviewRequest;
import com.hackathon.interview.dto.InterviewResponse;
import com.hackathon.interview.model.InterviewSession;
import com.hackathon.interview.service.FeedbackService;
import com.hackathon.interview.service.InterviewEngine;
import com.hackathon.interview.session.SessionStore;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Single endpoint for the whole interview, per the fixed API contract:
 * <pre>
 *   First call  POST /api/interview  { sessionId, candidate }  -> { reply, done:false }
 *   Next calls  POST /api/interview  { sessionId, message }    -> { reply, done:false }
 *   Final call  POST /api/interview  { sessionId, message }    -> { reply:"Interview completed.",
 *                                                                   done:true, feedback:{...} }
 * </pre>
 * The final reply is fixed to "Interview completed." by the contract; the engine's own
 * closing line (if any) is intentionally not surfaced on the wire.
 */
@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private static final String COMPLETION_REPLY = "Interview completed.";

    private final InterviewEngine interviewEngine;
    private final SessionStore sessionStore;
    private final FeedbackService feedbackService;

    public InterviewController(InterviewEngine interviewEngine,
                               SessionStore sessionStore,
                               FeedbackService feedbackService) {
        this.interviewEngine = interviewEngine;
        this.sessionStore = sessionStore;
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public InterviewResponse interview(@Valid @RequestBody InterviewRequest request) {
        if (request.candidate() != null) {
            if (hasText(request.message())) {
                throw new IllegalArgumentException(
                        "Provide either candidate (to start) or message (to continue), not both.");
            }
            InterviewResponse start = interviewEngine.startInterview(request.candidate());
            sessionStore.createSession(request.sessionId(), start.session());
            return start;
        }

        if (!hasText(request.message())) {
            throw new IllegalArgumentException(
                    "Provide candidate to start an interview or message to continue.");
        }

        InterviewSession session = sessionStore.getSession(request.sessionId())
                .orElseThrow(() -> new SessionNotFoundException(request.sessionId()));

        // The engine mutates `session` in place and returns a turn whose session field is
        // intentionally null (the route already holds the session). Persist the same object
        // so the next turn sees the updated conversation state.
        InterviewResponse turn = interviewEngine.processTurn(session, request.message());
        sessionStore.updateSession(request.sessionId(), session);

        if (turn.done()) {
            Feedback feedback = feedbackService.generateFeedback(session);
            return new InterviewResponse(COMPLETION_REPLY, true, feedback, null);
        }
        return turn;
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
