import { z } from 'zod';

const stepConfig = z.record(z.any()).default({});

const workflowStepSchema = z.object({
  _id: z.string().optional(),
  type: z.enum([
    'textTransform',
    'delay',
    'condition',
    'mockApiCall',
    'jsonExtract',
    'dataValidation',
    'webhook',
    'finalOutput'
  ]),
  label: z.string().trim().min(1, 'Step label is required').max(100),
  config: stepConfig
});

export const workflowPayloadSchema = z.object({
  name: z.string().trim().min(1, 'Workflow name is required').max(100),
  description: z.string().trim().max(500).default(''),
  steps: z.array(workflowStepSchema).min(1, 'Add at least one workflow step')
});

export const executePayloadSchema = z.object({
  input: z.any().default('')
});
