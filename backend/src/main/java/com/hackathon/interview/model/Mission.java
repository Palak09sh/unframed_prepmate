package com.hackathon.interview.model;

/**
 * One curriculum mission a candidate attempted.
 * <p>
 * Two shapes are accepted (JSON from candidates.json):
 * <pre>
 *   { "day": 6, "title": "Pandas Basics", "passed": false, "attempts": 4 }
 *   { "day": 9, "title": "Probability Foundations", "skipped": true }
 * </pre>
 * High {@code attempts} (3+) or {@code skipped: true} mark weak spots worth probing.
 */
public record Mission(
        int day,
        String title,
        Boolean passed,
        Integer attempts,
        Boolean skipped
) {}
