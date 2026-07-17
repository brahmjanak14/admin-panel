import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { randomUUID } from 'crypto';

export const settings = pgTable('settings', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  data: jsonb('data').notNull().$type<Record<string, unknown>>(),
  updatedAt: timestamp('updated_at', { precision: 3, mode: 'date' })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type SettingRow = typeof settings.$inferSelect;
