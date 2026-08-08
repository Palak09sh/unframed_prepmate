package com.hackathon.interview.config;

import com.hackathon.interview.model.CurriculumDay;
import com.hackathon.interview.service.ClaudeService;
import com.hackathon.interview.service.CurriculumLoader;
import com.hackathon.interview.service.InterviewEngine;
import java.util.Map;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Wires the Agent Core engine into the Spring context.
 *
 * <p>{@link InterviewEngine} is deliberately Spring-free (friend2's module, unit-tested
 * standalone), so it is assembled here as a bean from the two services it depends on:
 * {@link ClaudeService} for LLM calls and the AI Cohort curriculum map loaded from
 * {@code curriculum.json}.</p>
 */
@Configuration
public class InterviewEngineConfig {

    @Bean
    public InterviewEngine interviewEngine(ClaudeService claudeService) {
        return new InterviewEngine(claudeService, CurriculumLoader.load());
    }
}
