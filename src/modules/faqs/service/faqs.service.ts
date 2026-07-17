import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { buildPaginationMeta } from '../../../shared/utils/pagination';
import { faqsModel, type Faq, type FaqInput } from '../model/faqs.model';

export const faqsService = {
  async list(query: { page?: number; perPage?: number; search?: string }) {
    const result = await faqsModel.findMany(query);
    return {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
  },

  async getById(id: string): Promise<Faq> {
    const item = await faqsModel.findById(id);
    if (!item) throw new NotFoundError('FAQ not found');
    return item;
  },

  async create(input: FaqInput): Promise<Faq> {
    return faqsModel.create(input);
  },

  async update(id: string, input: FaqInput): Promise<Faq> {
    const item = await faqsModel.update(id, input);
    if (!item) throw new NotFoundError('FAQ not found');
    return item;
  },

  async delete(id: string): Promise<void> {
    const item = await faqsModel.delete(id);
    if (!item) throw new NotFoundError('FAQ not found');
  },
};
