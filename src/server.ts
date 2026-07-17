import 'dotenv/config';
import { createApp } from './app';
import { env } from './config/env';
import { checkDatabase } from './config/database';
import { connectRedis } from './config/redis';

async function bootstrap() {
  try {
    await connectRedis();
  } catch (err) {
    console.warn('Redis unavailable — caching and rate limiting may degrade:', err);
  }

  if (!(await checkDatabase())) {
    throw new Error(
      'Database connection failed. Check DATABASE_URL in .env (user/password/db) and that PostgreSQL is running.',
    );
  }

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`${env.APP_NAME} running on http://localhost:${env.PORT}${env.API_PREFIX}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
