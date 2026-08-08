package com.hackathon.interview.model;

/**
 * A single mission record from the candidate's learning history
 * (candidates.json {@code missions} entry).
 *
 * <p>Missions are either {@code {day, title, passed, attempts}} or
 * {@code {day, title, skipped: true}}. The nullable fields represent that
 * union: when {@code skipped} is {@code true}, {@code passed} and
 * {@code attempts} are {@code null}, and vice-versa.</p>
 */
public record CandidateMission(
        int day,
        String title,
        Boolean passed,
        Integer attempts,
        Boolean skipped) {

    /** Whether this mission is a "weak spot": skipped, or struggled (3+ attempts and not passed). */
    public boolean isWeak() {
        return Boolean.TRUE.equals(skipped())
                || (attempts() != null && attempts() >= 3 && !Boolean.TRUE.equals(passed()));
    }
}
