import { prisma } from '../../config/database';
import { toJsonValue } from '../../shared/utils/helpers';
import type { CountryContent, CountryContentBody } from './countries.types';
import { parsePagination } from '../../shared/utils/pagination';

function toCountry(row: {
  slug: string;
  name: string;
  flag: string;
  content: unknown;
}): CountryContent {
  const content = row.content as CountryContentBody;
  return {
    slug: row.slug,
    name: row.name,
    flag: row.flag,
    ...content,
  };
}

function extractContent(input: CountryContent): CountryContentBody {
  const { slug: _s, name: _n, flag: _f, ...content } = input;
  return content;
}

export const countriesRepository = {
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
      prisma.country.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
      prisma.country.count({ where }),
    ]);

    return {
      items: rows.map(toCountry),
      total,
      page,
      perPage,
    };
  },

  async findBySlug(slug: string) {
    const row = await prisma.country.findUnique({ where: { slug } });
    return row ? toCountry(row) : null;
  },

  async slugExists(slug: string) {
    const count = await prisma.country.count({ where: { slug } });
    return count > 0;
  },

  async create(input: CountryContent) {
    const row = await prisma.country.create({
      data: {
        slug: input.slug,
        name: input.name,
        flag: input.flag,
        content: toJsonValue(extractContent(input)),
      },
    });
    return toCountry(row);
  },

  async update(oldSlug: string, input: CountryContent) {
    const row = await prisma.country.update({
      where: { slug: oldSlug },
      data: {
        slug: input.slug,
        name: input.name,
        flag: input.flag,
        content: toJsonValue(extractContent(input)),
      },
    });
    return toCountry(row);
  },

  async delete(slug: string) {
    await prisma.country.delete({ where: { slug } });
  },
};
