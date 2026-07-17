import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';
import { connectRedis } from './config/redis';
import { prisma } from './config/database';

async function bootstrap() {
  try {
    await connectRedis();
  } catch (err) {
    console.warn('Redis unavailable — caching and rate limiting may degrade:', err);
  }

  await prisma.$connect();

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`${env.APP_NAME} running on http://localhost:${env.PORT}${env.API_PREFIX}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
