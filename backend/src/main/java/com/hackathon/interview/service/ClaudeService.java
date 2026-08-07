package com.hackathon.interview.service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.errors.AnthropicServiceException;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import com.hackathon.interview.model.ChatMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Thin, reusable transport over the Anthropic Claude API. Owned by Radhika.
 *
 * <p>This service knows nothing about interviews or feedback — it just turns a
 * system prompt plus conversation history into the assistant's text reply.
 * {@code InterviewEngine} uses it for question generation and follow-ups;
 * {@code FeedbackService} uses it for structured feedback.</p>
 *
 * <p>SDK: {@code com.anthropic:anthropic-java} (official Anthropic Java SDK).</p>
 */
@Service
public class ClaudeService {

    private static final Logger log = LoggerFactory.getLogger(ClaudeService.class);

    private final AnthropicClient client;
    private final String model;
    private final long maxTokens;
    private final double temperature;

    public ClaudeService(
            @Value("${app.claude.api-key}") String apiKey,
            @Value("${app.claude.model}") String model,
            @Value("${app.claude.max-tokens}") long maxTokens,
            @Value("${app.claude.temperature}") double temperature) {
        this.model = model;
        this.maxTokens = maxTokens;
        this.temperature = temperature;

        if (apiKey == null || apiKey.isBlank()) {
            log.warn("ANTHROPIC_API_KEY is not set. The app still starts (health check works) "
                    + "but Claude API calls will fail at runtime.");
            this.client = AnthropicOkHttpClient.builder().build();
        } else {
            this.client = AnthropicOkHttpClient.builder().apiKey(apiKey).build();
        }
    }

    /**
     * Send a system prompt and full conversation history to Claude and return the
     * assistant's text reply (all text blocks joined).
     *
     * @param systemPrompt role/persona instructions; may be {@code null} or blank
     * @param history      conversation so far, alternating user/assistant
     * @return the assistant's reply text
     * @throws ClaudeApiException if the API call fails (mapped to 502 by the global handler)
     */
    public String sendMessage(String systemPrompt, List<ChatMessage> history) {
        MessageCreateParams.Builder builder = MessageCreateParams.builder()
                .model(model)
                .maxTokens(maxTokens)
                // NOTE: rejected with a 400 on Opus 4.7+ / Sonnet 5 / Fable 5.
                // Fine for the default model (claude-haiku-4-5). If the model is
                // upgraded to a 5-series family, drop temperature/top_p.
                .temperature(temperature);

        if (systemPrompt != null && !systemPrompt.isBlank()) {
            builder.system(systemPrompt);
        }

        for (ChatMessage msg : history) {
            if ("user".equals(msg.role())) {
                builder.addUserMessage(msg.content());
            } else if ("assistant".equals(msg.role())) {
                builder.addAssistantMessage(msg.content());
            }
            // Unknown roles are skipped — never send malformed history to the API.
        }

        try {
            Message response = client.messages().create(builder.build());
            return response.content().stream()
                    .flatMap(block -> block.text().stream())
                    .map(textBlock -> textBlock.text())
                    .collect(Collectors.joining("\n"));
        } catch (AnthropicServiceException e) {
            log.error("Claude API request failed: {}", e.getMessage());
            throw new ClaudeApiException("Claude API request failed: " + e.getMessage(), e);
        }
    }
}
