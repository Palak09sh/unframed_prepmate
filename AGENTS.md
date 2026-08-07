# AGENTS.md

This repository follows a **single source of truth**.

All AI coding agents (Claude Code, Cursor, Codex CLI, Gemini CLI, etc.) must follow the instructions defined in **CLAUDE.md**.

Rules:

1. Read `CLAUDE.md` completely before making any changes.
2. Respect ownership boundaries.
3. Do not modify files owned by another developer.
4. Never change the REST API contract.
5. Never introduce a database or authentication unless explicitly requested.
6. Work incrementally and explain changes after each implementation.
7. Never commit, push, or create branches.
8. Keep code modular, readable, and production-ready.
9. Follow the defined folder structure and public service contracts.
10. If `CLAUDE.md` and this file ever differ, **`CLAUDE.md` takes precedence**.
