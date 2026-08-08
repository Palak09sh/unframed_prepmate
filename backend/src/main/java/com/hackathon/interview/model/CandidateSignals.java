package com.hackathon.interview.model;

/**
 * Candidate's aggregate learning signals (candidates.json {@code signals} block).
 */
public record CandidateSignals(int commitDays, int missionsCompleted, int missionsFirstTry) {
}
