import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Play, Plus, Save, Trash2 } from 'lucide-react';
import { api } from './api';
import type { Execution, StepType, Workflow, WorkflowStep } from './types';

const stepLabels: Record<StepType, string> = {
  textTransform: 'Text transform',
  delay: 'Delay',
  condition: 'Condition',
  mockApiCall: 'Mock API call',
  finalOutput: 'Final output'
};

const stepTypes = Object.keys(stepLabels) as StepType[];

const createStep = (type: StepType = 'textTransform'): WorkflowStep => ({
  clientId: crypto.randomUUID(),
  type,
  label: stepLabels[type],
  config:
    type === 'textTransform'
      ? { operation: 'uppercase' }
      : type === 'delay'
        ? { ms: 500 }
        : type === 'condition'
          ? { operator: 'contains', value: 'APPROVED', continueOnFail: false }
          : type === 'mockApiCall'
            ? { endpoint: '/mock/customer-profile', method: 'GET' }
            : { prefix: 'Result' }
});

const emptyDraft = () => ({
  id: '',
  name: '',
  description: '',
  steps: [createStep('textTransform')] as WorkflowStep[]
});

function formatValue(value: unknown) {
  if (typeof value === 'string') return value;
  return JSON.stringify(value, null, 2);
}

export function App() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [input, setInput] = useState(' approved customer  ');
  const [execution, setExecution] = useState<Execution | null>(null);
  const [history, setHistory] = useState<Execution[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const isEditing = Boolean(draft.id);
  const canRun = isEditing && draft.steps.length > 0;

  async function refreshWorkflows() {
    const data = await api.listWorkflows();
    setWorkflows(data);
  }

  useEffect(() => {
    refreshWorkflows().catch((error) => setMessage(error.message));
  }, []);

  async function loadHistory(workflowId: string) {
    const data = await api.listExecutions(workflowId);
    setHistory(data);
  }

  function selectWorkflow(workflow: Workflow) {
    setDraft({
      id: workflow._id,
      name: workflow.name,
      description: workflow.description,
      steps: workflow.steps.map((step) => ({
        ...step,
        clientId: step._id || crypto.randomUUID()
      }))
    });
    setExecution(null);
    loadHistory(workflow._id).catch((error) => setMessage(error.message));
  }

  function startNewWorkflow() {
    setDraft(emptyDraft());
    setExecution(null);
    setHistory([]);
    setMessage('');
  }

  function updateStep(index: number, nextStep: WorkflowStep) {
    setDraft((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) => (stepIndex === index ? nextStep : step))
    }));
  }

  function moveStep(index: number, direction: -1 | 1) {
    setDraft((current) => {
      const next = [...current.steps];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return { ...current, steps: next };
    });
  }

  async function saveWorkflow() {
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        name: draft.name,
        description: draft.description,
        steps: draft.steps
      };
      const saved = isEditing ? await api.updateWorkflow(draft.id, payload) : await api.createWorkflow(payload);
      await refreshWorkflows();
      selectWorkflow(saved);
      setMessage('Workflow saved');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save workflow');
    } finally {
      setLoading(false);
    }
  }

  async function runWorkflow() {
    if (!draft.id) return;
    setLoading(true);
    setMessage('');

    try {
      const result = await api.executeWorkflow(draft.id, input);
      setExecution(result);
      await loadHistory(draft.id);
      setMessage('Workflow executed');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to execute workflow');
    } finally {
      setLoading(false);
    }
  }

  async function deleteWorkflow() {
    if (!draft.id) return;
    setLoading(true);
    setMessage('');

    try {
      await api.deleteWorkflow(draft.id);
      setDraft(emptyDraft());
      setExecution(null);
      setHistory([]);
      await refreshWorkflows();
      setMessage('Workflow deleted');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to delete workflow');
    } finally {
      setLoading(false);
    }
  }

  const selectedWorkflowName = useMemo(
    () => workflows.find((workflow) => workflow._id === draft.id)?.name,
    [draft.id, workflows]
  );

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span>FlowForge</span>
          <button type="button" onClick={startNewWorkflow}>
            <Plus size={16} /> New
          </button>
        </div>

        <div className="workflow-list">
          {workflows.map((workflow) => (
            <button
              className={workflow._id === draft.id ? 'workflow-list-item active' : 'workflow-list-item'}
              key={workflow._id}
              type="button"
              onClick={() => selectWorkflow(workflow)}
            >
              <strong>{workflow.name}</strong>
              <span>{workflow.steps.length} steps</span>
            </button>
          ))}
          {workflows.length === 0 && <p className="muted">No saved workflows yet.</p>}
        </div>
      </aside>

      <section className="builder">
        <header className="topbar">
          <div>
            <p className="eyebrow">{isEditing ? selectedWorkflowName : 'Draft workflow'}</p>
            <h1>Workflow Builder</h1>
          </div>
          <div className="actions">
            {isEditing && (
              <button className="danger" type="button" onClick={deleteWorkflow} disabled={loading}>
                <Trash2 size={16} /> Delete
              </button>
            )}
            <button type="button" onClick={saveWorkflow} disabled={loading}>
              <Save size={16} /> Save
            </button>
          </div>
        </header>

        {message && <div className="notice">{message}</div>}

        <div className="layout">
          <section className="panel editor-panel">
            <label>
              Workflow name
              <input
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
              />
            </label>
            <label>
              Description
              <textarea
                value={draft.description}
                onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
              />
            </label>

            <div className="section-title">
              <h2>Steps</h2>
              <button
                type="button"
                onClick={() => setDraft((current) => ({ ...current, steps: [...current.steps, createStep()] }))}
              >
                <Plus size={16} /> Add step
              </button>
            </div>

            <div className="step-stack">
              {draft.steps.map((step, index) => (
                <StepEditor
                  index={index}
                  key={step.clientId}
                  step={step}
                  onChange={(nextStep) => updateStep(index, nextStep)}
                  onMove={moveStep}
                  onRemove={() =>
                    setDraft((current) => ({
                      ...current,
                      steps: current.steps.filter((item) => item.clientId !== step.clientId)
                    }))
                  }
                />
              ))}
            </div>
          </section>

          <section className="panel run-panel">
            <div className="section-title">
              <h2>Run</h2>
              <button type="button" onClick={runWorkflow} disabled={!canRun || loading}>
                <Play size={16} /> Execute
              </button>
            </div>
            <label>
              Initial input
              <textarea value={input} onChange={(event) => setInput(event.target.value)} />
            </label>

            <ExecutionView execution={execution} />

            <div className="history">
              <h2>Execution History</h2>
              {history.map((item) => (
                <button className="history-item" key={item._id} type="button" onClick={() => setExecution(item)}>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                  <strong>{item.status}</strong>
                </button>
              ))}
              {history.length === 0 && <p className="muted">Save and run a workflow to create history.</p>}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function StepEditor({
  index,
  step,
  onChange,
  onMove,
  onRemove
}: {
  index: number;
  step: WorkflowStep;
  onChange: (step: WorkflowStep) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  function updateConfig(key: string, value: unknown) {
    onChange({ ...step, config: { ...step.config, [key]: value } });
  }

  function changeType(type: StepType) {
    const replacement = createStep(type);
    onChange({ ...replacement, clientId: step.clientId, _id: step._id });
  }

  return (
    <article className="step-card">
      <div className="step-card-header">
        <span className="step-number">{index + 1}</span>
        <input value={step.label} onChange={(event) => onChange({ ...step, label: event.target.value })} />
        <button type="button" title="Move up" onClick={() => onMove(index, -1)}>
          <ArrowUp size={15} />
        </button>
        <button type="button" title="Move down" onClick={() => onMove(index, 1)}>
          <ArrowDown size={15} />
        </button>
        <button className="icon-danger" type="button" title="Remove step" onClick={onRemove}>
          <Trash2 size={15} />
        </button>
      </div>

      <div className="step-grid">
        <label>
          Type
          <select value={step.type} onChange={(event) => changeType(event.target.value as StepType)}>
            {stepTypes.map((type) => (
              <option key={type} value={type}>
                {stepLabels[type]}
              </option>
            ))}
          </select>
        </label>

        {step.type === 'textTransform' && (
          <label>
            Operation
            <select
              value={String(step.config.operation || 'uppercase')}
              onChange={(event) => updateConfig('operation', event.target.value)}
            >
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="trim">Trim</option>
            </select>
          </label>
        )}

        {step.type === 'delay' && (
          <label>
            Milliseconds
            <input
              min="0"
              max="5000"
              type="number"
              value={Number(step.config.ms || 0)}
              onChange={(event) => updateConfig('ms', Number(event.target.value))}
            />
          </label>
        )}

        {step.type === 'condition' && (
          <>
            <label>
              Operator
              <select
                value={String(step.config.operator || 'contains')}
                onChange={(event) => updateConfig('operator', event.target.value)}
              >
                <option value="contains">Contains</option>
                <option value="equals">Equals</option>
                <option value="notEmpty">Not empty</option>
              </select>
            </label>
            <label>
              Value
              <input value={String(step.config.value || '')} onChange={(event) => updateConfig('value', event.target.value)} />
            </label>
            <label className="checkbox-row">
              <input
                checked={Boolean(step.config.continueOnFail)}
                type="checkbox"
                onChange={(event) => updateConfig('continueOnFail', event.target.checked)}
              />
              Continue if false
            </label>
          </>
        )}

        {step.type === 'mockApiCall' && (
          <>
            <label>
              Method
              <select
                value={String(step.config.method || 'GET')}
                onChange={(event) => updateConfig('method', event.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
              </select>
            </label>
            <label>
              Endpoint
              <input
                value={String(step.config.endpoint || '')}
                onChange={(event) => updateConfig('endpoint', event.target.value)}
              />
            </label>
          </>
        )}

        {step.type === 'finalOutput' && (
          <label>
            Prefix
            <input value={String(step.config.prefix || '')} onChange={(event) => updateConfig('prefix', event.target.value)} />
          </label>
        )}
      </div>
    </article>
  );
}

function ExecutionView({ execution }: { execution: Execution | null }) {
  if (!execution) {
    return <div className="empty-state">Execution output will appear here after a workflow run.</div>;
  }

  return (
    <div className="execution">
      <div className="execution-summary">
        <span className={execution.status === 'success' ? 'status success' : 'status failed'}>{execution.status}</span>
        <strong>Final output</strong>
        <pre>{formatValue(execution.finalOutput)}</pre>
      </div>

      <div className="timeline">
        {execution.results.map((result, index) => (
          <article className="result-card" key={`${result.stepId}-${index}`}>
            <div>
              <span className="step-number">{index + 1}</span>
              <strong>{result.label}</strong>
            </div>
            <span className={`status ${result.status}`}>{result.status}</span>
            <p>{result.message}</p>
            <pre>{formatValue(result.output)}</pre>
          </article>
        ))}
      </div>
    </div>
  );
}
