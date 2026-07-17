import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { buildPaginationMeta } from '../../../shared/utils/pagination';
import {
  universitiesModel,
  type University,
  type UniversityInput,
} from '../model/universities.model';

export const universitiesService = {
  async list(query: { page?: number; perPage?: number; search?: string }) {
    const result = await universitiesModel.findMany(query);
    return {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
  },

  async getById(id: string): Promise<University> {
    const item = await universitiesModel.findById(id);
    if (!item) throw new NotFoundError('University not found');
    return item;
  },

  async create(input: UniversityInput): Promise<University> {
    return universitiesModel.create(input);
  },

  async update(id: string, input: UniversityInput): Promise<University> {
    const item = await universitiesModel.update(id, input);
    if (!item) throw new NotFoundError('University not found');
    return item;
  },

  async delete(id: string): Promise<void> {
    const item = await universitiesModel.delete(id);
    if (!item) throw new NotFoundError('University not found');
  },
};
