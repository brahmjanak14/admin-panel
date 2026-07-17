import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { AppError } from '../../../shared/errors/AppError';
import { buildPaginationMeta } from '../../../shared/utils/pagination';
import { mediaModel, type MediaItem } from '../model/media.model';

export const mediaService = {
  async list(query: { page?: number; perPage?: number }) {
    const result = await mediaModel.findMany(query);
    return {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
  },

  async upload(file: Express.Multer.File): Promise<MediaItem> {
    if (!file) throw new AppError('No file uploaded', 400);
    const url = `/uploads/${file.filename}`;
    return mediaModel.create({
      url,
      name: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    });
  },

  async delete(id: string): Promise<void> {
    const deleted = await mediaModel.delete(id);
    if (!deleted) throw new NotFoundError('Media not found');
  },
};
