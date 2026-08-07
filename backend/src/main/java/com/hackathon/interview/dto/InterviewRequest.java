package com.hackathon.interview.dto;

import com.hackathon.interview.model.Candidate;
import jakarta.validation.constraints.NotBlank;

/**
 * Request body for {@code POST /api/interview}.
 * <p>
 * First call: {@code {sessionId, candidate}}.
 * Follow-up call: {@code {sessionId, message}}.
 * Exactly one of {@code candidate}/{@code message} must be present — enforced in the controller.
 */
public record InterviewRequest(
        @NotBlank(message = "sessionId is required") String sessionId,
        Candidate candidate,
        String message
) {}
