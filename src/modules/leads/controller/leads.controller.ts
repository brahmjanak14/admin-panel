import type { Request, Response } from 'express';
import { paramString } from '../../../shared/utils/helpers';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ApiResponse } from '../../../shared/http/ApiResponse';
import { PaginatedResponse } from '../../../shared/http/ApiResponse';
import { leadsService } from '../service/leads.service';

export const leadsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const result = await leadsService.list(req.query as never);
    PaginatedResponse.send(res, result.data, result.meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.getById(paramString(req.params.id));
    ApiResponse.success(res, lead);
  }),

  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.updateStatus(paramString(req.params.id), req.body.status);
    ApiResponse.success(res, lead);
  }),

  exportCsv: asyncHandler(async (req: Request, res: Response) => {
    const csv = await leadsService.exportCsv(req.query as never);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  }),

  createPublic: asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadsService.createPublic(req.body);
    ApiResponse.success(res, lead, 'Lead submitted successfully', 201);
  }),
};
