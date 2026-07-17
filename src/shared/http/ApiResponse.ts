import type { Response } from 'express';
import type { PaginationMeta } from '../utils/pagination';

export class ApiResponse {
  static success<T>(res: Response, data: T, message?: string, status = 200) {
    const body: { data: T; message?: string } = { data };
    if (message) body.message = message;
    return res.status(status).json(body);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}

export class PaginatedResponse {
  static send<T>(res: Response, data: T[], meta: PaginationMeta) {
    return res.status(200).json({ data, meta });
  }
}
