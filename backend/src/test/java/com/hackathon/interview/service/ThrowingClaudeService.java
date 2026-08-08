package com.hackathon.interview.service;

import com.hackathon.interview.model.ChatMessage;

import java.util.List;

/** Claude stand-in that always fails — used to prove the engine's fallback path. */
public class ThrowingClaudeService extends ClaudeService {

    public ThrowingClaudeService() {
        super();
    }

    @Override
    public String complete(String systemPrompt, List<ChatMessage> messages) {
        throw new RuntimeException("simulated Claude API outage");
    }
}
