package com.hackathon.interview.dto;

import java.util.List;

/**
 * Structured interview feedback, produced by {@link com.hackathon.interview.service.FeedbackService}
 * when the interview is {@code done}.
 */
public record Feedback(
        String summary,
        List<String> strengths,
        List<String> gaps,
        List<String> next
) {}
