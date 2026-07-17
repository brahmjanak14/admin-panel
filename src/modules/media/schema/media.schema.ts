import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';

export const media = pgTable('media', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  url: text('url').notNull(),
  name: text('name').notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  createdAt: timestamp('created_at', { precision: 3, mode: 'date' }).notNull().defaultNow(),
});

export type MediaRow = typeof media.$inferSelect;

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export function mapMedia(m: MediaRow): MediaItem {
  return {
    id: m.id,
    url: m.url,
    name: m.name,
    mimeType: m.mimeType,
    size: m.size,
    createdAt: m.createdAt.toISOString(),
  };
}
