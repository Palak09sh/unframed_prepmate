package com.hackathon.interview.service;

import com.hackathon.interview.dto.InterviewResponse;
import com.hackathon.interview.model.Candidate;
import com.hackathon.interview.model.ChatMessage;
import com.hackathon.interview.model.InterviewSession;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * TEMPORARY STUB — owned by Developer 2 (Agent Core). Replace the bodies; do NOT change
 * the method signatures or the {@link InterviewResponse} shape (my controller depends on them).
 * <p>
 * This implements the exact public contract deterministically (no LLM) so the controller,
 * session store and feedback pipeline can be exercised end-to-end before the real engine lands.
 * It enforces the 8-question / 4-day minimum in code, never by trusting a model to count.
 */
@Service
public class InterviewEngine {

    private static final List<Integer> STUB_TARGET_DAYS = List.of(1, 2, 3, 4);
    private static final int MIN_QUESTIONS = 8;
    private static final int MIN_DAYS = 4;

    /** Called once per session. Builds the initial state and returns the opening question. */
    public InterviewResponse startInterview(Candidate candidate) {
        InterviewSession session = new InterviewSession();
        session.setCandidate(candidate);
        session.setTargetDays(new ArrayList<>(STUB_TARGET_DAYS));
        session.setHistory(new ArrayList<>());
        session.setQuestionCount(1);
        session.setPhase("interviewing");

        String opening = "Welcome! Let's begin your technical interview. "
                + "Starting with Day 1: can you explain how a machine-learning model learns from data?";
        session.getHistory().add(new ChatMessage("assistant", opening));

        return new InterviewResponse(opening, false, null, session);
    }

    /** Called on every subsequent turn. Advances the interview and decides when it is done. */
    public InterviewResponse processTurn(InterviewSession session, String message) {
        session.getHistory().add(new ChatMessage("user", message));
        session.setQuestionCount(session.getQuestionCount() + 1);

        // Advance the cursor through targetDays, marking each as asked (code-enforced).
        int nextDayIndex = session.getAskedDays().size();
        if (nextDayIndex < session.getTargetDays().size()) {
            int day = session.getTargetDays().get(nextDayIndex);
            if (!session.getAskedDays().contains(day)) {
                session.getAskedDays().add(day);
            }
        }

        boolean done = session.getQuestionCount() >= MIN_QUESTIONS
                && session.getAskedDays().size() >= MIN_DAYS;

        String reply;
        if (done) {
            session.setPhase("done");
            reply = "Thank you — the interview is complete.";
        } else {
            int day = session.getTargetDays().get(Math.min(nextDayIndex, session.getTargetDays().size() - 1));
            reply = "Got it. Next, Day " + day + ": "
                    + "what approach would you take to solve a real-world problem with this topic?";
        }
        session.getHistory().add(new ChatMessage("assistant", reply));

        return new InterviewResponse(reply, done, null, session);
    }
}
