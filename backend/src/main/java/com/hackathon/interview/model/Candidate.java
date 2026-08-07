package com.hackathon.interview.model;

import java.util.List;

/**
 * A candidate, matching the shape of candidates.json. Sent by the frontend on the
 * first request and used by the engine to select target curriculum days.
 */
public record Candidate(
        String id,
        String name,
        Member member,
        List<Mission> missions,
        Signals signals
) {}
