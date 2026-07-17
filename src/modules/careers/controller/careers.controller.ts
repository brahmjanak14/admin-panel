import type { Request, Response } from 'express';
import { paramString } from '../../../shared/utils/helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../../shared/http/ApiResponse';
import { careersService } from '../service/careers.service';

export const careersController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await careersService.list(req.query as never);
    PaginatedResponse.send(res, result.data, result.meta);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const item = await careersService.getBySlug(paramString(req.params.slug));
    ApiResponse.success(res, item);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const item = await careersService.create(req.body);
    ApiResponse.success(res, item, 'Created', 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const item = await careersService.update(paramString(req.params.slug), req.body);
    ApiResponse.success(res, item);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await careersService.delete(paramString(req.params.slug));
    ApiResponse.noContent(res);
  }),
};
