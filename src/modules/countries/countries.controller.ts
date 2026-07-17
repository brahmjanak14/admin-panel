import type { Request, Response } from 'express';
import { paramString } from '../../shared/utils/helpers';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../shared/http/ApiResponse';
import { countriesService } from './countries.service';

export const countriesController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await countriesService.list(req.query as never);
    PaginatedResponse.send(res, result.data, result.meta);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const country = await countriesService.getBySlug(paramString(req.params.slug));
    ApiResponse.success(res, country);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const country = await countriesService.create(req.body);
    ApiResponse.success(res, country, 'Country created', 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const country = await countriesService.update(paramString(req.params.slug), req.body);
    ApiResponse.success(res, country);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await countriesService.delete(paramString(req.params.slug));
    ApiResponse.noContent(res);
  }),
};
