package com.hackathon.interview.service;

/**
 * Thrown when the AI provider call fails (missing key, network, rate limit,
 * auth, malformed response, etc.). Mapped to 502 Bad Gateway by the
 * {@code GlobalExceptionHandler} so the frontend sees a clear error
 * instead of a fabricated assistant reply.
 *
 * <p>The name is kept for compatibility: the transport is now the Gemini API,
 * but nothing downstream (engine, feedback, controller, tests) should change.</p>
 */
public class ClaudeApiException extends RuntimeException {

    public ClaudeApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
