import { pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { timestamps } from '../../../db/columns';
import { careerTypeEnum } from '../../../db/enums';

export const careers = pgTable(
  'careers',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    department: text('department').notNull(),
    location: text('location').notNull(),
    type: careerTypeEnum('type').notNull(),
    experience: text('experience').notNull(),
    description: text('description').notNull(),
    responsibilities: text('responsibilities').array().notNull().default([]),
    requirements: text('requirements').array().notNull().default([]),
    ...timestamps,
  },
  (table) => [uniqueIndex('careers_slug_key').on(table.slug)],
);

export type CareerRow = typeof careers.$inferSelect;
export type CareerType = 'full-time' | 'part-time' | 'contract';

export interface Career {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: CareerType;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  createdAt: string;
  updatedAt: string;
}

export function mapCareer(row: CareerRow): Career {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    experience: row.experience,
    description: row.description,
    responsibilities: row.responsibilities,
    requirements: row.requirements,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
