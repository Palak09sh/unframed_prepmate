package com.hackathon.interview.session;

import com.hackathon.interview.model.InterviewSession;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.springframework.stereotype.Service;

/**
 * In-memory session store backed by a {@link ConcurrentHashMap}, per CLAUDE.md.
 * <p>
 * Known limitation (intentional for the hackathon): state lives only in this JVM's
 * heap. A restart or a second instance loses all interviews — which is exactly why the
 * backend must run as a long-lived server (Render web service), not serverless.
 */
@Service
public class SessionStore {

    private final ConcurrentMap<String, InterviewSession> sessions = new ConcurrentHashMap<>();

    public void createSession(String sessionId, InterviewSession session) {
        sessions.put(sessionId, session);
    }

    public Optional<InterviewSession> getSession(String sessionId) {
        return Optional.ofNullable(sessions.get(sessionId));
    }

    public void updateSession(String sessionId, InterviewSession session) {
        sessions.put(sessionId, session);
    }

    public void removeSession(String sessionId) {
        sessions.remove(sessionId);
    }
}
