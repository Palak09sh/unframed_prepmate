package com.hackathon.interview.service;

/**
 * Thrown when the Anthropic Claude API call fails (network, rate limit,
 * auth, malformed response, etc.). Mapped to 502 Bad Gateway by the
 * {@code GlobalExceptionHandler} so the frontend sees a clear error
 * instead of a fabricated assistant reply.
 */
public class ClaudeApiException extends RuntimeException {

    public ClaudeApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
