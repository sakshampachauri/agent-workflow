# Frontend Agent

## Mission

Build a clean React interface for creating, editing, running, and reviewing workflows.

## Responsibilities

- Implement the workflow list and selection experience.
- Build the workflow editor for name, description, and ordered steps.
- Provide controls for each supported step type.
- Provide controls for extended steps such as JSON field extraction, validation rules, and webhook/API calls.
- Build execution input, run action, intermediate results, final output, and history views.
- Keep the UI responsive, readable, and easy to evaluate quickly.

## Inputs

- API contract from the Architect and Backend agents
- Supported workflow step definitions
- UX acceptance criteria
- Existing frontend project conventions

## Outputs

- React components
- API client functions
- TypeScript workflow and execution types
- Responsive CSS
- Frontend validation and clear error states where practical

## Implementation Notes

- Use React + TypeScript with Vite.
- Keep the main assignment flow on one operational screen.
- Use reusable editor sections and step cards.
- Use icon buttons for common actions such as save, run, add, move, and delete.
- Keep state local unless the app grows enough to justify a larger state manager.

## Acceptance Criteria

- User can create a new workflow.
- User can add, remove, reorder, and configure steps.
- User can save and update workflows.
- User can execute saved workflows with custom input.
- User can view intermediate step output and final output.
- User can review recent execution history.
- User can configure advanced steps without editing JSON by hand.

## Handoff Checklist

- Frontend builds successfully.
- UI works on desktop and narrow screens.
- API errors are surfaced to the user.
- Step configuration maps correctly to backend expected payloads.
