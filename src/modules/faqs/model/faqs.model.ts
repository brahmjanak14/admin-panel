import { count, desc, eq, ilike, or } from 'drizzle-orm';
import { db } from '../../../config/database';
import { faqs, mapFaq, type Faq } from '../schema/faqs.schema';
import { parsePagination } from '../../../shared/utils/pagination';
import type { z } from 'zod';
import type { faqSchema } from '../util/faqs.util';

export type { Faq } from '../schema/faqs.schema';
export type FaqInput = z.infer<typeof faqSchema>;

export const faqsModel = {
  async findMany(query: { page?: number; perPage?: number; search?: string }) {
    const { page, perPage, skip, take } = parsePagination(query);
    const where = query.search
      ? or(ilike(faqs.question, `%${query.search}%`), ilike(faqs.answer, `%${query.search}%`))
      : undefined;

    const [rows, totalRow] = await Promise.all([
      db.select().from(faqs).where(where).orderBy(desc(faqs.createdAt)).limit(take).offset(skip),
      db.select({ value: count() }).from(faqs).where(where),
    ]);

    return { items: rows.map(mapFaq), total: Number(totalRow[0]?.value ?? 0), page, perPage };
  },

  async findById(id: string) {
    const [row] = await db.select().from(faqs).where(eq(faqs.id, id)).limit(1);
    return row ? mapFaq(row) : null;
  },

  async create(input: FaqInput): Promise<Faq> {
    const [row] = await db
      .insert(faqs)
      .values({ question: input.question, answer: input.answer })
      .returning();
    return mapFaq(row);
  },

  async update(id: string, input: FaqInput) {
    const [row] = await db
      .update(faqs)
      .set({ question: input.question, answer: input.answer })
      .where(eq(faqs.id, id))
      .returning();
    return row ? mapFaq(row) : null;
  },

  async delete(id: string) {
    const [row] = await db.delete(faqs).where(eq(faqs.id, id)).returning();
    return row ? mapFaq(row) : null;
  },
};
