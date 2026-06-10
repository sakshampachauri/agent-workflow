# AI Agent Development Workflow

This project was shaped as a small multi-agent delivery plan. In a real 24-hour assignment, the agents can be separate chat sessions, Codex threads, or role prompts that operate on the same repository.

## Agent Roles

1. Product agent
   - Convert the assignment into user flows, acceptance criteria, and a delivery scope.
   - Keep the build focused on core workflow creation, persistence, execution, and review.

2. Backend agent
   - Design API routes, workflow schema, execution history schema, validation, and error handling.
   - Keep step execution modular so new step types can be added without changing controllers.

3. Frontend agent
   - Build React components for workflow list, builder, step configuration, execution output, and history.
   - Prioritize a clear first-screen SaaS tool experience over a landing page.

4. QA agent
   - Review edge cases: empty workflows, invalid payloads, failed conditions, unsupported steps, and API errors.
   - Run setup/build checks and update the README with verified commands.

5. Documentation agent
   - Capture architecture, assumptions, data model, and design decisions in the README.
   - Prepare a submission narrative that explains iteration and tradeoffs.

## Suggested 24-Hour Timeline

- Hour 0-1: Confirm scope, data model, and UX flows.
- Hour 1-5: Backend API, MongoDB models, validation, execution engine.
- Hour 5-10: React builder, workflow list, save/edit flow.
- Hour 10-14: Execution UI, intermediate results, execution history.
- Hour 14-17: Error states, responsive styling, cleanup.
- Hour 17-20: Manual QA, build checks, bug fixes.
- Hour 20-24: README, screenshots if desired, final repository polish.

## Agent Handoff Contract

Each agent should leave:

- Files changed
- Commands run
- Known issues
- Next recommended task

That keeps the process auditable while still using AI acceleration pragmatically.
