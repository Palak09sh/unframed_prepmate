package com.hackathon.interview.service;

import com.hackathon.interview.dto.Feedback;
import com.hackathon.interview.model.InterviewSession;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * Generates structured interview feedback from a completed session.
 * <p>
 * TEMPORARY: currently returns a safe placeholder so the end-to-end flow (including the
 * final response contract) is testable. Milestone 3 wires this to {@link ClaudeService}
 * with a prompt producing {@code {summary, strengths, gaps, next}} and a fallback on parse errors.
 */
@Service
public class FeedbackService {

    public Feedback generateFeedback(InterviewSession session) {
        return new Feedback(
                "Placeholder summary — real feedback generation lands in Milestone 3.",
                List.of("placeholder strength"),
                List.of("placeholder gap"),
                List.of("Review your notes and try again tomorrow.")
        );
    }
}
