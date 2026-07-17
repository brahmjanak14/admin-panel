import type { Request, Response } from 'express';
import { paramString } from '../../../shared/utils/helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../../shared/http/ApiResponse';
import { eventsService } from '../service/events.service';

export const eventsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await eventsService.list(req.query as never);
    PaginatedResponse.send(res, result.data, result.meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const item = await eventsService.getById(paramString(req.params.id));
    ApiResponse.success(res, item);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const item = await eventsService.create(req.body);
    ApiResponse.success(res, item, 'Created', 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const item = await eventsService.update(paramString(req.params.id), req.body);
    ApiResponse.success(res, item);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await eventsService.delete(paramString(req.params.id));
    ApiResponse.noContent(res);
  }),
};
