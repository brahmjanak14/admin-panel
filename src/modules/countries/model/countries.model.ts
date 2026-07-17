import { count, eq, ilike, or, asc } from 'drizzle-orm';
import { db } from '../../../config/database';
import {
  countries,
  extractCountryContent,
  mapCountry,
  type CountryContent,
} from '../schema/countries.schema';
import { toJsonValue } from '../../../shared/utils/helpers';
import { parsePagination } from '../../../shared/utils/pagination';

export type { CountryContent, CountryContentBody } from '../schema/countries.schema';

export const countriesModel = {
  async findMany(query: { page?: number; perPage?: number; search?: string }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = query.search
      ? or(ilike(countries.name, `%${query.search}%`), ilike(countries.slug, `%${query.search}%`))
      : undefined;

    const [rows, totalRow] = await Promise.all([
      db
        .select()
        .from(countries)
        .where(where)
        .orderBy(asc(countries.name))
        .limit(take)
        .offset(skip),
      db.select({ value: count() }).from(countries).where(where),
    ]);

    return {
      items: rows.map(mapCountry),
      total: Number(totalRow[0]?.value ?? 0),
      page,
      perPage,
    };
  },

  async findBySlug(slug: string) {
    const [row] = await db.select().from(countries).where(eq(countries.slug, slug)).limit(1);
    return row ? mapCountry(row) : null;
  },

  async slugExists(slug: string) {
    const [row] = await db
      .select({ value: count() })
      .from(countries)
      .where(eq(countries.slug, slug));
    return Number(row?.value ?? 0) > 0;
  },

  async create(input: CountryContent) {
    const [row] = await db
      .insert(countries)
      .values({
        slug: input.slug,
        name: input.name,
        flag: input.flag,
        content: toJsonValue(extractCountryContent(input)),
      })
      .returning();
    return mapCountry(row);
  },

  async update(oldSlug: string, input: CountryContent) {
    const [row] = await db
      .update(countries)
      .set({
        slug: input.slug,
        name: input.name,
        flag: input.flag,
        content: toJsonValue(extractCountryContent(input)),
      })
      .where(eq(countries.slug, oldSlug))
      .returning();
    return mapCountry(row);
  },

  async delete(slug: string) {
    await db.delete(countries).where(eq(countries.slug, slug));
  },
};
