package com.hackathon.interview.model;

import java.util.List;
import java.util.Optional;

/**
 * Candidate profile the interview is built around (candidates.json shape).
 */
public record Candidate(
        CandidateMember member,
        List<CandidateMission> missions,
        CandidateSignals signals) {

    /** The recorded mission for {@code day}, if the candidate attempted/skipped it. */
    public Optional<CandidateMission> missionForDay(int day) {
        if (missions == null) {
            return Optional.empty();
        }
        return missions.stream().filter(m -> m.day() == day).findFirst();
    }
}
