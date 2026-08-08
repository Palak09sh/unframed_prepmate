package com.hackathon.interview.model;

import java.util.List;

/**
 * One day of the curriculum (curriculum.json {@code days} entry): the metadata
 * the engine uses to ground questions in what was actually taught.
 *
 * <p>NOTE (ownership): this is friend2's contract type for the InterviewEngine.
 * If Radhika's pushed model differs, reconcile on merge.</p>
 */
public record CurriculumDay(
        int day,
        String title,
        String type,
        List<String> tools,
        List<String> objectives) {
}
