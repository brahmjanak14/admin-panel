import type { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/http/ApiResponse';
import { settingsService } from '../service/settings.service';

export const settingsController = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    const data = await settingsService.get();
    ApiResponse.success(res, data);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const data = await settingsService.update(req.body);
    ApiResponse.success(res, data);
  }),
};
