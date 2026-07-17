import { and, count, desc, eq, ilike, ne, or } from 'drizzle-orm';
import { db } from '../../../config/database';
import { careers, mapCareer, type Career } from '../schema/careers.schema';
import { parsePagination } from '../../../shared/utils/pagination';
import type { z } from 'zod';
import type { careerSchema } from '../util/careers.util';

export type { Career, CareerType } from '../schema/careers.schema';
export type CareerInput = z.infer<typeof careerSchema>;

export const careersModel = {
  async findMany(query: { page?: number; perPage?: number; search?: string }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = query.search
      ? or(
          ilike(careers.title, `%${query.search}%`),
          ilike(careers.slug, `%${query.search}%`),
          ilike(careers.department, `%${query.search}%`),
          ilike(careers.location, `%${query.search}%`),
        )
      : undefined;

    const [rows, totalRow] = await Promise.all([
      db
        .select()
        .from(careers)
        .where(where)
        .orderBy(desc(careers.createdAt))
        .limit(take)
        .offset(skip),
      db.select({ value: count() }).from(careers).where(where),
    ]);

    return { items: rows.map(mapCareer), total: Number(totalRow[0]?.value ?? 0), page, perPage };
  },

  async findBySlug(slug: string) {
    const [row] = await db.select().from(careers).where(eq(careers.slug, slug)).limit(1);
    return row ? mapCareer(row) : null;
  },

  async slugExists(slug: string, excludeId?: string) {
    const conditions = [eq(careers.slug, slug)];
    if (excludeId) conditions.push(ne(careers.id, excludeId));
    const [row] = await db
      .select({ id: careers.id })
      .from(careers)
      .where(and(...conditions))
      .limit(1);
    return Boolean(row);
  },

  async create(input: CareerInput): Promise<Career> {
    const [row] = await db
      .insert(careers)
      .values({
        slug: input.slug,
        title: input.title,
        department: input.department,
        location: input.location,
        type: input.type,
        experience: input.experience,
        description: input.description,
        responsibilities: input.responsibilities ?? [],
        requirements: input.requirements ?? [],
      })
      .returning();
    return mapCareer(row);
  },

  async update(oldSlug: string, input: CareerInput) {
    const [row] = await db
      .update(careers)
      .set({
        slug: input.slug,
        title: input.title,
        department: input.department,
        location: input.location,
        type: input.type,
        experience: input.experience,
        description: input.description,
        responsibilities: input.responsibilities ?? [],
        requirements: input.requirements ?? [],
      })
      .where(eq(careers.slug, oldSlug))
      .returning();
    return row ? mapCareer(row) : null;
  },

  async delete(slug: string) {
    const [row] = await db.delete(careers).where(eq(careers.slug, slug)).returning();
    return row ? mapCareer(row) : null;
  },
};
