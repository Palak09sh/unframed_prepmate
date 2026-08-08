package com.hackathon.interview.model;

/**
 * Candidate's role/experience summary (candidates.json {@code member} block).
 */
public record CandidateMember(String role, int experience) {
}
