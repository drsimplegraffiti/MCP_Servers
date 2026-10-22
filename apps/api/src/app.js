import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', (req, res) => res.json({ status: 'ok' }));

  app.use(routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
