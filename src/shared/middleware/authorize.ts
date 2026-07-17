import type { Request, Response, NextFunction } from 'express';
import { rolePermissions } from '../../config/constants';
import { ForbiddenError } from '../errors/ForbiddenError';
import type { Permission } from '../../modules/auth/schema/auth.schema';

export function authorize(...permissions: Permission[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new ForbiddenError('Authentication required'));
      return;
    }

    const userPermissions = rolePermissions[req.user.role];
    const allowed = permissions.some((p) => userPermissions.includes(p));

    if (!allowed) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }

    next();
  };
}
