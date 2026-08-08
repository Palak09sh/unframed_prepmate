package com.hackathon.interview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.interview.model.ChatMessage;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Unit tests for {@link ClaudeService}'s Gemini request mapping and response
 * parsing. No network is touched: {@code buildRequestBody} and {@code extractText}
 * are package-private seams exercised directly.
 */
class ClaudeServiceTest {

    private final ClaudeService service = new ClaudeService("test-key", "gemini-2.5-flash", 100, 0.7);
    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void requestBody_mapsSystemPromptAndClaudeRoles() throws Exception {
        String body = service.buildRequestBody("You are an interviewer.", List.of(
                new ChatMessage("user", "hi"),
                new ChatMessage("assistant", "hello"),
                new ChatMessage("system", "must be skipped")));

        JsonNode root = mapper.readTree(body);

        assertEquals("You are an interviewer.",
                root.path("systemInstruction").path("parts").get(0).path("text").asText());

        JsonNode contents = root.path("contents");
        assertEquals(2, contents.size(), "unknown roles must be dropped");
        assertEquals("user", contents.get(0).path("role").asText());
        assertEquals("model", contents.get(1).path("role").asText());
        assertEquals("hi", contents.get(0).path("parts").get(0).path("text").asText());
        assertEquals("hello", contents.get(1).path("parts").get(0).path("text").asText());

        assertEquals(0.7, root.path("generationConfig").path("temperature").asDouble());
        assertEquals(100, root.path("generationConfig").path("maxOutputTokens").asLong());
    }

    @Test
    void requestBody_omitsBlankSystemPrompt() {
        String body = service.buildRequestBody("   ", List.of(new ChatMessage("user", "hi")));
        assertFalse(body.contains("systemInstruction"));
    }

    @Test
    void extractText_joinsAllCandidateParts() throws Exception {
        String response = """
                {"candidates":[{"content":{"parts":[
                    {"text":"First "},
                    {"text":"second."}
                ]}}]}""";
        assertEquals("First second.", service.extractText(response));
    }

    @Test
    void extractText_throwsWhenGeminiBlocksTheRequest() {
        assertThrows(IllegalArgumentException.class, () -> service.extractText("{\"candidates\":[]}"));
    }
}
