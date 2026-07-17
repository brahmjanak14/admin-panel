import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';
import { timestamps } from '../../../db/columns';
import { eventTypeEnum } from '../../../db/enums';

export const events = pgTable('events', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  title: text('title').notNull(),
  date: timestamp('date', { precision: 3, mode: 'date' }).notNull(),
  location: text('location').notNull(),
  type: eventTypeEnum('type').notNull(),
  description: text('description').notNull(),
  ...timestamps,
});

export type EventRow = typeof events.$inferSelect;
export type EventType = 'webinar' | 'fair' | 'workshop';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  type: EventType;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function mapEvent(row: EventRow): EventItem {
  return {
    id: row.id,
    title: row.title,
    date: row.date.toISOString(),
    location: row.location,
    type: row.type,
    description: row.description,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
