import type { Request, Response } from 'express';
import { paramString } from '../../shared/utils/helpers';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../shared/http/ApiResponse';
import { servicesService } from './services.service';

export const servicesController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await servicesService.list(req.query as never);
    PaginatedResponse.send(res, result.data, result.meta);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const service = await servicesService.getBySlug(paramString(req.params.slug));
    ApiResponse.success(res, service);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const service = await servicesService.create(req.body);
    ApiResponse.success(res, service, 'Service created', 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const service = await servicesService.update(paramString(req.params.slug), req.body);
    ApiResponse.success(res, service);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await servicesService.delete(paramString(req.params.slug));
    ApiResponse.noContent(res);
  }),
};
