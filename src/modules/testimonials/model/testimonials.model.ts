import { count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../../../config/database';
import { mapTestimonial, testimonials, type Testimonial } from '../schema/testimonials.schema';
import { parsePagination } from '../../../shared/utils/pagination';
import type { z } from 'zod';
import type { testimonialSchema } from '../util/testimonials.util';

export type { Testimonial } from '../schema/testimonials.schema';
export type TestimonialInput = z.infer<typeof testimonialSchema>;

export const testimonialsModel = {
  async findMany(query: { page?: number; perPage?: number; search?: string }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = query.search
      ? or(
          ilike(testimonials.name, `%${query.search}%`),
          ilike(testimonials.country, `%${query.search}%`),
          ilike(testimonials.quote, `%${query.search}%`),
        )
      : undefined;

    const [rows, totalRow] = await Promise.all([
      db
        .select()
        .from(testimonials)
        .where(where)
        .orderBy(desc(testimonials.createdAt))
        .limit(take)
        .offset(skip),
      db.select({ value: count() }).from(testimonials).where(where),
    ]);

    return {
      items: rows.map(mapTestimonial),
      total: Number(totalRow[0]?.value ?? 0),
      page,
      perPage,
    };
  },

  async findById(id: string) {
    const [row] = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    return row ? mapTestimonial(row) : null;
  },

  async create(input: TestimonialInput): Promise<Testimonial> {
    const [row] = await db
      .insert(testimonials)
      .values({
        name: input.name,
        role: input.role,
        country: input.country,
        quote: input.quote,
        rating: input.rating,
        avatar: input.avatar,
        university: input.university,
      })
      .returning();
    return mapTestimonial(row);
  },

  async update(id: string, input: TestimonialInput) {
    const [row] = await db
      .update(testimonials)
      .set({
        name: input.name,
        role: input.role,
        country: input.country,
        quote: input.quote,
        rating: input.rating,
        avatar: input.avatar,
        university: input.university,
      })
      .where(eq(testimonials.id, id))
      .returning();
    return row ? mapTestimonial(row) : null;
  },

  async delete(id: string) {
    const [row] = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return row ? mapTestimonial(row) : null;
  },
};
