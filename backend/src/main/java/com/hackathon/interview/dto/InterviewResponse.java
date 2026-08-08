package com.hackathon.interview.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.hackathon.interview.model.InterviewSession;

/**
 * Response body for {@code POST /api/interview}.
 * <ul>
 *   <li>During the interview: {@code {reply, done:false}}</li>
 *   <li>Final call: {@code {reply:"Interview completed.", done:true, feedback:{...}}}</li>
 * </ul>
 * <p>
 * {@code session} is the internal conversation state returned by the engine so the
 * controller can persist it. It is never serialized ({@code @JsonIgnore}) and
 * {@code null} {@code feedback} is omitted ({@code NON_NULL}) — the wire format is
 * exactly the shared API contract.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public record InterviewResponse(
        String reply,
        boolean done,
        Feedback feedback,
        @JsonIgnore InterviewSession session
) {
    /** Builds a response that carries no session (used for processTurn turns). */
    public static InterviewResponse turn(String reply, boolean done) {
        return new InterviewResponse(reply, done, null, null);
    }
}
