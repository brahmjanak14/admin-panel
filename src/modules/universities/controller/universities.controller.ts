import type { Request, Response } from 'express';
import { paramString } from '../../../shared/utils/helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../../shared/http/ApiResponse';
import { universitiesService } from '../service/universities.service';

export const universitiesController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await universitiesService.list(req.query as never);
    PaginatedResponse.send(res, result.data, result.meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const item = await universitiesService.getById(paramString(req.params.id));
    ApiResponse.success(res, item);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const item = await universitiesService.create(req.body);
    ApiResponse.success(res, item, 'Created', 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const item = await universitiesService.update(paramString(req.params.id), req.body);
    ApiResponse.success(res, item);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await universitiesService.delete(paramString(req.params.id));
    ApiResponse.noContent(res);
  }),
};
