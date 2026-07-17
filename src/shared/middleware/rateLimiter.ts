import rateLimit from 'express-rate-limit';
import { env } from '../../config/env';

export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? req.ip ?? 'unknown',
  message: { message: 'Too many requests' },
});

export const authLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests' },
});

export const authRefreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests' },
});

export const publicLeadsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests' },
});

export const mediaUploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user?.id ?? req.ip ?? 'unknown',
  message: { message: 'Too many requests' },
});
