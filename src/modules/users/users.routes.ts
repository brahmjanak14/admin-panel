import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/database';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../shared/http/ApiResponse';
import { validate } from '../../shared/middleware/validate';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { AppError } from '../../shared/errors/AppError';
import { buildPaginationMeta, parsePagination } from '../../shared/utils/pagination';
import { hashPassword } from '../../shared/utils/password';
import { paramString } from '../../shared/utils/helpers';

const roleEnum = z.enum(['super_admin', 'admin', 'editor', 'viewer']);

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  role: roleEnum,
  avatar: z.string().optional(),
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

const idParamSchema = z.object({ id: z.string().uuid() });

function mapUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar ?? undefined,
  };
}

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('users:read'),
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, perPage, skip, take } = parsePagination(req.query as never);
    const search = req.query.search as string | undefined;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);

    PaginatedResponse.send(res, users.map(mapUser), buildPaginationMeta(total, page, perPage));
  }),
);

router.get(
  '/:id',
  authenticate,
  authorize('users:read'),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: paramString(req.params.id) } });
    if (!user) throw new NotFoundError('User not found');
    ApiResponse.success(res, mapUser(user));
  }),
);

router.post(
  '/',
  authenticate,
  authorize('users:write'),
  validate(userSchema.extend({ password: z.string().min(6) })),
  asyncHandler(async (req, res) => {
    const exists = await prisma.user.findUnique({ where: { email: req.body.email } });
    if (exists) throw new AppError('Email already in use', 409);

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        passwordHash: await hashPassword(req.body.password),
        role: req.body.role,
        avatar: req.body.avatar,
      },
    });
    ApiResponse.success(res, mapUser(user), 'User created', 201);
  }),
);

router.patch(
  '/:id',
  authenticate,
  authorize('users:write'),
  validate(idParamSchema, 'params'),
  validate(userSchema.partial()),
  asyncHandler(async (req, res) => {
    const data: Record<string, unknown> = {};
    if (req.body.name) data.name = req.body.name;
    if (req.body.email) data.email = req.body.email;
    if (req.body.role) data.role = req.body.role;
    if (req.body.avatar !== undefined) data.avatar = req.body.avatar;
    if (req.body.password) data.passwordHash = await hashPassword(req.body.password);

    try {
      const user = await prisma.user.update({ where: { id: paramString(req.params.id) }, data });
      ApiResponse.success(res, mapUser(user));
    } catch {
      throw new NotFoundError('User not found');
    }
  }),
);

router.delete(
  '/:id',
  authenticate,
  authorize('users:write'),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    if (req.user?.id === paramString(req.params.id)) {
      throw new AppError('Cannot delete your own account', 400);
    }
    try {
      await prisma.user.delete({ where: { id: paramString(req.params.id) } });
      ApiResponse.noContent(res);
    } catch {
      throw new NotFoundError('User not found');
    }
  }),
);

export default router;
