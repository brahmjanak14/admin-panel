import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { env } from '../../config/env';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    const body: { message: string; errors?: Record<string, string[]> } = {
      message: err.message,
    };
    if (err.errors) body.errors = err.errors;
    return res.status(err.statusCode).json(body);
  }

  console.error(err);
  return res.status(500).json({
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
