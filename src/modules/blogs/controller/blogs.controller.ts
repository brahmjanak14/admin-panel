import type { Request, Response } from 'express';
import { paramString } from '../../../shared/utils/helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../../shared/http/ApiResponse';
import { blogsService } from '../service/blogs.service';

export const blogsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await blogsService.list(req.query as never);
    PaginatedResponse.send(res, result.data, result.meta);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogsService.getBySlug(paramString(req.params.slug));
    ApiResponse.success(res, blog);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogsService.create(req.body);
    ApiResponse.success(res, blog, 'Blog created', 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const blog = await blogsService.update(paramString(req.params.slug), req.body);
    ApiResponse.success(res, blog);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await blogsService.delete(paramString(req.params.slug));
    ApiResponse.noContent(res);
  }),
};
