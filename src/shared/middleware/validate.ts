import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodSchema } from 'zod';
import { AppError } from '../errors/AppError';

type RequestPart = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, part: RequestPart = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req[part]);
      req[part] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const path = issue.path.join('.') || 'root';
          if (!errors[path]) errors[path] = [];
          errors[path].push(issue.message);
        }
        next(new AppError('Validation failed', 422, errors));
        return;
      }
      next(error);
    }
  };
}
