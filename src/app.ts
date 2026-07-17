import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { requestId } from './shared/middleware/requestId';
import { errorHandler } from './shared/middleware/errorHandler';
import { notFoundHandler } from './shared/middleware/notFoundHandler';
import path from 'path';
import routes from './routes';
import { prisma } from './config/database';
import { pingRedis } from './config/redis';

export function createApp() {
  const app = express();

  app.use(requestId);
  app.use(
    pinoHttp({
      customProps: (req) => ({ requestId: req.requestId }),
      autoLogging: env.NODE_ENV !== 'test',
    }),
  );
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIR)));

  app.get(`${env.API_PREFIX}/health`, async (_req, res) => {
    let db = 'disconnected';
    let redis = 'disconnected';
    try {
      await prisma.$queryRaw`SELECT 1`;
      db = 'connected';
    } catch {
      // keep disconnected
    }
    if (await pingRedis()) redis = 'connected';
    res.json({ status: 'ok', db, redis });
  });

  app.use(env.API_PREFIX, routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
