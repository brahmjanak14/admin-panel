import type { Request, Response } from 'express';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/http/ApiResponse';
import { authService } from '../service/auth.service';

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const session = await authService.login(req.body.email, req.body.password);
    ApiResponse.success(res, session);
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.body?.refreshToken as string | undefined;
    await authService.logout(refreshToken, req.user?.id);
    ApiResponse.noContent(res);
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.me(req.user!.id);
    ApiResponse.success(res, user);
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const tokens = await authService.refresh(req.body.refreshToken);
    ApiResponse.success(res, tokens);
  }),
};
