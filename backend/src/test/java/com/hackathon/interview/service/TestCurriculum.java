package com.hackathon.interview.service;

import com.hackathon.interview.model.CurriculumDay;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * In-code mirror of curriculum.json for days used by the tests, so the engine
 * can be exercised without Jackson or the classpath resource.
 */
public final class TestCurriculum {

    private TestCurriculum() {
    }

    public static Map<Integer, CurriculumDay> all() {
        Map<Integer, CurriculumDay> map = new LinkedHashMap<>();
        map.put(1, day(1, "HTML & CSS", "practice", "HTML,CSS"));
        map.put(2, day(2, "Prompting Basics", "practice", "prompt design"));
        map.put(3, day(3, "JavaScript", "practice", "JavaScript"));
        map.put(4, day(4, "Data Cleaning", "practice", "Pandas"));
        map.put(5, day(5, "RAG Fundamentals", "lesson", "embeddings, vector stores"));
        map.put(6, day(6, "Accessibility", "practice", "ARIA"));
        map.put(7, day(7, "Statistics", "practice", "scipy"));
        map.put(8, day(8, "Agents", "lesson", "tools, orchestration"));
        map.put(9, day(9, "Performance", "practice", "Lighthouse"));
        map.put(12, day(12, "Evaluation", "lesson", "evals"));
        map.put(13, day(13, "MLOps", "practice", "Docker"));
        map.put(14, day(14, "Testing", "practice", "Jest"));
        map.put(15, day(15, "Fine-tuning", "lesson", "datasets"));
        map.put(16, day(16, "Storytelling", "practice", "dashboards"));
        // A few more days so "pad to >= 4" has room when missions are sparse.
        map.put(17, day(17, "Agent Orchestration", "project", "multi-agent"));
        map.put(18, day(18, "Vector Databases", "practice", "ChromaDB"));
        map.put(19, day(19, "Prompt Caching & Cost", "lesson", "caching"));
        map.put(20, day(20, "Multimodal Inputs", "practice", "vision"));
        return map;
    }

    private static CurriculumDay day(int day, String title, String type, String toolsCsv) {
        List<String> tools = List.of(toolsCsv.split(","));
        List<String> objectives = List.of("Master " + title, "Apply " + title + " in practice");
        return new CurriculumDay(day, title, type, tools, objectives);
    }
}
