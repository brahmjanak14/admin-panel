import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { buildPaginationMeta } from '../../../shared/utils/pagination';
import { eventsModel, type EventInput, type EventItem } from '../model/events.model';

export const eventsService = {
  async list(query: { page?: number; perPage?: number; search?: string }) {
    const result = await eventsModel.findMany(query);
    return {
      data: result.items,
      meta: buildPaginationMeta(result.total, result.page, result.perPage),
    };
  },

  async getById(id: string): Promise<EventItem> {
    const item = await eventsModel.findById(id);
    if (!item) throw new NotFoundError('Event not found');
    return item;
  },

  async create(input: EventInput): Promise<EventItem> {
    return eventsModel.create(input);
  },

  async update(id: string, input: EventInput): Promise<EventItem> {
    const item = await eventsModel.update(id, input);
    if (!item) throw new NotFoundError('Event not found');
    return item;
  },

  async delete(id: string): Promise<void> {
    const item = await eventsModel.delete(id);
    if (!item) throw new NotFoundError('Event not found');
  },
};
