import { Execution } from '../models/execution.model.js';
import { Workflow } from '../models/workflow.model.js';
import { executeWorkflow } from '../engine/executionEngine.js';
import { executePayloadSchema, workflowPayloadSchema } from '../validators/workflow.validator.js';
import { httpError } from '../utils/httpError.js';

export async function listWorkflows(_req, res) {
  const workflows = await Workflow.find().sort({ updatedAt: -1 });
  res.json(workflows);
}

export async function getWorkflow(req, res, next) {
  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) return next(httpError(404, 'Workflow not found'));
  res.json(workflow);
}

export async function createWorkflow(req, res) {
  const payload = workflowPayloadSchema.parse(req.body);
  const workflow = await Workflow.create(payload);
  res.status(201).json(workflow);
}

export async function updateWorkflow(req, res, next) {
  const payload = workflowPayloadSchema.parse(req.body);
  const workflow = await Workflow.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true
  });

  if (!workflow) return next(httpError(404, 'Workflow not found'));
  res.json(workflow);
}

export async function deleteWorkflow(req, res, next) {
  const workflow = await Workflow.findByIdAndDelete(req.params.id);
  if (!workflow) return next(httpError(404, 'Workflow not found'));
  await Execution.deleteMany({ workflow: req.params.id });
  res.status(204).send();
}

export async function executeWorkflowById(req, res, next) {
  const { input } = executePayloadSchema.parse(req.body);
  const workflow = await Workflow.findById(req.params.id);
  if (!workflow) return next(httpError(404, 'Workflow not found'));

  const executionResult = await executeWorkflow(workflow, input);
  const execution = await Execution.create({
    workflow: workflow._id,
    ...executionResult
  });

  res.status(201).json(execution);
}

export async function listExecutions(req, res, next) {
  const workflow = await Workflow.exists({ _id: req.params.id });
  if (!workflow) return next(httpError(404, 'Workflow not found'));

  const executions = await Execution.find({ workflow: req.params.id }).sort({ createdAt: -1 }).limit(20);
  res.json(executions);
}
