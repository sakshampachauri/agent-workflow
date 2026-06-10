import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import workflowRoutes from './routes/workflow.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
  app.use(express.json({ limit: '1mb' }));
  app.use(morgan('dev'));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'workflow-platform-api' });
  });

  app.use('/api/workflows', workflowRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
