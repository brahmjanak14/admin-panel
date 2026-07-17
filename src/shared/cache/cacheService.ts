import { getRedis } from '../../config/redis';
import { env } from '../../config/env';

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const client = getRedis();
      const raw = await client.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    try {
      const client = getRedis();
      const ttl = ttlSeconds ?? env.CACHE_TTL_MEDIUM;
      await client.set(key, JSON.stringify(value), 'EX', ttl);
    } catch {
      // Cache failures should not break requests
    }
  }

  async del(key: string): Promise<void> {
    try {
      const client = getRedis();
      await client.del(key);
    } catch {
      // ignore
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const client = getRedis();
      let cursor = '0';
      do {
        const [nextCursor, keys] = await client.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
        cursor = nextCursor;
        if (keys.length > 0) {
          await client.del(...keys);
        }
      } while (cursor !== '0');
    } catch {
      // ignore
    }
  }
}

export const cacheService = new CacheService();
