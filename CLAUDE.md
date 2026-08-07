\# AI Interview Agent - Claude Code Instructions

\## Purpose

This repository is being developed during a hackathon by a team of three developers using Claude Code.

Your job is to help implement features while strictly following the architecture, ownership boundaries, and coding standards defined below.

Do not redesign the project unless explicitly asked.

\---

\# Project Overview

Build an AI-powered Interview Agent that:

\- Conducts a technical interview.

\- Uses curriculum and candidate progress data.

\- Maintains conversation state.

\- Covers at least four curriculum days.

\- Asks at least eight technical questions.

\- Generates structured interview feedback.

The final submission must be production-quality within hackathon scope and fully deployable.

\---

\# Technology Stack

\## Frontend

\- React

\- Vite

\- Tailwind CSS

\## Backend

\- Java 21+ (or project JDK)

\- Spring Boot

\- Spring Web

\- Spring Validation

\- Jackson

\## AI

\- Anthropic Claude API

\## Deployment

Frontend

\- Vercel

Backend

\- Render

\---

\# Repository Ownership

\## Developer 1 (Leader)

Owns

/frontend

Responsibilities

\- Complete UI

\- Chat screen

\- Feedback screen

\- API integration

\- Responsive design

Do not modify backend.

\---

\## Developer 2 (Agent Core)

Owns

src/main/java/.../service/InterviewEngine.java

Responsibilities

\- Prompt engineering

\- Question generation

\- Follow-up logic

\- Curriculum selection

\- Interview flow

Do not modify

\- Controller

\- Session Store

\- Feedback Service

\---

\## Developer 3 (Backend)

Owns

controller/

session/

FeedbackService.java

ClaudeService.java

Configuration

Deployment

README

Responsibilities

\- REST APIs

\- Session lifecycle

\- Feedback generation

\- Validation

\- Claude API integration

\- Deployment

Do not modify InterviewEngine.java.

\---

\# Folder Structure

backend/

src/main/java/com/hackathon/interview/

controller/

service/

InterviewEngine.java

FeedbackService.java

ClaudeService.java

session/

SessionStore.java

model/

dto/

config/

InterviewApplication.java

resources/

application.yml

curriculum.json

candidates.json

\---

\# Architecture

React UI

↓

REST API

↓

InterviewController

↓

InterviewEngine

↓

ClaudeService

↓

Claude API

↓

FeedbackService

↓

Frontend

\---

\# Session Management

Maintain conversation state in memory.

Use

ConcurrentHashMap<String, InterviewSession>

Do NOT introduce

\- PostgreSQL

\- MySQL

\- MongoDB

\- Redis

\- Hibernate

\- Spring Data JPA

Persistent storage is intentionally out of scope.

\---

\# REST API

POST /api/interview

First request

```json

{

&#x20; "sessionId":"...",

&#x20; "candidate":{}

}

```

Response

```json

{

&#x20; "reply":"...",

&#x20; "done":false

}

```

Next request

```json

{

&#x20; "sessionId":"...",

&#x20; "message":"..."

}

```

Final response

```json

{

&#x20; "reply":"Interview completed.",

&#x20; "done":true,

&#x20; "feedback":{

&#x20;     "summary":"",

&#x20;     "strengths":\[],

&#x20;     "gaps":\[],

&#x20;     "next":\[]

&#x20; }

}

```

Never change this contract.

\---

\# Interview Rules

The application must

\- Ask at least 8 questions.

\- Cover at least 4 curriculum days.

\- Ask adaptive follow-up questions.

\- Generate structured feedback.

Never depend on the LLM to count questions.

Track everything in Java.

\---

\# Candidate Selection Logic

Prioritize

\- skipped missions

\- high attempt count

Use curriculum metadata while generating questions.

\---

\# Interview Session

Maintain

```java

InterviewSession

```

containing

\- sessionId

\- candidate

\- history

\- targetDays

\- askedDays

\- questionCount

\- phase

\---

\# Public Service Contracts

InterviewEngine

```java

InterviewResponse startInterview(Candidate candidate)

InterviewResponse processTurn(

&#x20;   InterviewSession session,

&#x20;   String message

)

```

FeedbackService

```java

Feedback generateFeedback(

&#x20;   InterviewSession session

)

```

SessionStore

```java

createSession()

getSession()

updateSession()

removeSession()

```

Do not rename these methods.

\---

\# Coding Guidelines

Prefer

\- Constructor injection

\- Small methods

\- Clean DTOs

\- Validation annotations

\- Meaningful exceptions

Avoid

\- God classes

\- Static mutable state

\- Duplicate logic

\- Premature optimization

\---

\# Forbidden Changes

Do NOT

\- Change API contract

\- Rewrite teammate modules

\- Rename exported services

\- Add authentication

\- Add database

\- Add unnecessary dependencies

\---

\# Environment Variables

ANTHROPIC\_API\_KEY

PORT

FRONTEND\_URL

Never hardcode secrets.

Never commit .env.

\---

\# Git Rules

Never commit.

Never push.

Never create branches.

Developers manage Git manually.

\---

\# Working Style

Work incrementally.

After every implementation:

Explain

\- What changed

\- Why it changed

\- Remaining work

Never generate the entire project at once.

Always prefer small reviewable iterations.

\---

\# Success Criteria

The final solution must

\- Build successfully

\- Be deployable

\- Maintain interview sessions

\- Ask adaptive questions

\- Cover required curriculum

\- Produce structured feedback

\- Be demo-ready

## Additional Project Documentation

Before starting work, also read:

- docs/00_SHARED_CONTEXT.md
- Your assigned role prompt:
    - docs/01_PROMPT_frontend_leader.md
    - docs/02_PROMPT_agent_core_friend2.md
    - docs/03_PROMPT_backend_api_radhika.md

If any instruction conflicts, priority is:

1. CLAUDE.md
2. 00_SHARED_CONTEXT.md
3. Role Prompt


