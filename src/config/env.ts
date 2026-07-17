import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default('/api'),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(10),
  CACHE_TTL_SHORT: z.coerce.number().default(60),
  CACHE_TTL_MEDIUM: z.coerce.number().default(300),
  CACHE_TTL_LONG: z.coerce.number().default(3600),
  UPLOAD_DIR: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z.coerce.number().default(10),
  ALLOWED_MIME_TYPES: z.string().default('image/jpeg,image/png,image/webp,image/gif,application/pdf'),
  APP_NAME: z.string().default('Shyaam Admin API'),
  PUBLIC_SITE_URL: z.string().default('https://shyaam.in'),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().optional(),
  SEED_ADMIN_NAME: z.string().optional(),

  // Google Sheets (optional — disabled unless enabled + credentials set)
  GOOGLE_SHEETS_ENABLED: z
    .string()
    .optional()
    .transform((v) => v === 'true' || v === '1'),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().email().optional(),
  ),
  GOOGLE_PRIVATE_KEY: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().optional(),
  ),
  GOOGLE_SHEETS_SPREADSHEET_ID: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().optional(),
  ),
  GOOGLE_SHEETS_CONTACT_TAB: z.string().default('Contact'),
  GOOGLE_SHEETS_CONSULTATION_TAB: z.string().default('Consultation'),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
