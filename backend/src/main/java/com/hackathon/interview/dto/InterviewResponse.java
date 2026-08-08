package com.hackathon.interview.dto;

import com.hackathon.interview.model.InterviewSession;

/**
 * Reply envelope returned by the engine.
 *
 * <p>The {@code reply}/{@code done}/{@code feedback} fields mirror the REST
 * contract exactly. {@code session} is a handoff seam, not part of the wire
 * format: it is populated on {@code startInterview} so the route can persist
 * the freshly built session via SessionStore, and {@code null} on
 * {@code processTurn} because the route already holds the session.</p>
 */
public record InterviewResponse(
        String reply,
        boolean done,
        Feedback feedback,
        InterviewSession session) {

    /** Builds a response that carries no session (used for processTurn turns). */
    public static InterviewResponse turn(String reply, boolean done) {
        return new InterviewResponse(reply, done, null, null);
    }
}
