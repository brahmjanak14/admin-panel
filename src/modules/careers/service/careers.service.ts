import { AppError } from '../../../shared/errors/AppError';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { buildPaginationMeta } from '../../../shared/utils/pagination';
import { careersModel, type Career, type CareerInput } from '../model/careers.model';

export const careersService = {
  async list(query: { page?: number; perPage?: number; search?: string }) {
    const result = await careersModel.findMany(query);
    return {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
  },

  async getBySlug(slug: string): Promise<Career> {
    const item = await careersModel.findBySlug(slug);
    if (!item) throw new NotFoundError('Career not found');
    return item;
  },

  async create(input: CareerInput): Promise<Career> {
    if (await careersModel.slugExists(input.slug)) {
      throw new AppError('Slug already exists', 409);
    }
    return careersModel.create(input);
  },

  async update(slug: string, input: CareerInput): Promise<Career> {
    const existing = await careersModel.findBySlug(slug);
    if (!existing) throw new NotFoundError('Career not found');
    if (input.slug !== slug && (await careersModel.slugExists(input.slug, existing.id))) {
      throw new AppError('Slug already exists', 409);
    }
    const item = await careersModel.update(slug, input);
    if (!item) throw new NotFoundError('Career not found');
    return item;
  },

  async delete(slug: string): Promise<void> {
    const item = await careersModel.delete(slug);
    if (!item) throw new NotFoundError('Career not found');
  },
};
