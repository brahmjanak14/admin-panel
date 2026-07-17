import { boolean, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { timestamps } from '../../../db/columns';

export const services = pgTable(
  'services',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    content: jsonb('content').notNull(),
    published: boolean('published').notNull().default(true),
    ...timestamps,
  },
  (table) => [uniqueIndex('services_slug_key').on(table.slug)],
);

export type ServiceRow = typeof services.$inferSelect;

export interface ServiceContent {
  slug: string;
  name: string;
  heroTitle: string;
  heroSubtitle: string;
  overview: string;
  whoIsItFor: string[];
  benefits: FeatureItem[];
  process: ProcessStep[];
  documents: string[];
  timeline: string;
  faqs: FaqItem[];
  seo: { title: string; description: string };
}

interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  duration?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export type ServiceContentBody = Omit<ServiceContent, 'slug' | 'name'>;

export function mapService(row: ServiceRow): ServiceContent {
  const content = row.content as ServiceContentBody;
  return { slug: row.slug, name: row.name, ...content };
}

export function extractServiceContent(input: ServiceContent): ServiceContentBody {
  const { slug: _s, name: _n, ...content } = input;
  return content;
}
