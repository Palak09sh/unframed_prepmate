package com.hackathon.interview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hackathon.interview.dto.Feedback;
import com.hackathon.interview.model.Candidate;
import com.hackathon.interview.model.ChatMessage;
import com.hackathon.interview.model.InterviewSession;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Generates structured interview feedback from a completed interview session.
 *
 * <p>Owned by Radhika. Builds a coaching prompt from the candidate profile and the
 * full conversation transcript, asks the AI service (via {@link ClaudeService}) for
 * strict JSON — {@code {summary, strengths, gaps, next}} — then parses it tolerantly.
 * If the AI call fails or returns malformed output it falls back to a generic but
 * honest summary, so the {@code POST /api/interview} completion never fails and the
 * response contract (a {@link Feedback} object) is preserved.</p>
 *
 * <p>The API key is never touched here: {@link ClaudeService} reads it from the
 * environment ({@code GEMINI_API_KEY}). Nothing is hardcoded.</p>
 */
@Service
public class FeedbackService {

    private static final Logger log = LoggerFactory.getLogger(FeedbackService.class);

    /** Closing directive so Claude knows to emit the JSON now (mirrors the engine's directive pattern). */
    private static final String OUTPUT_INSTRUCTION =
            "Based on the interview above, produce the structured feedback JSON now. "
                    + "Return ONLY the JSON object and nothing else.";

    private final ClaudeService claudeService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public FeedbackService(ClaudeService claudeService) {
        this.claudeService = claudeService;
    }

    /**
     * Generates structured feedback for a completed session. Never throws: any Claude or
     * parse failure falls back to a generic summary so the API contract is preserved.
     */
    public Feedback generateFeedback(InterviewSession session) {
        try {
            String raw = claudeService.complete(buildSystemPrompt(session), buildTranscript(session));
            return parse(raw);
        } catch (Exception e) {
            log.warn("Feedback generation failed ({}); returning fallback feedback.", e.getMessage());
            return fallbackFeedback();
        }
    }

    // ------------------------------------------------------------------
    // Prompting
    // ------------------------------------------------------------------

    private String buildSystemPrompt(InterviewSession session) {
        String background = "the candidate";
        Candidate candidate = session.getCandidate();
        if (candidate != null && candidate.member() != null) {
            background = candidate.member().role() + " with "
                    + candidate.member().experience() + " year(s) of experience";
        }
        return """
                You are an expert technical interviewer coach for an AI cohort program.
                The candidate is: %s.

                You will receive the full transcript of an interview that covered multiple
                curriculum days. Write a constructive, specific and honest evaluation of the
                candidate's performance in that interview.

                Return ONLY valid JSON with exactly this shape (no markdown, no code fence,
                no commentary):
                {
                  "summary": "one to three sentences summarizing overall performance",
                  "strengths": ["2 to 4 concrete strengths observed"],
                  "gaps": ["2 to 4 knowledge or skill gaps revealed"],
                  "next": ["2 to 4 concrete next actions for the candidate"]
                }

                Ground every point in what the candidate actually said. Do not invent topics
                that were not discussed.
                """.formatted(background);
    }

    /**
     * The conversation transcript plus a closing directive asking for the JSON. The
     * directive is framed as an instruction, not a candidate answer.
     */
    private List<ChatMessage> buildTranscript(InterviewSession session) {
        List<ChatMessage> transcript = new ArrayList<>(session.getHistory());
        transcript.add(new ChatMessage("user", "INTERVIEWER INSTRUCTION: " + OUTPUT_INSTRUCTION));
        return transcript;
    }

    // ------------------------------------------------------------------
    // Parsing
    // ------------------------------------------------------------------

    /**
     * Tolerantly parses the JSON feedback. Accepts a bare object, prose wrapped around an
     * object, or a markdown code fence. Throws on unparseable output so the caller falls back.
     */
    private Feedback parse(String raw) throws Exception {
        String json = extractJsonObject(raw);
        JsonNode root = objectMapper.readTree(json);
        return new Feedback(
                textOf(root, "summary"),
                listOf(root, "strengths"),
                listOf(root, "gaps"),
                listOf(root, "next"));
    }

    /** Pulls the outermost JSON object out of a possibly-noisy response. */
    private static String extractJsonObject(String raw) {
        if (raw == null) {
            throw new IllegalArgumentException("Claude returned no feedback text");
        }
        String s = raw.trim();
        if (s.startsWith("```")) {
            // Drop the code-fence opener line (e.g. ```json) and the trailing fence.
            int firstLineBreak = s.indexOf('\n');
            if (firstLineBreak >= 0) {
                s = s.substring(firstLineBreak + 1);
            }
            s = s.replaceAll("```[a-zA-Z]*\\s*$", "").trim();
        }
        int start = s.indexOf('{');
        int end = s.lastIndexOf('}');
        if (start < 0 || end < start) {
            throw new IllegalArgumentException("No JSON object found in feedback response");
        }
        return s.substring(start, end + 1);
    }

    private static String textOf(JsonNode root, String field) {
        JsonNode node = root.get(field);
        return node == null || node.isNull() || !node.isValueNode() ? "" : node.asText().trim();
    }

    private static List<String> listOf(JsonNode root, String field) {
        JsonNode node = root.get(field);
        if (node == null || !node.isArray()) {
            return List.of();
        }
        List<String> items = new ArrayList<>();
        for (JsonNode item : node) {
            if (item.isTextual() && !item.asText().isBlank()) {
                items.add(item.asText().trim());
            }
        }
        return List.copyOf(items);
    }

    private static Feedback fallbackFeedback() {
        return new Feedback(
                "A detailed automatic review was unavailable for this session.",
                List.of("Completed the full interview across multiple curriculum days."),
                List.of("A deeper analysis of the transcript was not available — review the days "
                        + "covered and note any answers that felt uncertain."),
                List.of("Revisit the curriculum days covered and redo any missions marked as "
                        + "skipped or difficult."));
    }
}
