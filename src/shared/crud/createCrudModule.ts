import { Router } from 'express';
import { z, type ZodSchema } from 'zod';
import { prisma } from '../../config/database';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../http/ApiResponse';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { NotFoundError } from '../errors/NotFoundError';
import { buildPaginationMeta, parsePagination } from '../utils/pagination';
import { paramString } from '../utils/helpers';
import type { Permission } from '../../modules/auth/auth.types';

type PrismaModel = 'university' | 'event' | 'testimonial' | 'faq' | 'career';

interface CrudModuleOptions {
  model: PrismaModel;
  permission: { read: Permission; write: Permission };
  schema: ZodSchema;
  idField: 'id' | 'slug';
  searchFields?: string[];
  transformCreate?: (data: Record<string, unknown>) => Record<string, unknown>;
  transformUpdate?: (data: Record<string, unknown>) => Record<string, unknown>;
  mapTypeField?: (data: Record<string, unknown>) => Record<string, unknown>;
  mapFromDb?: (row: Record<string, unknown>) => Record<string, unknown>;
}

function getDelegate(model: PrismaModel) {
  const map = {
    university: prisma.university,
    event: prisma.event,
    testimonial: prisma.testimonial,
    faq: prisma.faq,
    career: prisma.career,
  } as const;
  return map[model];
}

function serializeRow(row: Record<string, unknown>, mapFromDb?: CrudModuleOptions['mapFromDb']) {
  const base = mapFromDb ? mapFromDb(row) : row;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(base)) {
    result[key] = value instanceof Date ? value.toISOString() : value;
  }
  return result;
}

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
});

export function createCrudModule(options: CrudModuleOptions): Router {
  const router = Router();
  const delegate = getDelegate(options.model);
  const idParamSchema =
    options.idField === 'slug'
      ? z.object({ slug: z.string().min(1) })
      : z.object({ id: z.string().uuid() });

  const prepareWrite = (data: Record<string, unknown>, transform?: CrudModuleOptions['transformCreate']) => {
    let payload = { ...data };
    if (options.mapTypeField) payload = options.mapTypeField(payload);
    if (transform) payload = transform(payload);
    return payload;
  };

  router.get(
    '/',
    authenticate,
    authorize(options.permission.read),
    validate(listQuerySchema, 'query'),
    asyncHandler(async (req, res) => {
      const { page, perPage, skip, take } = parsePagination(req.query as never);
      const search = req.query.search as string | undefined;
      const searchFields = options.searchFields ?? ['name', 'title', 'slug', 'question'];
      const where = search
        ? {
            OR: searchFields.map((key) => ({
              [key]: { contains: search, mode: 'insensitive' as const },
            })),
          }
        : {};

      const [rows, total] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (delegate as any).findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (delegate as any).count({ where }),
      ]);

      PaginatedResponse.send(
        res,
        rows.map((row: Record<string, unknown>) => serializeRow(row, options.mapFromDb)),
        buildPaginationMeta(total, page, perPage),
      );
    }),
  );

  router.get(
    `/:${options.idField}`,
    authenticate,
    authorize(options.permission.read),
    validate(idParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const idValue = paramString(req.params[options.idField]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await (delegate as any).findUnique({
        where: { [options.idField]: idValue },
      });
      if (!row) throw new NotFoundError(`${options.model} not found`);
      ApiResponse.success(res, serializeRow(row as Record<string, unknown>, options.mapFromDb));
    }),
  );

  router.post(
    '/',
    authenticate,
    authorize(options.permission.write),
    validate(options.schema),
    asyncHandler(async (req, res) => {
      const data = prepareWrite(req.body, options.transformCreate);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const row = await (delegate as any).create({ data });
      ApiResponse.success(
        res,
        serializeRow(row as Record<string, unknown>, options.mapFromDb),
        'Created',
        201,
      );
    }),
  );

  router.patch(
    `/:${options.idField}`,
    authenticate,
    authorize(options.permission.write),
    validate(idParamSchema, 'params'),
    validate(options.schema),
    asyncHandler(async (req, res) => {
      const idValue = paramString(req.params[options.idField]);
      const data = prepareWrite(req.body, options.transformUpdate);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const row = await (delegate as any).update({
          where: { [options.idField]: idValue },
          data,
        });
        ApiResponse.success(res, serializeRow(row as Record<string, unknown>, options.mapFromDb));
      } catch {
        throw new NotFoundError(`${options.model} not found`);
      }
    }),
  );

  router.delete(
    `/:${options.idField}`,
    authenticate,
    authorize(options.permission.write),
    validate(idParamSchema, 'params'),
    asyncHandler(async (req, res) => {
      const idValue = paramString(req.params[options.idField]);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (delegate as any).delete({ where: { [options.idField]: idValue } });
        ApiResponse.noContent(res);
      } catch {
        throw new NotFoundError(`${options.model} not found`);
      }
    }),
  );

  return router;
}
