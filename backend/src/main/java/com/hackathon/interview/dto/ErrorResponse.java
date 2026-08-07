package com.hackathon.interview.dto;

/**
 * Standard error body for non-2xx responses, e.g. {@code {"error": "..."}}.
 */
public record ErrorResponse(String error) {}
