package com.hackathon.interview.service;

import com.hackathon.interview.model.Candidate;
import com.hackathon.interview.model.CandidateMember;
import com.hackathon.interview.model.CandidateMission;
import com.hackathon.interview.model.CandidateSignals;

import java.util.List;

/**
 * Sample candidates mirroring the frontend's hardcoded pool (candidates.json
 * shape). Each encodes different weak-spot patterns for the selection logic.
 */
public final class TestCandidates {

    private TestCandidates() {
    }

    /** AI Engineer: skipped Day 8, failed RAG (3 attempts), failed Fine-tuning (4 attempts). */
    public static Candidate aiEngineer() {
        return new Candidate(
                new CandidateMember("AI Engineer", 2),
                List.of(
                        mission(2, "Day 2 - Prompting Basics", true, 1),
                        mission(5, "Day 5 - RAG Fundamentals", false, 3),
                        skipped(8, "Day 8 - Agents"),
                        mission(12, "Day 12 - Evaluation", true, 1),
                        mission(15, "Day 15 - Fine-tuning", false, 4)),
                new CandidateSignals(10, 3, 2));
    }

    /** Web Developer: two skipped days (6, 14), one failed (9). */
    public static Candidate webDeveloper() {
        return new Candidate(
                new CandidateMember("Web Developer", 1),
                List.of(
                        mission(1, "Day 1 - HTML & CSS", true, 1),
                        mission(3, "Day 3 - JavaScript", true, 2),
                        skipped(6, "Day 6 - Accessibility"),
                        mission(9, "Day 9 - Performance", false, 3),
                        skipped(14, "Day 14 - Testing")),
                new CandidateSignals(6, 2, 1));
    }

    /** Data Scientist: skipped Day 16, failed MLOps (3 attempts). */
    public static Candidate dataScientist() {
        return new Candidate(
                new CandidateMember("Data Scientist", 4),
                List.of(
                        mission(4, "Day 4 - Data Cleaning", true, 1),
                        mission(7, "Day 7 - Statistics", true, 1),
                        mission(11, "Day 11 - Modeling", true, 2),
                        mission(13, "Day 13 - MLOps", false, 3),
                        skipped(16, "Day 16 - Storytelling")),
                new CandidateSignals(14, 4, 3));
    }

    /** No weak spots and only 2 missions — forces curriculum padding to reach 4 days. */
    public static Candidate noWeakSpotsSparse() {
        return new Candidate(
                new CandidateMember("Junior Engineer", 0),
                List.of(
                        mission(2, "Day 2 - Prompting Basics", true, 1),
                        mission(5, "Day 5 - RAG Fundamentals", true, 1)),
                new CandidateSignals(3, 2, 2));
    }

    private static CandidateMission mission(int day, String title, boolean passed, int attempts) {
        return new CandidateMission(day, title, passed, attempts, null);
    }

    private static CandidateMission skipped(int day, String title) {
        return new CandidateMission(day, title, null, null, true);
    }
}
