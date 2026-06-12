export type StepType =
  | 'textTransform'
  | 'delay'
  | 'condition'
  | 'mockApiCall'
  | 'jsonExtract'
  | 'dataValidation'
  | 'webhook'
  | 'finalOutput';

export type WorkflowStep = {
  _id?: string;
  clientId?: string;
  type: StepType;
  label: string;
  config: Record<string, unknown>;
};

export type Workflow = {
  _id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
};

export type ExecutionStepResult = {
  stepId: string;
  label: string;
  type: StepType;
  status: 'success' | 'skipped' | 'failed';
  input: unknown;
  output: unknown;
  message: string;
  durationMs: number;
};

export type Execution = {
  _id: string;
  workflow: string;
  status: 'success' | 'failed';
  initialInput: unknown;
  finalOutput: unknown;
  results: ExecutionStepResult[];
  error?: string;
  createdAt: string;
};
