import { boolean, jsonb, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { timestamps } from '../../../db/columns';

export const countries = pgTable(
  'countries',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    slug: text('slug').notNull(),
    name: text('name').notNull(),
    flag: text('flag').notNull(),
    content: jsonb('content').notNull(),
    published: boolean('published').notNull().default(true),
    ...timestamps,
  },
  (table) => [uniqueIndex('countries_slug_key').on(table.slug)],
);

export type CountryRow = typeof countries.$inferSelect;

export interface CountryContent {
  slug: string;
  name: string;
  flag: string;
  heroTitle: string;
  heroSubtitle: string;
  overview: string;
  benefits: FeatureItem[];
  universities: UniversityItem[];
  popularCourses: Course[];
  eligibility: string[];
  requirements: string[];
  documents: string[];
  visaProcess: ProcessStep[];
  timeline: ProcessStep[];
  cost: { label: string; value: string }[];
  scholarships: Scholarship[];
  livingExpenses: { label: string; value: string }[];
  testimonials: TestimonialItem[];
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

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  country: string;
  quote: string;
  rating: number;
  avatar?: string;
  university?: string;
}

interface UniversityItem {
  id: string;
  name: string;
  country: string;
  ranking: number;
  logo?: string;
  location: string;
  programs: string[];
}

interface Course {
  id: string;
  title: string;
  level: string;
  duration: string;
  field: string;
  countries: string[];
}

interface Scholarship {
  id: string;
  title: string;
  amount: string;
  country: string;
  deadline: string;
  eligibility: string;
}

export type CountryContentBody = Omit<CountryContent, 'slug' | 'name' | 'flag'>;

export function mapCountry(row: CountryRow): CountryContent {
  const content = row.content as CountryContentBody;
  return {
    slug: row.slug,
    name: row.name,
    flag: row.flag,
    ...content,
  };
}

export function extractCountryContent(input: CountryContent): CountryContentBody {
  const { slug: _s, name: _n, flag: _f, ...content } = input;
  return content;
}
