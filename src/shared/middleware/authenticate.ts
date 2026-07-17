import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import type { JwtPayload, User } from '../../modules/auth/auth.types';
import { authRepository } from '../../modules/auth/auth.repository';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      requestId?: string;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = header.slice(7);
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    const user = await authRepository.findUserById(decoded.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found or inactive');
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar ?? undefined,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Invalid or expired token'));
      return;
    }
    next(error);
  }
}

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    next();
    return;
  }
  authenticate(req, _res, next).catch(next);
}
