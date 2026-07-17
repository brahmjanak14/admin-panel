import type { Request, Response } from 'express';
import { paramString } from '../../../shared/utils/helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse, PaginatedResponse } from '../../../shared/http/ApiResponse';
import { mediaService } from '../service/media.service';

export const mediaController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await mediaService.list(req.query as never);
    PaginatedResponse.send(res, result.data, result.meta);
  }),

  upload: asyncHandler(async (req: Request, res: Response) => {
    const media = await mediaService.upload(req.file!);
    ApiResponse.success(res, media, 'File uploaded', 201);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await mediaService.delete(paramString(req.params.id));
    ApiResponse.noContent(res);
  }),
};
