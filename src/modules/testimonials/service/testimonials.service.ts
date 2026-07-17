import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { buildPaginationMeta } from '../../../shared/utils/pagination';
import {
  testimonialsModel,
  type Testimonial,
  type TestimonialInput,
} from '../model/testimonials.model';

export const testimonialsService = {
  async list(query: { page?: number; perPage?: number; search?: string }) {
    const result = await testimonialsModel.findMany(query);
    return {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
  },

  async getById(id: string): Promise<Testimonial> {
    const item = await testimonialsModel.findById(id);
    if (!item) throw new NotFoundError('Testimonial not found');
    return item;
  },

  async create(input: TestimonialInput): Promise<Testimonial> {
    return testimonialsModel.create(input);
  },

  async update(id: string, input: TestimonialInput): Promise<Testimonial> {
    const item = await testimonialsModel.update(id, input);
    if (!item) throw new NotFoundError('Testimonial not found');
    return item;
  },

  async delete(id: string): Promise<void> {
    const item = await testimonialsModel.delete(id);
    if (!item) throw new NotFoundError('Testimonial not found');
  },
};
