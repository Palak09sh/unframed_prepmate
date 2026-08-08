package com.hackathon.interview.model;

/**
 * A single conversation turn in Claude's message format.
 *
 * <p>NOTE (ownership): this is friend2's contract type for the InterviewEngine.
 * If Radhika's pushed model differs, reconcile on merge — do not change the
 * engine's usage without telling her.</p>
 */
public record ChatMessage(String role, String content) {
}
