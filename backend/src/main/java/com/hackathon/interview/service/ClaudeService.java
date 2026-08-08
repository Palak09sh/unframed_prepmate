package com.hackathon.interview.service;

import com.hackathon.interview.model.ChatMessage;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * <b>Contract stub — Radhika owns this file.</b> It exists only so
 * InterviewEngine compiles and runs until her real backend is pushed. Replace
 * freely on merge, but KEEP the method the engine calls:
 *
 * <pre>String complete(String systemPrompt, List&lt;ChatMessage&gt; messages)</pre>
 *
 * <p>The stub is a working Anthropic Messages-API client built on the JDK
 * HttpClient (no external deps). Reads {@code ANTHROPIC_API_KEY} and optional
 * {@code ANTHROPIC_MODEL} (default: Haiku 4.5) from the environment.</p>
 */
public class ClaudeService {

    static final String API_URL = "https://api.anthropic.com/v1/messages";
    static final String ANTHROPIC_VERSION = "2023-06-01";
    static final String DEFAULT_MODEL = "claude-haiku-4-5-20251001";
    static final int MAX_TOKENS = 500;

    private static final Pattern TEXT_BLOCK =
            Pattern.compile("\"type\":\\s*\"text\"\\s*,\\s*\"text\":\\s*\"((?:\\\\.|[^\"\\\\])*)\"");

    private final HttpClient http;
    private final String apiKey;
    private final String model;

    public ClaudeService() {
        this(System.getenv("ANTHROPIC_API_KEY"), System.getenv("ANTHROPIC_MODEL"));
    }

    public ClaudeService(String apiKey, String model) {
        this.apiKey = apiKey;
        this.model = (model == null || model.isBlank()) ? DEFAULT_MODEL : model.trim();
        this.http = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(30)).build();
    }

    /** Calls the Messages API and returns the assistant's reply text. */
    public String complete(String systemPrompt, List<ChatMessage> messages) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("ANTHROPIC_API_KEY is not set");
        }
        HttpRequest request = HttpRequest.newBuilder(URI.create(API_URL))
                .header("x-api-key", apiKey)
                .header("anthropic-version", ANTHROPIC_VERSION)
                .header("content-type", "application/json")
                .timeout(Duration.ofSeconds(60))
                .POST(HttpRequest.BodyPublishers.ofString(buildRequestBody(systemPrompt, messages)))
                .build();
        try {
            HttpResponse<String> response = http.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new RuntimeException("Claude API error " + response.statusCode() + ": " + response.body());
            }
            return extractText(response.body());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Claude API call interrupted", e);
        } catch (IOException e) {
            throw new RuntimeException("Claude API call failed", e);
        }
    }

    private String buildRequestBody(String systemPrompt, List<ChatMessage> messages) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"model\":").append(quote(model))
                .append(",\"max_tokens\":").append(MAX_TOKENS)
                .append(",\"system\":").append(quote(systemPrompt))
                .append(",\"messages\":[");
        for (int i = 0; i < messages.size(); i++) {
            ChatMessage m = messages.get(i);
            if (i > 0) {
                sb.append(',');
            }
            sb.append("{\"role\":").append(quote(m.role()))
                    .append(",\"content\":").append(quote(m.content()))
                    .append('}');
        }
        sb.append("]}");
        return sb.toString();
    }

    private static String quote(String s) {
        return "\"" + escapeJson(s) + "\"";
    }

    static String escapeJson(String s) {
        StringBuilder sb = new StringBuilder(s.length() + 16);
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> {
                    if (c < 0x20) {
                        sb.append(String.format("\\u%04x", (int) c));
                    } else {
                        sb.append(c);
                    }
                }
            }
        }
        return sb.toString();
    }

    /** Pulls every text block's content out of a Messages-API response. */
    static String extractText(String json) {
        StringBuilder out = new StringBuilder();
        Matcher m = TEXT_BLOCK.matcher(json);
        while (m.find()) {
            out.append(unescapeJson(m.group(1)));
        }
        return out.toString().trim();
    }

    static String unescapeJson(String s) {
        StringBuilder sb = new StringBuilder(s.length());
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\' && i + 1 < s.length()) {
                char n = s.charAt(++i);
                switch (n) {
                    case '"' -> sb.append('"');
                    case '\\' -> sb.append('\\');
                    case 'n' -> sb.append('\n');
                    case 'r' -> sb.append('\r');
                    case 't' -> sb.append('\t');
                    case 'u' -> {
                        if (i + 4 < s.length()) {
                            sb.append((char) Integer.parseInt(s.substring(i + 1, i + 5), 16));
                            i += 4;
                        }
                    }
                    default -> sb.append(n);
                }
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
