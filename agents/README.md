# AI Agent Playbook

This folder describes how to build and explain the workflow automation platform using coordinated AI-agent roles.

## Agents

- [Architect Agent](./architect.md): owns product scope, system design, data model, and task breakdown.
- [Frontend Agent](./frontend.md): owns React UI, state handling, workflow builder, runner, and history views.
- [Backend Agent](./backend.md): owns Express APIs, MongoDB models, validation, and execution engine.
- [Deployment Agent](./deployment.md): owns setup, environment variables, Docker, verification, and GitHub submission readiness.

## Suggested Workflow

1. Architect Agent converts the assignment into architecture and acceptance criteria.
2. Backend Agent builds persistence, validation, APIs, and execution logic.
3. Frontend Agent builds the workflow builder and execution UI against the API contract.
4. Deployment Agent verifies setup, documents commands, and prepares the repository for submission.

## Handoff Format

Each agent should finish with:

- Files changed
- Commands run
- Decisions made
- Known issues
- Next recommended action

This keeps AI-assisted development structured and reviewable instead of becoming one long untracked prompt chain.
