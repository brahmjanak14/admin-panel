import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { timestamps } from '../../../db/columns';

export const testimonials = pgTable('testimonials', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  role: text('role').notNull(),
  country: text('country').notNull(),
  quote: text('quote').notNull(),
  rating: integer('rating').notNull(),
  avatar: text('avatar'),
  university: text('university'),
  ...timestamps,
});

export type TestimonialRow = typeof testimonials.$inferSelect;

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  country: string;
  quote: string;
  rating: number;
  avatar?: string;
  university?: string;
  createdAt: string;
  updatedAt: string;
}

export function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    country: row.country,
    quote: row.quote,
    rating: row.rating,
    avatar: row.avatar ?? undefined,
    university: row.university ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
