package com.hackathon.interview.model;

import java.util.ArrayList;
import java.util.List;

/**
 * Mutable per-interview state. Held in memory by Radhika's SessionStore and
 * passed in/out of the engine each turn.
 *
 * <p>Fields marked "engine-internal" are written by the InterviewEngine and
 * must persist across turns so the flow tracking survives — store the whole
 * session object, not just the documented fields.</p>
 */
public class InterviewSession {

    public static final String PHASE_INTERVIEWING = "interviewing";
    public static final String PHASE_DONE = "done";

    private String sessionId;
    private Candidate candidate;

    /** Claude-format conversation, e.g. [{role:"assistant",content:"..."}, ...]. */
    private List<ChatMessage> history = new ArrayList<>();

    /** Target curriculum days chosen at start (>= 4). */
    private List<Integer> targetDays = new ArrayList<>();

    /** Days the interview has asked about so far. */
    private List<Integer> askedDays = new ArrayList<>();

    /** Number of questions asked so far (opening counts as 1). */
    private int questionCount;

    /** "interviewing" or "done". */
    private String phase = PHASE_INTERVIEWING;

    // ---- engine-internal tracking (persist these too) ----
    /** Index into targetDays for the day currently being interviewed. */
    private int currentDayIndex;

    /** How many questions have been asked on the current day. */
    private int questionsOnCurrentDay;

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public Candidate getCandidate() { return candidate; }
    public void setCandidate(Candidate candidate) { this.candidate = candidate; }

    public List<ChatMessage> getHistory() { return history; }
    public void setHistory(List<ChatMessage> history) { this.history = history; }

    public List<Integer> getTargetDays() { return targetDays; }
    public void setTargetDays(List<Integer> targetDays) { this.targetDays = targetDays; }

    public List<Integer> getAskedDays() { return askedDays; }
    public void setAskedDays(List<Integer> askedDays) { this.askedDays = askedDays; }

    public int getQuestionCount() { return questionCount; }
    public void setQuestionCount(int questionCount) { this.questionCount = questionCount; }

    public String getPhase() { return phase; }
    public void setPhase(String phase) { this.phase = phase; }

    public int getCurrentDayIndex() { return currentDayIndex; }
    public void setCurrentDayIndex(int currentDayIndex) { this.currentDayIndex = currentDayIndex; }

    public int getQuestionsOnCurrentDay() { return questionsOnCurrentDay; }
    public void setQuestionsOnCurrentDay(int questionsOnCurrentDay) { this.questionsOnCurrentDay = questionsOnCurrentDay; }
}
