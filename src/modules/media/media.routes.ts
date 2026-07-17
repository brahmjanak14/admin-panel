import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';
import { prisma } from '../../config/database';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../shared/http/ApiResponse';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';
import { mediaUploadLimiter } from '../../shared/middleware/rateLimiter';
import { NotFoundError } from '../../shared/errors/NotFoundError';
import { buildPaginationMeta, parsePagination } from '../../shared/utils/pagination';
import { AppError } from '../../shared/errors/AppError';
import { paramString } from '../../shared/utils/helpers';
import { validate } from '../../shared/middleware/validate';
import { z } from 'zod';

const allowedMimes = env.ALLOWED_MIME_TYPES.split(',').map((s) => s.trim());

if (!fs.existsSync(env.UPLOAD_DIR)) {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedMimes.includes(file.mimetype)) {
      cb(new AppError('File type not allowed', 400));
      return;
    }
    cb(null, true);
  },
});

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().positive().max(100).optional(),
});

const idParamSchema = z.object({ id: z.string().uuid() });

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('blogs:read'),
  validate(listQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const { page, perPage, skip, take } = parsePagination(req.query as never);
    const [items, total] = await Promise.all([
      prisma.media.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.media.count(),
    ]);
    PaginatedResponse.send(
      res,
      items.map((m) => ({
        id: m.id,
        url: m.url,
        name: m.name,
        mimeType: m.mimeType,
        size: m.size,
        createdAt: m.createdAt.toISOString(),
      })),
      buildPaginationMeta(total, page, perPage),
    );
  }),
);

router.post(
  '/upload',
  authenticate,
  authorize('blogs:write'),
  mediaUploadLimiter,
  upload.single('file'),
  asyncHandler(async (req, res) => {
    if (!req.file) throw new AppError('No file uploaded', 400);
    const url = `/uploads/${req.file.filename}`;
    const media = await prisma.media.create({
      data: {
        url,
        name: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
      },
    });
    ApiResponse.success(
      res,
      {
        id: media.id,
        url: media.url,
        name: media.name,
        mimeType: media.mimeType,
        size: media.size,
        createdAt: media.createdAt.toISOString(),
      },
      'File uploaded',
      201,
    );
  }),
);

router.delete(
  '/:id',
  authenticate,
  authorize('blogs:write'),
  validate(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const media = await prisma.media.findUnique({ where: { id: paramString(req.params.id) } });
    if (!media) throw new NotFoundError('Media not found');

    const filePath = path.join(env.UPLOAD_DIR, path.basename(media.url));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.media.delete({ where: { id: paramString(req.params.id) } });
    ApiResponse.noContent(res);
  }),
);

export default router;
