import { pgTable, text } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { timestamps } from '../../../db/columns';

export const faqs = pgTable('faqs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  ...timestamps,
});

export type FaqRow = typeof faqs.$inferSelect;

export interface Faq {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export function mapFaq(row: FaqRow): Faq {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
