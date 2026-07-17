import type { Request, Response } from 'express';
import { paramString } from '../../../shared/utils/helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../../shared/http/ApiResponse';
import { usersService } from '../service/users.service';

export const usersController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await usersService.list(req.query as never);
    PaginatedResponse.send(res, result.data, result.meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.getById(paramString(req.params.id));
    ApiResponse.success(res, user);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.create(req.body);
    ApiResponse.success(res, user, 'User created', 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.update(paramString(req.params.id), req.body);
    ApiResponse.success(res, user);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await usersService.delete(paramString(req.params.id), req.user?.id);
    ApiResponse.noContent(res);
  }),
};
