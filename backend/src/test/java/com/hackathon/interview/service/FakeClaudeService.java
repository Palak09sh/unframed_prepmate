package com.hackathon.interview.service;

import com.hackathon.interview.model.ChatMessage;

import java.util.ArrayList;
import java.util.List;

/**
 * Deterministic Claude stand-in for the standalone self-test and the JUnit
 * tests. Records every call so tests can assert on prompts and conversation.
 */
public class FakeClaudeService extends ClaudeService {

    public final List<String> systemPrompts = new ArrayList<>();
    public final List<List<ChatMessage>> messageCalls = new ArrayList<>();

    private int questionSeq;

    public FakeClaudeService() {
        super(); // env apiKey may be unset; harmless because complete() is overridden
    }

    @Override
    public String complete(String systemPrompt, List<ChatMessage> messages) {
        systemPrompts.add(systemPrompt);
        messageCalls.add(new ArrayList<>(messages));
        questionSeq++;
        return "Q" + questionSeq + ": " + lastCandidateContent(messages);
    }

    /** The last real candidate message (skips ephemeral INTERVIEWER INSTRUCTION messages). */
    private String lastCandidateContent(List<ChatMessage> messages) {
        for (int i = messages.size() - 1; i >= 0; i--) {
            ChatMessage m = messages.get(i);
            if ("user".equals(m.role()) && !m.content().startsWith(InterviewEngine.INSTRUCTION_PREFIX)) {
                return m.content();
            }
        }
        return "(opening)";
    }
}
