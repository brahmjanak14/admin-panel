import Redis from 'ioredis';
import { env } from './env';

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return redis;
}

export async function connectRedis(): Promise<void> {
  const client = getRedis();
  if (client.status === 'wait' || client.status === 'end') {
    await client.connect();
  }
}

export async function pingRedis(): Promise<boolean> {
  try {
    const client = getRedis();
    if (client.status !== 'ready') {
      await connectRedis();
    }
    const result = await client.ping();
    return result === 'PONG';
  } catch {
    return false;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
