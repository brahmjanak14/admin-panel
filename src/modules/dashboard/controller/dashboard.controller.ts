import type { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/http/ApiResponse';
import { dashboardService } from '../service/dashboard.service';

export const dashboardController = {
  getStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await dashboardService.getStats();
    ApiResponse.success(res, stats);
  }),
};
