import type { Execution, Workflow, WorkflowStep } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

type WorkflowPayload = {
  name: string;
  description: string;
  steps: WorkflowStep[];
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

function serializeWorkflow(payload: WorkflowPayload) {
  return {
    ...payload,
    steps: payload.steps.map(({ clientId: _clientId, ...step }) => step)
  };
}

export const api = {
  listWorkflows: () => request<Workflow[]>('/workflows'),
  createWorkflow: (payload: WorkflowPayload) =>
    request<Workflow>('/workflows', {
      method: 'POST',
      body: JSON.stringify(serializeWorkflow(payload))
    }),
  updateWorkflow: (id: string, payload: WorkflowPayload) =>
    request<Workflow>(`/workflows/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serializeWorkflow(payload))
    }),
  deleteWorkflow: (id: string) =>
    request<void>(`/workflows/${id}`, {
      method: 'DELETE'
    }),
  executeWorkflow: (id: string, input: string) =>
    request<Execution>(`/workflows/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify({ input })
    }),
  listExecutions: (id: string) => request<Execution[]>(`/workflows/${id}/executions`)
};
