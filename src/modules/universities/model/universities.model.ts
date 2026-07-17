import { count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../../../config/database';
import { mapUniversity, universities, type University } from '../schema/universities.schema';
import { parsePagination } from '../../../shared/utils/pagination';
import type { z } from 'zod';
import type { universitySchema } from '../util/universities.util';

export type { University } from '../schema/universities.schema';
export type UniversityInput = z.infer<typeof universitySchema>;

export const universitiesModel = {
  async findMany(query: { page?: number; perPage?: number; search?: string }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = query.search
      ? or(
          ilike(universities.name, `%${query.search}%`),
          ilike(universities.country, `%${query.search}%`),
          ilike(universities.location, `%${query.search}%`),
        )
      : undefined;

    const [rows, totalRow] = await Promise.all([
      db
        .select()
        .from(universities)
        .where(where)
        .orderBy(desc(universities.createdAt))
        .limit(take)
        .offset(skip),
      db.select({ value: count() }).from(universities).where(where),
    ]);

    return { items: rows.map(mapUniversity), total: Number(totalRow[0]?.value ?? 0), page, perPage };
  },

  async findById(id: string) {
    const [row] = await db.select().from(universities).where(eq(universities.id, id)).limit(1);
    return row ? mapUniversity(row) : null;
  },

  async create(input: UniversityInput): Promise<University> {
    const [row] = await db
      .insert(universities)
      .values({
        name: input.name,
        country: input.country,
        ranking: input.ranking,
        logo: input.logo,
        location: input.location,
        programs: input.programs ?? [],
      })
      .returning();
    return mapUniversity(row);
  },

  async update(id: string, input: UniversityInput) {
    const [row] = await db
      .update(universities)
      .set({
        name: input.name,
        country: input.country,
        ranking: input.ranking,
        logo: input.logo,
        location: input.location,
        programs: input.programs ?? [],
      })
      .where(eq(universities.id, id))
      .returning();
    return row ? mapUniversity(row) : null;
  },

  async delete(id: string) {
    const [row] = await db.delete(universities).where(eq(universities.id, id)).returning();
    return row ? mapUniversity(row) : null;
  },
};
