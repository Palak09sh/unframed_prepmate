package com.hackathon.interview.model;

/**
 * Aggregate learning signals for a candidate.
 */
public record Signals(
        int commitDays,
        int missionsCompleted,
        int missionsFirstTry
) {}
