package com.hackathon.interview.model;

/**
 * One entry in the conversation history. {@code role} is {@code "user"} or {@code "assistant"}.
 */
public record ChatMessage(String role, String content) {}
