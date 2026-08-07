package com.hackathon.interview.model;

import java.util.ArrayList;
import java.util.List;

/**
 * In-memory conversation state, as required by CLAUDE.md. Held in the
 * {@link com.hackathon.interview.session.SessionStore} between requests and mutated
 * by the {@link com.hackathon.interview.service.InterviewEngine} each turn.
 * <p>
 * Fields: sessionId, candidate, history, targetDays, askedDays, questionCount, phase.
 */
public class InterviewSession {

    private String sessionId;
    private Candidate candidate;
    private List<ChatMessage> history = new ArrayList<>();
    private List<Integer> targetDays = new ArrayList<>();
    private List<Integer> askedDays = new ArrayList<>();
    private int questionCount;
    private String phase;

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public List<ChatMessage> getHistory() {
        return history;
    }

    public void setHistory(List<ChatMessage> history) {
        this.history = history;
    }

    public List<Integer> getTargetDays() {
        return targetDays;
    }

    public void setTargetDays(List<Integer> targetDays) {
        this.targetDays = targetDays;
    }

    public List<Integer> getAskedDays() {
        return askedDays;
    }

    public void setAskedDays(List<Integer> askedDays) {
        this.askedDays = askedDays;
    }

    public int getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(int questionCount) {
        this.questionCount = questionCount;
    }

    public String getPhase() {
        return phase;
    }

    public void setPhase(String phase) {
        this.phase = phase;
    }
}
