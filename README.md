# Mini Workflow Automation Platform

A full-stack MERN workflow automation platform for creating, editing, saving, executing, and reviewing simple workflow runs.

## Features

- Create workflows with name, description, and ordered configurable steps.
- Edit saved workflows and reorder steps.
- Supported step types:
  - Text transform: uppercase, lowercase, trim
  - Delay/wait
  - Conditional check
  - Mock API call
  - Final output
- Persist workflow definitions in MongoDB.
- Execute workflows step by step with intermediate and final output.
- Store and review execution history.
- Modular step handler design for adding new workflow step types.

## Tech Stack

- Frontend: React, TypeScript, Vite, lucide-react
- Backend: Node.js, Express, Mongoose, Zod
- Database: MongoDB
- Optional local infrastructure: Docker Compose for MongoDB

## Project Structure

```text
client/
  src/
    App.tsx          Workflow builder, runner, and history UI
    api.ts           API client
    types.ts         Shared frontend types
server/
  src/
    controllers/     HTTP request handlers
    engine/          Plugin-style workflow execution handlers
    middleware/      Error and 404 handlers
    models/          Mongoose workflow and execution models
    routes/          Express routes
    validators/      Zod payload validation
docs/
  AI_AGENT_WORKFLOW.md
```

## Setup

### Prerequisites

- Node.js 20+
- npm
- MongoDB running locally or through Docker

### 1. Start MongoDB

With Docker:

```bash
docker compose up -d
```

Or use a local MongoDB instance and update `server/.env`.

### 2. Configure Environment

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Default values:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/workflow_automation
CLIENT_ORIGIN=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

```bash
npm run install:all
```

### 4. Run the App

```bash
npm run dev:server
```

In a second terminal:

```bash
npm run dev:client
```

Frontend: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

## API Overview

```text
GET    /api/workflows
POST   /api/workflows
GET    /api/workflows/:id
PUT    /api/workflows/:id
DELETE /api/workflows/:id
POST   /api/workflows/:id/execute
GET    /api/workflows/:id/executions
```

## Data Model

### Workflow

```ts
{
  name: string;
  description: string;
  steps: Array<{
    type: 'textTransform' | 'delay' | 'condition' | 'mockApiCall' | 'finalOutput';
    label: string;
    config: Record<string, unknown>;
  }>;
}
```

### Execution

```ts
{
  workflow: ObjectId;
  status: 'success' | 'failed';
  initialInput: unknown;
  finalOutput: unknown;
  results: Array<{
    stepId: string;
    label: string;
    type: string;
    status: 'success' | 'skipped' | 'failed';
    input: unknown;
    output: unknown;
    message: string;
    durationMs: number;
  }>;
}
```

## Architecture and Approach

The backend separates routing, controllers, validation, persistence, and workflow execution. The execution engine dispatches each step to a handler in `server/src/engine/stepHandlers.js`, which makes the step system easy to extend. Adding a new step generally means adding its type to validation/model enums and implementing one handler.

The frontend keeps the assignment flows on one operational screen: saved workflows on the left, builder in the center, and execution output/history on the right. This favors fast review and repeated workflow iteration, which is the natural use case for an automation tool.

Validation is handled on the API boundary with Zod and at persistence level with Mongoose. Runtime execution errors are captured per step and returned in a structured format.

## Assumptions

- Authentication is intentionally out of scope for the 24-hour assignment.
- Mock API calls are deterministic local simulated responses, not external network calls.
- Delay steps are capped at 5 seconds to avoid accidental long-running requests.
- Conditional failure stops the workflow unless `continueOnFail` is enabled.

## AI-Agent Development Process

The repository includes `docs/AI_AGENT_WORKFLOW.md`, which describes how to split this assignment across AI-assisted product, backend, frontend, QA, and documentation agents while keeping handoffs explicit.
