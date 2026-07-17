import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from './env';
import * as schema from '../db/schema';

const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
  db: ReturnType<typeof drizzle<typeof schema>> | undefined;
};

/** postgres.js does not use Prisma's `?schema=` query param */
function toPostgresUrl(url: string): string {
  return url.replace(/[?&]schema=[^&]*/g, '').replace(/\?$/, '');
}

const sql =
  globalForDb.sql ??
  postgres(toPostgresUrl(env.DATABASE_URL), {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });

export const db = globalForDb.db ?? drizzle(sql, { schema });

export async function checkDatabase(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function closeDatabase(): Promise<void> {
  await sql.end({ timeout: 5 });
}

if (env.NODE_ENV !== 'production') {
  globalForDb.sql = sql;
  globalForDb.db = db;
}
