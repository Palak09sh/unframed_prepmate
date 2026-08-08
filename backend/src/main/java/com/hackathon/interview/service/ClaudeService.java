package com.hackathon.interview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.hackathon.interview.model.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.io.IOException;
import java.util.List;

/**
 * Thin, reusable transport over the Google Gemini API. Owned by Radhika.
 *
 * <p>This service knows nothing about interviews or feedback — it just turns a
 * system prompt plus conversation history into the assistant's text reply.
 * {@code InterviewEngine} uses it for question generation and follow-ups;
 * {@code FeedbackService} uses it for structured feedback.</p>
 *
 * <p>The class intentionally keeps the legacy name {@code ClaudeService} and its
 * {@link #complete(String, List)} contract so nothing downstream changes: the Agent
 * Core, the Spring config, and the test stand-ins ({@code FakeClaudeService},
 * {@code ThrowingClaudeService}) all bind to this name. The transport itself now
 * calls Gemini's {@code generateContent} REST endpoint (free tier, no credit card)
 * via {@link RestClient}; the Anthropic SDK is no longer used.</p>
 *
 * <p>Two constructor shapes exist so the Agent Core can stay Spring-free while the
 * service stays a Spring bean:</p>
 * <ul>
 *   <li>The {@code @Autowired} config constructor binds {@code application.yml}
 *       ({@code app.gemini.*}) and is what Spring uses at runtime.</li>
 *   <li>The no-arg constructor exists only for test stand-ins
 *       ({@code FakeClaudeService} / {@code ThrowingClaudeService}) that subclass
 *       this service and override {@link #complete(String, List)} — they never
 *       touch the client or the API.</li>
 * </ul>
 */
@Service
public class ClaudeService {

    private static final Logger log = LoggerFactory.getLogger(ClaudeService.class);

    private static final String DEFAULT_MODEL = "gemini-2.5-flash";
    private static final String API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestClient restClient;
    private final String apiKey;
    private final String model;
    private final long maxTokens;
    private final double temperature;

    /**
     * Test-only constructor (no Spring config): reads the same env vars the config
     * constructor is bound to. Subclasses override {@link #complete(String, List)},
     * so no API key or client is actually exercised.
     */
    public ClaudeService() {
        this(System.getenv("GEMINI_API_KEY"),
                System.getenv("GEMINI_MODEL") != null ? System.getenv("GEMINI_MODEL") : DEFAULT_MODEL,
                1024, 0.7);
    }

    @Autowired
    public ClaudeService(
            @Value("${app.gemini.api-key}") String apiKey,
            @Value("${app.gemini.model}") String model,
            @Value("${app.gemini.max-tokens}") long maxTokens,
            @Value("${app.gemini.temperature}") double temperature) {
        this.apiKey = apiKey;
        this.model = model;
        this.maxTokens = maxTokens;
        this.temperature = temperature;
        this.restClient = RestClient.builder().baseUrl(API_BASE_URL).build();
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("GEMINI_API_KEY is not set. The app still starts (health check works) "
                    + "but AI calls will fail at runtime.");
        }
    }

    /**
     * Compatibility entry point used by the InterviewEngine (Agent Core).
     * Delegates to {@link #sendMessage(String, List)}.
     *
     * @param systemPrompt role/persona instructions; may be {@code null} or blank
     * @param history      conversation so far, alternating user/assistant
     * @return the assistant's reply text
     * @throws ClaudeApiException if the API call fails (mapped to 502 by the global handler)
     */
    public String complete(String systemPrompt, List<ChatMessage> history) {
        return sendMessage(systemPrompt, history);
    }

    /**
     * Send a system prompt and full conversation history to Gemini and return the
     * assistant's text reply (all text parts joined).
     *
     * @param systemPrompt role/persona instructions; may be {@code null} or blank
     * @param history      conversation so far, alternating user/assistant
     * @return the assistant's reply text
     * @throws ClaudeApiException if the API call fails (mapped to 502 by the global handler)
     */
    public String sendMessage(String systemPrompt, List<ChatMessage> history) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ClaudeApiException("GEMINI_API_KEY is not set. The backend starts, but AI "
                    + "calls fail until the key is provided.", new IllegalStateException("missing key"));
        }
        try {
            String response = restClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/models/{model}:generateContent")
                            .build(model))
                    .header("x-goog-api-key", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(buildRequestBody(systemPrompt, history))
                    .retrieve()
                    .body(String.class);
            return extractText(response);
        } catch (RestClientException | IOException | IllegalArgumentException e) {
            log.error("Gemini API request failed: {}", e.getMessage());
            throw new ClaudeApiException("Gemini API request failed: " + e.getMessage(), e);
        }
    }

    /**
     * Builds the {@code generateContent} request body: optional system instruction,
     * conversation contents (Claude roles mapped to Gemini's {@code user}/{@code model}),
     * and generation config. Unknown roles are dropped — malformed history is never sent.
     */
    String buildRequestBody(String systemPrompt, List<ChatMessage> history) {
        ObjectNode root = objectMapper.createObjectNode();

        if (systemPrompt != null && !systemPrompt.isBlank()) {
            root.putObject("systemInstruction")
                    .putArray("parts").addObject().put("text", systemPrompt);
        }

        ArrayNode contents = root.putArray("contents");
        for (ChatMessage msg : history) {
            String geminiRole = "assistant".equals(msg.role()) ? "model" : msg.role();
            if (!"user".equals(geminiRole) && !"model".equals(geminiRole)) {
                continue;
            }
            contents.addObject()
                    .put("role", geminiRole)
                    .putArray("parts").addObject().put("text", msg.content());
        }

        root.putObject("generationConfig")
                .put("temperature", temperature)
                .put("maxOutputTokens", maxTokens);

        return root.toString();
    }

    /**
     * Joins all text parts of the first candidate. Throws when Gemini returns no
     * candidates or no text (e.g. a safety block), so the caller falls back.
     */
    String extractText(String response) throws IOException {
        JsonNode root = objectMapper.readTree(response);
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new IllegalArgumentException("Gemini returned no candidates.");
        }
        StringBuilder text = new StringBuilder();
        for (JsonNode part : candidates.get(0).path("content").path("parts")) {
            JsonNode textNode = part.get("text");
            if (textNode != null && textNode.isTextual()) {
                text.append(textNode.asText());
            }
        }
        String reply = text.toString().trim();
        if (reply.isEmpty()) {
            throw new IllegalArgumentException("Gemini returned no text content.");
        }
        return reply;
    }
}
