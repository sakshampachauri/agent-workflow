import { Router } from 'express';
import {
  createWorkflow,
  deleteWorkflow,
  executeWorkflowById,
  getWorkflow,
  listExecutions,
  listWorkflows,
  updateWorkflow
} from '../controllers/workflow.controller.js';

const router = Router();

router.get('/', listWorkflows);
router.post('/', createWorkflow);
router.get('/:id', getWorkflow);
router.put('/:id', updateWorkflow);
router.delete('/:id', deleteWorkflow);
router.post('/:id/execute', executeWorkflowById);
router.get('/:id/executions', listExecutions);

export default router;
