import { integer, pgTable, text } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { timestamps } from '../../../db/columns';

export const universities = pgTable('universities', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  country: text('country').notNull(),
  ranking: integer('ranking').notNull(),
  logo: text('logo'),
  location: text('location').notNull(),
  programs: text('programs').array().notNull().default([]),
  ...timestamps,
});

export type UniversityRow = typeof universities.$inferSelect;

export interface University {
  id: string;
  name: string;
  country: string;
  ranking: number;
  logo?: string;
  location: string;
  programs: string[];
  createdAt: string;
  updatedAt: string;
}

export function mapUniversity(row: UniversityRow): University {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    ranking: row.ranking,
    logo: row.logo ?? undefined,
    location: row.location,
    programs: row.programs,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
