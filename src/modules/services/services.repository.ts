import { prisma } from '../../config/database';
import { toJsonValue } from '../../shared/utils/helpers';
import type { ServiceContent, ServiceContentBody } from './services.types';
import { parsePagination } from '../../shared/utils/pagination';

function toService(row: { slug: string; name: string; content: unknown }): ServiceContent {
  const content = row.content as ServiceContentBody;
  return { slug: row.slug, name: row.name, ...content };
}

function extractContent(input: ServiceContent): ServiceContentBody {
  const { slug: _s, name: _n, ...content } = input;
  return content;
}

export const servicesRepository = {
  async findMany(query: { page?: number; perPage?: number; search?: string }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { slug: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [rows, total] = await Promise.all([
      prisma.service.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      prisma.service.count({ where }),
    ]);

    return { items: rows.map(toService), total, page, perPage };
  },

  async findBySlug(slug: string) {
    const row = await prisma.service.findUnique({ where: { slug } });
    return row ? toService(row) : null;
  },

  async slugExists(slug: string) {
    return (await prisma.service.count({ where: { slug } })) > 0;
  },

  async create(input: ServiceContent) {
    const row = await prisma.service.create({
      data: { slug: input.slug, name: input.name, content: toJsonValue(extractContent(input)) },
    });
    return toService(row);
  },

  async update(oldSlug: string, input: ServiceContent) {
    const row = await prisma.service.update({
      where: { slug: oldSlug },
      data: { slug: input.slug, name: input.name, content: toJsonValue(extractContent(input)) },
    });
    return toService(row);
  },

  async delete(slug: string) {
    await prisma.service.delete({ where: { slug } });
  },
};
