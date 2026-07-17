import { asc, count, eq, ilike, or } from 'drizzle-orm';
import { db } from '../../../config/database';
import {
  extractServiceContent,
  mapService,
  services,
  type ServiceContent,
} from '../schema/services.schema';
import { toJsonValue } from '../../../shared/utils/helpers';
import { parsePagination } from '../../../shared/utils/pagination';

export type { ServiceContent, ServiceContentBody } from '../schema/services.schema';

export const servicesModel = {
  async findMany(query: { page?: number; perPage?: number; search?: string }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = query.search
      ? or(ilike(services.name, `%${query.search}%`), ilike(services.slug, `%${query.search}%`))
      : undefined;

    const [rows, totalRow] = await Promise.all([
      db.select().from(services).where(where).orderBy(asc(services.name)).limit(take).offset(skip),
      db.select({ value: count() }).from(services).where(where),
    ]);

    return { items: rows.map(mapService), total: Number(totalRow[0]?.value ?? 0), page, perPage };
  },

  async findBySlug(slug: string) {
    const [row] = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
    return row ? mapService(row) : null;
  },

  async slugExists(slug: string) {
    const [row] = await db.select({ value: count() }).from(services).where(eq(services.slug, slug));
    return Number(row?.value ?? 0) > 0;
  },

  async create(input: ServiceContent) {
    const [row] = await db
      .insert(services)
      .values({
        slug: input.slug,
        name: input.name,
        content: toJsonValue(extractServiceContent(input)),
      })
      .returning();
    return mapService(row);
  },

  async update(oldSlug: string, input: ServiceContent) {
    const [row] = await db
      .update(services)
      .set({
        slug: input.slug,
        name: input.name,
        content: toJsonValue(extractServiceContent(input)),
      })
      .where(eq(services.slug, oldSlug))
      .returning();
    return mapService(row);
  },

  async delete(slug: string) {
    await db.delete(services).where(eq(services.slug, slug));
  },
};
