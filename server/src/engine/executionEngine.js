import { stepHandlers } from './stepHandlers.js';

export async function executeWorkflow(workflow, initialInput) {
  let current = initialInput;
  const results = [];
  let status = 'success';
  let error;

  for (const step of workflow.steps) {
    const startedAt = Date.now();
    const handler = stepHandlers[step.type];
    const stepInput = current;

    if (!handler) {
      status = 'failed';
      error = `Unsupported step type: ${step.type}`;
      results.push({
        stepId: step._id.toString(),
        label: step.label,
        type: step.type,
        status: 'failed',
        input: current,
        message: error,
        durationMs: Date.now() - startedAt
      });
      break;
    }

    try {
      const result = await handler(current, step.config || {});
      current = result.output;
      const shouldContinue = result.shouldContinue !== false;

      results.push({
        stepId: step._id.toString(),
        label: step.label,
        type: step.type,
        status: shouldContinue ? 'success' : 'skipped',
        input: result.input ?? stepInput,
        output: result.output,
        message: result.message,
        durationMs: Date.now() - startedAt
      });

      if (!shouldContinue) {
        break;
      }
    } catch (stepError) {
      status = 'failed';
      error = stepError.message;
      results.push({
        stepId: step._id.toString(),
        label: step.label,
        type: step.type,
        status: 'failed',
        input: current,
        message: stepError.message,
        durationMs: Date.now() - startedAt
      });
      break;
    }
  }

  return {
    status,
    initialInput,
    finalOutput: current,
    results,
    error
  };
}
