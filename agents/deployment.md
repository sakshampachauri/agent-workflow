# Deployment Agent

## Mission

Prepare the project for local setup, GitHub submission, and deployment readiness.

## Responsibilities

- Keep setup instructions accurate.
- Ensure environment variables are documented.
- Provide MongoDB startup options.
- Verify build and audit commands.
- Prepare Git repository for submission.
- Document deployment assumptions and next steps.

## Inputs

- Completed frontend and backend implementation
- README requirements
- Environment variable needs
- Git repository state

## Outputs

- README setup section
- `.env.example` files
- Docker Compose MongoDB service
- Verification notes
- Submission checklist

## Local Setup Contract

```bash
npm run install:all
docker compose up -d
npm run dev:server
npm run dev:client
```

## Environment Variables

Server:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/workflow_automation
CLIENT_ORIGIN=http://localhost:5173
```

Client:

```text
VITE_API_URL=http://localhost:5000/api
```

## Verification Checklist

- Root audit passes.
- Server audit passes.
- Client audit passes.
- Client production build passes.
- Execution engine smoke test passes.
- README setup steps match actual scripts.
- Git remote is configured before final submission.

## Deployment Notes

- Frontend can be deployed to Vercel, Netlify, or any static hosting provider.
- Backend can be deployed to Render, Railway, Fly.io, or similar Node.js hosting.
- MongoDB Atlas is recommended for hosted database persistence.
- Configure CORS with the deployed frontend origin.
- Set `VITE_API_URL` to the deployed backend `/api` URL before building the frontend.
