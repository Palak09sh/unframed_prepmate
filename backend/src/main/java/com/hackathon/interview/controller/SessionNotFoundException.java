package com.hackathon.interview.controller;

/**
 * Thrown when a follow-up request references a session the store does not know.
 * Mapped to 404 by {@link GlobalExceptionHandler}.
 */
public class SessionNotFoundException extends RuntimeException {

    public SessionNotFoundException(String sessionId) {
        super("Session not found or expired: " + sessionId);
    }
}
