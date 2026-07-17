import { jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { timestamps } from '../../../db/columns';
import { blogStatusEnum } from '../../../db/enums';

export const blogs = pgTable(
  'blogs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull(),
    category: text('category').notNull(),
    author: text('author').notNull(),
    publishedAt: timestamp('published_at', { precision: 3, mode: 'date' }),
    readTime: text('read_time').notNull(),
    coverImage: text('cover_image').notNull(),
    tags: text('tags').array().notNull().default([]),
    body: text('body'),
    status: blogStatusEnum('status').notNull().default('draft'),
    seo: jsonb('seo').notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex('blogs_slug_key').on(table.slug)],
);

export type BlogRow = typeof blogs.$inferSelect;

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  body?: string;
  status?: 'draft' | 'published';
  seo: { title: string; description: string };
}

export function mapBlog(row: BlogRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    author: row.author,
    publishedAt: row.publishedAt?.toISOString().split('T')[0] ?? '',
    readTime: row.readTime,
    coverImage: row.coverImage,
    tags: row.tags,
    body: row.body ?? undefined,
    status: row.status,
    seo: row.seo as BlogPost['seo'],
  };
}
