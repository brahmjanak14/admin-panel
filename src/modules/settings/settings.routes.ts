import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/database';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse } from '../../shared/http/ApiResponse';
import { validate } from '../../shared/middleware/validate';
import { authenticate } from '../../shared/middleware/authenticate';
import { authorize } from '../../shared/middleware/authorize';

const settingsSchema = z.record(z.unknown());

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('settings:write'),
  asyncHandler(async (_req, res) => {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({ data: { data: {} } });
    }
    ApiResponse.success(res, setting.data as Record<string, unknown>);
  }),
);

router.patch(
  '/',
  authenticate,
  authorize('settings:write'),
  validate(settingsSchema),
  asyncHandler(async (req, res) => {
    let setting = await prisma.setting.findFirst();
    if (!setting) {
      setting = await prisma.setting.create({ data: { data: req.body } });
    } else {
      setting = await prisma.setting.update({
        where: { id: setting.id },
        data: { data: { ...(setting.data as object), ...req.body } },
      });
    }
    ApiResponse.success(res, setting.data as Record<string, unknown>);
  }),
);

export default router;
