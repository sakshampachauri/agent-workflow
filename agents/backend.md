# Backend Agent

## Mission

Build the Node.js, Express, and MongoDB backend for workflow persistence, validation, execution, and history.

## Responsibilities

- Define Mongoose models for workflows and executions.
- Implement REST APIs for workflow CRUD operations.
- Implement workflow execution by ordered steps.
- Support extensible step handlers such as JSON extraction, validation, and webhook/API calls.
- Validate API payloads.
- Store execution history.
- Keep controllers, routes, models, validation, and execution logic separated.

## Inputs

- Data model from Architect Agent
- Step types required by assignment
- Frontend API needs
- Error handling and validation expectations

## Outputs

- Express application
- Workflow routes and controllers
- Mongoose models
- Zod validators
- Execution engine
- Step handler modules

## API Contract

```text
GET    /api/workflows
POST   /api/workflows
GET    /api/workflows/:id
PUT    /api/workflows/:id
DELETE /api/workflows/:id
POST   /api/workflows/:id/execute
GET    /api/workflows/:id/executions
```

## Step Handler Contract

Each step handler receives the current input and step config, then returns:

```ts
{
  output: unknown;
  message: string;
  shouldContinue?: boolean;
}
```

## Acceptance Criteria

- Workflow payloads are validated before persistence.
- Workflows can be saved, listed, updated, fetched, and deleted.
- Execution runs steps in order.
- Each step result includes status, input, output, message, and duration.
- Execution history is persisted.
- Unsupported or failed steps return structured errors.
- New step types can be added by extending the enum list and adding a step handler.

## Handoff Checklist

- Backend starts with `npm run dev:server`.
- MongoDB connection is configurable through `.env`.
- API health endpoint is available.
- Execution engine is isolated enough to test independently.
